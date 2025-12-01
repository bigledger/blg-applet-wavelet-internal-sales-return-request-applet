import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { bl_fi_generic_doc_hdr_RowClass, PagingResponseModel, BranchContainerModel, GuidDataFieldInterface, BranchService, CompanyWorkflowGendocProcessService, WfMdAvailableStatusService, WfMdProcessHdrService,   ServiceReturnReasonService, WfMdProcessStatusContainerModel, WfMdProcessStatusLinkService, WfMdProcessStatusService, WfMdResolutionService, Pagination, CustomerService, LocationService, LocationContainerModel, bl_fi_generic_doc_line_RowClass,
  EntityLoginSubjectLinkContainerModel, EntityLoginSubjectLinkService, ApiResponseModel, EntityService, EntityLabelLinkService, ForexDataSourceHistoryService
} from 'blg-akaun-ts-lib';
import { AppConfig } from 'projects/shared-utilities/visa';
import { Observable, forkJoin, combineLatest, ReplaySubject, Subject, of } from 'rxjs';
import { map, switchMap, takeUntil, toArray, withLatestFrom, debounceTime, distinctUntilChanged, take, tap, startWith, filter } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { DraftStates } from '../../../../state-controllers/draft-controller/store/states';
import { InternalSalesReturnSelectors } from '../../../../state-controllers/internal-sales-return-controller/store/selectors';
import { InternalSalesReturnStates } from '../../../../state-controllers/internal-sales-return-controller/store/states';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';
import { AppletSettings } from '../../../../models/applet-settings.model';
import moment from 'moment';
import { AppletConstants } from '../../../../models/constants/applet-constants';
import { ClientSidePermissionStates } from 'projects/shared-utilities/modules/permission/client-side-permissions-controller/states';
import { ClientSidePermissionsSelectors } from 'projects/shared-utilities/modules/permission/client-side-permissions-controller/selectors';
import { UserPermInquirySelectors } from 'projects/shared-utilities/modules/permission/user-permissions-inquiry-controller/selectors';
import { PermissionStates } from 'projects/shared-utilities/modules/permission/permission-controller';
import { InternalSalesReturnActions } from '../../../../state-controllers/internal-sales-return-controller/store/actions';
import { PNSActions } from '../../../../state-controllers/draft-controller/store/actions';
import { SettlementActions} from "../../../../state-controllers/draft-controller/store/actions";
import { ForexService } from 'projects/shared-utilities/services/forex.service';
import { BranchSettingsStates } from '../../../../state-controllers/branch-settings-controller/states';
import { BranchSettingsActions } from '../../../../state-controllers/branch-settings-controller/actions';
import { BranchSettingsSelectors } from '../../../../state-controllers/branch-settings-controller/selectors';

interface Option {
  value: string;
  viewValue: string;
}

export class ReasonOption implements Option {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-internal-sales-return-main-details',
  templateUrl: './main-details.component.html',
  styleUrls: ['./main-details.component.scss'],
})
export class InternalSalesReturnMainComponent implements OnInit, OnDestroy {

  @Input() draft$: Observable<bl_fi_generic_doc_hdr_RowClass>;
  @Input() isInExpansionPanel: boolean = false;
  @Input() appletSettings$: Observable<AppletSettings>;
  @Input() pns$: Observable<bl_fi_generic_doc_line_RowClass[]>;
  @Output() updateMain = new EventEmitter();
  @Output() selectMember = new EventEmitter();
  @Output() formStatusChange = new EventEmitter<string>();

  protected subs = new SubSink();
  SHOW_SALES_AGENT: boolean;
  HIDE_SALES_AGENT: boolean;

  apiVisa = AppConfig.apiVisa;
  public form: FormGroup;
  selectedBranch: GuidDataFieldInterface;
  selectedDeliveryBranch: GuidDataFieldInterface;
  selectedCompany: GuidDataFieldInterface;
  selectedSalesAgent: GuidDataFieldInterface;
  creditTermsList = [];
  creditLimitList = [];
  postingStatus;
  status;
  appletSettings: AppletSettings;
  defaultBranch: string;
  defaultLocation: string;
  defaultDeliveryBranch: string;
  defaultDeliveryLocation: string;
  defaultCompany: any;
  editMode$ = this.store.select(InternalSalesReturnSelectors.selectEditMode);
  genDocLock$ = this.store.select(InternalSalesReturnSelectors.selectGenDocLock);
  modeValue;
  clientSidePermissionSettings: any;
  applyToLines:boolean = false;
  isFinal:boolean = false;
  hdr: any;
  subjectGuid = localStorage.getItem('guid');

  SHOW_DOC_NO_TENANT: boolean;
  SHOW_DOC_NO_COMPANY: boolean;
  SHOW_DOC_NO_BRANCH: boolean;
  SHOW_CLIENT_DOC_TYPE: boolean;
  SHOW_CLIENT_DOC_1: boolean;
  SHOW_CLIENT_DOC_2: boolean;
  SHOW_CLIENT_DOC_3: boolean;
  SHOW_CLIENT_DOC_4: boolean;
  SHOW_CLIENT_DOC_5: boolean;
  SHOW_TRANSACTION_DATE: boolean;
  genDocLock:boolean;


  reasonOptions: ReasonOption[] = [];
  filteredReasonOptions: ReplaySubject<ReasonOption[]> = new ReplaySubject<[]>(1);
  reasonOptionsFilterCtrl: FormControl = new FormControl();

  entityGuid;
  processGuid;
  // processStatusGuid;
  processStatusCode;
  resolutionGuid;
  resolutionCode;
  availableStatus: Array <WfMdProcessStatusContainerModel> = null;
  currentStatus = new WfMdProcessStatusContainerModel();
  docType = AppletConstants.docType;
  protected _onDestroy = new Subject<void>();
  filteredWorkflowStatusOptions: ReplaySubject<WfMdProcessStatusContainerModel[]> = new ReplaySubject<[]>(1);
  WorkflowStatusFilterCtrl: FormControl = new FormControl();
  branchGuids: any[];
  deliveryBranchGuids: any[];
  locationGuids: any[];

