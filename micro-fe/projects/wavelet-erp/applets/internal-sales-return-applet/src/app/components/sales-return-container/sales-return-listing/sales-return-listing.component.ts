import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Store } from "@ngrx/store";
import { StatusPanelDef } from "ag-grid-enterprise";
import {
  GenericDocContainerModel,
  GenericDocEditingLockDto,
  GenericDocLockService,
  InternalSalesReturnRequestService,
  DocumentShortCodesClass ,
} from "blg-akaun-ts-lib";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { ClientSidePermissionsSelectors } from "projects/shared-utilities/modules/permission/client-side-permissions-controller/selectors";
import { PermissionStates } from "projects/shared-utilities/modules/permission/permission-controller";
import { UserPermInquirySelectors } from "projects/shared-utilities/modules/permission/user-permissions-inquiry-controller/selectors";
import { SessionSelectors } from "projects/shared-utilities/modules/session/session-controller/selectors";
import { SessionStates } from "projects/shared-utilities/modules/session/session-controller/states";
import { ViewColumnComponent } from "projects/shared-utilities/view-column.component";
import { AppConfig } from "projects/shared-utilities/visa";
import { from, Observable } from "rxjs";
import { map, mergeMap, toArray } from "rxjs/operators";
import { SubSink } from "subsink2";
import { ViewColumnFacade } from "../../../facades/view-column.facade";
import { salesReturnSearchModel } from "../../../models/advanced-search-models/internal-sales-return.model";
import { AppletSettings } from "../../../models/applet-settings.model";
import { InternalSalesReturnActions } from "../../../state-controllers/internal-sales-return-controller/store/actions";
import { InternalSalesReturnSelectors } from "../../../state-controllers/internal-sales-return-controller/store/selectors";
import { InternalSalesReturnStates } from "../../../state-controllers/internal-sales-return-controller/store/states";
import { Column1ViewSelectors } from "../../../state-controllers/sales-return-view-model-controller/store/selectors";
import { ColumnViewModelStates } from "../../../state-controllers/sales-return-view-model-controller/store/states";
import { PNSActions, ContraActions } from "../../../state-controllers/draft-controller/store/actions";
import { DraftStates } from "../../../state-controllers/draft-controller/store/states";
import { UUID } from "angular2-uuid";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AkaunGenDocLockDialogComponent } from 'projects/shared-utilities/dialogues/akaun-gen-doc-lock-dialog/akaun-gen-doc-lock-dialog.component';
import { UtilitiesModule } from 'projects/shared-utilities/utilities/utilities.module';
import { ListingInputModel } from 'projects/shared-utilities/models/listing-input.model';
import { SearchQueryModel } from 'projects/shared-utilities/models/query.model';
import { ListingService } from 'projects/shared-utilities/services/listing-service';
import { AdvancedSearchGeneralComponent } from 'projects/shared-utilities/utilities/advanced-search-general/advanced-search-general.component'
import { GridOptions } from "ag-grid-enterprise";
import { AkaunConfirmationDialogComponent } from "projects/shared-utilities/utilities/dialogues/akaun-confirmation-dialog/akaun-confirmation-dialog";
import { FormControl, FormGroup } from '@angular/forms';
import { SessionActions } from "projects/shared-utilities/modules/session/session-controller/actions";
interface LocalState {
  deactivateAdd: boolean;
  deactivateList: boolean;
  selectedRow: any;
}

