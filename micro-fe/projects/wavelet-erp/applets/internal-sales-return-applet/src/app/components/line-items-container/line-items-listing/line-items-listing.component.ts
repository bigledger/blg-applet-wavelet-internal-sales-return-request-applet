import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { InternalSalesReturnService, GenericDocLineService  } from 'blg-akaun-ts-lib';
import { SearchQueryModel } from 'projects/shared-utilities/models/query.model';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { Observable, from } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from '../../../facades/view-column.facade';
import { lineItemSearchModel } from '../../../models/advanced-search-models/line-item.model';
import { LineItemActions } from '../../../state-controllers/line-item-controller/store/actions';
import { LineItemSelectors } from '../../../state-controllers/line-item-controller/store/selectors';
import { LineItemStates } from '../../../state-controllers/line-item-controller/store/states';
import { ClientSidePermissionsSelectors } from 'projects/shared-utilities/modules/permission/client-side-permissions-controller/selectors';
import { ClientSideViewModel } from 'projects/shared-utilities/modules/permission/client-side-permissions-controller/states/client-side-permission.states';
import { PermissionStates } from 'projects/shared-utilities/modules/permission/permission-controller';
import { UserPermInquirySelectors } from 'projects/shared-utilities/modules/permission/user-permissions-inquiry-controller/selectors';
import { Column1ViewSelectors } from '../../../state-controllers/sales-return-view-model-controller/store/selectors';
import { ColumnViewModelStates } from '../../../state-controllers/sales-return-view-model-controller/store/states';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { ClientSidePermissionChecker } from 'projects/shared-utilities/utilities/client-side-permission-checker';
import { SessionActions } from "projects/shared-utilities/modules/session/session-controller/actions";
import { GridOptions } from "ag-grid-enterprise";
import { ListingInputModel } from 'projects/shared-utilities/models/listing-input.model';
import { ListingService } from 'projects/shared-utilities/services/listing-service';
import { UtilitiesModule } from 'projects/shared-utilities/utilities/utilities.module';
import { ToastrService } from "ngx-toastr";


interface LocalState {
  deactivateList: boolean;
  selectedRow: any;
}