  userPermissionTarget$ = this.permissionStore.select(
    UserPermInquirySelectors.selectUserPermInquiry
  );
  customer$ = this.store.select(InternalSalesReturnSelectors.selectEntity);

  constructor(
    protected readonly draftStore: Store<DraftStates>,
    protected readonly sessionStore: Store<SessionStates>,
    protected readonly store: Store<InternalSalesReturnStates>,
    protected readonly permissionStore: Store<PermissionStates>,
    private readonly branchSettingStore: Store<BranchSettingsStates>,
    private locationService: LocationService,
    private branchService: BranchService,
    private customerService: CustomerService,
    private companyWorkflowGendocProcessService: CompanyWorkflowGendocProcessService,
    private wfmdprocesshdrService: WfMdProcessHdrService,
    private statusLinkService: WfMdProcessStatusLinkService,
    private wfProcessStatusService: WfMdProcessStatusService,
    private wfMdAvailableStatusService: WfMdAvailableStatusService,
    private wfResolutionService: WfMdResolutionService,
    private returnReasonService: ServiceReturnReasonService,
    private forexService: ForexService,
    private forexDataSourceHistoryService: ForexDataSourceHistoryService,
    private entityLoginSubjectLinkService: EntityLoginSubjectLinkService,
    private entityService: EntityService,
    private entityLabelLinkService: EntityLabelLinkService
  ) {

  }
  masterSettings$ = this.sessionStore.select(SessionSelectors.selectMasterSettings);
  personalSettings$ = this.sessionStore.select(SessionSelectors.selectPersonalSettings);

  clientSidePermissions$ = this.permissionStore.select(
    ClientSidePermissionsSelectors.selectAll
  );

