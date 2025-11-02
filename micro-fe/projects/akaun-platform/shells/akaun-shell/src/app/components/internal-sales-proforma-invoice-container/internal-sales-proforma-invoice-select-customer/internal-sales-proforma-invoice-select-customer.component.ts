import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { EntityContainerModel, Pagination, CustomerService, bl_fi_entity_hdr_RowClass, bl_fi_mst_entity_line_RowClass, SubQueryService } from 'blg-akaun-ts-lib';
import { ViewColumnFacade } from '../../../facades/view-column.facade';
import { SubSink } from 'subsink2';
import { customerSearchModel } from '../../../models/advanced-search-models/customer.model';
import { Store } from '@ngrx/store';
import { InternalSalesProformaInvoiceStates } from '../../../state-controllers/internal-sales-proforma-invoice-controller/store/states';
import * as moment from 'moment';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { SearchQueryModel } from 'projects/shared-utilities/models/query.model';
import { PaginationComponent } from 'projects/shared-utilities/utilities/pagination/pagination.component';

interface LocalState {
  deactivateAdd: boolean;
  deactivateList: boolean;
  deactivateReturn: boolean;
}

@Component({
  selector: 'app-internal-sales-proforma-invoice-select-customer',
  templateUrl: './internal-sales-proforma-invoice-select-customer.component.html',
  styleUrls: ['./internal-sales-proforma-invoice-select-customer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class InternalSalesProformaInvoiceSelectCustomerComponent extends ViewColumnComponent {

  protected subs = new SubSink();

  protected compName = 'Select Customer';
  protected readonly index = 5;
  protected localState: LocalState;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateAdd$ = this.componentStore.select(state => state.deactivateAdd);
  readonly deactivateList$ = this.componentStore.select(state => state.deactivateList);
  readonly deactivateReturn$ = this.componentStore.select(state => state.deactivateReturn);

  prevIndex: number;
  protected prevLocalState: any;

  searchModel = customerSearchModel;

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilterComponentParams: {suppressFilterButton: true},
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true
  };

  gridApi;

  columnsDefs = [
    {headerName: 'Customer Code', field: 'bl_fi_mst_entity_ext', cellStyle: () => ({'text-align': 'left'}), cellRenderer: 'agGroupCellRenderer', valueFormatter: params =>
      params.value.find(x => x.param_code === 'CUSTOMER_CODE')?.value_string ? params.value.find(x => x.param_code === 'CUSTOMER_CODE')?.value_string : ''
    },
    {headerName: 'Customer Name', field: 'bl_fi_mst_entity_hdr.name', cellStyle: () => ({'text-align': 'left'})},
    {headerName: 'Customer Code', field: 'bl_fi_mst_entity_hdr.customer_code', cellStyle: () => ({'text-align': 'left'})},
    {headerName: 'Mobile Number', field: 'bl_fi_mst_entity_hdr.phone', cellStyle: () => ({'text-align': 'left'})},
    //{headerName: 'Entity Type', field: 'bl_fi_mst_entity_hdr.txn_type', cellStyle: () => ({'text-align': 'left'})},
    //{headerName: 'Currency', field: 'bl_fi_mst_entity_ext', valueFormatter: params =>
    //params.value.find(x => x.param_code === 'CURRENCY')?.value_json?.currency ? params.value.find(x => x.param_code === 'CURRENCY')?.value_json?.currency : ''},
    //{headerName: 'Creation Date', field: 'bl_fi_mst_entity_hdr.created_date',
    //valueFormatter: (params) => params.value ? moment(params.value).format('YYYY-MM-DD') : ''},
    //{headerName: 'Modified Date', field: 'bl_fi_mst_entity_hdr.updated_date',
    //valueFormatter: (params) => params.value ? moment(params.value).format('YYYY-MM-DD') : ''},
    //{headerName: 'Status', field: 'bl_fi_mst_entity_hdr.status', cellStyle: () => ({'text-align': 'left'})},
  ];

  detailCellRendererParams = {
    detailGridOptions: {
      columnDefs: [
        { headerName: 'Contact Name', field: 'contact.name'},
        { headerName: 'Position', field: 'contact.contact_json.position' },
        { headerName: 'Customer ID', field: 'contact.id_no' },
        { headerName: 'Mobile No', field: 'contact.contact_json.mobile_no' },
        // { headerName:'Member ID', field: '' }
      ],
      defaultColDef: {
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        floatingFilterComponentParams: {suppressFilterButton: true},
        flex: 1,
        sortable: true,
        resizable: true
      },
      rowData: [],
      onRowClicked: (params) => this.onRowClicked(params.data)
    },
    getDetailRowData: params => {
      // supply data to the detail grid
      const details = [];
      params.data.bl_fi_mst_entity_line.forEach(l => {
        details.push({entity: {...params.data}, contact:{...l}})
      })
      params.successCallback(details);
    },
  };

  SQLGuids: string[] = null;
  pagination = new Pagination();

  @ViewChild(PaginationComponent) paginationComp: PaginationComponent;

  constructor(
    protected viewColFacade: ViewColumnFacade,
    protected customerService: CustomerService,
    private sqlService: SubQueryService,
    protected store: Store<InternalSalesProformaInvoiceStates>,
    protected readonly componentStore: ComponentStore<LocalState>) {
    super();
  }

  ngOnInit() {
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => {this.prevIndex = resolve});
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.subs.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
  }

  onAdd() {
    // TODO: add simple customer creation
    this.viewColFacade.gotoFourOhFour();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    const datasource = {
      getRows: grid => {
        // this.store.dispatch(InternalPackingOrderActions.loadPackingOrdersInit({request: grid.request}));
        this.pagination.offset = this.SQLGuids ? 0 : grid.request.startRow;
        this.pagination.limit = this.SQLGuids ? grid.request.endRow - grid.request.startRow : grid.request.endRow;
        this.pagination.conditionalCriteria = [
          {columnName: 'calcTotalRecords', operator: '=', value: 'true'},
          {columnName: 'orderBy', operator: '=', value: 'updated_date'},
          {columnName: 'order', operator: '=', value: 'DESC'},
          {
            columnName: 'hdr_guids',
            operator: '=',
            value: this.SQLGuids ? this.SQLGuids.slice(grid.request.startRow, grid.request.endRow).toString() : ''
          }
        ];
        this.subs.sink = this.customerService.getByCriteria(this.pagination, AppConfig.apiVisa).subscribe( resolved => {
          // resolved.data[0].bl_fi_mst_entity_hdr
          // this.store.dispatch(InternalPackingOrderActions.loadPackingOrderSuccess({totalRecords: resolved.totalRecords}));
          grid.success({
            rowData: resolved.data,
            rowCount: this.SQLGuids ? this.SQLGuids.length : resolved.totalRecords
          });
        }, err => {
          // this.store.dispatch(InternalPackingOrderActions.loadPackingOrderFailed({error: err.message}));
          grid.fail();
        });
      }
    };
    this.gridApi.setServerSideDatasource(datasource);
  }

  onSearch(e: SearchQueryModel) {
    if (!e.isEmpty) {
      const sql = {
        subquery: e.queryString,
        table: e.table
      };
      this.subs.sink = this.sqlService.post(sql, AppConfig.apiVisa).subscribe(
        {next: resolve => {
          this.SQLGuids = resolve.data;
          this.paginationComp.firstPage();
          this.gridApi.refreshServerSideStore();
        }}
      );
    } else {
      this.SQLGuids = null;
      this.paginationComp.firstPage();
      this.gridApi.refreshServerSideStore();
    }
  }

  onToggle(e: boolean) {
    this.viewColFacade.toggleColumn(e);
  }

  onRowClicked(entity: {entity: EntityContainerModel, contact: bl_fi_mst_entity_line_RowClass}) {
    if (entity) {
      this.viewColFacade.selectCustomer(entity, this.prevIndex);
    }
  }

  onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateReturn: false,
      deactivateCustomer: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
