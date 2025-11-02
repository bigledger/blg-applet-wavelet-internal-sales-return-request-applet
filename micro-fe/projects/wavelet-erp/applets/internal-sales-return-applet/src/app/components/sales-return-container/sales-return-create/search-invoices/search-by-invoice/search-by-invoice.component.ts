import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Store } from "@ngrx/store";
import {
  DocumentShortCodesClass,
  GenericDocContainerModel,
  SalesInvoiceService,
} from "blg-akaun-ts-lib";
import moment from "moment";
import { ToastrService } from "ngx-toastr";
import { SearchQueryModel } from "projects/shared-utilities/models/query.model";
import { AppConfig } from "projects/shared-utilities/visa";
import { from, Observable, Subject } from "rxjs";
import { debounceTime, map, mergeMap, toArray } from "rxjs/operators";
import { ViewColumnFacade } from "../../../../../facades/view-column.facade";
import { salesInvoiceSearchModel } from "../../../../../models/advanced-search-models/sales-invoice.model";
import { InternalSalesReturnActions } from "../../../../../state-controllers/internal-sales-return-controller/store/actions";
import { InternalSalesReturnStates } from "../../../../../state-controllers/internal-sales-return-controller/store/states";
import { UserPermInquirySelectors } from 'projects/shared-utilities/modules/permission/user-permissions-inquiry-controller/selectors';
import { PermissionStates } from 'projects/shared-utilities/modules/permission/permission-controller';
import { UtilitiesModule } from 'projects/shared-utilities/utilities/utilities.module';
import { ExportStatusBarComponent } from 'projects/shared-utilities/utilities/status-bar/export-status-bar.component';
import { GridOptions } from "ag-grid-enterprise";
import { PaginationV2Component } from 'projects/shared-utilities/utilities/pagination-v2/pagination-v2.component';
import { ListingInputModel } from 'projects/shared-utilities/models/listing-input.model';
import { ListingService } from 'projects/shared-utilities/services/listing-service';
import { SubSink } from "subsink2";

interface LocalState {
  deactivateAdd: boolean;
  deactivateList: boolean;
  selectedRow: any;
}

@Component({
  selector: "app-search-by-invoice",
  templateUrl: "./search-by-invoice.component.html",
  styleUrls: ["./search-by-invoice.component.css"],
})

export class SearchByInvoiceComponent implements OnInit {

  @Input() docType;

  protected subs = new SubSink();

  protected compName = "Invoice Listing";
  protected readonly index = 1;
  protected localState: LocalState;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateAdd$ = this.componentStore.select(
    (state) => state.deactivateAdd
  );

  toggleColumn$: Observable<boolean>;
  searchModel = salesInvoiceSearchModel;

  readPermissionDefintion = {
    branch: "TNT_API_DOC_INTERNAL_SALES_RETURN_READ_TGT_GUID"
  }

  userPermissionTarget$ = this.permissionStore.select(
    UserPermInquirySelectors.selectUserPermInquiry
  );

  rowData = [];
  totalRecords = 0;
  limit = 25;
  searchQuery: SearchQueryModel;
  branchGuids: any[];

  // api visa
  apiVisa = AppConfig.apiVisa;

  // initial grid state
  gridApi;
  gridColumnApi;
  groupColumn = {
    headerName: "Group",
    field: '',
    cellRendererParams: { suppressCount: true },
  };

  gridOptions: GridOptions = {
    statusBar: {
      statusPanels: [
        { statusPanel: 'agTotalAndFilteredRowCountComponent', key: 'totalAndFilter', align: 'left' },
        { statusPanel: 'agSelectedRowCountComponent', align: 'left' },
        { statusPanel: 'agAggregationComponent', align: 'right' },
        // { statusPanel: ExportStatusBarComponent, key: 'statusBarExportKey' }
      ]
    },
    defaultColDef: {
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      //minWidth: 140,
      //flex: 1,
      width: 100,
      sortable: true,
      resizable: true,
      suppressSizeToFit: false,
    },
    columnTypes: UtilitiesModule.columnTypes,
    defaultExcelExportParams: UtilitiesModule.getDefaultExportParams(),
    defaultCsvExportParams: UtilitiesModule.getDefaultExportParams(),
    suppressAggFuncInHeader: true,
    pagination: true,
    animateRows: true,
    sideBar: true,
    rowSelection: 'single',
    suppressRowClickSelection: false,
    multiSortKey: 'ctrl',
    onSortChanged: this.onSortChanged,
    onFilterChanged: this.onFilterChanged,
    onPaginationChanged: (params) => {
      if (params.newPage) {
        let currentPage = params.api.paginationGetCurrentPage();

        localStorage.setItem('currentPageSearchInvoice', JSON.stringify(currentPage));
      }
    }
  }