  ngOnInit() {
    this.subs.sink = this.genDocLock$.subscribe(lock=>{
      this.genDocLock = lock;
    })
    this.subs.sink = this.masterSettings$.subscribe({ next: (resolve: AppletSettings) => { this.appletSettings = resolve } });

    this.subs.sink = this.clientSidePermissions$.subscribe({
      next: (resolve) => {
        console.log("clientsidepermission",resolve)
        resolve.forEach(permission => {
          if (permission.perm_code === "SHOW_DOC_NO_TENANT") {
            this.SHOW_DOC_NO_TENANT = true;
          }

          if (permission.perm_code === "SHOW_DOC_NO_COMPANY") {
            this.SHOW_DOC_NO_COMPANY = true;
          }

          if (permission.perm_code === "SHOW_DOC_NO_BRANCH") {
            this.SHOW_DOC_NO_BRANCH = true;
          }

          if (permission.perm_code === "SHOW_CLIENT_DOC_TYPE") {
            this.SHOW_CLIENT_DOC_TYPE = true;
          }

          if (permission.perm_code === "SHOW_CLIENT_DOC_1") {
            this.SHOW_CLIENT_DOC_1 = true;
          }

          if (permission.perm_code === "SHOW_CLIENT_DOC_2") {
            this.SHOW_CLIENT_DOC_2 = true;
          }

          if (permission.perm_code === "SHOW_CLIENT_DOC_3") {
            this.SHOW_CLIENT_DOC_3 = true;
          }

          if (permission.perm_code === "SHOW_CLIENT_DOC_4") {
            this.SHOW_CLIENT_DOC_4 = true;
          }

          if (permission.perm_code === "SHOW_CLIENT_DOC_5") {
            this.SHOW_CLIENT_DOC_5 = true;
          }
          if (permission.perm_code === "SHOW_TRANSACTION_DATE") {
            this.SHOW_TRANSACTION_DATE = true;
          }
        })
      }
    });

    this.subs.sink = combineLatest([
      this.masterSettings$,
      this.personalSettings$,
    ]).subscribe(([masterSettings, personalSettings]) => {
      this.appletSettings = personalSettings
      console.log("Applet Settings: ", masterSettings)
      this.appletSettings = masterSettings
      this.defaultCompany = personalSettings.DEFAULT_COMPANY ?? masterSettings.DEFAULT_COMPANY;
      this.defaultBranch = personalSettings.DEFAULT_BRANCH ?? masterSettings.DEFAULT_BRANCH;
      this.defaultLocation = personalSettings.DEFAULT_LOCATION ?? masterSettings.DEFAULT_LOCATION;
      this.defaultDeliveryBranch = personalSettings.DEFAULT_DELIVERY_BRANCH;
      this.defaultDeliveryLocation = personalSettings.DEFAULT_DELIVERY_LOCATION;
      this.HIDE_SALES_AGENT = this.appletSettings?.HIDE_MAIN_DETAILS_SALES_AGENT ? true : this.appletSettings.HIDE_SALES_AGENT;
    });
    this.creditTermsList = [];
    this.form = new FormGroup({
      company: new FormControl('', Validators.required),
      branch: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
      salesAgent: new FormControl(''),
      memberCard: new FormControl(''),
      customer: new FormControl(''),
      transactionDate: new FormControl(),
      creditTerms: new FormControl(''),
      creditLimit: new FormControl(''),
      reference: new FormControl(),
      remarks: new FormControl(''),
      permitNo: new FormControl(),
      currency: new FormControl(),
      baseCurrency: new FormControl({value: '', disabled: true}),
      currencyRate: new FormControl(),
      forexSourceHdrGuid: new FormControl(),
      forexSourceHistoryGuid: new FormControl(),
      trackingID: new FormControl(),
      docType: new FormControl(),
      tenantDocNo: new FormControl(),
      companyDocNo: new FormControl(),
      branchDocNo: new FormControl(),
      dueDate: new FormControl(),
      processGuid: new FormControl(),
      processStatusGuid: new FormControl(),
      processStatusCode: new FormControl(),
      resolutionCode: new FormControl(),
      resolutionGuid: new FormControl(),
      reasonOfRepair: new FormControl(''),
      clientDocType: new FormControl(),
      clientDoc1No: new FormControl(),
      clientDoc2No: new FormControl(),
      clientDoc3No: new FormControl(),
      clientDoc4No: new FormControl(),
      clientDoc5No: new FormControl(),
      deliveryBranch: new FormControl(),
      deliveryLocation: new FormControl(),
      deliveryBranchCode: new FormControl(),
      deliveryLocationCode: new FormControl(),
      createdBy: new FormControl(),
      modifiedBy: new FormControl(),
      createdDate: new FormControl(),
      modifiedDate: new FormControl(),
    });

    this.subs.sink = this.form.statusChanges.subscribe((status) => {
      this.formStatusChange.emit(status);
    });

    this.subs.sink = this.draft$.pipe(
      tap((resolve) => {
        // Update resolve.date_txn if it is null
        if (!resolve.date_txn) {
          resolve.date_txn = new Date(); // Set to current date
        }
      })).subscribe(resolve => {
      console.log("Default Location: resolve: ", resolve);
      this.hdr = resolve;
      // this.defaultBranch = this.appletSettings.DEFAULT_BRANCH;
      this.selectedBranch = resolve.guid_branch ?? this.defaultBranch;
      this.store.dispatch(InternalSalesReturnActions.loadBranchCompany({ compGuid: resolve.guid_comp, branchGuid:this.selectedBranch,changeDefault: true , branchObj:null}));
      if(!this.appletSettings.HIDE_DELIVERY_LOCATION){
        this.selectedDeliveryBranch =
        resolve.delivery_branch_guid ?? this.defaultDeliveryBranch;
        this.form.patchValue({
          deliveryBranch: resolve.delivery_branch_guid ?? this.defaultDeliveryBranch,
          deliveryLocation:
            resolve.delivery_location_guid ?? this.defaultDeliveryLocation,
        })
      }
      this.form.patchValue({
        company: resolve.guid_comp ?? this.defaultCompany,
        branch: resolve.guid_branch ?? this.defaultBranch,
        location: resolve.guid_store ?? this.defaultLocation,
        salesAgent: resolve.sales_entity_hdr_guid ? resolve.sales_entity_hdr_guid : (<any>resolve).doc_entity_hdr_json?.salesAgent,
        memberCard: (<any>resolve).property_json?.memberCardNo,
        customer: (<any>resolve).doc_entity_hdr_json?.entityName,
        reference: resolve.doc_reference,
        creditTerms: (<any>resolve).doc_entity_hdr_json?.creditTerms,
        creditLimit: (<any>resolve).doc_entity_hdr_json?.creditLimit,
        dueDate: resolve.due_date,
        // transactionDate: resolve.date_txn ? resolve.date_txn : new Date(),
        transactionDate: resolve.date_txn,
        // currency: resolve.doc_ccy,
        baseCurrency: resolve.base_doc_ccy ?? 'MYR',
        currencyRate: resolve.base_doc_xrate,
        forexSourceHdrGuid: resolve.forex_source_hdr_guid,
        forexSourceHistoryGuid: resolve.forex_source_history_guid,
        permitNo: (<any>resolve).doc_entity_hdr_json?.permitNo,
        trackingID: resolve.tracking_id,
        remarks: resolve.doc_remarks,
        docType: resolve.server_doc_type,
        tenantDocNo: resolve.server_doc_1,
        companyDocNo: resolve.server_doc_2,
        branchDocNo: resolve.server_doc_3,
        clientDocType: resolve.client_doc_type,
        clientDoc1No: resolve.client_doc_1,
        clientDoc2No: resolve.client_doc_2,
        clientDoc3No: resolve.client_doc_3,
        clientDoc4No: resolve.client_doc_4,
        clientDoc5No: resolve.client_doc_5,
        reasonOfRepair: (<any>resolve).doc_entity_hdr_json?.reasonOfRepair,
        deliveryBranchCode: resolve.delivery_branch_code,
        deliveryLocationCode: resolve.delivery_location_code,
        createdBy: resolve.created_by_name,
        modifiedBy: resolve.updated_by_name,
        createdDate: this.DateConvert(resolve.created_date),
        modifiedDate: this.DateConvert(resolve.updated_date),
      });
      // this.subs.sink = this.branchService.getByGuid(this.defaultBranch, this.apiVisa).subscribe(
      //   resolve => {
      //     if (resolve.data.bl_fi_mst_branch?.ccy_code){
      //       // this.selectWorkflow(resolve.data.bl_fi_mst_branch.comp_guid);
      //       this.form.patchValue({
      //         currency: resolve.data.bl_fi_mst_branch?.ccy_code?? 'MYR',
      //       });
      //     }
      //   }
      // );
      if(this.defaultBranch) {
        this.subs.sink = this.branchService.getByGuid(this.defaultBranch, this.apiVisa).subscribe(
          default_branch => {
            console.log('NULL BRANCH CHECK')
            this.form.patchValue({ currency: resolve.doc_ccy ?? default_branch?.data?.bl_fi_mst_branch?.ccy_code ?? 'MYR' })
          }
        );
      } else {
        this.form.patchValue({ currency: resolve.doc_ccy ?? 'MYR' })
      }

      if (resolve.wf_process_hdr_guid){
        this.processGuid = resolve.wf_process_hdr_guid;
        this.selectWorkflow(resolve.wf_process_hdr_guid);
        this.retrieveAvailableStatus(resolve.wf_process_hdr_guid, resolve.wf_process_status_guid);
        this.setResolution(resolve.wf_process_hdr_guid,resolve.wf_process_status_guid);
      }
      else (
        this.selectWorkflow(this.appletSettings.WORKFLOW_PROCESS_GUID)
      )
      // this.updateMain.emit(this.form);
      this.postingStatus = resolve.posting_status;
      this.status = resolve.status;
      if (
        resolve.posting_status === "FINAL" ||
        resolve.posting_status === "VOID" ||
        resolve.posting_status === "DISCARDED" || this.genDocLock ||
        (resolve.status !== "ACTIVE" &&
          resolve.status !== "TEMP" &&
          resolve.status !== null)
      ) {
        this.form.controls["branch"].disable();
        this.form.controls["company"].disable();
        this.form.controls["location"].disable();
        this.form.controls["transactionDate"].disable();
        this.form.controls["creditTerms"].disable();
        this.form.controls["creditLimit"].disable();
        this.form.controls["salesAgent"].disable();
        // this.form.controls["reference"].disable();
        this.form.controls["memberCard"].disable();
        this.form.controls['currency'].disable();
        this.form.controls['currencyRate'].disable();
        this.form.controls["customer"].disable();
        this.form.controls["dueDate"].disable();
        this.form.controls["deliveryBranch"].disable();
        this.form.controls["deliveryLocation"].disable();
        this.form.controls['forexSourceHdrGuid'].disable();
        this.isFinal = true;
      } else {
        this.form.controls["branch"].enable();
        this.form.controls["company"].enable();
        this.form.controls["location"].enable();
        this.form.controls["transactionDate"].enable();
        this.form.controls["creditTerms"].enable();
        this.form.controls["creditLimit"].enable();
        // this.form.controls['salesAgent'].enable();
        this.form.controls["memberCard"].enable();
        this.form.controls['currency'].enable();
        this.form.controls['currencyRate'].enable();
        this.form.controls["customer"].enable();
        this.form.controls["dueDate"].enable();
        this.form.controls["deliveryBranch"].enable();
        this.form.controls["deliveryLocation"].enable();
        this.form.controls['forexSourceHdrGuid'].enable();
      }

      if (resolve.status == "TEMP" && this.appletSettings.ENABLE_EMPLOYEE_LOGIN_AUTO_DETECTION) {
        this.detectEmployee();
      }

      if (this.isFinal || this.appletSettings.CANNOT_EDIT_CURRENCY_RATE) {
        this.form.controls['currencyRate'].disable();
      }

      this.entityGuid = resolve.doc_entity_hdr_guid;
      if (this.entityGuid) {
        this.subs.sink = this.customer$.subscribe((customer) => {
          if (!customer || customer.bl_fi_mst_entity_hdr.guid !== this.entityGuid) {
            // this.customerService.getByGuid(this.entityGuid, this.apiVisa).subscribe((customer) => {
            //   if (customer) {
            //     console.log('selectCustomer', customer);
            //     this.store.dispatch(InternalSalesReturnActions.selectEntity({ entity: { entity: customer.data, contact: null } }));
            //   }
            // })
          } else {
            this.creditTermsList = customer.bl_fi_mst_entity_ext.filter(e => e.param_code === 'CREDIT_TERMS');
            this.creditLimitList = customer.bl_fi_mst_entity_ext.filter(e => e.param_code === 'CREDIT_LIMITS');
            this.setCredits();
          }
        })
      }
    });

    this.editMode$.subscribe((data) => {
      this.modeValue = data;
      console.log("edit mode", data);
    });

    this.getReasons();

    this.subs.sink = this.form.get('transactionDate').valueChanges.subscribe({
      next: (date) => {
        this.calculateDueDate();
      }
    });

    this.subs.sink = this.masterSettings$.subscribe({
      next: (resolve: AppletSettings) => {
        this.appletSettings = resolve;
        this.HIDE_SALES_AGENT = this.appletSettings?.HIDE_MAIN_DETAILS_SALES_AGENT ? true : this.appletSettings.HIDE_SALES_AGENT; // HIDE_SALES_AGENT in line items would follow the one in main details
        this.setupReasonFieldValidator();
        this.setupRemarksFieldValidator();
      },
    });

    this.subs.sink = this.form.valueChanges
    .pipe(debounceTime(100), distinctUntilChanged())
    .subscribe({
      next: (form) => {
        if(this.postingStatus!=='FINAL'){
          this.selectedBranch = form.branch;
        }
        const formValues = this.form.getRawValue();
        this.updateMain.emit(formValues);
      },
    });

    this.WorkflowStatusFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterWorkflowStatusOptions();
    });

    this.reasonOptionsFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterReasonOptions();
    });

    this.subs.sink = this.userPermissionTarget$.subscribe((targets) => {
      console.log("targets", targets);
      let target = targets.filter(
        (target) =>
          target.permDfn === "TNT_API_DOC_INTERNAL_SALES_RETURN_REQUEST_READ_TGT_GUID"
      );
      let targetDelivery = targets.filter(
        (targetDelivery) =>
        targetDelivery.permDfn === "TNT_API_DOC_INTERNAL_SALES_RETURN_DELIVERY_BRANCH_READ"
      );
      let adminCreatePermissionTarget = targets.filter(
        (target) => target.permDfn === "TNT_TENANT_ADMIN"
      );
      let ownerCreatePermissionTarget = targets.filter(
        (target) => target.permDfn === "TNT_TENANT_OWNER"
      );
      if(adminCreatePermissionTarget[0]?.hasPermission || ownerCreatePermissionTarget[0]?.hasPermission){
        this.branchGuids = [];
        this.deliveryBranchGuids = [];
      }else{
        this.branchGuids = (target[0]?.target!==null && Object.keys(target[0]?.target || {}).length !== 0) ? target[0]?.target["bl_fi_mst_branch"] : [];
        this.deliveryBranchGuids = (targetDelivery[0]?.target!==null && Object.keys(targetDelivery[0]?.target || {}).length !== 0) ? targetDelivery[0]?.target["bl_fi_mst_branch"] : [];
        this.deliveryBranchGuids = [...this.branchGuids, ...this.deliveryBranchGuids];
      }
    });


    this.subs.sink = combineLatest([
      this.draft$.pipe(startWith(null)),
      this.form.valueChanges.pipe(
        startWith(this.form.value), // Start with the current form value to trigger immediately
        debounceTime(300),
        distinctUntilChanged()
      ),
      this.pns$.pipe(
        startWith([]), // Start with an empty array
        filter(lines => lines.length > 0)
      ), // Start with an empty array or a suitable initial value
      this.store.select(InternalSalesReturnSelectors.selectKoStatus)
    ]).pipe(
      switchMap(([resolve, formValues, lines, koStatus]) => {
        const { branch, location, currency } = formValues;
        if (branch && location && currency && resolve.status === "TEMP" && resolve.doc_entity_hdr_guid !== null && lines.length > 0 && (!koStatus || koStatus==="DONE" )) {
          console.log("Convert To Active",koStatus);

          this.store.dispatch(InternalSalesReturnActions.convertToActiveInit());
        }
        return of(null);
      })
    ).subscribe();

    this.subs.sink = this.form.get('transactionDate').valueChanges.subscribe(value=>{
      // If users are not allowed to edit the line's stl date, update line's txn date = hdr's txn date
      if (!this.appletSettings?.ENABLE_EDIT_PAYMENT_DATE){
        this.draftStore.dispatch(SettlementActions.updateLineTransactionDate({transactionDate: value}))
      }
    })

    if(!this.selectedBranch && !this.defaultBranch){
      this.getDefaultEntityBranch();
    }

    this.branchSettingStore.dispatch(BranchSettingsActions.selectDefaultPrintableFormatInit({branchGuid: this.selectedBranch.toString(), serverDocType:"INTERNAL_SALES_RETURN_REQUEST"}));
  }

  DateConvert(date) {
    if (date != null && '' !== date) {
      const dates = date;
      const moments = moment(date).format('YYYY-MM-DD HH:mm:ss');
      return moments;
    } else {
      const notEdited = ' ';
      return notEdited;
    }
  }

  onBranchSelected(e: BranchContainerModel) {
    this.selectedBranch = e.bl_fi_mst_branch.guid;
    // if (!this.modeValue){
    //   this.selectWorkflow(e.bl_fi_mst_branch.comp_guid);
    // }
    if (e.bl_fi_mst_branch?.default_pricing_scheme) {
      this.store.dispatch(InternalSalesReturnActions.selectPricingSchemeGuid({guid: e.bl_fi_mst_branch.default_pricing_scheme}));
      this.store.dispatch(InternalSalesReturnActions.selectPricingSchemeHdr({ pricingSchemeHdr: e.bl_fi_mst_branch.default_pricing_scheme}));
    }
    if(this.appletSettings.HIDE_DELIVERY_LOCATION){
      this.form.patchValue({
        company: e.bl_fi_mst_branch.comp_guid,
        baseCurrency: e.bl_fi_mst_branch?.ccy_code?? 'MYR',
        currency: e.bl_fi_mst_branch?.ccy_code?? 'MYR',
        currencyRate: 1
      });
    }else{
      this.selectedDeliveryBranch = e.bl_fi_mst_branch.guid;
      this.form.patchValue({
        deliveryBranchCode: e.bl_fi_mst_branch.code,
        deliveryBranch: e.bl_fi_mst_branch.guid,
        company: e.bl_fi_mst_branch.comp_guid,
        baseCurrency: e.bl_fi_mst_branch?.ccy_code?? 'MYR',
        currency: e.bl_fi_mst_branch?.ccy_code?? 'MYR',
        currencyRate: 1
      });
    };
    this.selectedCompany = e.bl_fi_mst_branch.comp_guid;
    this.store.dispatch(InternalSalesReturnActions.loadBranchCompany({ compGuid: e.bl_fi_mst_branch.comp_guid,branchGuid:e.bl_fi_mst_branch.guid,changeDefault: true, branchObj:e }));
    this.branchSettingStore.dispatch(BranchSettingsActions.selectDefaultPrintableFormatInit({branchGuid: e.bl_fi_mst_branch.guid.toString(), serverDocType:"INTERNAL_SALES_RETURN_REQUEST"}));
  }

  onLocationSelected(e: LocationContainerModel) {
    if(!this.appletSettings.HIDE_DELIVERY_LOCATION){
      this.form.patchValue({
        deliveryLocation: e.bl_inv_mst_location.guid.toString(),
        deliveryLocationCode: e.bl_inv_mst_location.code,
      });
    }
  }

  async onDeliveryBranchSelected(e: BranchContainerModel) {
    this.selectedDeliveryBranch = e.bl_fi_mst_branch.guid;
    this.form.patchValue({
      deliveryBranchCode: e.bl_fi_mst_branch.code,
    });
    this.applyToLines = true;
    this.updateMain.emit(this.form.value);
  }

  onDeliveryLocationSelected(e: LocationContainerModel) {
    this.form.patchValue({
      deliveryLocationCode: e.bl_inv_mst_location.code,
    });
    this.applyToLines = true;
    this.updateMain.emit(this.form.value);
  }

  async onApplyToLines(){
    let deliveryBranchCode;
    let deliveryLocationCode;
    this.subs.sink = await this.branchService.getByGuid(this.form.value.deliveryBranch, AppConfig.apiVisa).subscribe(async data=>{
      deliveryBranchCode= await data.data.bl_fi_mst_branch.code
    })
    this.subs.sink = await this.locationService.getByGuid(this.form.value.deliveryLocation, AppConfig.apiVisa).subscribe(async data=>{
      deliveryLocationCode= await data.data.bl_inv_mst_location.code
    })
    setTimeout(()=>{
      this.draftStore.dispatch(PNSActions.updateDeliveryBranchAndLocation({deliveryBranch: this.form.value.deliveryBranch, deliveryBranchCode: deliveryBranchCode, deliveryLocation: this.form.value.deliveryLocation, deliveryLocationCode:deliveryLocationCode }))
    },3000)
  }

  protected filterReasonOptions() {
    if (!this.reasonOptions) {
      return;
    }
    let search = this.reasonOptionsFilterCtrl.value;
    if (!search) {
      this.filteredReasonOptions.next(this.reasonOptions.slice());
      return;
    } else {
      search = search.trim().toLowerCase();
      this.filteredReasonOptions.next(
        this.reasonOptions.filter(
          (option) => option.viewValue.toLowerCase().indexOf(search) > -1
        )
      );
    }
  }

  async getReasons(): Promise<void> {
    this.reasonOptions = [];
    let paging = new Pagination();
    paging.conditionalCriteria =  [
      { columnName: "calcTotalRecords", operator: "=", value: "true" },
    ]
    await this.returnReasonService
      .getByCriteriaPromise(paging, this.apiVisa)
      .then((resp: PagingResponseModel<any>) => {
        resp.data.forEach((eachBank, index) => {
            this.reasonOptions.push({
              value: eachBank.bl_svc_return_reason.guid,
              viewValue: eachBank.bl_svc_return_reason.reason_code + " | " + eachBank.bl_svc_return_reason.reason_name,
            });
        });
      });
    this.reasonOptions.sort((a, b) => a.viewValue.localeCompare(b.viewValue));
    this.filteredReasonOptions.next(this.reasonOptions.slice());
  }

  getReasonNameCode(){
    const reasonGuid =  this.form.controls['reasonOfRepair'].value;
    this.returnReasonService.getByGuid(reasonGuid,this.apiVisa).subscribe(data => {
     this.form.patchValue({
               reasonCode: data.data.bl_svc_return_reason.reason_code,
               reasonName : data.data.bl_svc_return_reason.reason_name,
             })
    })
   }

  // selectWorkflow(companyGuid){
  //   let pagination = new Pagination();
  //   pagination.conditionalCriteria = [
  //     {
  //       columnName: "company_guid",
  //       operator: "=",
  //       value: companyGuid.toString()
  //     },
  //     {
  //       columnName: "server_doc_type",
  //       operator: "=",
  //       value: this.docType.toString()
  //     }
  //   ]
  //   this.subs.sink = this.companyWorkflowGendocProcessService.getByCriteria(pagination, this.apiVisa)
  //     .subscribe({
  //       next: (resolve) => {
  //         if (resolve.data[0]) {
  //           this.processGuid = resolve.data[0].bl_fi_comp_workflow_gendoc_process_template_hdr.process_hdr_guid,
  //             this.wfmdprocesshdrService
  //               .getByGuid(this.processGuid.toString(), this.apiVisa)
  //               .subscribe({
  //                 next: (resolve) => (
  //                   this.form.controls['processGuid'].setValue(resolve.data.bl_wf_md_process_hdr.guid),
  //                   this.form.controls['processStatusGuid'].setValue(resolve.data.bl_wf_md_process_hdr.default_process_status_guid)
  //                   // this.updateMainDetails.emit(this.form.value)
  //                 )
  //               })
  //         }
  //         else {
  //           console.log("No record found");
  //         }
  //       }
  //     })
  // }

  selectWorkflow(processGuid) {
    if (processGuid) {
      this.subs.sink = this.wfmdprocesshdrService
        .getByGuid(processGuid.toString(), this.apiVisa)
        .subscribe({
          next: (resolve) => (
            this.form.controls['processGuid'].setValue(resolve.data.bl_wf_md_process_hdr.guid),
            this.form.controls['processStatusGuid'].setValue(resolve.data.bl_wf_md_process_hdr.default_process_status_guid)
            // this.updateMainDetails.emit(this.form.value)
          )
        })
    }
  }


  retrieveAvailableStatus(wfProcessGuid, currentStatus) {
    this.subs.sink = this.wfMdAvailableStatusService.getStatus(wfProcessGuid, currentStatus, this.apiVisa)
      .pipe(
        switchMap((x: any) => {
          return x.data;
        }),
        toArray()
      )
      .subscribe(
        (availableStatus: Array<WfMdProcessStatusContainerModel>) => {
          this.wfProcessStatusService
          .getByGuid(currentStatus.toString(), this.apiVisa)
          .subscribe({ next: (resolve) => (
            this.currentStatus.bl_wf_md_process_status.guid = resolve.data.bl_wf_md_process_status.guid,
            this.currentStatus.bl_wf_md_process_status.code = resolve.data.bl_wf_md_process_status.code
          )})
          this.availableStatus = availableStatus;
          this.availableStatus.unshift(this.currentStatus);
          console.log("availableStatus::::", this.availableStatus);
          setTimeout(() => {
            this.form.controls['processStatusGuid'].patchValue(currentStatus);
            this.availableStatus.sort((a, b) => a.bl_wf_md_process_status.code.localeCompare(b.bl_wf_md_process_status.code.toString()));
            this.filteredWorkflowStatusOptions.next(this.availableStatus.slice());
          }, 3000)


        },
        (err) => {
          console.error("locationService.get", err);
        }
      )
  }