@Component({
  selector: 'app-line-items-listing',
  templateUrl: './line-items-listing.component.html',
  styleUrls: ['./line-items-listing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})

export class LineItemsListingComponent extends ViewColumnComponent {

  userPermissionTarget$ = this.permissionStore.select(
    UserPermInquirySelectors.selectUserPermInquiry
  );

  masterSettings$ = this.sessionStore.select(
    SessionSelectors.selectMasterSettings
  );

  readPermissionDefintion = {
    branch: "TNT_API_DOC_INTERNAL_SALES_RETURN_READ_TGT_GUID"
  }

  protected subs = new SubSink();

  compId = 'salesReturnLine';
  compName = 'Sales Return Line Items Listing';
  protected readonly index = 0;
  protected localState: LocalState;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateList$ = this.componentStore.select(state => state.deactivateList);
  readonly clientSidePermissions$ = this.permissionStore.select(ClientSidePermissionsSelectors.selectAll);
  readonly appletLoginSubjectLink$ = this.sessionStore.select(SessionSelectors.selectAppletLoginSubjectLink);
  selectedBranches$ = this.viewModelStore.select(Column1ViewSelectors.selectAdvanceSearch_Branch_Field);

  branchGuids: any[] = [];
  settings: any[] = [];
  appletSettings: any;
  permissions: any[] = [];

  toggleColumn$: Observable<boolean>;
  searchModel = lineItemSearchModel;

  firstLoad$ = this.store.select(LineItemSelectors.selectFirstLoadListing);
  totalRecords$ = this.store.select(LineItemSelectors.selectTotalRecords);
  rowData$ = this.store.select(LineItemSelectors.selectRowData);
  rowData = [];
  totalRecords = 0;
  limit = 50;
  searchQuery: SearchQueryModel;
  firstLoad;

  // api visa
  apiVisa = AppConfig.apiVisa;

  // initial grid state
  gridApi;
  gridColumnApi;
  groupColumn = {
    headerName: "Group",
    //width: 200,
    field: 'server_doc_1',
    sort: 'asc',
    cellRenderer: 'agGroupCellRenderer',
  };

  gridOptions: GridOptions = {
    paginationPageSize: this.limit,
    onRowClicked: (event) => this.onRowClicked(event.data),
  }

  columnsDefs = [
    { headerName: 'Sales Return No', field: 'bl_fi_generic_doc_hdr_server_doc_1', type: 'textColumn'},
    { headerName: "Transaction Date", field: "date_txn", type: 'dateColumn'},
    { headerName: "Branch Code", field: "bl_fi_mst_branch_code", type: 'textColumn'},
    { headerName: 'Item Code', field: 'item_code', type: 'textColumn'},
    { headerName: 'Item Name', field: 'item_name', type: 'textColumn'},
    { headerName: 'Ordered Qty', field: 'quantity_base', type: 'integerColumn'},
    { headerName: 'Unit Price', field: 'item_property_json.unitPriceStdWithoutTax', type: 'decimalColumn'},
    { headerName: 'SST/VAT/GST', field: 'amount_tax_gst', type: 'decimalColumn'},
    { headerName: 'Txn Amount', field: 'amount_txn', type: 'decimalColumn'},
    { headerName: 'Created Date', field: 'created_date', type: 'dateTimeColumn'},
    { headerName: 'Updated Date', field: 'updated_date', type: 'dateTimeColumn'},
    // { headerName: 'Requested Delivery Date', field: 'delivery_date', type: 'dateTimeColumn'}
  ]

  personalData: any;

  constructor(
    private readonly viewModelStore: Store<ColumnViewModelStates>,
    private readonly permissionStore: Store<PermissionStates>,
    private viewColFacade: ViewColumnFacade,
    private isSalesReturnService: InternalSalesReturnService,
    private readonly componentStore: ComponentStore<LocalState>,
    private readonly store: Store<LineItemStates>,
    private listingService: ListingService,
    private docLineService: GenericDocLineService,
    private toastr: ToastrService,
    private readonly sessionStore: Store<SessionStates>) {
    super();
  }

  ngOnInit() {
    this.subs.sink = this.firstLoad$.subscribe(firstLoad => this.firstLoad = firstLoad);
    this.subs.sink = this.rowData$.subscribe(rowData => this.rowData = rowData);
    this.subs.sink = this.totalRecords$.subscribe(totalRecords => this.totalRecords = totalRecords);

    this.toggleColumn$ = this.viewColFacade.toggleColumn$;
    this.subs.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState(a);
    });

    this.getAppletSettings();
    this.getPermissions();

    this.subs.sink = this.sessionStore.select(SessionSelectors.selectPersonalSettings)
      .subscribe((data) => {
        this.personalData = data;
        if(data?.DEFAULT_TOGGLE_COLUMN){
          if(data.DEFAULT_TOGGLE_COLUMN === "SINGLE"){
            this.onToggle(true);
          }else{
            this.onToggle(false);
          }
        }

      })

    let userPermissions: ClientSideViewModel[];
    this.subs.sink = this.clientSidePermissions$.subscribe(permissions => userPermissions = permissions);

    this.subs.sink = this.userPermissionTarget$.subscribe((targets) => {
      let target = targets.filter(
        (target) =>
          target.permDfn === "TNT_API_DOC_INTERNAL_SALES_RETURN_READ_TGT_GUID"
      );
      let adminCreatePermissionTarget = targets.filter(
        (target) => target.permDfn === "TNT_TENANT_ADMIN"
      );
      let ownerCreatePermissionTarget = targets.filter(
        (target) => target.permDfn === "TNT_TENANT_OWNER"
      );
      if ( adminCreatePermissionTarget[0]?.hasPermission
        || ownerCreatePermissionTarget[0]?.hasPermission) {
        console.log("has Permission");
        this.branchGuids = [];
      } else {
        console.log("has targets");
        this.branchGuids = target[0]?.target !== null && Object.keys(target[0]?.target || {}).length !== 0
        ? target[0]?.target["bl_fi_mst_branch"]
        : [];
      }
    });
  }

  async getAppletSettings() {
    this.subs.sink = await this.masterSettings$.subscribe(
      resolve => {
        this.appletSettings = resolve;
        this.settings.push(resolve);
      }
    );
  }

  getPermissions() {
    this.subs.sink = this.clientSidePermissions$.subscribe({
      next: (resolve: any[]) => {
        this.permissions = resolve;
      }
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.gridColumnApi = params.columnApi;

    const statusBarComponent = this.gridApi.getStatusPanel('statusBarExportKey');
    statusBarComponent.setTitle(this.compName);
    statusBarComponent.setFilename(this.compName);
    statusBarComponent.setPageOritentation('landscape');

    if (this.rowData.length > 0) {
      this.setDataRowCache();
    }
    else {
      this.getTotalData();
      this.createData();
    }

    // reload
    this.subs.sink = this.store.select(LineItemSelectors.selectAgGrid).subscribe( a => {
      if (a) {
        this.firstLoad = true;
        this.clear();
        this.getTotalData();
        this.createData();
        this.store.dispatch(LineItemActions.resetAgGrid());
      }
    });
  }


  onToggle(e: boolean) {
    this.viewColFacade.toggleColumn(e);
    this.personalData.DEFAULT_TOGGLE_COLUMN = e ? 'SINGLE' : 'DOUBLE';
    this.sessionStore.dispatch(SessionActions.saveTogglePersonalSettingsInit({ settings: this.personalData }));
  }

  createData(showAll?) {
    console.log("on create data....");
    const formData = this.getInputModel();
    if (showAll) formData.limit = null;
    this.subs.sink = this.listingService.get("gen-doc-line/internal-sales-returns/backoffice-ep", formData, this.apiVisa).pipe(
	  mergeMap(a => from(a.data).pipe(
        map(b => {
          Object.assign(b,
            {
            //   bl_fi_generic_doc_hdr: b,
            //   "doc_type" : b.server_doc_type?DocumentShortCodesClass.serverDocTypeToShortCodeMapper(b.server_doc_type): "",
            //   "posting_status" : (b.posting_status ? b.posting_status : "DRAFT")
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
      console.log(resolved);
      this.rowData = [...this.rowData, ...resolved.data];
      this.gridApi.setRowData(this.rowData);
      this.store.dispatch(LineItemActions.selectRowData({rowData: <any>this.rowData}));
      this.gridApi.paginationGoToLastPage();
    }, err => {
      console.error(err);
    });
  };

  getInputModel() {
    const inputModel = {} as ListingInputModel;
    inputModel.search = (this.searchQuery?.keyword);
    inputModel.searchColumns = ['item_code', 'item_name', 'bl_fi_generic_doc_hdr.server_doc_1'];
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
    inputModel.childs = [];
    inputModel.joins= [
      {
        "tableName": "bl_fi_generic_doc_hdr",
        "joinColumn": "generic_doc_hdr_guid",
        "columns": ["server_doc_1", "forex_doc_hdr_guid"],
        "joinType": "left join"
      },
      {
        "tableName": "bl_fi_mst_branch",
        "joinColumn": "guid_branch",
        "columns": ["code"],
        "joinType": "left join"
      },
    ]
    inputModel.childs =[
      // {
      //   "tableName": "bl_fi_generic_doc_line",
      //   "joinColumn": "generic_doc_hdr_guid",
      //   "joinType": "left join",
      //   "filterLogical": "AND",
      //   "filterConditions": []
      // },
    ];

    let filterBranch;
    if (this.branchGuids.length > 0) {
      filterBranch = {
        "filterColumn": "guid_branch",
        "filterValues": this.branchGuids,
        "filterOperator": "IN"
      };
    }

    inputModel.filterConditions.push({
      "filterColumn": "txn_type",
      "filterValues": ['PNS'],
      "filterOperator": "IN"
    })

    let filterDate = {
      "dateFrom": UtilitiesModule.getDateNoTime(moment().subtract(1, 'month')),
      "dateTo": UtilitiesModule.getTodayNoTime(),
      "column": "date_txn"
    }

    if (this.appletSettings?.DEFAULT_TRANSACTION_DATE === "1_week") {
      filterDate = {
        "dateFrom": UtilitiesModule.getDateNoTime(moment().subtract(1, 'week')),
        "dateTo": UtilitiesModule.getTodayNoTime(),
        "column": "date_txn"
      }
    } else if (this.appletSettings?.DEFAULT_TRANSACTION_DATE === "1_day") {
      filterDate = {
        "dateFrom": UtilitiesModule.getTodayNoTime(),
        "dateTo": UtilitiesModule.getTodayNoTime(),
        "column": "date_txn"
      }
    }

    if (this.firstLoad) {
      inputModel.filterDate = filterDate;
    }

    if (this.searchQuery?.queryString) {
      const keyword = UtilitiesModule.checkNull(this.searchQuery.queryString['keyword'], null);
      if (keyword) {
        inputModel.search = keyword;
        inputModel.searchColumns = ['item_code', 'item_name'];
      }

      const branches = UtilitiesModule.checkNull(this.searchQuery.queryString['branch'],[]);
      if (branches && branches.length > 0) {
        filterBranch = {
          "filterColumn": "guid_branch",
          "filterValues": branches,
          "filterOperator": "IN"
        }
      }

      if (this.searchQuery.queryString['createdDateCheckbox']) {
        const dateFrom = UtilitiesModule.checkNull(this.searchQuery.queryString['createdDate']['from'],'2022-01-01T00:00:00.000Z');
        const dateTo = UtilitiesModule.checkNull(this.searchQuery.queryString['createdDate']['to'],'2099-12-31T00:00:00.000Z');
        inputModel.filterDate = {
          "dateFrom": dateFrom,
          "dateTo": dateTo,
          "column": "created_date"
        }
      }
      else if (this.searchQuery.queryString['transactionDateCheckbox']) {
        const dateFrom = UtilitiesModule.checkNull(this.searchQuery.queryString['transactionDate']['from'],'2022-01-01T00:00:00.000Z');
        const dateTo = UtilitiesModule.checkNull(this.searchQuery.queryString['transactionDate']['to'],'2099-12-31T00:00:00.000Z');
        inputModel.filterDate = {
          "dateFrom": dateFrom,
          "dateTo": dateTo,
          "column": "date_txn"
        }
      }
      else if (this.searchQuery.queryString['updatedDateCheckbox']) {
        const dateFrom = UtilitiesModule.checkNull(this.searchQuery.queryString['updatedDate']['from'],'2022-01-01T00:00:00.000Z');
        const dateTo = UtilitiesModule.checkNull(this.searchQuery.queryString['updatedDate']['to'],'2099-12-31T00:00:00.000Z');
        inputModel.filterDate = {
          "dateFrom": dateFrom,
          "dateTo": dateTo,
          "column": "updated_date"
        }
      }
    }

    console.log(filterBranch);
    if (filterBranch) {
      inputModel.filterConditions.push(filterBranch);
    }
    return inputModel;
  }

  getTotalData() {
    console.log("on create data....");
    const formData = this.getInputModel();
    formData.childs = [];
    //formData.joins = [];

    formData.calcTotalRecords = true;
    formData.calcTotalRecordsOnly = true;
    this.subs.sink = this.listingService.get("gen-doc-line/internal-sales-returns/backoffice-ep", formData, this.apiVisa).pipe(
    ).subscribe(resolved => {
      this.totalRecords = resolved.totalRecords;
      this.store.dispatch(LineItemActions.selectTotalRecords({totalRecords: this.totalRecords}));
      this.setPaginationTotalRecords(this.totalRecords);
    }, err => {
      console.error(err);
    });
  };

  setDataRowCache() {
    console.log('set data row cache');
    this.gridApi.setRowData(this.rowData);
    this.setPaginationTotalRecords(this.totalRecords);

    this.gridApi.forEachNode(node=> {
      if (node.data.guid === this.localState.selectedRow) {
        //console.log(node);
        node.setSelected(true);
        //const currentPage = Math.ceil((node.rowIndex + 1) / this.gridApi.paginationGetPageSize())
        const pageToNavigate  = JSON.parse(localStorage.getItem(this.compId+'ListingPage'));
        this.gridApi.paginationGoToPage(pageToNavigate);
      }
    });
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
      }
      this.store.dispatch(LineItemActions.selectFirstLoadListing({firstLoadListing: false}));
      this.firstLoad = false;

      this.searchQuery = e;
    } else {
      this.store.dispatch(LineItemActions.selectFirstLoadListing({firstLoadListing: true}));
      this.firstLoad = true;

      this.searchQuery = null;
    }
    this.clear();
    this.getTotalData();
    this.createData();
  }

  clear() {
    this.gridApi.setRowData(null);
    this.totalRecords = 0;
    this.rowData = [];
    this.setPaginationTotalRecords(this.totalRecords);
  }

  getRowStyle = params => {
    if (params.node.footer) {
      return { fontWeight: 'bold', background: '#e6f7ff' };
    }
    if (params.node.group) {
      return { fontWeight: "bold" };
    }
    if (params.data.bl_fi_generic_doc_hdr_forex_doc_hdr_guid) {
      return { background: '#ff4500' };
    }
  }

  onMorePage() {
    console.log('on more page click');
    if (this.rowData.length < this.totalRecords) {
      this.createData();
    }
  }

  onAllPage() {
    console.log('on all page click');
    this.createData(true);
  }

  onRowClicked(entity) {
    if (entity && !this.localState.deactivateList) {
      this.docLineService.getByGuid(entity.guid.toString(), AppConfig.apiVisa).subscribe((response) => {
        this.store.dispatch(LineItemActions.selectLineItem({ lineItem: response.data.bl_fi_generic_doc_line}));
        this.store.dispatch(LineItemActions.selectPricingSchemeLink({ item: response.data.bl_fi_generic_doc_line }));

        this.isSalesReturnService.getByGuid(entity.generic_doc_hdr_guid.toString(), AppConfig.apiVisa).subscribe((response) => {
          this.store.dispatch(LineItemActions.selectSalesReturn({ genDoc: response.data }));
          this.viewColFacade.updateInstance<LocalState>(this.index, {
            ...this.localState,
            deactivateList: false,
            selectedRow: entity.guid
          });
          this.viewColFacade.onNextAndReset(this.index, 1);
        });
      });
    }
  }

  setPaginationTotalRecords(totalRecords) {
    const statusBarPagination = this.gridApi.getStatusPanel('statusBarPagination');
    statusBarPagination.setTotalRecords(totalRecords);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