  columnsDefs = [
    {
      headerName: "Company Code",
      field: "code_company",
      type: 'textColumn'
    },
    {
      headerName: "Branch Code",
      field: "code_branch",
      type: 'textColumn'
    },
    {
      headerName: "Server Doc Type",
      field: "doc_type",
      type: 'textColumn'
    },
    {
      headerName: "Invoice No",
      field: "server_doc_1",
      type: 'textColumn'
    },
    {
      headerName: "Transaction Date",
      field: "date_txn",
      type: 'dateColumn'
    },
    {
      headerName: "Created Date",
      field: "created_date",
      type: "dateTimeColumn",
    },
  ];

  @ViewChild(PaginationV2Component, { static: false })
  private paginationComponent: PaginationV2Component;

  constructor(
    private internalSalesInvoiceService: SalesInvoiceService,
    private listingService: ListingService,
    private viewColFacade: ViewColumnFacade,
    protected readonly permissionStore: Store<PermissionStates>,
    private readonly store: Store<InternalSalesReturnStates>,
    private toastr: ToastrService,
    private readonly componentStore: ComponentStore<LocalState>
  ) { }

  ngOnInit() {
    this.toggleColumn$ = this.viewColFacade.toggleColumn$;
    this.subs.sink = this.localState$.subscribe((a) => {
      this.localState = a;
      this.componentStore.setState(a);
    });

    this.subs.sink = this.userPermissionTarget$.subscribe((targets) => {
      console.log("targets", targets);
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
      if (adminCreatePermissionTarget[0]?.hasPermission || ownerCreatePermissionTarget[0]?.hasPermission) {
        this.branchGuids = [];
      } else {
        this.branchGuids = (target[0]?.target !== null && Object.keys(target[0]?.target || {}).length !== 0) ? target[0]?.target["bl_fi_mst_branch"] : [];
      }
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.gridColumnApi = params.columnApi;

    if (this.rowData.length > 0) {
      this.setDataRowCache();
    }
    else {
      this.clear();
      this.getTotalData();
      this.createData();
    }
    this.gridApi.sizeColumnsToFit();
    setTimeout(() => {
      UtilitiesModule.autoSizeAllColumns(params);
    }, 0);
  }

  onToggle(e: boolean) {
    this.viewColFacade.toggleColumn(e);
  }

  createData(showAll?) {
    console.log("on create data....");
    const formData = this.getInputModel();
    if (showAll) formData.limit = null;
    this.subs.sink = this.listingService.get("gen-doc/" + this.docType, formData, this.apiVisa).pipe(
      mergeMap(a => from(a.data).pipe(
        map(b => {
          Object.assign(b,
            {
              "doc_type": b.server_doc_type ? DocumentShortCodesClass.serverDocTypeToShortCodeMapper(b.server_doc_type) : "",
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
      this.gridApi.paginationGoToLastPage();
      this.paginationComponent.totalRecords.next(this.totalRecords);
    }, err => {
      console.error(err);
    });
  };

  getInputModel() {
    const inputModel = {} as ListingInputModel;
    inputModel.search = (this.searchQuery?.keyword);
    inputModel.searchColumns = ['server_doc_1','code_branch','doc_remarks','doc_reference'];
    inputModel.status = ['ACTIVE'];
    inputModel.orderBy = 'updated_date';
    inputModel.order = 'desc';
    inputModel.limit = this.limit;
    inputModel.offset = this.rowData.length;
    inputModel.calcTotalRecords = false;
    inputModel.showCreatedBy = false;
    inputModel.showUpdatedBy = false;
    inputModel.filterLogical = 'AND';
    //inputModel.filterConditions = [];
    inputModel.childs = [];
    inputModel.joins = [
      // {
      //   "tableName": "bl_fi_mst_branch",
      //   "joinColumn": "guid_branch",
      //   "columns": ["code"],
      //   "joinType": "left join"
      // },
    ]

    inputModel.filterConditions = [
      {
        "filterColumn": "posting_status",
        "filterValues": ["FINAL"],
        "filterOperator": "IN"
      }
    ]

    let filterBranch;
    if (this.branchGuids.length > 0) {
      filterBranch = {
        "filterColumn": "guid_branch",
        "filterValues": this.branchGuids,
        "filterOperator": "IN"
      };
    }

    if (this.searchQuery?.queryString) {
      const branches = UtilitiesModule.checkNull(this.searchQuery.queryString['branch'], []);
      if (branches && branches.length > 0) {
        filterBranch = {
          "filterColumn": "guid_branch",
          "filterValues": branches,
          "filterOperator": "IN"
        }
      }

      const status = UtilitiesModule.checkNull(this.searchQuery.queryString['status'], []);
      if (status && status.length > 0) {
        inputModel.status = status;
      }

      if (this.searchQuery.queryString['createdDateCheckbox']) {
        const dateFrom = UtilitiesModule.checkNull(this.searchQuery.queryString['createdDate']['from'], '2022-01-01T00:00:00.000Z');
        const dateTo = UtilitiesModule.checkNull(this.searchQuery.queryString['createdDate']['to'], '2099-12-31T00:00:00.000Z');
        inputModel.filterDate = {
          "dateFrom": dateFrom,
          "dateTo": dateTo,
          "column": "created_date"
        }
      }
      else if (this.searchQuery.queryString['transactionDateCheckbox']) {
        const dateFrom = UtilitiesModule.checkNull(this.searchQuery.queryString['transactionDate']['from'], '2022-01-01T00:00:00.000Z');
        const dateTo = UtilitiesModule.checkNull(this.searchQuery.queryString['transactionDate']['to'], '2099-12-31T00:00:00.000Z');
        inputModel.filterDate = {
          "dateFrom": dateFrom,
          "dateTo": dateTo,
          "column": "date_txn"
        }
      }
      else if (this.searchQuery.queryString['updatedDateCheckbox']) {
        const dateFrom = UtilitiesModule.checkNull(this.searchQuery.queryString['updatedDate']['from'], '2022-01-01T00:00:00.000Z');
        const dateTo = UtilitiesModule.checkNull(this.searchQuery.queryString['updatedDate']['to'], '2099-12-31T00:00:00.000Z');
        inputModel.filterDate = {
          "dateFrom": dateFrom,
          "dateTo": dateTo,
          "column": "updated_date"
        }
      }
    }

    if (filterBranch) {
      inputModel.filterConditions.push(filterBranch);
    }
    return inputModel;
  }

  getTotalData() {
    console.log("on create data....");
    const formData = this.getInputModel();
    formData.childs = [];
    formData.joins = [];

    formData.calcTotalRecords = true;
    formData.calcTotalRecordsOnly = true;
    this.subs.sink = this.listingService.get("gen-doc/" + this.docType, formData, this.apiVisa).pipe(
    ).subscribe(resolved => {
      this.totalRecords = resolved.totalRecords;
      this.paginationComponent.totalRecords.next(this.totalRecords);
    }, err => {
      console.error(err);
    });
  };

  setDataRowCache() {
    console.log('set data row cache');
    this.gridApi.setRowData(this.rowData);
    this.paginationComponent.totalRecords.next(this.totalRecords);
  }

  onSearch(e: SearchQueryModel) {
    console.log("search", e);
    if (!e.isEmpty) {
      if (e.keyword && e.keyword.length > 0 && e.keyword.length < 3) {
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

      this.searchQuery = e;
    } else {
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
    this.paginationComponent.totalRecords.next(this.totalRecords);
  }

  onRowClicked(entity) {
    console.log(entity);
    this.store.dispatch(
      InternalSalesReturnActions.selectInvoiceForSalesReturn({
        invoiceGuid: entity.guid.toString(),
      })
    );
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState,
      deactivateAdd: true,
      deactivateList: false,
      selectedSearchIndex: this.docType==='internal-sales-invoices'?1:2,
      docType: this.docType
    });
    this.viewColFacade.updateInstance(44, {
      ...this.localState,
      docType: this.docType
    });
    this.viewColFacade.onNextAndReset(this.index, 44);
  }

  getRowStyle = params => {
    if (params.data.forex_doc_hdr_guid) {
      return { background: '#ff4500' };
    }
  }

  onFirstDataRendered(params) {
    UtilitiesModule.autoSizeAllColumns(this.gridOptions);
  }

  onSortChanged(e) {
    e.api.refreshCells();
  }

  onFilterChanged(e) {
    e.api.refreshCells();
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

  checkDataRow(rowData) {
    return rowData.filter(item => item.bl_fi_generic_doc_hdr.forex_doc_hdr_guid === null);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