workflowSelected(e){
  let processStatusGuid = e.value;
  let pagination = new Pagination;
  pagination.conditionalCriteria = [
    {
      columnName: "process_guid",
      operator: "=",
      value: this.processGuid.toString(),
    },
    {
      columnName: "process_status_guid",
      operator: "=",
      value: processStatusGuid.toString(),
    },
  ],
  this.subs.sink = this.statusLinkService
  .getByCriteria(pagination, this.apiVisa)
  .subscribe({ next: (resolve) => (
    this.resolutionGuid = resolve.data[0].bl_wf_md_process_status_link.process_resolution_guid.toString(),
    this.processStatusCode = resolve.data[0].bl_wf_md_process_status_link.code.toString(),
    this.form.controls['processGuid'].setValue(this.processGuid),
    this.form.controls['resolutionGuid'].setValue(this.resolutionGuid),
    this.wfResolutionService
    .getByGuid(this.resolutionGuid, this.apiVisa)
    .subscribe({ next: (resolve) => (
      this.resolutionCode = resolve.data.bl_wf_md_resolution.code.toString(),
      this.form.controls['resolutionCode'].setValue(this.resolutionCode)
      )
    })

    )
  })
}

setResolution(p, s){
  let processGuid = p;
  let processStatusGuid = s;
  let pagination = new Pagination;
  pagination.conditionalCriteria = [
    {
      columnName: "process_guid",
      operator: "=",
      value: processGuid.toString(),
    },
    {
      columnName: "process_status_guid",
      operator: "=",
      value: processStatusGuid.toString(),
    },
  ],
  this.subs.sink = this.statusLinkService
  .getByCriteria(pagination, this.apiVisa)
  .subscribe({ next: (resolve) => (
    this.resolutionGuid = resolve.data[0].bl_wf_md_process_status_link.process_resolution_guid.toString(),
    this.processStatusCode = resolve.data[0].bl_wf_md_process_status_link.code.toString(),
    this.form.controls['processGuid'].setValue(processGuid),
    this.form.controls['resolutionGuid'].setValue(this.resolutionGuid),
    this.wfResolutionService
    .getByGuid(this.resolutionGuid, this.apiVisa)
    .subscribe({ next: (resolve) => (
      this.resolutionCode = resolve.data.bl_wf_md_resolution.code.toString(),
      this.form.controls['resolutionCode'].setValue(this.resolutionCode)
      )
    })

    )
  })
}