@Component({
  selector: "app-sales-return-listing",
  templateUrl: "./sales-return-listing.component.html",
  styleUrls: ["./sales-return-listing.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore],
})

export class SalesReturnListingComponent extends ViewColumnComponent {
  @ViewChild(AdvancedSearchGeneralComponent) advancedSearch!: AdvancedSearchGeneralComponent;
  protected subs = new SubSink();

  compId = 'salesReturn';
  compName = "Sales Return Request Listing";
  protected readonly index = 0;
  protected localState: LocalState;
  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateAdd$ = this.componentStore.select(
    (state) => state.deactivateAdd
  );

  toggleColumn$: Observable<boolean>;
  searchModel = salesReturnSearchModel;

  readPermissionDefintion = {
    branch: "TNT_API_DOC_INTERNAL_SALES_RETURN_REQUEST_READ_TGT_GUID",
    company: "TNT_API_DOC_INTERNAL_SALES_RETURN_REQUEST_READ_TGT_GUID",
  }

  showColumns = [
    { name: 'bl_fi_generic_doc_hdr.server_doc_1', setting: 'HIDE_SERVER_DOC_1', permission: 'SHOW_DOC_NO_TENANT' },
    { name: 'bl_fi_generic_doc_hdr.server_doc_2', setting: 'HIDE_SERVER_DOC_2', permission: 'SHOW_DOC_NO_COMPANY' },
    { name: 'bl_fi_generic_doc_hdr.server_doc_3', setting: 'HIDE_SERVER_DOC_3', permission: 'SHOW_DOC_NO_BRANCH' },
    { name: 'bl_fi_generic_doc_hdr.bl_fi_mst_branch_code', setting: 'HIDE_LISTING_BRANCH', permission: 'SHOW_LISTING_BRANCH' },
    { name: 'bl_fi_generic_doc_hdr.date_txn', setting: 'HIDE_TRANSACTION_DATE', permission: 'SHOW_TRANSACTION_DATE' },
    { name: 'bl_fi_generic_doc_hdr.client_doc_type', setting: 'HIDE_CLIENT_DOC_TYPE', permission: 'SHOW_CLIENT_DOC_TYPE' },
    { name: 'bl_fi_generic_doc_hdr.client_doc_1', setting: 'HIDE_CLIENT_DOC_1', permission: 'SHOW_CLIENT_DOC_1' },
    { name: 'bl_fi_generic_doc_hdr.client_doc_2', setting: 'HIDE_CLIENT_DOC_2', permission: 'SHOW_CLIENT_DOC_2' },
    { name: 'bl_fi_generic_doc_hdr.client_doc_3', setting: 'HIDE_CLIENT_DOC_3', permission: 'SHOW_CLIENT_DOC_3' },
    { name: 'bl_fi_generic_doc_hdr.client_doc_4', setting: 'HIDE_CLIENT_DOC_4', permission: 'SHOW_CLIENT_DOC_4' },
    { name: 'bl_fi_generic_doc_hdr.client_doc_5', setting: 'HIDE_CLIENT_DOC_5', permission: 'SHOW_CLIENT_DOC_5' },
    { name: 'bl_fi_generic_doc_hdr.arap_pns_amount', setting: 'HIDE_ARAP_PNS', permission: 'SHOW_ARAP_PNS' },
    { name: 'bl_fi_generic_doc_hdr.arap_stlm_amount', setting: 'HIDE_ARAP_SETTLEMENT', permission: 'SHOW_ARAP_SETTLEMENT' },
    { name: 'bl_fi_generic_doc_hdr.arap_doc_open', setting: 'HIDE_ARAP_DOC_OPEN', permission: 'SHOW_ARAP_DOC_OPEN' },
    { name: 'bl_fi_generic_doc_hdr.arap_contra', setting: 'HIDE_ARAP_CONTRA', permission: 'SHOW_ARAP_CONTRA' },
    { name: 'bl_fi_generic_doc_hdr.arap_bal', setting: 'HIDE_ARAP_BAL', permission: 'SHOW_ARAP_BAL' },
    { name: 'bl_fi_generic_doc_hdr.arap_stlm_amount', setting: 'HIDE_ARAP_SETTLEMENT', permission: 'SHOW_ARAP_SETTLEMENT' },
    { name: 'bl_fi_generic_doc_hdr.bl_fi_mst_gl_dimension_code', setting: 'SHOW_GL_DIMENSION', permission: 'SHOW_GL_DIMENSION' },
    { name: 'bl_fi_generic_doc_hdr.bl_fi_mst_segment_code', setting: 'SHOW_SEGMENT', permission: 'SHOW_SEGMENT' },
    { name: 'bl_fi_generic_doc_hdr.bl_fi_mst_profit_center_code', setting: 'SHOW_PROFIT_CENTER', permission: 'SHOW_PROFIT_CENTER' },
    { name: 'bl_fi_generic_doc_hdr.bl_fi_mst_project_code', setting: 'SHOW_PROJECT', permission: 'SHOW_PROJECT' },
    { name: 'bl_fi_generic_doc_hdr.doc_entity_hdr_json.description', setting:'SHOW_DESCRIPTION', permission:'SHOW_DESCRIPTION'},
    { name: 'bl_fi_generic_doc_hdr.amount_txn', setting:'HIDE_AMOUNT_TXN_MAIN_LISTING', permission:'SHOW_AMOUNT_TXN_MAIN_LISTING'},
    { name: 'bl_fi_generic_doc_hdr.xtn_doc_ref_1',setting:'HIDE_QUOTATION', permission:'SHOW_QUOTATION'},
    { name: 'bl_fi_generic_doc_hdr.xtn_doc_ref_2',setting:'HIDE_ORDER', permission:'SHOW_ORDER'},
    { name: 'bl_fi_generic_doc_hdr.xtn_doc_ref_3',setting:'HIDE_DELIVERY_ORDER', permission:'SHOW_DELIVERY_ORDER'},
    { name: 'bl_fi_generic_doc_hdr.xtn_doc_ref_4',setting:'HIDE_INVOICE', permission:'SHOW_INVOICE'},
    { name: 'bl_fi_generic_doc_hdr.xtn_doc_ref_5',setting:'HIDE_OTHERS', permission:'SHOW_OTHERS'},
    { name: 'bl_fi_generic_doc_hdr.doc_remarks',setting:'SHOW_REMARKS_MAIN_LISTING', permission:'SHOW_REMARKS_MAIN_LISTING'},
    { name: 'bl_fi_generic_doc_hdr.doc_reference',setting:'SHOW_REFERENCE_MAIN_LISTING', permission:'SHOW_REFERENCE_MAIN_LISTING'},
  ]
  dateMappings = [
    { display: 'CREATED DATE', key: 'created_date' },
    { display: 'UPDATED DATE', key: 'updated_date' },
    { display: 'TRANSACTION DATE', key: 'date_txn' }
  ];

  firstLoad$ = this.store.select(InternalSalesReturnSelectors.selectFirstLoadListing);
  totalRecords$ = this.store.select(InternalSalesReturnSelectors.selectTotalRecords);
  rowData$ = this.store.select(InternalSalesReturnSelectors.selectRowData);
  rowData = [];
  totalRecords = 0;
  limit = 50;
  searchQuery: SearchQueryModel;
  firstLoad;
  branchGuids: any[];
  companyGuids: any[];
  hasCreatePermission: boolean;
  settings: any[] = [];
  appletSettings: any;
  permissions: any[] = [];
  userRank: string;
  fieldHidingExecuted = false;
  disableVoidButton = false;

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
    paginationPageSize: this.limit,
    onRowClicked: (event) => this.onRowClicked(event.data),
    onSelectionChanged: (event) => this.onSelectionChanged(event),
  }

  readonly userRank$ = this.sessionStore.select(
    SessionSelectors.selectUserRank
  );
  selectedBranches$ = this.viewModelStore.select(
    Column1ViewSelectors.selectAdvanceSearch_Branch_Field
  );
  readonly userPermissionTarget$ = this.permissionStore.select(
    UserPermInquirySelectors.selectUserPermInquiry
  );

  masterSettings$ = this.sessionStore.select(
    SessionSelectors.selectMasterSettings
  );

  clientSidePermissions$ = this.permissionStore.select(
    ClientSidePermissionsSelectors.selectAll
  );
  akaunGenDocLockDialogComponent: MatDialogRef<AkaunGenDocLockDialogComponent>;

  columnsDefs = [
    {
      floatingFilter: false,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      maxWidth: 50,
      suppressColumnsToolPanel: false,
      sortable: false,
      resizable: true,
      suppressMenu: true,
      enableRowGroup: false,
      pdfExportOptions: { skipColumn: true }
    },
    {
      headerName: "Doc Short Code",
      field: "bl_fi_generic_doc_hdr.doc_type",
      type: 'textColumn'
    },
    {
      headerName: "Doc No (Tenant)",
      field: "bl_fi_generic_doc_hdr.server_doc_1",
      type: 'textColumn'
    },
    {
      headerName: "Doc No (Company)",
      field: "bl_fi_generic_doc_hdr.server_doc_2",
      type: 'textColumn'
    },
    {
      headerName: "Doc No (Branch)",
      field: "bl_fi_generic_doc_hdr.server_doc_3",
      type: 'textColumn'
    },
    {
      headerName: "Reference",
      field: "bl_fi_generic_doc_hdr.doc_reference",
      type: 'textColumn'
    },
    {
      headerName: "Remarks",
      field: "bl_fi_generic_doc_hdr.doc_remarks",
      type: "textColumn"
    },
    {
      headerName: "Posting Status",
      field: "bl_fi_generic_doc_hdr.posting_status",
      type: 'textColumn'
    },
    {
      headerName: "Status",
      field: "bl_fi_generic_doc_hdr.status",
      type: 'textColumn'
    },
    {
      headerName: "Branch Code",
      field: "bl_fi_generic_doc_hdr.code_branch",
      type: 'textColumn'
    },
    {
      headerName: "Currency",
      field: "bl_fi_generic_doc_hdr.doc_ccy",
      type: 'textColumn'
    },
    {
      headerName: "Customer Name",
      field: "bl_fi_generic_doc_hdr.doc_entity_hdr_json.entityName",
      type: 'textColumn'
    },
    {
      headerName: "Sales Agent",
      field: "bl_fi_generic_doc_hdr.sales_entity_hdr_name",
      type: "textColumn"
    },
    {
      headerName: "Transaction Date",
      field: "bl_fi_generic_doc_hdr.date_txn",
      type: 'dateColumn'
    },
    {
      headerName: "Amount Txn",
      field: "bl_fi_generic_doc_hdr.amount_txn",
      type: "decimalColumn"
    },
    {
      headerName: "ARAP PNS",
      field: "bl_fi_generic_doc_hdr.arap_pns_amount",
      type: "decimalColumn"
    },
    {
      headerName: "ARAP Settlement",
      field: "bl_fi_generic_doc_hdr.arap_stlm_amount",
      type: "decimalColumn"
    },
    {
      headerName: "ARAP Doc Open",
      field: "bl_fi_generic_doc_hdr.arap_doc_open",
      type: "decimalColumn"
    },
    {
      headerName: "ARAP Contra",
      field: "bl_fi_generic_doc_hdr.arap_contra",
      type: "decimalColumn"
    },
    {
      headerName: "ARAP Bal",
      field: "bl_fi_generic_doc_hdr.arap_bal",
      type: "decimalColumn"
    },
    {
      headerName: "Created Date",
      field: "bl_fi_generic_doc_hdr.created_date",
      type: "dateTimeColumn",
    },
    {
      headerName: "Created By",
      field: "bl_fi_generic_doc_hdr.created_by_name",
      type: "textColumn"
    },
    {
      headerName: "Updated Date",
      field: "bl_fi_generic_doc_hdr.updated_date",
      type: "dateTimeColumn"
    },
    {
      headerName: "Updated By",
      field: "bl_fi_generic_doc_hdr.updated_by_name",
      type: "textColumn"
    },
    {
      headerName: "Client Doc Type",
      field: "bl_fi_generic_doc_hdr.client_doc_type",
      type: "textColumn"
    },
    {
      headerName: "Client Doc 1",
      field: "bl_fi_generic_doc_hdr.client_doc_1",
      type: "textColumn"
    },
    {
      headerName: "Client Doc 2",
      field: "bl_fi_generic_doc_hdr.client_doc_2",
      type: "textColumn"
    },
    {
      headerName: "Client Doc 3",
      field: "bl_fi_generic_doc_hdr.client_doc_3",
      type: "textColumn"
    },
    {
      headerName: "Client Doc 4",
      field: "bl_fi_generic_doc_hdr.client_doc_4",
      type: "textColumn"
    },
    {
      headerName: "Client Doc 5",
      field: "bl_fi_generic_doc_hdr.client_doc_5",
      type: "textColumn"
    },
    {
      headerName: "GL Dimension",
      field: "bl_fi_generic_doc_hdr.bl_fi_mst_gl_dimension_code",
      type: "textColumn",
    },
    {
      headerName: "Segment",
      field: "bl_fi_generic_doc_hdr.bl_fi_mst_segment_code",
      type: "textColumn",
    },
    {
      headerName: "Profit Center",
      field: "bl_fi_generic_doc_hdr.bl_fi_mst_profit_center_code",
      type: "textColumn",
    },
    {
      headerName: "Project",
      field: "bl_fi_generic_doc_hdr.bl_fi_mst_project_code",
      type: "textColumn",
    }
  ];
  disableFinalButton: boolean = true;
  disableDiscardButton: boolean = true;
  akaunConfirmationDialogComponent: MatDialogRef<AkaunConfirmationDialogComponent>;

  personalData: any;

  constructor(
    private readonly draftStore: Store<DraftStates>,
    private viewColFacade: ViewColumnFacade,
    private toastr: ToastrService,
    private readonly store: Store<InternalSalesReturnStates>,
    protected readonly sessionStore: Store<SessionStates>,
    public readonly viewModelStore: Store<ColumnViewModelStates>,
    protected readonly permissionStore: Store<PermissionStates>,
    private readonly componentStore: ComponentStore<LocalState>,
    private isdnService: InternalSalesReturnRequestService,
    private listingService: ListingService,
    private cdr: ChangeDetectorRef,
    private genericDocLockService: GenericDocLockService,
    private dialogRef: MatDialog
  ) {
    super();
  }

  ngOnInit() {

    this.subs.sink = this.firstLoad$.subscribe(firstLoad => this.firstLoad = firstLoad);
    this.subs.sink = this.rowData$.subscribe(rowData => this.rowData = rowData);
    this.subs.sink = this.totalRecords$.subscribe(totalRecords => this.totalRecords = totalRecords);

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

    this.toggleColumn$ = this.viewColFacade.toggleColumn$;
    this.subs.sink = this.localState$.subscribe((a) => {
      this.localState = a;
      this.componentStore.setState(a);
    });

    this.toggleColumn$ = this.viewColFacade.toggleColumn$;
    this.subs.sink = this.localState$.subscribe((a) => {
      this.localState = a;
      this.componentStore.setState(a);
    });

    this.subs.sink = this.userRank$.subscribe((userRank) => {
      if (userRank) {
        this.userRank = userRank;
      }
    });

    this.subs.sink = this.selectedBranches$.subscribe((branches) => {
      this.branchGuids = branches.map((obj) => obj.guid);
    });

    this.subs.sink = this.userPermissionTarget$.subscribe((targets) => {
      let target = targets.filter(
        (target) =>
          target.permDfn === "TNT_API_DOC_INTERNAL_SALES_RETURN_REQUEST_READ_TGT_GUID"
      );
      let createPermissionTarget = targets.filter(
        (target) =>
          target.permDfn === "TNT_API_DOC_INTERNAL_SALES_RETURN_REQUEST_CREATE_TGT_GUID"
      );
      let adminCreatePermissionTarget = targets.filter(
        (target) => target.permDfn === "TNT_TENANT_ADMIN"
      );
      let ownerCreatePermissionTarget = targets.filter(
        (target) => target.permDfn === "TNT_TENANT_OWNER"
      );
      if (adminCreatePermissionTarget[0]?.hasPermission
        || ownerCreatePermissionTarget[0]?.hasPermission) {
        console.log("has Permission");
        this.branchGuids = [];
        this.companyGuids = [];
      } else {
        console.log("has targets");
        this.branchGuids = target[0]?.target !== null && Object.keys(target[0]?.target || {}).length !== 0
          ? target[0]?.target["bl_fi_mst_branch"]
          : [];
        this.companyGuids = target[0]?.target !== null && Object.keys(target[0]?.target || {}).length !== 0
          ? target[0]?.target["bl_fi_mst_comp"]
          : [];
      }
      if (
        createPermissionTarget[0]?.hasPermission ||
        adminCreatePermissionTarget[0]?.hasPermission ||
        ownerCreatePermissionTarget[0]?.hasPermission
      ) {
        this.hasCreatePermission = true;
      } else {
        this.hasCreatePermission = false;
      }
    });

    this.getAppletSettings();
    this.getPermissions();
  }

  onSelectionChanged(event) {
    this.disableVoidButtonStatus(event.api.getSelectedRows())
    this.disableFinalButtonStatus(event.api.getSelectedRows())
    this.disableDiscardButtonStatus(event.api.getSelectedRows())
  }
  disableFinalButtonStatus(selectedRows) {
    if (!selectedRows || selectedRows.length === 0) {
      this.disableFinalButton = true;
    } else {
      this.disableFinalButton = !selectedRows.every(row => row.bl_fi_generic_doc_hdr.posting_status === "DRAFT");
    }
    this.cdr.detectChanges();
  }

  onFinal() {
    let selectedRows;
    let arr = [];
    const json = {
      posting_status: "FINAL",
    };
    selectedRows = this.gridApi.getSelectedRows();
    let errorList: string[] = [];
    let errorListNoPayment: string[] = [];
    selectedRows.map((row) => {
      if (this.checkDoclineError(row)) {
        errorList.push(
          row.bl_fi_generic_doc_hdr.server_doc_1 +
          " Serial numbers are invalid."
        );
      } else {
        arr.push(row);
      }

      if (this.appletSettings?.SALES_RETURN_WITH_PAYMENT) {
        if (row.bl_fi_generic_doc_hdr.arap_bal !== 0) {
          errorListNoPayment.push(
            row.bl_fi_generic_doc_hdr.server_doc_1 + " No Payment"
          );
        }
      } else {
        arr.push(row);
      }
    });
    if (errorList.length || errorListNoPayment.length) {
      const docList = errorList.join("<br/> ");
      const docListNoPayment = errorListNoPayment.join("<br/> ");
      if (errorList.length) {
        this.toastr.error(
          "Unable to post the document to FINAL: <br/>" + docList,
          "Error",
          {
            tapToDismiss: true,
            progressBar: true,
            timeOut: 1300,
            enableHtml: true,
            closeButton: false,
          }
        );
      }
      if (
        this.appletSettings?.SALES_RETURN_WITH_PAYMENT &&
        errorListNoPayment.length
      ) {
        this.toastr.error(
          "Unable to post the document to FINAL: <br/>" + docListNoPayment,
          "Error",
          {
            tapToDismiss: true,
            progressBar: true,
            timeOut: 1300,
            enableHtml: true,
            closeButton: false,
          }
        );
      }
    } else {
      arr = arr.filter(
        (x) =>
          x.bl_fi_generic_doc_hdr.posting_status !== "FINAL" &&
          x.bl_fi_generic_doc_hdr.status === "ACTIVE"
      );
      const uniqueArr = Array.from(
        new Set(arr.map((x) => x.bl_fi_generic_doc_hdr.guid))
      ).map((guid) => {
        return arr.find((x) => x.bl_fi_generic_doc_hdr.guid === guid);
      });
      uniqueArr.forEach((e) => {
        let temp: GenericDocContainerModel = {
          bl_fi_generic_doc_hdr: e.bl_fi_generic_doc_hdr,
          bl_fi_generic_doc_event: e.bl_fi_generic_doc_event,
          bl_fi_generic_doc_ext: e.bl_fi_generic_doc_ext,
          bl_fi_generic_doc_link: e.bl_fi_generic_doc_link,
          bl_fi_generic_doc_line: e.bl_fi_generic_doc_line,
        };
        this.store.dispatch(
          InternalSalesReturnActions.updatePostingStatus({
            status: json,
            doc: temp,
          })
        );
      });
      this.gridApi.refreshServerSideStore();
    }
    if(this.appletSettings.ENABLE_AUTO_POPUP) {
      this.onBulkPrint();
    }
  }


  disableVoidButtonStatus(selectedRows) {
    if (!selectedRows || selectedRows.length === 0) {
      this.disableVoidButton = true;
    } else {
      this.disableVoidButton = !selectedRows.every(row => row.bl_fi_generic_doc_hdr.posting_status === "FINAL");
    }
    this.cdr.detectChanges();
  }

  onVoid() {
    const json = {
      posting_status: "VOID",
    };
    const selectedRows = this.gridApi
      .getSelectedRows()
      .filter(
        (x) =>
          x.bl_fi_generic_doc_hdr.posting_status === "FINAL" &&
          x.bl_fi_generic_doc_hdr.status === "ACTIVE"
      );
    if (selectedRows.length > 0) {
      this.akaunConfirmationDialogComponent = this.dialogRef.open(AkaunConfirmationDialogComponent, { width: '400px' });
      this.akaunConfirmationDialogComponent.componentInstance.confirmMessage = 'Are you sure you want to VOID selected documents?';
      this.akaunConfirmationDialogComponent.afterClosed().subscribe((result) => {
      if (result === true) {
       selectedRows.forEach((e) => {
        let temp: GenericDocContainerModel = {
          bl_fi_generic_doc_hdr: e.bl_fi_generic_doc_hdr,
          bl_fi_generic_doc_event: e.bl_fi_generic_doc_event,
          bl_fi_generic_doc_ext: e.bl_fi_generic_doc_ext,
          bl_fi_generic_doc_link: e.bl_fi_generic_doc_link,
          bl_fi_generic_doc_line: e.bl_fi_generic_doc_line,
        };
        this.store.dispatch(
          InternalSalesReturnActions.voidSalesReturnInit({
            status: json,
            doc: temp,
          })
        );
      });
    }
  })
    }
  }

  checkDoclineError(lines: any) {
    let hasInvalidSerial = false;
    lines.bl_fi_generic_doc_line.forEach((line) => {
      if (line.item_sub_type === "SERIAL_NUMBER") {
        if (line.serial_no) {
          if (Array.isArray(line.serial_no?.serialNumbers)) {
            if (!line.serial_no?.serialNumbers.length) {
              hasInvalidSerial = true;
            }
          } else {
            hasInvalidSerial = true;
          }
        } else {
          hasInvalidSerial = true;
        }
      }
    });
    return hasInvalidSerial;
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
    else if (!this.appletSettings.DISABLE_GEN_DOC_LISTING) {
      this.clear();
      this.getTotalData();
      this.createData();
    }
    this.subs.sink = this.store.select(InternalSalesReturnSelectors.refreshGenDocListing).subscribe(resolved => {
      if (resolved) {
        this.firstLoad = true;
        this.clear();
        this.getTotalData();
        this.createData();
        this.store.dispatch(InternalSalesReturnActions.resetAgGrid());
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
    this.subs.sink = this.listingService.get("gen-doc/internal-sales-return-requests", formData, this.apiVisa).pipe(
      mergeMap(a => from(a.data).pipe(
        map(b => {
          Object.assign(b,
            {
              bl_fi_generic_doc_hdr: b,
              "doc_type": b.server_doc_type ? DocumentShortCodesClass.serverDocTypeToShortCodeMapper(b.server_doc_type) : "",
              "posting_status": (b.posting_status ? b.posting_status : "DRAFT")
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
      this.store.dispatch(InternalSalesReturnActions.selectRowData({ rowData: <any>this.rowData }));
      this.gridApi.paginationGoToLastPage();
    }, err => {
      console.error(err);
    });
  };

  getInputModel() {
    const inputModel = {} as ListingInputModel;
    inputModel.search = (this.searchQuery?.keyword);
    inputModel.searchColumns = this.getFuzzySearch();
    inputModel.status = ['ACTIVE'];
    inputModel.orderBy = this.appletSettings.SORT_ORDER ?? 'updated_date';
    inputModel.order = 'desc';
    inputModel.limit = this.limit;
    inputModel.offset = this.rowData.length;
    inputModel.calcTotalRecords = false;
    inputModel.showCreatedBy = false;
    inputModel.showUpdatedBy = false;
    inputModel.filterLogical = 'AND';
    inputModel.filterConditions = [];
    inputModel.childs = [];
    inputModel.joins = [
      // {
      //   "tableName": "bl_fi_mst_branch",
      //   "joinColumn": "guid_branch",
      //   "columns": ["code"],
      //   "joinType": "left join"
      // },
      {
        "tableName": "bl_fi_mst_gl_dimension",
        "joinColumn": "guid_dimension",
        "columns": ["code"],
        "joinType": "left join"
      },
      {
        "tableName": "bl_fi_mst_segment",
        "joinColumn": "guid_segment",
        "columns": ["code"],
        "joinType": "left join"
      },
      {
        "tableName": "bl_fi_mst_profit_center",
        "joinColumn": "guid_profit_center",
        "columns": ["code"],
        "joinType": "left join"
      },
      {
        "tableName": "bl_fi_mst_project",
        "joinColumn": "guid_project",
        "columns": ["code"],
        "joinType": "left join"
      },
    ]
    inputModel.childs = [
      {
        "tableName": "bl_fi_generic_doc_line",
        "joinColumn": "generic_doc_hdr_guid",
        "joinType": "left join",
        "filterLogical": "AND",
        "filterConditions": []
      },
    ];

    let filterBranch;
    if (this.branchGuids?.length > 0) {
      filterBranch = {
        "filterColumn": "guid_branch",
        "filterValues": this.branchGuids,
        "filterOperator": "IN"
      };
    }

    let filterCompany;
    if (this.companyGuids?.length > 0) {
      filterCompany = {
        "filterColumn": "guid_comp",
        "filterValues": this.companyGuids,
        "filterOperator": "IN"
      };
    }

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

      const status = this.getStatus();
      if (status) {
        inputModel.status = status;
      }

      const postingStatus = this.getPostingStatus();
      if (postingStatus && postingStatus.length > 0) {
        inputModel.filterConditions.push({
          "filterColumn": "posting_status",
          "filterValues": postingStatus,
          "filterOperator": "IN"
        })
      }
    }

    if (this.searchQuery?.queryString) {
      const customers = UtilitiesModule.checkNull(this.searchQuery.queryString['customer'], []);
      if (customers && customers.length > 0) {
        inputModel.filterConditions.push({
          "filterColumn": "doc_entity_hdr_guid",
          "filterValues": customers,
          "filterOperator": "IN"
        })
      }

      const branches = UtilitiesModule.checkNull(this.searchQuery.queryString['branch'], []);
      if (branches && branches.length > 0) {
        filterBranch = {
          "filterColumn": "guid_branch",
          "filterValues": branches,
          "filterOperator": "IN"
        }
      }
      const companies = UtilitiesModule.checkNull(this.searchQuery.queryString['company'], []);
      if (companies && companies.length > 0) {
        filterCompany = {
          "filterColumn": "guid_comp",
          "filterValues": companies,
          "filterOperator": "IN"
        }
      }
      const salesAgents = UtilitiesModule.checkNull(this.searchQuery.queryString['salesAgent'], []);
      if (salesAgents && salesAgents.length > 0) {
        inputModel.filterConditions.push({
          "filterColumn": "sales_entity_hdr_guid",
          "filterValues": salesAgents,
          "filterOperator": "IN"
        })
      }
      const postingStatus = UtilitiesModule.checkNull(this.searchQuery.queryString['postingStatus'], []);
      if (postingStatus && postingStatus.length > 0) {
        inputModel.filterConditions.push({
          "filterColumn": "posting_status",
          "filterValues": postingStatus,
          "filterOperator": "IN"
        })
      }

      const status = UtilitiesModule.checkNull(this.searchQuery.queryString['status'], []);
      if (status && status.length > 0) {
        inputModel.status = status;
      }

      const glDimensions = UtilitiesModule.checkNull(this.searchQuery.queryString['glDimensions'], []);
      if (glDimensions && glDimensions.length > 0) {
        inputModel.filterConditions.push({
          "filterColumn": "guid_dimension",
          "filterValues": glDimensions,
          "filterOperator": "IN"
        })
      }
      const segments = UtilitiesModule.checkNull(this.searchQuery.queryString['segments'], []);
      if (segments && segments.length > 0) {
        inputModel.filterConditions.push({
          "filterColumn": "guid_segment",
          "filterValues": segments,
          "filterOperator": "IN"
        })
      }
      const profitCenters = UtilitiesModule.checkNull(this.searchQuery.queryString['profitCenters'], []);
      if (profitCenters && profitCenters.length > 0) {
        inputModel.filterConditions.push({
          "filterColumn": "guid_profit_center",
          "filterValues": profitCenters,
          "filterOperator": "IN"
        })
      }
      const projects = UtilitiesModule.checkNull(this.searchQuery.queryString['projects'], []);
      if (projects && projects.length > 0) {
        inputModel.filterConditions.push({
          "filterColumn": "guid_project",
          "filterValues": projects,
          "filterOperator": "IN"
        })
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
      if (this.searchQuery.queryString['einvoiceBillingFrequencyCheckbox']) {
        const billingFrequency = UtilitiesModule.checkNull(this.searchQuery.queryString['einvoiceBillingFrequency'], []);
        if (billingFrequency && billingFrequency.length > 0) {
          inputModel.filterConditions.push({
            "filterColumn": "einvoice_billing_frequency",
            "filterValues": billingFrequency,
            "filterOperator": "IN"
          })
        }
      }
      if (this.searchQuery.queryString['einvoiceBillingPeriodStartCheckbox']) {
        const dateFrom = UtilitiesModule.checkNull(this.searchQuery.queryString['einvoiceBillingPeriodStart']['from'], '2022-01-01T00:00:00.000Z');
        const dateTo = UtilitiesModule.checkNull(this.searchQuery.queryString['einvoiceBillingPeriodStart']['to'], '2099-12-31T00:00:00.000Z');
        inputModel.filterDate = {
          "dateFrom": dateFrom,
          "dateTo": dateTo,
          "column": "einvoice_billing_period_start"
        }
      }
      if (this.searchQuery.queryString['einvoiceBillingPeriodEndCheckbox']) {
        const dateFrom = UtilitiesModule.checkNull(this.searchQuery.queryString['einvoiceBillingPeriodEnd']['from'], '2022-01-01T00:00:00.000Z');
        const dateTo = UtilitiesModule.checkNull(this.searchQuery.queryString['einvoiceBillingPeriodEnd']['to'], '2099-12-31T00:00:00.000Z');
        inputModel.filterDate = {
          "dateFrom": dateFrom,
          "dateTo": dateTo,
          "column": "einvoice_billing_period_end"
        }
      }

      const orderBy = UtilitiesModule.checkNull(this.searchQuery.queryString['orderBy'], null);
      if (orderBy) {
        inputModel.orderBy = this.getOrderBy(orderBy);
      }

    }

    if (filterBranch) inputModel.filterConditions.push(filterBranch);
    if (filterCompany) inputModel.filterConditions.push(filterCompany);
    return inputModel;
  }

  getTotalData() {
    console.log("on create data....");
    const formData = this.getInputModel();
    formData.childs = [];
    formData.joins = [];

    formData.calcTotalRecords = true;
    formData.calcTotalRecordsOnly = true;
    this.subs.sink = this.listingService.get("gen-doc/internal-sales-return-requests", formData, this.apiVisa).pipe(
    ).subscribe(resolved => {
      this.totalRecords = resolved.totalRecords;
      this.store.dispatch(InternalSalesReturnActions.selectTotalRecords({ totalRecords: this.totalRecords }));
      this.setPaginationTotalRecords(this.totalRecords);
    }, err => {
      console.error(err);
    });
  };

  setDataRowCache() {
    console.log('set data row cache');
    this.gridApi.setRowData(this.rowData);
    this.setPaginationTotalRecords(this.totalRecords);

    this.gridApi.forEachNode(node => {
      if (node.data.guid === this.localState.selectedRow) {
        //console.log(node);
        node.setSelected(true);
        //const currentPage = Math.ceil((node.rowIndex + 1) / this.gridApi.paginationGetPageSize())
        const pageToNavigate = JSON.parse(localStorage.getItem(this.compId+'ListingPage'));
        this.gridApi.paginationGoToPage(pageToNavigate);
      }
    });
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

      this.store.dispatch(InternalSalesReturnActions.selectFirstLoadListing({ firstLoadListing: false }));
      this.firstLoad = false;

      this.searchQuery = e;
    } else {
      this.store.dispatch(InternalSalesReturnActions.selectFirstLoadListing({ firstLoadListing: true }));
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

  onAdd() {
    this.store.dispatch(InternalSalesReturnActions.updateKOStatus({ status:null }));
    this.store.dispatch(InternalSalesReturnActions.resetDraft());

    let genDoc = new GenericDocContainerModel();
    genDoc.bl_fi_generic_doc_hdr.guid = UUID.UUID().toLowerCase();
    this.subs.sink = this.isdnService
      .createTemp(genDoc, AppConfig.apiVisa)
      .subscribe((response) => {
        let entity = new GenericDocContainerModel();
        entity = response.data;
        this.store.dispatch(
          InternalSalesReturnActions.createTempSalesReturnSuccess({ response: entity })
        );
        const genDoc = { ...response.data };
        genDoc.bl_fi_generic_doc_hdr.amount_std = <any>'0.00',
        genDoc.bl_fi_generic_doc_hdr.amount_net= <any>'0.00',
        genDoc.bl_fi_generic_doc_hdr.amount_discount= <any>'0.00',
        genDoc.bl_fi_generic_doc_hdr.amount_tax_gst= <any>'0.00',
        genDoc.bl_fi_generic_doc_hdr.amount_tax_wht= <any>'0.00',
        genDoc.bl_fi_generic_doc_hdr.amount_txn= <any>'0.00',
        genDoc.bl_fi_generic_doc_hdr.amount_json= null,
        genDoc.bl_fi_generic_doc_hdr.amount_open_balance= <any>'0.00',
        this.store.dispatch(
          InternalSalesReturnActions.selectGUID({
            guid: genDoc.bl_fi_generic_doc_hdr.guid.toString(),
          })
        );
        this.store.dispatch(
          InternalSalesReturnActions.selectSalesReturnForEdit({ genDoc })
        );
        this.store.dispatch(InternalSalesReturnActions.refreshArapListing({ refreshArapListing: true }));

        this.store.dispatch(
          InternalSalesReturnActions.setEditMode({ editMode: true })
        );

        this.store.dispatch(
          InternalSalesReturnActions.resetExpansionPanel({ resetIndex: true })
        );

        let genDocLockDto = new GenericDocEditingLockDto();

        genDocLockDto.generic_doc_hdr_guid = genDoc.bl_fi_generic_doc_hdr.guid.toString();
        this.subs.sink = this.genericDocLockService.checkDocument(genDocLockDto, AppConfig.apiVisa).subscribe();

        this.viewColFacade.updateInstance(this.index, {
          ...this.localState,
          deactivateAdd: true,
          deactivateList: false,
          selectedRow: response.data.bl_fi_generic_doc_hdr.guid,
        });
        this.viewColFacade.onNextAndReset(this.index, 2);
      });
  }

  disableDiscardButtonStatus(selectedRows) {
    if (!selectedRows || selectedRows.length === 0) {
      this.disableDiscardButton = true;
    } else {
      this.disableDiscardButton = !selectedRows.every(row => row.bl_fi_generic_doc_hdr.posting_status === "DRAFT");
    }
    this.cdr.detectChanges();
  }
  onDiscard() {
    const selectedRows: any[] = this.gridApi.getSelectedRows();
    const discardPileGuids = selectedRows
      .filter(
        (row) =>
          row.bl_fi_generic_doc_hdr.posting_status == "DRAFT" &&
          row.bl_fi_generic_doc_hdr.status == "ACTIVE"
      )
      .map((row) => row.bl_fi_generic_doc_hdr?.guid.toString());
    if (discardPileGuids.length > 0) {
      this.akaunConfirmationDialogComponent = this.dialogRef.open(AkaunConfirmationDialogComponent, { width: '400px' });
      this.akaunConfirmationDialogComponent.componentInstance.confirmMessage = 'Are you sure you want to DISCARD selected documents?';
      this.akaunConfirmationDialogComponent.afterClosed().subscribe((result) => {
      if (result === true) {
      this.store.dispatch(
        InternalSalesReturnActions.discardInit({ guids: discardPileGuids })
      );
    }
  })
}
  }

  onBulkPrint() {
    const selectedRows: any[] = this.gridApi.getSelectedRows();
    let autoPreview= this.appletSettings.ENABLE_AUTO_POPUP;
    const printableGuids = selectedRows.map((row) =>
      row.bl_fi_generic_doc_hdr?.guid.toString()
    );
    const docNumbers = selectedRows.map((row) => row.bl_fi_generic_doc_hdr?.server_doc_1);
    if (printableGuids.length > 0) {
      this.store.dispatch(
        InternalSalesReturnActions.printMultipleJasperPdfInit({
          guids: printableGuids,
          printable: this.appletSettings.PRINTABLE.toString(),
          preview: autoPreview,
          docNumbers: docNumbers,
        })
      );
    } else {
      this.toastr.warning(
        "Please select at least one data from listing",
        "Warning",
        {
          tapToDismiss: true,
          progressBar: true,
          timeOut: 1500,
        }
      );
    }
  }

  onRowClicked(entity: GenericDocContainerModel) {
    this.store.dispatch(InternalSalesReturnActions.updateKOStatus({ status:null }));
    if (entity && !this.localState.deactivateList) {
      this.subs.sink = this.isdnService
        .getByGuid(
          entity.bl_fi_generic_doc_hdr.guid.toString(),
          AppConfig.apiVisa
        )
        .subscribe((response) => {
          // Restore draft values from clicked entity
          this.store.dispatch(
            InternalSalesReturnActions.setEditMode({ editMode: true })
          );
          const genDoc = { ...response.data };
          this.store.dispatch(
            InternalSalesReturnActions.selectSalesReturnForEdit({ genDoc })
          );
          this.draftStore.dispatch(ContraActions.loadContraInit({ guid_doc_1_hdr: entity.bl_fi_generic_doc_hdr.guid.toString() }));
          this.store.dispatch(InternalSalesReturnActions.recalculateDocBalance());
          this.store.dispatch(
            InternalSalesReturnActions.refreshArapListing({
              refreshArapListing: true,
            })
          );
          genDoc.bl_fi_generic_doc_line.forEach((line: any) => {
            if (line.item_sub_type === "SERIAL_NUMBER") {
              if (!Array.isArray(line.serial_no)) {
                if (line.serial_no && line.serial_no.serialNumbers.length) {
                  if (genDoc.bl_fi_generic_doc_hdr.posting_status !== "FINAL") {
                    this.draftStore.dispatch(
                      PNSActions.validatePNSSerialNo({ line })
                    );
                  } else {
                    this.draftStore.dispatch(
                      PNSActions.mapToSerialNumberObject({
                        line: line,
                        postingStatus: "FINAL",
                      })
                    );
                  }
                } else {
                  this.draftStore.dispatch(
                    PNSActions.validatePNSNoSerialNo({ line })
                  );
                }
              }
            }
          });
          this.store.dispatch(
            InternalSalesReturnActions.loadBranchCompany({
              compGuid: response.data.bl_fi_generic_doc_hdr.guid_comp,
              branchGuid: response.data.bl_fi_generic_doc_hdr.guid_branch,
              changeDefault: true,
              branchObj: null,
            })
          );
          let genDocLockDto = new GenericDocEditingLockDto();
          let created_by = localStorage.getItem('guid');

          genDocLockDto.generic_doc_hdr_guid = genDoc.bl_fi_generic_doc_hdr.guid.toString();

          this.subs.sink = this.genericDocLockService.checkDocument(genDocLockDto, AppConfig.apiVisa)
            .subscribe((genDocLockData: any) => {
              if (genDocLockData.code === "THIS_DOCUMENT_IS_LOCKED" && genDocLockData.data.bl_fi_generic_doc_editing_lock.created_by_subject_guid !== created_by && (genDoc.bl_fi_generic_doc_hdr.posting_status !== 'FINAL' || genDoc.bl_fi_generic_doc_hdr.posting_status !== 'VOID' || genDoc.bl_fi_generic_doc_hdr.posting_status !== 'DISCARDED')) {
                this.akaunGenDocLockDialogComponent = this.dialogRef.open(AkaunGenDocLockDialogComponent, { width: '400px' });
                this.akaunGenDocLockDialogComponent.componentInstance.warningMessage =
                  'This document is currently being edited by <b>' +
                  genDocLockData.data.bl_fi_generic_doc_editing_lock.created_by_name +
                  '</b>. You can view it in read-only mode, but changes cannot be made until <b>' +
                  genDocLockData.data.bl_fi_generic_doc_editing_lock.created_by_name +
                  '</b> finishes editing and the document is unlocked.';
                this.akaunGenDocLockDialogComponent.afterClosed().subscribe((result) => {
                  if (result === true) {
                    this.store.dispatch(InternalSalesReturnActions.lockDocument());
                    this.viewColFacade.updateInstance(this.index, {
                      ...this.localState,
                      deactivateAdd: true,
                      deactivateList: false,
                      selectedRow: genDoc.bl_fi_generic_doc_hdr.guid,
                    });
                    this.viewColFacade.onNextAndReset(this.index, 2);
                  }
                });
              } else {
                this.viewColFacade.updateInstance(this.index, {
                  ...this.localState,
                  deactivateAdd: true,
                  deactivateList: false,
                  selectedRow: genDoc.bl_fi_generic_doc_hdr.guid,
                });
                this.viewColFacade.onNextAndReset(this.index, 2);
              }
            })
        });

        this.store.dispatch(
          InternalSalesReturnActions.resetExpansionPanel({ resetIndex: false })
        );
    }
  }

  getRowStyle = params => {
    if (params.node.footer) {
      return { fontWeight: 'bold', background: '#e6f7ff' };
    }
    if (params.node.group) {
      return { fontWeight: 'bold' };
    }
    if (params.data.bl_fi_generic_doc_hdr?.forex_doc_hdr_guid) {
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

  isShowColumn(settingName, permissionName) {
    if (settingName.includes('SHOW')) {
      return this.settings.some(setting => setting[settingName]) || this.permissions.some(permission => permission.perm_code === permissionName);
    }
    return !this.settings.some(setting => setting[settingName]) || this.permissions.some(permission => permission.perm_code === permissionName);
  }

  getOrderBy(value) {
    const match = this.dateMappings.find(mapping => mapping.display === value);
    return match ? match.key : 'date_txn';
  }

  getOrderBy2(value) {
    const match = this.dateMappings.find(mapping => mapping.key === value);
    return match ? match.display : 'TRANSACTION DATE';
  }

  getDefaultDate() {
    let defaultDate = UtilitiesModule.getDateNoTime(moment().subtract(1, 'month'));
    if (this.appletSettings?.DEFAULT_TRANSACTION_DATE === "1_week") {
      defaultDate = UtilitiesModule.getDateNoTime(moment().subtract(1, 'week'));
    } else if (this.appletSettings?.DEFAULT_TRANSACTION_DATE === "1_day") {
      defaultDate = UtilitiesModule.getTodayNoTime();
    }
    return defaultDate;
  }

  getPostingStatus() {
    return this.appletSettings?.DEFAULT_POSTING_STATUS === 'ALL'
      ? []
      : (this.appletSettings?.DEFAULT_POSTING_STATUS
        ? [this.appletSettings?.DEFAULT_POSTING_STATUS] : []);
  }

  getStatus() {
    return (this.appletSettings?.DEFAULT_STATUS === 'ALL' ||
      this.appletSettings?.DEFAULT_STATUS === true)
      ? []
      : [(this.appletSettings?.DEFAULT_STATUS ?? 'ACTIVE')];
  }

  getFuzzySearch() {
    let columns = 'server_doc_1,client_doc_1,client_doc_2,client_doc_3,client_doc_4,client_doc_5,doc_reference';
    if (this.appletSettings?.FUZZY_SEARCH_COLUMNS) {
      columns = this.appletSettings?.FUZZY_SEARCH_COLUMNS;
    }
    return columns.split(',');
  }

  setAdvFormValue() {
    // Make sure the child component is initialized before setting values
    if (this.advancedSearch) {
      const newFormValue = {
        postingStatus: this.getPostingStatus(),
        status: this.getStatus(),
        orderBy: this.getOrderBy2(this.appletSettings.SORT_ORDER)
      };
      this.advancedSearch.advForm.patchValue(newFormValue);

      const sortOrder = this.appletSettings.SORT_ORDER;
      if (sortOrder === 'created_date') {
        this.advancedSearch.advForm.get('createdDateCheckbox')?.patchValue(true);
      }
      else if (sortOrder === 'updated_date') {
        this.advancedSearch.advForm.get('updatedDateCheckbox')?.patchValue(true);
      }
      else {
        this.advancedSearch.advForm.get('transactionDateCheckbox')?.patchValue(true);
      }

      this.advancedSearch.advForm.get('transactionDate.from')?.patchValue(this.getDefaultDate());
      this.advancedSearch.advForm.get('createdDate.from')?.patchValue(this.getDefaultDate());
      this.advancedSearch.advForm.get('updatedDate.from')?.patchValue(this.getDefaultDate());

    }
  }

  ngAfterViewInit() {
    this.setAdvFormValue();
  }

  setPaginationTotalRecords(totalRecords) {
    const statusBarPagination = this.gridApi.getStatusPanel('statusBarPagination');
    statusBarPagination.setTotalRecords(totalRecords);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
