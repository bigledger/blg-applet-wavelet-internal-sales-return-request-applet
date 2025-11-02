import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { bl_fi_mst_entity_line_RowClass, EntityContainerModel, EntityService, Pagination, SubQueryService, CustomerService } from 'blg-akaun-ts-lib';
import { Observable } from 'rxjs';
import { ViewColumnFacade } from '../../../../../../facades/view-column.facade';
import { AppConfig } from 'projects/shared-utilities/visa';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { SubSink } from 'subsink2';
import { PaginationComponent } from 'projects/shared-utilities/utilities/pagination/pagination.component';
import { SearchQueryModel } from 'projects/shared-utilities/models/query.model';
import { entitySearchModel } from '../../../../../../models/advanced-search-models/entity.model'
import { pageFiltering, pageSorting } from 'projects/shared-utilities/listing.utils';

interface LocalState {
  deactivateReturn: boolean;
}

@Component({
  selector: 'app-sales-return-account-select-customer',
  templateUrl: './select-customer-listing.component.html',
  styleUrls: ['./select-customer-listing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class SelectCustomerListingComponent extends ViewColumnComponent {
  
  protected subs = new SubSink();
  
  protected compName = 'Select Customer Listing';
  protected readonly index = 4;
  protected localState: LocalState;
  protected prevLocalState: any;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);

  toggleColumn$: Observable<boolean>;
  prevIndex: number;
  searchModel = entitySearchModel;
  gridApi;
  SQLGuids: string[] = null;
  pagination = new Pagination();

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilterComponentParams: {suppressFilterButton: true},
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true
  };

  columnsDefs = [
    { headerName: 'Code', field: 'bl_fi_mst_entity_hdr.customer_code', cellStyle: () => ({ 'text-align': 'left' }),
      cellRenderer: 'agGroupCellRenderer' },
    { headerName: 'Type', field: 'bl_fi_mst_entity_hdr.txn_type', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Name', field: 'bl_fi_mst_entity_hdr.name', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Contact Number', field: 'bl_fi_mst_entity_hdr.phone', type: 'numericColumn' },
  ];

  columnsDefsEntity = [
    // { headerName: 'Code', field: 'bl_fi_mst_entity_hdr', cellStyle: () => ({ 'text-align': 'left' }),
    //   cellRenderer: 'agGroupCellRenderer', valueFormatter: (params) => {
    //     console.log(params.value);
    //   }
    // },
    { headerName: 'Type', field: 'bl_fi_mst_entity_hdr.txn_type', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Name', field: 'bl_fi_mst_entity_hdr.name', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Contact Number', field: 'bl_fi_mst_entity_hdr.phone', type: 'numericColumn' },
  ];

  detailCellRendererParams = {
    detailGridOptions: {
      columnDefs: [
        { headerName: 'Contact Name', field: 'contact.name' },
        { headerName: 'Position', field: 'contact.contact_json.position' },
        { headerName: 'Customer ID', field: 'contact.id_no' },
        { headerName: 'Mobile No', field: 'contact.contact_json.mobile_no' },
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
        details.push({ entity: { ...params.data }, contact: { ...l } });
      });
      params.successCallback(details);
    },
  };

  @ViewChild(PaginationComponent) paginationComp: PaginationComponent;

  constructor(
    private viewColFacade: ViewColumnFacade,
    protected readonly componentStore: ComponentStore<LocalState>,
    private customerService: CustomerService,
    private entityService: EntityService,
    private subQueryService: SubQueryService) {
    super();
  }

  ngOnInit() {
    this.subs.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.setGridData();
  }

  setGridData() {
    const apiVisa = AppConfig.apiVisa;
    const datasource = {
      getRows: grid => {
        const filter = pageFiltering(grid.request.filterModel);
        const sortOn = pageSorting(grid.request.sortModel);
        this.pagination.offset = this.SQLGuids ? 0 : grid.request.startRow;
        this.pagination.limit = grid.request.endRow - grid.request.startRow;
        this.pagination.conditionalCriteria = [
          { columnName: 'calcTotalRecords', operator: '=', value: 'true' },
          { columnName: 'orderBy', operator: '=', value: 'updated_date' },
          { columnName: 'order', operator: '=', value: 'DESC' },
          { columnName: 'hdr_guids', operator: '=',
            value: this.SQLGuids ? this.SQLGuids.slice(grid.request.startRow, grid.request.endRow).toString() : ''
          }
        ];
        this.subs.sink = this.customerService.getByCriteria(this.pagination, apiVisa).subscribe(resolved => {
          const data = sortOn(resolved.data).filter(entity => filter.by(entity));
          const totalRecords = filter.isFiltering ? (this.SQLGuids ? this.SQLGuids.length : resolved.totalRecords) : data.length;
          grid.success({
            rowData: data,
            rowCount: totalRecords
          });
        }, err => {
          grid.fail();
        });
      }
    };
    this.gridApi.setServerSideDatasource(datasource);
  }

  setEntityData() {
    const apiVisa = AppConfig.apiVisa;
    const datasource = {
      getRows: grid => {
        const filter = pageFiltering(grid.request.filterModel);
        const sortOn = pageSorting(grid.request.sortModel);
        this.pagination.offset = this.SQLGuids ? 0 : grid.request.startRow;
        this.pagination.limit = grid.request.endRow - grid.request.startRow;
        this.pagination.conditionalCriteria = [
          { columnName: 'calcTotalRecords', operator: '=', value: 'true' },
          { columnName: 'orderBy', operator: '=', value: 'updated_date' },
          { columnName: 'order', operator: '=', value: 'DESC' },
          { columnName: 'hdr_guids', operator: '=',
            value: this.SQLGuids ? this.SQLGuids.slice(grid.request.startRow, grid.request.endRow).toString() : ''
          }
        ];
        this.subs.sink = this.entityService.getByCriteria(this.pagination, apiVisa).subscribe(resolved => {
          const data = sortOn(resolved.data).filter(entity => filter.by(entity));
          const totalRecords = filter.isFiltering ? (this.SQLGuids ? this.SQLGuids.length : resolved.totalRecords) : data.length;
          grid.success({
            rowData: data,
            rowCount: totalRecords
          });
        }, err => {
            grid.fail();
          }
        );
      }
    };
    this.gridApi.setServerSideDatasource(datasource);
  }

  onReturn() {
    this.viewColFacade.updateInstance<LocalState>(this.prevIndex, {
      ...this.prevLocalState,
      deactivateReturn: false,
      deactivateAdd: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  onRowClickedNoContact(entity: EntityContainerModel) {
    console.log(entity);
    if (entity) {
      this.viewColFacade.selectEntity({ entity, contact: null })
    }
  }

  onRowClicked(entity: {entity: EntityContainerModel, contact: bl_fi_mst_entity_line_RowClass}) {
    if (entity) {
      this.viewColFacade.selectEntity(entity);
    }
  }
  
  onSearch(e: SearchQueryModel) {
    console.log(e.queryString);
    if (!e.isEmpty) {
      const sql = {
        subquery: e.queryString,
        table: e.table
      };
      this.subs.sink = this.subQueryService.post(sql, AppConfig.apiVisa).subscribe({ next: resolve => {
        this.SQLGuids = resolve.data;
        this.paginationComp.firstPage();
        if (e.queryString.includes('hdr.is_customer') || e.queryString.includes('hdr.is_employee') ||
          e.queryString.includes('hdr.is_merchant')) {
            this.gridApi.setColumnDefs(this.columnsDefsEntity);
            this.setEntityData();
        } else {
          this.gridApi.setColumnDefs(this.columnsDefs);
          this.setGridData();
        }
      }});
    } else {
      this.SQLGuids = null;
      this.paginationComp.firstPage();
      this.gridApi.refreshServerSideStore();
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}