protected filterWorkflowStatusOptions() {
  if (!this.availableStatus) {
    return;
  }
  let search = this.WorkflowStatusFilterCtrl.value;
  if (!search) {
    this.filteredWorkflowStatusOptions.next(this.availableStatus.slice());
    return;
  } else {
    search = search.trim().toLowerCase();
    this.filteredWorkflowStatusOptions.next(
      this.availableStatus.filter(
        (option) => option.bl_wf_md_process_status.code.toLowerCase().indexOf(search) > -1
      )
    );
  }
}

  disableCondition() {
    if (this.postingStatus || this.status) {
      if ((this.postingStatus === "FINAL") || (this.postingStatus === "VOID") || (this.postingStatus === "DISCARDED") || (this.status !== "ACTIVE" && this.status !== null) || this.genDocLock) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }

  setCredits() {
    if((this.creditTermsList.length) && (!this.disableCondition())) {
      this.form.controls['creditTerms'].enable();
      if (!this.modeValue) {
        if (this.creditTermsList.length == 1) {
          this.form.controls['creditTerms'].setValue(this.creditTermsList[0].value_json.name);
          this.calculateDueDate();
        } else if (!(this.creditTermsList.some(term =>
          term.value_json.name === this.form.value.creditTerms))) {
            this.form.patchValue({
              creditTerms: null,
              dueDate: null
            })
        }
      }
    }
    if ((this.creditLimitList.length) && (!this.disableCondition())) {
      this.form.controls['creditLimit'].enable();
      if (!this.modeValue) {
        if (this.creditLimitList.length == 1) {
          this.form.controls['creditLimit'].setValue(this.creditLimitList[0].value_json.name);
        } else if (!(this.creditLimitList.some(limit =>
          limit.value_json.name === this.form.value.creditLimit))) {
            this.form.patchValue({
              creditLimit: null
            })
        }
      }
    }
  }

  calculateDueDate() {
    console.log("Transaction Date",this.form.controls['transactionDate'].value)
    const txnDate = this.form.controls['transactionDate'].value;
    const creditTerms = this.form.controls['creditTerms'].value;
    this.creditTermsList.forEach(data => {
      if(data.value_json.name === creditTerms){
        //year-month-day
        const year = data.value_json.year;
        const month = data.value_json.month;
        const day = data.value_json.day;
        let givenDate = this.setDate(year,month,day);
        if(givenDate.toDate().toString() == "Invalid Date"){
          givenDate = moment(txnDate);
        }
        const addedYear = Number(data.value_json.addyear);
        const addedMonth = Number(data.value_json.addmonth);
        const addedDay = Number(data.value_json.addday);

        let dueDateTemp;
        let dueDate;
        dueDateTemp = givenDate.add(addedYear,'years');
        dueDateTemp = dueDateTemp.add(addedMonth,'months');
        dueDateTemp = dueDateTemp.add(addedDay,'days');

        dueDate = new Date(dueDateTemp);

        this.form.patchValue({
          dueDate : dueDate
        })
      }
    })
  }

  setDate(year,month,day) {
    return moment(new Date(`${year}-${month}-${day}`));
  }
  goToSelectMember() {
    this.selectMember.emit();
  }

  getCurencyRate(currency_foreign?) {
    console.log('getCurencyRate....');
    const currency_base = this.form.controls.baseCurrency.value;
    const currency_from = currency_foreign?? this.form.controls.currency.value;

    if (currency_base === currency_from) {
      this.form.patchValue({
        currencyRate: 1
      });
    }

    // {
    //   "Realtime Currency Exchange Rate": {
    //       "1. From_Currency Code": "USD",
    //       "2. From_Currency Name": "United States Dollar",
    //       "3. To_Currency Code": "MYR",
    //       "4. To_Currency Name": "Malaysian Ringgit",
    //       "5. Exchange Rate": "4.55800000",
    //       "6. Last Refreshed": "2023-08-07 10:28:02",
    //       "7. Time Zone": "UTC",
    //       "8. Bid Price": "4.55780000",
    //       "9. Ask Price": "4.55810000"
    //   }
    // }
    this.forexService.getCurrencyRate(currency_base, currency_from).subscribe(data => {
      if (data["Error Message"]) {
        console.log(data["Error Message"]);
      }
      else {
        this.form.patchValue({
          currencyRate: data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]
        });
      }
    });
  }

  setCurrency(e) {
    console.log('onCurrencyChange', e);
    this.updateMain.emit(e);
    this.getCurencyRate();
  }

  detectEmployee() {
    let page = new Pagination();
    if (this.appletSettings.salesManLabels?.length > 0) {
      page.conditionalCriteria = [
        { columnName: "calcTotalRecords", operator: "=", value: "true" },
        { columnName: "namespace", operator: "=", value: "EMPLOYEE_CATEGORY" },
        { columnName: "label_hdr_guids", operator: "=", value: this.appletSettings.salesManLabels.join(",") },
      ];
    } else {
      page.conditionalCriteria = [
        { columnName: "calcTotalRecords", operator: "=", value: "true" },
        { columnName: "namespace", operator: "=", value: "EMPLOYEE_CATEGORY" },
      ];
    }

    this.subs.sink = this.entityLabelLinkService.getByCriteria(page, this.apiVisa)
      .pipe(
        switchMap(resolve => {
          const entityHdrGuids = resolve.data
            .map(item => item.bl_fi_mst_entity_label_link.entity_hdr_guid?.toString())
            .filter(guid => !!guid);

          // Check if entityHdrGuids is not null before using toString()
          const hdrGuidsString = entityHdrGuids ? entityHdrGuids.toString() : '';

          return this.entityService.getByCriteria(
            new Pagination(0, 1000, [
              { columnName: "hdr_guids", operator: "=", value: hdrGuidsString },
              { columnName: "is_employee", operator: "=", value: "true" },
            ]),
            AppConfig.apiVisa
          );
        })
      )
      .subscribe(resolve => {
        const filteredData = resolve.data.filter(item =>
          item.bl_fi_mst_entity_login_subject_links.some(link => link.subject_guid === this.subjectGuid.toString())
        );

        // Check if filteredData is not empty before accessing its first element
        if (filteredData.length > 0) {
          this.form.patchValue({
            salesAgent: filteredData[0].bl_fi_mst_entity_hdr.guid,
          });
        }
      });
  }

  async getDefaultEntityBranch() {
    const pagination = new Pagination();
    pagination.conditionalCriteria = [
      {
        columnName: "subject_guid",
        operator: "=",
        value: this.subjectGuid
      },
      {
        columnName: "status",
        operator: "=",
        value: "ACTIVE"
      }
    ];
    let entityGuids = [];

    await new Promise<void>((resolve, reject) => {
      this.subs.sink = this.entityLoginSubjectLinkService.getByCriteria(pagination, this.apiVisa).subscribe(
        (entityLogin) => {
          if (entityLogin.data.length > 0) {
            entityLogin.data.forEach((entity) => {
              entityGuids.push(entity.bl_fi_mst_entity_login_subject_link.entity_hdr_guid.toString());
            });
          }
          resolve(); // Resolve the promise when the subscription is complete
        },
        (error) => {
          reject(error); // Reject the promise if there's an error
        }
      );
    });
    if(entityGuids.length > 0){
      pagination.conditionalCriteria = [
        {
          columnName: "hdr_guids",
          operator: "=",
          value: entityGuids.toString()
        },
        {
          columnName: "status",
          operator: "=",
          value: "ACTIVE"
        }
      ];
      pagination.sortCriteria= [
        { columnName: 'orderBy', value: 'updated_date' },
        { columnName: 'order', value: 'DESC' }
      ];
      this.subs.sink = this.entityService.getByCriteria(pagination, this.apiVisa).subscribe(
        (entities) =>{
          let entity = entities.data.find(ent => (
            ent.bl_fi_mst_entity_hdr.txn_type === "INDIVIDUAL" &&
            ent.bl_fi_mst_entity_hdr.default_branch_guid !==null &&
            ent.bl_fi_mst_entity_hdr.status === "ACTIVE" &&
            ent.bl_fi_mst_entity_hdr.is_employee
          ))
          if(entity){
            this.defaultBranch = entity.bl_fi_mst_entity_hdr.default_branch_guid.toString();
            this.selectedDeliveryBranch = entity.bl_fi_mst_entity_hdr.default_branch_guid.toString();
            this.form.patchValue({
              branch : entity.bl_fi_mst_entity_hdr.default_branch_guid,
              deliveryBranch: entity.bl_fi_mst_entity_hdr.default_branch_guid
            })
          }
        }
      )
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  validateSalesAgent(): boolean {
    const salesAgentControl = this.form.controls['salesAgent'];
    if (this.appletSettings?.MANDATORY_MAIN_DETAILS_SALES_AGENT) {
      if (!salesAgentControl.touched) {
        salesAgentControl.markAsTouched();
      }
      if (!(salesAgentControl.value)) {
        return false;
      }
    }
    return true;
  }

  setupReasonFieldValidator() {
    const reasonControl = this.form.get('reasonOfRepair');

    if (!this.appletSettings.HIDE_REASON && this.appletSettings.MANDATORY_REASON_FIELD) {
      reasonControl.setValidators([Validators.required]);
    } else {
      reasonControl.clearValidators();
    }

    reasonControl.updateValueAndValidity();

    if (
      !this.appletSettings.HIDE_REASON &&
      this.appletSettings.MANDATORY_REASON_FIELD &&
      !reasonControl.value
    ) {
      reasonControl.markAsTouched();
      reasonControl.markAsDirty();
    }

  }

  setupRemarksFieldValidator() {
    const remarksControl = this.form.get('remarks');

    if (!this.appletSettings.HIDE_REMARKS && this.appletSettings.MANDATORY_REMARKS_FIELD) {
      remarksControl.setValidators([Validators.required]);
    } else {
      remarksControl.clearValidators();
    }

    remarksControl.updateValueAndValidity();

    if (
      !this.appletSettings.HIDE_REMARKS &&
      this.appletSettings.MANDATORY_REMARKS_FIELD &&
      !remarksControl.value
    ) {
      remarksControl.markAsTouched();
      remarksControl.markAsDirty();
    }

  }

  onForexDataSourceSelected(selectedRow: any) {
    console.log('Selected Forex Data Source:', selectedRow);

    this.form.patchValue({
      currency: selectedRow.currency_foreign
    });
  }
}
