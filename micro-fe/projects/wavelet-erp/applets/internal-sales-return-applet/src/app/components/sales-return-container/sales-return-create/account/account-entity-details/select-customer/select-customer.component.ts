import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { GridOptions } from "ag-grid-enterprise";
import { ApiResponseModel, bl_fi_mst_entity_line_RowClass, ConditionalCriterion, CustomerBranchLinkingService, CustomerService, EntityAccountManagerLinkService, EntityContainerModel, Pagination } from 'blg-akaun-ts-lib';
import { SearchQueryModel } from 'projects/shared-utilities/models/query.model';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { CustomerActions } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/actions';
import { CustomerSelectors } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/selectors';
import { CustomerStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/states';
import { Observable, of, Subject, from } from 'rxjs';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from '../../../../../../facades/view-column.facade';
import { entitySearchModel } from '../../../../../../models/advanced-search-models/entity.model';
import { ToastrService } from 'ngx-toastr';
import { InternalSalesReturnActions } from '../../../../../../state-controllers/internal-sales-return-controller/store/actions';
import { InternalSalesReturnStates } from '../../../../../../state-controllers/internal-sales-return-controller/store/states';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { AppletSettings } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/models/applet-settings.model';
import { HDRSelectors } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/draft-controller/store/selectors';
import { DraftStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/draft-controller/store/states';
import { HDRActions } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/draft-controller/store/actions';
import { ListingInputModel } from "projects/shared-utilities/models/listing-input.model";
import { ListingService } from "projects/shared-utilities/services/listing-service";
import { UtilitiesModule } from 'projects/shared-utilities/utilities/utilities.module';
import { PaginationV2Component } from "projects/shared-utilities/utilities/pagination-v2/pagination-v2.component";
import { map, mergeMap, toArray } from "rxjs/operators";
import { switchMap } from 'rxjs/operators';

interface LocalState {
  deactivateReturn: boolean;
  deactivateList: boolean;
  deactivateAdd: boolean;
  rowIndexListing: number;
}

@Component({
  selector: 'app-internal-sales-return-account-select-customer',
  templateUrl: './select-customer.component.html',
  styleUrls: ['./select-customer.component.css'],
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
  readonly deactivateAdd$ = this.componentStore.select(state => state.deactivateAdd);
  readonly deactivateList$ = this.componentStore.select(state => state.deactivateList);
  readonly deactivateReturn$ = this.componentStore.select(state => state.deactivateReturn);
  readonly rowIndexListing$ = this.componentStore.select(state => state.rowIndexListing);
  readonly checkAgGrid$ = this.store.select(CustomerSelectors.selectAgGrid);

  toggleColumn$: Observable<boolean>;
  prevIndex: number;
  searchModel = entitySearchModel;
  
  toggleMode: boolean = false;
  selectedRowIndex: number;
  appletSettings: any;
  branchGuid: string;

  masterSettings$ = this.sessionStore.select(
    SessionSelectors.selectMasterSettings
  );

  hdr$ = this.draftStore.select(HDRSelectors.selectHdr);

  rowData = [];
  totalRecords = 0;
  limit = 10;
  searchQuery: SearchQueryModel;
  apiVisa = AppConfig.apiVisa;
  selectedEntity = false;

  columnsDefs = [
    {
      headerName: 'Code', field: 'bl_fi_mst_entity_hdr.customer_code', type: 'textColumn',
      cellRenderer: 'agGroupCellRenderer'
    },
    { headerName: 'Name', field: 'bl_fi_mst_entity_hdr.name', type: 'textColumn' },
    { headerName: 'Contact Number', field: 'bl_fi_mst_entity_hdr.phone', type: 'textColumn' },
    {
      headerName: "Email",
      field: "bl_fi_mst_entity_hdr.email",
      type: 'textColumn'
    },
    { headerName: 'Description', field: 'bl_fi_mst_entity_hdr.descr', type: 'textColumn' },
    { headerName: 'Ref 1', field: 'bl_fi_mst_entity_hdr.ref_1', type: 'textColumn' },
    { headerName: 'Ref 2', field: 'bl_fi_mst_entity_hdr.ref_2', type: 'textColumn' },
    { headerName: 'Type', field: 'bl_fi_mst_entity_hdr.txn_type', type: 'textColumn' },
  ];

  gridApi;
  gridColumnApi;
  gridOptions: GridOptions = {
    statusBar: {
      statusPanels: [
          { statusPanel: 'agTotalAndFilteredRowCountComponent', key: 'totalAndFilter', align: 'left' },
          { statusPanel: 'agSelectedRowCountComponent', align: 'left' },
          { statusPanel: 'agAggregationComponent', align: 'right' }
      ]
    },
    defaultColDef: {
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      //minWidth: 100,
      //flex: 1,
      width: 100,
      sortable: true,
      resizable: true,
      enableRowGroup: false,
      enablePivot: false
    },
    columnTypes: UtilitiesModule.columnTypes,
    pagination: true,
    animateRows: true,
    sideBar: true,
    rowSelection: 'single',
    suppressRowClickSelection: false,
    multiSortKey: 'ctrl',
    onSortChanged: this.onSortChanged,
    onFilterChanged: this.onFilterChanged,
  };

  detailCellRendererParams = {
    detailGridOptions: {
      columnDefs: [
        { headerName: 'Contact Name', field: 'contact.name', type: 'textColumn' },
        { headerName: 'Position', field: 'contact.contact_json.position', type: 'textColumn' },
        { headerName: 'Customer ID', field: 'contact.id_no', type: 'textColumn' },
        { headerName: 'Mobile No', field: 'contact.contact_json.mobile_no', type: 'textColumn' },
      ],
      defaultColDef: {
        filter: 'agTextColumnFilter',
        floatingFilter: true,
        floatingFilterComponentParams: { suppressFilterButton: true },
        flex: 1,
        sortable: true,
        resizable: true
      },
      columnTypes: UtilitiesModule.columnTypes,
      rowData: [],
      onRowClicked: (params) => this.onRowClicked(params.data)
    },
    getDetailRowData: params => {
      // supply data to the detail grid
      const details = [];
      params.data.bl_fi_mst_entity_line.forEach(l => {
        console.log(l);
        details.push({ entity: { ...params.data }, contact: { ...l } });
      });
      params.successCallback(details);
    },
  };

  @ViewChild(PaginationV2Component, { static: false })
  private paginationComponent: PaginationV2Component;

  constructor(
    protected readonly sessionStore: Store<SessionStates>,
    protected readonly draftStore: Store<DraftStates>,
    private customerBranchLinkingService: CustomerBranchLinkingService,
    private toastr: ToastrService,
    private viewColFacade: ViewColumnFacade,
    protected readonly componentStore: ComponentStore<LocalState>,
    private customerService: CustomerService,
    private store: Store<CustomerStates>,
    protected readonly salesReturnStore: Store<InternalSalesReturnStates>,
    protected listingService: ListingService,
    private entityAccountManagerLinkService: EntityAccountManagerLinkService,) {
    super();
  }

  ngOnInit() {
    this.subs.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState(a);
      if (a.rowIndexListing === null) {
        this.gridApi?.deselectAll();
      }
    });
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.store.select(CustomerSelectors.selectToggleMode).subscribe((data) => {
      console.log("toggle er vejal", data);
      this.toggleMode = data;
    });

    this.subs.sink = this.masterSettings$.subscribe({
      next: (resolve: AppletSettings) => {
        this.appletSettings = resolve;
      },
    });

    this.subs.sink = this.hdr$.subscribe({
      next: (resolve) => {
        this.branchGuid = resolve.guid_branch.toString();
      },
    });
  }


  toggle(event: MatSlideToggleChange) {
    if (event.checked) {
      this.toggleMode = true;
      this.store.dispatch(CustomerActions.selectToggleMode({ SelectedToggleMode: true }));
    } else {
      this.toggleMode = false;
      this.store.dispatch(CustomerActions.selectToggleMode({SelectedToggleMode: false}));
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    if (this.rowData.length > 0) {
      this.setDataRowCache();
    }
    else
    {
      this.getTotalData();
      this.createData();
    }

    this.checkAgGrid$.subscribe(status => {
      if (status) {
        console.log("AG Grid Status", status);
        this.clear();
        this.getTotalData();
        this.createData();
        this.store.dispatch(CustomerActions.updateAgGridDone({ status: false }));
      }
    });

    this.gridApi.sizeColumnsToFit();
    UtilitiesModule.autoSizeAllColumns(params);
  }

  createData() {
    console.log("on create data....");
    const formData = this.getInputModel();
    this.subs.sink = this.listingService.get("entity/customers", formData, this.apiVisa).pipe(
      mergeMap(a => from(a.data).pipe(
        map(b => {
          Object.assign(b,
            {
              'bl_fi_mst_entity_hdr': b,
            }
          )
          return b;
        }),
        toArray(),
        map(c => {
          a.data = c;
          return a;
        })
      ))
    ).subscribe(resolved => {
      // console.log("DEBUG:::::::resolved",resolved )
      this.rowData = [...this.rowData, ...resolved.data];
      this.gridApi.setRowData(this.rowData);
      this.gridApi.paginationGoToLastPage();
      this.paginationComponent.totalRecords.next(this.totalRecords);
      UtilitiesModule.autoSizeAllColumns(this.gridOptions);
    }, err => {
      console.error(err);
    });
  };
  getInputModel() {
    const inputModel = {} as ListingInputModel;
    inputModel.search = (this.searchQuery?.keyword);
    inputModel.searchColumns = ['name','phone','email','id_no','customer_code'];
    inputModel.status = ['ACTIVE'];
    inputModel.orderBy = 'updated_date';
    inputModel.order = 'desc';
    inputModel.limit = this.limit;
    inputModel.offset = this.rowData.length;
    inputModel.calcTotalRecords = false;
    inputModel.showCreatedBy = false;
    inputModel.showUpdatedBy = false;
    inputModel.filterLogical = 'AND';
    inputModel.filterConditions = [];
    inputModel.childs = [{
      "tableName": "bl_fi_mst_entity_line",
      "joinColumn": "entity_hdr_guid",
      "filterLogical": "OR",
      "filterConditions": []
    }];
    if (this.searchQuery?.queryString) {
      const code = UtilitiesModule.checkNull(this.searchQuery.queryString['code'],'');
      if (code) {
        inputModel.filterConditions.push({
          "filterColumn": "customer_code",
          "filterValues": [code],
          "filterOperator": "="
        })
      }
      const name = UtilitiesModule.checkNull(this.searchQuery.queryString['name'],'');
      if (name) {
        inputModel.filterConditions.push({
          "filterColumn": "name",
          "filterValues": [name],
          "filterOperator": "="
        })
      }
      const phoneNo = UtilitiesModule.checkNull(this.searchQuery.queryString['phoneNo'],'');
      if (phoneNo) {
        inputModel.filterConditions.push({
          "filterColumn": "phone",
          "filterValues": [phoneNo],
          "filterOperator": "="
        })
      }
      const type = UtilitiesModule.checkNull(this.searchQuery.queryString['type'],'');
      if (type) {
        inputModel.filterConditions.push({
          "filterColumn": "txn_type",
          "filterValues": [type],
          "filterOperator": "="
        })
      }
      if (this.searchQuery.queryString['modifiedDateCheckbox']) {
        const dateFrom = UtilitiesModule.checkNull(this.searchQuery.queryString['modifiedDate']['from'],'2022-01-01T00:00:00.000Z');
        const dateTo = UtilitiesModule.checkNull(this.searchQuery.queryString['modifiedDate']['to'],'2099-12-31T00:00:00.000Z');
        inputModel.filterDate = {
          "dateFrom": dateFrom,
          "dateTo": dateTo,
          "column": "updated_date"
        }
      }
    }
    return inputModel;
  }

  getTotalData() {
    console.log("on create data....");
    const formData = this.getInputModel();
    formData.childs = [];
    formData.calcTotalRecords = true;
    formData.calcTotalRecordsOnly = true;
    this.subs.sink = this.listingService.get("entity/customers", formData, this.apiVisa).pipe(
    ).subscribe(resolved => {
      this.totalRecords = resolved.totalRecords;
      this.paginationComponent.totalRecords.next(this.totalRecords);
    }, err => {
      console.error(err);
    });
  };

  clear() {
    this.gridApi.setRowData(null);
    this.totalRecords = 0;
    this.rowData = [];
    this.paginationComponent.totalRecords.next(this.totalRecords);
  }

  onSearch(e: SearchQueryModel) {
    console.log("search", e);
    if (!e.isEmpty) {
      if (e.keyword && e.keyword.length > 0 && e.keyword.length < 3)  {
        this.toastr.error(
          'Search keyword must more than 2 characters.',
          'Keyword',
          {
            tapToDismiss: true,
            progressBar: true,
            timeOut: 1300
          }
        );
        return;
      }this.searchQuery = e;
      this.clear();
      this.getTotalData();
      this.createData();
    }
  }

  setDataRowCache() {
    console.log('set data row cache');
    this.gridApi.setRowData(this.rowData);
    this.paginationComponent.totalRecords.next(this.totalRecords);
  }

  onMorePage() {
    console.log('on more page click');
    if (this.rowData.length < this.totalRecords) {
      this.createData();
    }
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

  onNext() {
    this.viewColFacade.startDraft();
    this.viewColFacade.updateInstance(this.index, { ...this.localState, deactivateAdd: true });
    this.viewColFacade.onNextAndReset(this.index, 21);
  }

  async onRowClickedNoContact(event) {
    let salesAgentPagination = new Pagination();
    salesAgentPagination.conditionalCriteria = [
      { columnName: "calcTotalRecords", operator: "=", value: "true" },
      {
        columnName: "entity_hdr_guid",
        operator: "=",
        value: event.data.bl_fi_mst_entity_hdr.guid.toString(),
      },
    ];
    if (this.appletSettings.ENABLE_BRANCH_FILTER === true) {
      let entity: EntityContainerModel = event.data;
      if (this.toggleMode === false) {
        if (entity) {
          this.subs.sink = this.customerService.getByGuid(entity.bl_fi_mst_entity_hdr.guid.toString(), AppConfig.apiVisa)
          .subscribe(customer=>{
          let pagination = new Pagination();
          pagination.conditionalCriteria.push({
            columnName: "branch_guid",
            operator: "=",
            value: this.branchGuid,
          });
          pagination.conditionalCriteria.push({
            columnName: "customer_hdr_guid",
            operator: "=",
            value: entity.bl_fi_mst_entity_hdr.guid.toString(),
          });

          this.subs.sink = this.customerBranchLinkingService
            .getByCriteria(pagination, AppConfig.apiVisa)
            .subscribe((response) => {
              if (response.data.length > 0) {
                this.viewColFacade.selectEntity({ entity: customer.data, contact: null });
                this.subs.sink = this.entityAccountManagerLinkService.getByCriteria(salesAgentPagination, AppConfig.apiVisa).subscribe((response) => {
                  if (response.data.length > 0) {
                    this.draftStore.dispatch(HDRActions.updateSalesAgent({ salesAgent: response.data[0].bl_fi_mst_entity_account_manager_link.acc_mgr_guid.toString() }));
                    this.onReturn();
                  } else {
                    this.onReturn();
                  }
                })
              } else {
                this.toastr.error("Customer not linked to branch", "Error", {
                  tapToDismiss: true,
                  progressBar: true,
                  timeOut: 2000,
                });
              }
            });
          })  
        }
      } else {
        console.log("Entity Guid Here", entity);
        this.store.dispatch(CustomerActions.selectCustomerExtGuid({ guid: entity.bl_fi_mst_entity_hdr.guid.toString() }));
        this.selectedRowIndex = event.rowIndex;
        if (!this.localState.deactivateList) {
          this.viewColFacade.updateInstance(this.index, {
            ...this.localState,
            deactivateList: true,
            rowIndexListing: this.selectedRowIndex,
          });
          this.viewColFacade.onNextAndReset(this.index, 38);
        }
      }
    } else {
      let entity: EntityContainerModel = event.data;
      if (this.toggleMode === false) {
        if (entity) {
          this.subs.sink = this.customerService.getByGuid(entity.bl_fi_mst_entity_hdr.guid.toString(), AppConfig.apiVisa).subscribe(customer => {
            console.log("customer", customer.data);
            this.viewColFacade.selectEntity({ entity: customer.data, contact: null });
            if (customer.data.bl_fi_mst_entity_hdr.default_sales_agent !== null) {
              this.draftStore.dispatch(HDRActions.updateSalesAgent({ salesAgent: customer.data.bl_fi_mst_entity_hdr.default_sales_agent.toString() }));
              this.onReturn()
            } else {
              this.onReturn()
            }
          });
        }
      } else {
        console.log("Entity Guid Here", entity);
        this.store.dispatch(CustomerActions.selectCustomerExtGuid({ guid: entity.bl_fi_mst_entity_hdr.guid.toString() }));
        this.selectedRowIndex = event.rowIndex;
        if (!this.localState.deactivateList) {
          this.viewColFacade.updateInstance(this.index, { ...this.localState, deactivateList: true, rowIndexListing: this.selectedRowIndex });
          this.viewColFacade.onNextAndReset(this.index, 38);
        }
      }
    }

  }

onRowClicked(entity: { entity: EntityContainerModel, contact: bl_fi_mst_entity_line_RowClass }) {
    if (entity) {
      this.subs.sink = this.customerService.getByGuid(entity.entity.bl_fi_mst_entity_hdr.guid.toString(), AppConfig.apiVisa).subscribe(customer=>{
        entity.entity = customer.data;
        this.viewColFacade.selectEntity(entity);
      });
    }
  }

  onFirstDataRendered(params) {
    UtilitiesModule.autoSizeAllColumns(params);
  }
  onSortChanged(e) {
    e.api.refreshCells();
  }
  onFilterChanged(e) {
    e.api.refreshCells();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
