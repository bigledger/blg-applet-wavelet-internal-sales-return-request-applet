import { ChangeDetectionStrategy, Component, ComponentFactoryResolver, ViewChild, ViewChildren, ElementRef, ViewContainerRef, AfterViewChecked, } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { TenantAppletService, bl_fi_generic_doc_line_RowClass, GenericDocARAPContainerModel, GenericDocContainerModel } from 'blg-akaun-ts-lib';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { EMPTY, iif, of, combineLatest, Observable } from 'rxjs';
import { delay, filter, map, mergeMap, take } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { AppletSettings } from '../../../models/applet-settings.model';
import { ViewColumnFacade } from '../../../facades/view-column.facade';
import { BillingAddress, BillingInfo, ISCNDepartment, ISCNMain, ShippingAddress, ShippingInfo } from '../../../models/internal-sales-return.model';
// import { BillingInfo, ISCNDepartment, ISCNMain, ShippingInfo } from '../../../models/internal-sales-return.model';
import { HDRActions, PNSActions } from '../../../state-controllers/draft-controller/store/actions';
import { HDRSelectors, PNSSelectors, SettlementSelectors } from '../../../state-controllers/draft-controller/store/selectors';
import { DraftStates } from '../../../state-controllers/draft-controller/store/states';
import { InternalSalesReturnActions } from '../../../state-controllers/internal-sales-return-controller/store/actions';
import { InternalSalesReturnSelectors } from '../../../state-controllers/internal-sales-return-controller/store/selectors';
import { InternalSalesReturnStates } from '../../../state-controllers/internal-sales-return-controller/store/states';
import { AccountComponent } from '../sales-return-create/account/account.component';
import { LineItemListingComponent } from '../sales-return-create/line-item/line-item-listing.component';
import { InternalSalesReturnMainComponent } from '../sales-return-create/main-details/main-details.component';
import { ClientSidePermissionsSelectors } from 'projects/shared-utilities/modules/permission/client-side-permissions-controller/selectors';
import { ClientSidePermissionStates } from 'projects/shared-utilities/modules/permission/client-side-permissions-controller/states';
import { PermissionStates } from 'projects/shared-utilities/modules/permission/permission-controller';
import { UserPermInquirySelectors } from 'projects/shared-utilities/modules/permission/user-permissions-inquiry-controller/selectors';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';
import { ColumnViewModelStates } from '../../../state-controllers/sales-return-view-model-controller/store/states';
import { UtilitiesModule } from 'projects/shared-utilities/utilities/utilities.module';
import { Column4ViewModelActions } from '../../../state-controllers/sales-return-view-model-controller/store/actions';
import { SearchInvoicesComponent } from '../sales-return-create/search-invoices/search-invoices.component';
import { InternalSalesReturnEditExportComponent } from './export/export.component'
import { TabControlService } from '../../../services/tab-control.service';
import { ContraListingComponent } from '../sales-return-create/contra/contra-listing.component';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AkaunDiscardDialogComponent } from 'projects/shared-utilities/dialogues/akaun-discard-dialog/akaun-discard-dialog.component';

interface LocalState {
  deactivateReturn: boolean;
  deactivateAdd: boolean;
  deactivateList: boolean;
  selectedIndex: number;
  accountSelectedIndex: number;
  selectedLine: any;
  deleteConfirmation: boolean;
  selectedSearchIndex: number;
  expandedPanel: number;
}

@Component({
  selector: 'app-internal-sales-return-edit',
  templateUrl: './sales-return-edit.component.html',
  styleUrls: ['./sales-return-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class InternalSalesReturnEditComponent extends ViewColumnComponent implements AfterViewChecked {

  protected subs = new SubSink();

  protected compName = 'Internal Sales Return Edit';
  protected readonly index = 2;
  protected localState: LocalState;
  protected prevLocalState: any;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateReturn$ = this.componentStore.select(state => state.deactivateReturn);
  readonly selectedIndex$ = this.componentStore.select(state => state.selectedIndex);
  readonly accountSelectedIndex$ = this.componentStore.select(state => state.accountSelectedIndex);
  readonly deleteConfirmation$ = this.componentStore.select(state => state.deleteConfirmation);
  readonly selectedSearchIndex$ = this.componentStore.select(state => state.selectedSearchIndex);
  readonly expandedPanel$ = this.componentStore.select(state => state.expandedPanel);

  draft$ = this.draftStore.select(HDRSelectors.selectHdr);
  pns$ = this.draftStore.select(PNSSelectors.selectAll);
  hdr$ = this.store.select(InternalSalesReturnSelectors.selectInternalSalesReturns);
  stl$ = this.draftStore.select(SettlementSelectors.selectAll);
  readonly userPermissionTarget$ = this.permissionStore.select(
    UserPermInquirySelectors.selectUserPermInquiry
  );
  readonly userRank$ = this.sessionStore.select(SessionSelectors.selectUserRank);
  genDocLock$ = this.store.select(InternalSalesReturnSelectors.selectGenDocLock);

  prevIndex: number;
  apiVisa = AppConfig.apiVisa;
  viewMode: string;
  deleteConfirmation: boolean;
  postingStatus;
  status;
  showDeleteButton = false;
  appletSettings: AppletSettings;
  SHOW_FINAL_BUTTON: boolean;
  SHOW_DISCARD_BUTTON: boolean;
  SHOW_VOID_BUTTON: boolean;
  hdrGuid;
  userRank: string;
  clientSidePermissionSettings: any;
  mainTabInvalid: boolean = false;
  accountTabInvalid: boolean = false;
  lineTabInvalid: boolean = false;
  paymentTabInvalid: boolean = false;
  hdr: any;
  loadLazyContent: boolean = true; // Flag to control lazy loading
  genDocLock: boolean;
  showAdjustment = false;
  permEditSettlement = false;

  //  ------------------------------------------ Expansion Panel  (Vertical UI)  ------------------------------------------------------   //
  panels = [
    { title: 'Search', content: 'search', expandSetting: 'EXPAND_SEARCH'},
    { title: 'Main Details', content: 'main-details', expandSetting: 'EXPAND_MAIN_DETAILS', invalid: false },
    { title: 'E-Invoice', content: 'e-invoice' },
    { title: 'Account', content: 'account', expandSetting: 'EXPAND_ACCOUNT', invalid: false },
    { title: 'Lines', content: 'lines', expandSetting: 'EXPAND_LINE_ITEMS', invalid: false },
    { title: 'ARAP', content: 'arap', hide: 'HIDE_MAIN_ARAP_TAB', expandSetting: 'EXPAND_MAIN_ARAP'},
    { title: 'Delivery Details', content: 'delivery-details', hide: 'HIDE_DELIVERY_DETAILS_TAB', expandSetting: 'EXPAND_DELIVERY_DETAILS' },
    { title: 'Payment', content: 'payment', hide: 'HIDE_MAIN_PAYMENT_TAB', expandSetting: 'EXPAND_PAYMENT', invalid: false },
    { title: 'Payment Adjustment', content: 'payment-adjustment', hide: 'HIDE_PAYMENT_TAB', expandSetting: 'EXPAND_PAYMENT', invalid: this.paymentTabInvalid || false },
    { title: 'Department Hdr', content: 'department-hdr', hide: 'HIDE_DEPARTMENT_HDR_TAB', expandSetting: 'EXPAND_DEPARTMENT_HDR', lazy: true },
    { title: 'TraceDocument', content: 'trace-document', hide: 'HIDE_TRACE_DOCUMENT_TAB', expandSetting: 'EXPAND_TRACE_DOCUMENT'},
    { title: 'Contra', content: 'contra', hide: 'HIDE_MAIN_CONTRA_TAB', expandSetting: 'EXPAND_MAIN_CONTRA' },
    { title: 'Doc Link', content: 'doc-link', hide: 'HIDE_DOC_LINK_TAB', expandSetting: 'EXPAND_DOC_LINK'},
    { title: 'Attachments', content: 'attachments', hide: 'HIDE_ATTACHMENT_TAB', expandSetting: 'EXPAND_ATTACHMENT' },
    { title: 'Export', content: 'export', hide: 'HIDE_EXPORT_TAB', expandSetting: 'EXPAND_EXPORT' }
  ];
  expandedPanelIndex: number = 0;
  orientation: boolean = false;
  isPanelExpanded: boolean = false;
  viewCheckedSub: boolean = false;
  resetExpansion: boolean = false;
  @ViewChildren('panel', { read: ElementRef }) panelScroll;
  //  -----------------------------------------------------------------------------------------------------------------------------------   //


  FINAL_BUTTON_GUID: string;
  CURRENT_STATUS_GUID: string;
  eInvoiceEnabled = false;
  @ViewChild(MatTabGroup) matTab: MatTabGroup;
  @ViewChild(AccountComponent) account: AccountComponent;
  @ViewChild(InternalSalesReturnMainComponent) main: InternalSalesReturnMainComponent;
  @ViewChild(LineItemListingComponent) lines: LineItemListingComponent;
  @ViewChild(SearchInvoicesComponent) searchInvoice: SearchInvoicesComponent;
  @ViewChild(InternalSalesReturnEditExportComponent) exportComponent!: InternalSalesReturnEditExportComponent;
  @ViewChild('tabContent', { read: ViewContainerRef }) tabContent: ViewContainerRef;
  hasUpdatePermission: boolean;
  selectedIndex: unknown;

  akaunDiscardDialogComponent: MatDialogRef<AkaunDiscardDialogComponent>;
  docNo: any;
  title: Observable<any> = of('Create');

  constructor(
    private dialogRef: MatDialog,
    private viewModelStore: Store<ColumnViewModelStates>,
    private viewColFacade: ViewColumnFacade,
    private readonly componentStore: ComponentStore<LocalState>,
    protected readonly draftStore: Store<DraftStates>,
    private appletService: TenantAppletService,
    protected readonly permissionStore: Store<PermissionStates>,
    protected readonly sessionStore: Store<SessionStates>,
    protected readonly store: Store<InternalSalesReturnStates>,
    private tabControlService: TabControlService,
    private toastr: ToastrService,
    private cfr: ComponentFactoryResolver) {
    super();
  }

  masterSettings$ = this.sessionStore.select(
    SessionSelectors.selectMasterSettings
  );

  clientSidePermissions$ = this.permissionStore.select(
    ClientSidePermissionsSelectors.selectAll
  );

  appletSettings$ = combineLatest([
    this.sessionStore.select(SessionSelectors.selectMasterSettings),
    this.sessionStore.select(SessionSelectors.selectPersonalSettings)
  ]).pipe(map(([a, b]) => ({...a, ...b})));

  ngOnInit() {
    this.subs.sink = combineLatest([
      this.appletSettings$,
      this.clientSidePermissions$,
      this.genDocLock$,
      this.hdr$
    ]).pipe(
    ).subscribe({next: ([
                          master,permissionList, lock, hdr
                        ]:any) => {
        this.genDocLock = lock;
        this.FINAL_BUTTON_GUID = master.FINAL_STATUS_GUID ? master.FINAL_STATUS_GUID.toString() : null;
        this.appletSettings = master;
        if (master?.SALES_RETURN_DETAILS_TAB_ORDER) {
          const orderedMap: { [key: string]: number } = {};
          if (master.SALES_RETURN_DETAILS_TAB_ORDER.length > 0) {
            master.SALES_RETURN_DETAILS_TAB_ORDER.forEach((tab, index) => { 
              orderedMap[tab.content] = index;
            });

            // Separate panels into saved (with order) and new (without order)
            const savedPanels = this.panels.filter(panel => orderedMap.hasOwnProperty(panel.content));
            const newPanels = this.panels.filter(panel => !orderedMap.hasOwnProperty(panel.content));

            // Sort saved panels by their saved order, then append new panels
            this.panels = [
              ...savedPanels.sort((a, b) => (orderedMap[a.content] ?? Number.MAX_VALUE) - (orderedMap[b.content] ?? Number.MAX_VALUE)),
              ...newPanels
            ];
          }
        }
        this.showAdjustment = master?.ENABLE_EDIT_SETTLEMENT_FINAL && this.permEditSettlement && this.postingStatus === 'FINAL';

        if (!this.showAdjustment) {
          this.panels = this.panels.filter(panel => panel.content !== 'payment-adjustment');
        }
        this.clientSidePermissionSettings = permissionList;
        permissionList.forEach(permission => {
          if (permission.perm_code === "SHOW_GENDOC_FINAL_BUTTON") {
            this.SHOW_FINAL_BUTTON = true;
          }

          if (permission.perm_code === "SHOW_GENDOC_DISCARD_BUTTON") {
            this.SHOW_DISCARD_BUTTON = true;
          }

          if (permission.perm_code === "SHOW_GENDOC_VOID_BUTTON") {
            this.SHOW_VOID_BUTTON = true;
          }
          if (permission.perm_code === "SHOW_EDIT_SETTLEMENT_FINAL") {
            this.permEditSettlement = true;
          }
        });

        this.hdr = hdr;
        this.hdrGuid = hdr.bl_fi_generic_doc_hdr.guid;
        this.postingStatus = hdr.bl_fi_generic_doc_hdr.posting_status;
        this.status = hdr.bl_fi_generic_doc_hdr.status;
        this.CURRENT_STATUS_GUID = hdr.bl_fi_generic_doc_hdr.wf_process_status_guid ? hdr.bl_fi_generic_doc_hdr.wf_process_status_guid.toString() : '';
        this.docNo = hdr.bl_fi_generic_doc_hdr.server_doc_1
        hdr.bl_fi_generic_doc_hdr.status === 'TEMP'? this.title = of('Create') : this.title = of('Edit');

        this.showAdjustment = master?.ENABLE_EDIT_SETTLEMENT_FINAL && this.permEditSettlement && this.postingStatus === 'FINAL';
        if (!this.showAdjustment) {
          this.panels = this.panels.filter(panel => panel.content !== 'payment-adjustment');
        }
      }});

    this.subs.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.subs.sink = this.deleteConfirmation$.pipe(
      mergeMap(a => {
        return iif(() => a, of(a).pipe(delay(3000)), of(EMPTY));
      })
    ).subscribe(resolve => {
      if (resolve === true) {
        this.componentStore.patchState({ deleteConfirmation: false });
        this.deleteConfirmation = false;
      }
    });

    this.subs.sink = this.appletService.getByGuid(sessionStorage.getItem('appletGuid'), this.apiVisa).subscribe(
      (applet) => {
        const ext = applet.data.bl_applet_exts.find(x => x.param_code === 'APPLET_SETTINGS');
        if (ext) {
          if (ext.value_json.SHOW_DOCUMENT_DELETE_BUTTON) {
            this.showDeleteButton = true;
          }
          else {
            this.showDeleteButton = false;
          }
        }
      }
    )
    this.subs.sink = this.userRank$.subscribe(userRank => {
      if (userRank) {
        this.userRank = userRank;
      }
    });

    this.subs.sink = this.userPermissionTarget$.subscribe((targets) => {
      let updatePermissionTarget = targets.filter(
        (target) =>
          target.permDfn === "TNT_API_DOC_INTERNAL_SALES_RETURN_REQUEST_UPDATE_TGT_GUID"
      );
      let adminUpdatePermissionTarget = targets.filter(
        (target) =>
          target.permDfn === "TNT_TENANT_ADMIN"
      );
      let ownerUpdatePermissionTarget = targets.filter(
        (target) =>
          target.permDfn === "TNT_TENANT_OWNER"
      );
      if (updatePermissionTarget[0]?.hasPermission || adminUpdatePermissionTarget[0]?.hasPermission || ownerUpdatePermissionTarget[0]?.hasPermission) {
        this.hasUpdatePermission = true
      } else {
        this.hasUpdatePermission = false
      }

    });

    this.subs.sink = this.selectedIndex$.pipe(
      take(1),
      filter(index => typeof index === 'number') // Filter out undefined values
    ).subscribe(selectedIndex => {
      this.selectedIndex = selectedIndex;
    });


    this.subs.sink = this.pns$.subscribe(pns =>{
      if(pns.length > 0) {
        this.highlightLineTab(false)
        this.loadTabContent();
      }else{
        this.highlightLineTab(true)
      }
    })

    // this.subs.sink = this.stl$.subscribe(stl =>{
    //   if(stl.length > 0) {
    //     this.highlightPaymentTab(false)
    //   }else{
    //     this.highlightPaymentTab(true)
    //   }
    // })

    this.subs.sink = this.tabControlService.activateTab$.subscribe(tabIndex => {
      this.loadTabContent();
    });
    this.store.select(InternalSalesReturnSelectors.selectEInvoiceEnabled).subscribe(e => {
      this.eInvoiceEnabled = e;
    });

    this.store.select(InternalSalesReturnSelectors.selectResetExpansionPanel).subscribe(x => {
      this.resetExpansion = x;
      if (!this.resetExpansion){
        this.subs.sink = this.expandedPanel$.subscribe(expandedPanel =>{
          if(expandedPanel !== undefined) {
            this.expandedPanelIndex = expandedPanel;
        }});
      } else {
        this.expandedPanelIndex = 0;
        this.store.dispatch(InternalSalesReturnActions.resetExpansionPanel({ resetIndex: null }));
      }
      this.initializeExpandedPanels();
    });

  }

  loadTabContent() {
    this.tabContent?.clear();
    const factory = this.cfr.resolveComponentFactory(ContraListingComponent);
    this.tabContent?.createComponent(factory);
  }

  onFinal() {
    if (!this.validateInput()){
      return;
    }
    this.subs.sink = this.draft$.subscribe(resolve => {
      const json = {
        posting_status: 'FINAL'
      }
      let temp: GenericDocContainerModel = {
        bl_fi_generic_doc_hdr: resolve,
        bl_fi_generic_doc_event: null,
        bl_fi_generic_doc_ext: null,
        bl_fi_generic_doc_link: null,
        bl_fi_generic_doc_line: null
      };
      if (resolve.posting_status !== 'FINAL' && resolve.status === "ACTIVE") {
        if (this.appletSettings?.SALES_RETURN_WITH_PAYMENT) {
          this.subs.sink = this.store.select(InternalSalesReturnSelectors.selectedDocArapBalance).subscribe(docArapBalance=>{
            if (docArapBalance === 0) {
              // Dispatching action when SALES_RETURN_WITH_PAYMENT is enabled and arap_bal is 0
              this.store.dispatch(InternalSalesReturnActions.editSalesReturnFinalInit());
              if (this.appletSettings.ENABLE_AUTO_POPUP){
                setTimeout(() =>{
                  this.exportComponent.onOpen();
                },2000)
              }
            } else {
              // Displaying an error when arap_bal is not equal to 0
              this.viewColFacade.showFailedToast({ message: 'ARAP balance must be 0 for finalization' });
            }
          })
        } else {
          // Dispatching action when SALES_RETURN_WITH_PAYMENT is not enabled
          this.store.dispatch(InternalSalesReturnActions.editSalesReturnFinalInit());
        }
      } else {
        // Handling case when the document has already been posted
        this.viewColFacade.showFailedToast({ message: 'This document has been posted' });
      }
    });
  }

  disableFinal() {
    let hasInvalidSerial = false;
    this.subs.sink = this.pns$.subscribe({
      next: (pns: any) => {
        pns.forEach(line => {
          if(line.item_sub_type==='SERIAL_NUMBER'){
            hasInvalidSerial = UtilitiesModule.checkSerialValid(<any> line.serial_no);
          }
        })
      }
    });
    return hasInvalidSerial;
  }

  disableResetButton() {
    return this.postingStatus === "FINAL" || this.postingStatus === 'VOID' || this.status !== "ACTIVE";
  }

  // showFinal(): boolean {
  //   return this.status === 'ACTIVE' && this.postingStatus !== 'FINAL';
  // }

  // showDiscard(): boolean {
  //   return !this.postingStatus && this.status == 'ACTIVE';
  // }

  showFinal(): boolean {
    if(this.genDocLock){
      return false;
    }

    return (
      (!this.appletSettings.HIDE_GENDOC_FINAL_BUTTON || this.SHOW_FINAL_BUTTON) &&
      this.status === 'ACTIVE' &&
      (!this.postingStatus || this.postingStatus === "DRAFT")
      &&
      ((this.FINAL_BUTTON_GUID === this.CURRENT_STATUS_GUID) ||
        (this.FINAL_BUTTON_GUID === null))
    );
  }

  showDiscard(): boolean {
    if(this.genDocLock){
      return false;
    }

    return (!this.appletSettings.HIDE_GENDOC_DISCARD_BUTTON || this.SHOW_DISCARD_BUTTON)
      && this.status === 'ACTIVE' && (!this.postingStatus || this.postingStatus === "DRAFT");
  }

  showVoid(): boolean {
    if(this.genDocLock){
      return false;
    }

    return (!this.appletSettings.HIDE_GENDOC_VOID_BUTTON || this.SHOW_VOID_BUTTON)
      && this.postingStatus === 'FINAL' && !this.eInvoiceEnabled;
  }

  onVoid() {
    this.subs.sink = this.draft$.subscribe(resolve => {
      const json = {
        posting_status: 'VOID'
      }
      let temp: GenericDocContainerModel = {
        bl_fi_generic_doc_hdr: resolve,
        bl_fi_generic_doc_event: null,
        bl_fi_generic_doc_ext: null,
        bl_fi_generic_doc_link: null,
        bl_fi_generic_doc_line: null
      };
      if (resolve.posting_status === 'FINAL' || (resolve.status !== 'ACTIVE' && resolve.status !== null)) {
        this.store.dispatch(InternalSalesReturnActions.voidSalesReturnInit({ status: json, doc: temp }));
      } else {
        this.viewColFacade.showFailedToast({ message: 'This document has not been finalized yet' });
      }
    });
  }

  onDiscard() {
    this.akaunDiscardDialogComponent = this.dialogRef.open(AkaunDiscardDialogComponent, { width: '400px' });
    this.akaunDiscardDialogComponent.componentInstance.confirmMessage = 'Are you sure you want to discard document ';
    this.akaunDiscardDialogComponent.componentInstance.docNo = this.docNo;
    this.akaunDiscardDialogComponent.afterClosed().subscribe((result) => {
      if(result === true){
        this.store.dispatch(InternalSalesReturnActions.discardInit({ guids: [this.hdrGuid.toString()], fromEdit: true }));
      }
    });
  }

  ngAfterViewChecked() {
    if(this.orientation){
      if (this.isPanelExpanded) {
        if(this.resetExpansion){
          this.expandedPanelIndex = 0;
          this.store.dispatch(InternalSalesReturnActions.resetExpansionPanel({ resetIndex: null }));
        } else {
          if(!this.viewCheckedSub) {
            this.expandedPanel$.subscribe(expandedPanel => {
              if (expandedPanel !== undefined) { this.expandedPanelIndex = expandedPanel }
            });
            this.viewCheckedSub = true;
          }
        }
        setTimeout(() => this.panelScroll.toArray()[this.expandedPanelIndex].nativeElement.scrollIntoView({ behavior: 'smooth' }),500);;
        this.isPanelExpanded = false;  // Reset the flag after scrolling
      }
    }
  }

  onUpdateMain(form: ISCNMain) {
    this.draftStore.dispatch(HDRActions.updateMain({ form }));
  }

  onUpdateBillingInfo(form: BillingInfo) {
    this.draftStore.dispatch(HDRActions.updateBillingInfo({ form }));
  }

  onUpdateBillingAddress(form: BillingAddress) {
    this.draftStore.dispatch(HDRActions.updateBillingAddress({ form }));
  }

  onUpdateShippingInfo(form: ShippingInfo) {
    this.draftStore.dispatch(HDRActions.updateShippingInfo({ form }));
  }

  onUpdateShippingAddress(form: ShippingAddress) {
    this.draftStore.dispatch(HDRActions.updateShippingAddress({ form }));
  }

  onUpdateDepartmentInfo(form: ISCNDepartment) {
    this.draftStore.dispatch(HDRActions.updateDepartment({ form }));
  }

  onReset() {
    if (this.postingStatus !== 'FINAL' && this.status === 'ACTIVE') {
      this.viewColFacade.resetDraft(true);
    }
    else {
      this.viewColFacade.showFailedToast({ message: 'This document has been posted' });
    }
  }

  disableSave() {
    return this.main?.form?.invalid || this.genDocLock;
  }

  onSave() {
    if (!this.validateInput()){
      return;
    }
    if (this.hdr && this.hdr.base_doc_ccy !== this.hdr.doc_ccy
      && this.hdr.base_doc_xrate <= 0) {
        this.viewColFacade.showFailedToast({ message: 'The currency rate cannot be ZERO or negative.' });
        return;
    }
    else {
      if(this.status === 'TEMP'){
        this.store.dispatch(InternalSalesReturnActions.convertToActiveInit());
      }else{
        this.store.dispatch(InternalSalesReturnActions.editInternalSalesReturnInit());
      }
    }
  }

  onDelete() {
    if (this.deleteConfirmation) {
      this.store.dispatch(InternalSalesReturnActions.deleteInternalSalesReturnInit());
      this.deleteConfirmation = false;
      this.componentStore.patchState({ deleteConfirmation: false });
    } else {
      this.deleteConfirmation = true;
      this.componentStore.patchState({ deleteConfirmation: true });
    }
  }

  deleteButtonCondition() {
    if (this.postingStatus === "FINAL" || (this.status !== "ACTIVE" && this.status !== null)) {
      return false;
    }
    else {
      return this.showDeleteButton;
    }
  }

  goToSelectMember() {
    if (this.orientation) {
      this.savePanelState();
    }
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState,
      deactivateReturn: true,
      deactivateAdd: true,
      deactivateList: true
    });
    this.viewColFacade.onNextAndReset(this.index, 3);
  }

  goToSelectEntity() {
    if (this.orientation) {
      this.expandedPanelIndex = 3;
      this.savePanelState();
    }
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState,
      deactivateReturn: true,
      deactivateAdd: true,
      deactivateList: true
    });
    this.viewColFacade.onNextAndReset(this.index, 4);
  }

  goToSelectBilling() {
    if (this.orientation) {
      this.expandedPanelIndex = 3;
      this.savePanelState();
    }
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState,
      deactivateReturn: true,
      deactivateAdd: true,
      deactivateList: true
    });
    this.viewColFacade.onNextAndReset(this.index, 5);
  }

  goToSelectShipping() {
    if (this.orientation) {
      this.expandedPanelIndex = 3;
      this.savePanelState();
    }
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState,
      deactivateReturn: true,
      deactivateAdd: true,
      deactivateList: true
    });
    this.viewColFacade.onNextAndReset(this.index, 6);
  }

  goToLineItemCreate() {
    this.expandedPanelIndex = 4;
    if (this.orientation) {
      this.savePanelState();
    }
    this.store.dispatch(InternalSalesReturnActions.selectMode({ mode: 'edit' }))
    this.viewModelStore.dispatch(Column4ViewModelActions.processSerialNumberListing_Reset());
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState,
      deactivateAdd: true,
      deactivateReturn: true,
      deactivateList: true
    });
    this.viewColFacade.onNextAndReset(this.index, 7);
  }

  goToLineItemEdit(item: any) {
    if (item && !this.localState.deactivateList) {
      const lineItem = { ...item };
      this.store.dispatch(InternalSalesReturnActions.selectLineItem({ lineItem }));
      if (this.orientation) {
        this.expandedPanelIndex = 4;
        this.savePanelState();
      }
      if (item.item_sub_type === 'SERIAL_NUMBER') {
        this.viewModelStore.dispatch(Column4ViewModelActions.processSerialNumberListing_Reset());
        const hasInvalidSerial = UtilitiesModule.checkSerialValid(<any>item.serial_no);
        if (hasInvalidSerial) {
          this.viewModelStore.dispatch(Column4ViewModelActions.setSerialNumberTabFieldColor({ color: "warn" }));
        }
        this.viewModelStore.dispatch(Column4ViewModelActions.setSerialNumberTab_ScanTab_SerialNumbersListing({ serialNumberListing: <any>item.serial_no }));

        if (!Array.isArray(item.serial_no)) {
          if (item.serial_no && <any>item.serial_no.serialNumbers.length) {
            this.draftStore.dispatch(
              PNSActions.validatePNSSerialNo({ line: item })
            );
          } else {
            this.draftStore.dispatch(
              PNSActions.validatePNSNoSerialNo({ line: item })
            );
          }
        }
      }
      this.viewColFacade.updateInstance(this.index, {
        ...this.localState,
        deactivateAdd: true,
        deactivateReturn: true,
        deactivateList: false,
        selectedLine: item.guid
      });
      this.viewColFacade.onNextAndReset(this.index, 9);
    }
  }

  goToSettlementCreate() {
    if (this.orientation) {
      this.savePanelState();
    }
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState,
      deactivateAdd: true,
      deactivateReturn: true,
      deactivateList: true
    });
    this.viewColFacade.onNextAndReset(this.index, 10);
  }

  goToSettlementEdit(settlement: bl_fi_generic_doc_line_RowClass) {
    if (settlement && !this.localState.deactivateList) {
      this.store.dispatch(InternalSalesReturnActions.selectSettlement({ settlement: settlement }))
      if (this.orientation) {
        this.savePanelState();
      }
      this.viewColFacade.updateInstance(this.index, {
        ...this.localState,
        deactivateAdd: true,
        deactivateReturn: true,
        deactivateList: false,
        selectedLine: settlement.guid
      });
      this.viewColFacade.onNextAndReset(this.index, 11);
    }
  }

  goToSelectDocument() {
    if (this.orientation) {
      this.savePanelState();
    }
    this.store.dispatch(InternalSalesReturnActions.refreshArapListing({ refreshArapListing: false }));
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState,
      deactivateReturn: true,
      deactivateAdd: true,
      deactivateList: true
    });
    this.viewColFacade.onNextAndReset(this.index, 14);
  }

  goToEditContra(contra: GenericDocARAPContainerModel) {
    this.store.dispatch(InternalSalesReturnActions.selectContraLink({ link: contra }));
    if (contra && !this.localState.deactivateList) {
      if (this.orientation) {
        this.savePanelState();
      }
      this.viewColFacade.updateInstance<LocalState>(this.index, {
        ...this.localState,
        deactivateReturn: true,
        deactivateAdd: false,
        deactivateList: false,
      });
      this.viewColFacade.onNextAndReset(this.index, 16);
    }
  }

  goToAttachmentAdd() {
    if (this.orientation) {
      this.savePanelState();
    }
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState,
      deactivateReturn: true,
      deactivateAdd: true
    });
    this.viewColFacade.onNextAndReset(this.index, 17);
  }

  goToAttachmentView() {
    if (this.orientation) {
      this.savePanelState();
    }
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState,
      deactivateReturn: true,
      deactivateAdd: true,
      deactivateList: false,
    });
    this.viewColFacade.onNextAndReset(this.index, 18);
  }

  onFormStatusChange(status: string) {
    if (status === 'INVALID') {
      this.highlightMainTab(true);
    }else{
      this.highlightMainTab(false);
    }
  }

  highlightMainTab(boolean:boolean) {
    this.mainTabInvalid = boolean;
    const panelIndex = this.panels.findIndex(panel => panel.title === 'Main Details');
    this.panels[panelIndex].invalid = boolean;
  }

  onAccountStatusChange(status: string) {
    if (status === 'INVALID') {
      this.highlightAccountTab(true);
    }else{
      this.highlightAccountTab(false);
    }
  }

  highlightAccountTab(boolean:boolean) {
    this.accountTabInvalid = boolean;
    const panelIndex = this.panels.findIndex(panel => panel.title === 'Account');
    this.panels[panelIndex].invalid = boolean;
  }

  highlightLineTab(boolean:boolean) {
    this.lineTabInvalid = boolean;
    const panelIndex = this.panels.findIndex(panel => panel.title === 'Lines');
    this.panels[panelIndex].invalid = boolean;
  }

  highlightPaymentTab(boolean:boolean) {
    this.paymentTabInvalid = boolean;
    const panelIndex = this.panels.findIndex(panel => panel.title === 'Payment');
    this.panels[panelIndex].invalid = boolean;
  }

  onReturn() {
    if(!this.genDocLock){
      this.store.dispatch(InternalSalesReturnActions.unlockDocument({hdrGuid: this.hdrGuid}));
    }
    this.store.dispatch(InternalSalesReturnActions.resetDraft());
    this.store.dispatch(InternalSalesReturnActions.refreshArapListing({ refreshArapListing: true }));
    this.store.dispatch(InternalSalesReturnActions.setEditMode({ editMode: false }));
    if (this.orientation) {
      this.savePanelState();
      this.store.dispatch(InternalSalesReturnActions.resetExpansionPanel({ resetIndex: null }));
    }
    this.viewColFacade.updateInstance<LocalState>(this.prevIndex, {
      ...this.prevLocalState,
      deactivateAdd: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  // ------------------- Expansion Panel  (Vertical UI) ------------------------ //

  initializeExpandedPanels(): void {
    // Initialize the expanded panels based on appletSettings
    const expandedIndex = this.panels.findIndex(panel =>
      panel.expandSetting && this.appletSettings[panel.expandSetting]
    );
    if (expandedIndex !== -1) {
      this.expandedPanelIndex = expandedIndex;
    }
  }

  onPanelOpened(index: number): void {
    if (this.orientation) {
      this.expandedPanelIndex = index;
      this.isPanelExpanded = true;
    }
  }

  savePanelState(): void {
    this.viewColFacade.updateInstance<LocalState>(this.index, {
      ...this.localState,
      expandedPanel: this.expandedPanelIndex,
     });
  }

  getFilteredPanels(draft: any) {
    return this.panels.filter(panel => {
      const hidePanels = panel.hide && this.appletSettings[panel.hide];
      return !hidePanels;
    });
  }

  showPanels(): boolean {
    if(this.appletSettings?.VERTICAL_ORIENTATION){
      if(this.appletSettings?.DEFAULT_ORIENTATION === 'HORIZONTAL'){
        this.orientation = false;
      } else {
        this.orientation = true;
      }
    } else {
      if(this.appletSettings?.DEFAULT_ORIENTATION === 'VERTICAL'){
        this.orientation = true;
      } else {
        this.orientation = false;
      }
    }
    return this.orientation;
  }

  // --------------------------------------------------------------------------- //

  ngOnDestroy() {
    if (this.matTab) {
      this.viewColFacade.updateInstance<LocalState>(this.index, {
        ...this.localState,
        selectedIndex: this.matTab.selectedIndex,
        accountSelectedIndex: this.account.matTab.selectedIndex,
        selectedSearchIndex: this.searchInvoice.matTab.selectedIndex // Set the property conditionally
      });
    }

    if(this.orientation) {
      this.savePanelState();
      this.store.dispatch(InternalSalesReturnActions.resetExpansionPanel({ resetIndex: null }));
    }
    this.subs.unsubscribe();
  }

  isNotShadow() {
    return !(this.hdr.bl_fi_generic_doc_hdr.forex_doc_hdr_guid);
   }

  validateInput(): boolean {
    if (!this.main.validateSalesAgent()) {
      this.toastr.error(
        "Please select a Sales Agent to proceed.",
        "Sales Agent Required",
        {
          tapToDismiss: true,
          progressBar: true,
          timeOut: 3000,
        }
      );
      return false;
    } else {
      return true;
    }
  }

  goToAddSettlementAdjustment() {
    if (this.orientation) {
      this.savePanelState();
    }
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState,
      deactivateAdd: true,
      deactivateReturn: true,
      deactivateList: true,
    });
    this.viewColFacade.onNextAndReset(this.index, 46);
  }

  goToEditSettlementAdjustment(payment: bl_fi_generic_doc_line_RowClass) {
    if (payment && !this.localState.deactivateList) {
      this.store.dispatch(
        InternalSalesReturnActions.selectSettlementAdjustment({ settlementAdjustment: payment })
      );
      this.viewColFacade.updateInstance(this.index, {
        ...this.localState,
        deactivateAdd: true,
        deactivateReturn: true,
        deactivateList: false,
        selectedLine: payment.guid,
      });
      this.viewColFacade.onNextAndReset(this.index, 47);
    }
  }

}
