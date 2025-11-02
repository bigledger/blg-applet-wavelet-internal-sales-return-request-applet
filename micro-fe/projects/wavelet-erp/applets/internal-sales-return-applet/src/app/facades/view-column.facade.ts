import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {
  bl_fi_generic_doc_line_RowClass,
  bl_fi_generic_doc_link_RowClass,
  bl_fi_mst_entity_line_RowClass,
  EntityContainerModel,
  GenericDocContainerModel,
  JsonDatatypeInterface,
  MembershipCardContainerModel,
  bl_fi_generic_doc_arap_contra_RowClass,
} from 'blg-akaun-ts-lib';
import {ToastrService} from 'ngx-toastr';
import {ViewColActions} from 'projects/shared-utilities/application-controller/store/actions';
import {ViewColSelectors} from 'projects/shared-utilities/application-controller/store/selectors';
import {AppStates} from 'projects/shared-utilities/application-controller/store/states';
import {ViewColumnState} from 'projects/shared-utilities/application-controller/store/states/view-col.states';
import {Observable} from 'rxjs';
import {SnackBarConstants} from '../models/constants/snack-bar.constants';
import {CustomerActions} from '../state-controllers/customer-controller/actions';
import {CustomerStates} from '../state-controllers/customer-controller/states';
import {
  ContraActions,
  HDRActions,
  LinkActions,
  PNSActions,
  SettlementActions
} from '../state-controllers/draft-controller/store/actions';
import {DraftStates} from '../state-controllers/draft-controller/store/states';
import {InternalSalesReturnActions} from '../state-controllers/internal-sales-return-controller/store/actions';
import {InternalSalesReturnStates} from '../state-controllers/internal-sales-return-controller/store/states';
import {LineItemActions} from '../state-controllers/line-item-controller/store/actions';
import {LineItemStates} from '../state-controllers/line-item-controller/store/states';
import {ViewCacheActions} from '../state-controllers/view-cache-controller/store/actions';
import {ViewCacheSelectors} from '../state-controllers/view-cache-controller/store/selectors';
import {ViewCacheStates} from '../state-controllers/view-cache-controller/store/states';

@Injectable()
export class ViewColumnFacade {

  viewColState: ViewColumnState;
  internalSalesReturnCache$ = this.viewCacheStore.select(ViewCacheSelectors.selectInternalSalesReturnCache);
  lineItemsCache$ = this.viewCacheStore.select(ViewCacheSelectors.selectLineItemsCache);
  printableFormatSettingsCache$ = this.viewCacheStore.select(ViewCacheSelectors.selectPrintableFormatSettingsCache);
  workflowSettingsCache$ = this.viewCacheStore.select(ViewCacheSelectors.selectWorkflowSettingsCache);
  reasonSettingsViewCache$ = this.viewCacheStore.select(ViewCacheSelectors.selectReasonSettingsCache);
  manualIntercompanyCache$ = this.viewCacheStore.select(ViewCacheSelectors.selectManualIntercompanyTransaction);
  salesReturnFileExportCache$ = this.viewCacheStore.select(ViewCacheSelectors.selectFileExportCache);
  fileImportCache$ = this.viewCacheStore.select(ViewCacheSelectors.selectFileImportCache);

  firstCol$ = this.appStore.select(ViewColSelectors.selectFirstColComp);
  secondCol$ = this.appStore.select(ViewColSelectors.selectSecondColComp);
  breadCrumbs$ = this.appStore.select(ViewColSelectors.selectBreadCrumbs);
  leftDrawer$ = this.appStore.select(ViewColSelectors.selectLeftDrawer);
  rightDrawer$ = this.appStore.select(ViewColSelectors.selectRightDrawer);
  toggleColumn$ = this.appStore.select(ViewColSelectors.selectSingleColumn);
  prevIndex$ = this.appStore.select(ViewColSelectors.selectPrevIndex);
  // For customer
  customerExt$: Observable<EntityContainerModel>;
  customerExtLineItem$: Observable<bl_fi_mst_entity_line_RowClass>;
  draft$: Observable<any>;
  errorLog = [];

  constructor(
    private readonly appStore: Store<AppStates>,
    private readonly viewCacheStore: Store<ViewCacheStates>,
    private readonly isSalesReturnStore: Store<InternalSalesReturnStates>,
    private readonly draftStore: Store<DraftStates>,
    private readonly lineStore: Store<LineItemStates>,
    private router: Router,
    private snackBar: MatSnackBar,
    private toastr: ToastrService,
    private readonly customerExtStore: Store<CustomerStates>
  ) {
    this.appStore.select(ViewColSelectors.selectViewColState).subscribe(resolve => this.viewColState = resolve);
  }

  prevLocalState$ = () => {
    ViewColSelectors.selectPrevLocalState.release();
    return this.appStore.select(ViewColSelectors.selectPrevLocalState);
  };

  setViewColState(state: ViewColumnState) {
    this.appStore.dispatch(ViewColActions.setViewColState({state}));
  }

  onNext(index: number) {
    this.appStore.dispatch(ViewColActions.viewColNext({index}));
  }

  onNextAndReset(curIndex: number, nextIndex: number) {
    this.appStore.dispatch(ViewColActions.viewColNextAndReset({curIndex, nextIndex}));
  }

  onPrev(index: number) {
    this.appStore.dispatch(ViewColActions.viewColPrev({index}));
  }

  updateInstance<T>(index: number, localState: T) {
    this.appStore.dispatch(ViewColActions.viewColUpdateInstance({index, localState}));
  }

  goToIndex(index: number) {
    this.appStore.dispatch(ViewColActions.goToIndex({index}));
  }

  goBackIndex(index: number) {
    this.appStore.dispatch(ViewColActions.viewColRvIndex({index}));
  }

  goForwardIndex(index: number) {
    this.appStore.dispatch(ViewColActions.viewColFwIndex({index}));
  }

  resetIndex(index: number) {
    this.appStore.dispatch(ViewColActions.resetIndex({index}));
  }

  toggleColumn(toggle: boolean) {
    this.appStore.dispatch(ViewColActions.toggleColumn({toggle}));
  }

  selectLocalState(index: number) {
    return this.appStore.select(ViewColSelectors.selectLocalState, index);
  }

  gotoFourOhFour() {
    this.router.navigate(['404']);
  }

  saveInternalSalesReturnState() {
    this.viewCacheStore.dispatch(ViewCacheActions.cacheInternalSalesReturn({cache: this.viewColState}));
  }

  saveLineItemsState() {
    this.viewCacheStore.dispatch(ViewCacheActions.cacheLineItems({cache: this.viewColState}));
  }

  savePrintableFormatSettingsState() {
    this.viewCacheStore.dispatch(ViewCacheActions.cachePrintableFormatSettings({cache: this.viewColState}));
  }

  saveWorkflowSettingsState() {
    this.viewCacheStore.dispatch(ViewCacheActions.cacheWorkflowSettings({cache: this.viewColState}));
  }

  saveReasonSettingsState() {
    this.viewCacheStore.dispatch(ViewCacheActions.cacheReasonSettings({cache: this.viewColState}));
  }

  saveManualIntercompanyTransactionState() {
    this.viewCacheStore.dispatch(ViewCacheActions.cacheManualIntercompanyTransaction({cache: this.viewColState}));
  }

  saveFileExportState() {
    this.viewCacheStore.dispatch(ViewCacheActions.cacheFileExport({cache: this.viewColState}));
  }

  showSuccessToast(message: string) {
    this.toastr.success(
      message,
      'Success',
      {
        tapToDismiss: true,
        progressBar: true,
        timeOut: 2000
      }
    );
  }

  showFailedToast(err) {
    this.toastr.error(
      err.message,
      'Error',
      {
        tapToDismiss: true,
        progressBar: true,
        timeOut: 2000
      }
    );
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, 'Close');
  }

  selectEntity(entity: { entity: EntityContainerModel, contact: bl_fi_mst_entity_line_RowClass }) {
    this.isSalesReturnStore.dispatch(InternalSalesReturnActions.selectEntity({entity}));
    // Default Billing
    if (entity.entity.bl_fi_mst_entity_hdr.addresses_json.billing_address?.length) {
      let billingAddresses = entity.entity.bl_fi_mst_entity_hdr.addresses_json.billing_address;
      billingAddresses.forEach(eachBilling => {
        if (eachBilling.default_address_status || (entity.entity.bl_fi_mst_entity_hdr.addresses_json.billing_address.length == 1)) {
          let defaultBillingAddress = <JsonDatatypeInterface>eachBilling;
          this.isSalesReturnStore.dispatch(InternalSalesReturnActions.selectBillingAddress({billing_address: defaultBillingAddress}));
        }
      })
    }
    // Default Shipping
    if (entity.entity.bl_fi_mst_entity_hdr.addresses_json.shipping_address?.length) {
      let shippingAddreses = entity.entity.bl_fi_mst_entity_hdr.addresses_json.shipping_address;
      shippingAddreses.forEach(eachShipping => {
        if (eachShipping.default_address_status || entity.entity.bl_fi_mst_entity_hdr.addresses_json.shipping_address.length == 1) {
          let defaultShippingAddress = <JsonDatatypeInterface>eachShipping;
          this.isSalesReturnStore.dispatch(InternalSalesReturnActions.selectShippingAddress({shipping_address: defaultShippingAddress}));
        }
      })
    }
    this.snackBar.open(`Some fields have been reset`, 'Close');
  }

  selectMember(member: MembershipCardContainerModel) {
    this.isSalesReturnStore.dispatch(InternalSalesReturnActions.selectMember({member}));
    this.showSnackBar(SnackBarConstants.memberResetEffects);
  }

  addLineItem(line: bl_fi_generic_doc_line_RowClass, mode: string) {
    this.draftStore.dispatch(PNSActions.addPNS({pns: line}));
    if (mode === 'create')
      this.resetIndex(1);
    else if (mode === 'edit')
      this.resetIndex(2);
    this.snackBar.open(`Line Item Added`, 'Close');
    this.isSalesReturnStore.dispatch(InternalSalesReturnActions.recalculateDocBalance());
  }

  editLineItem(line: bl_fi_generic_doc_line_RowClass, diffLine: bl_fi_generic_doc_line_RowClass, pageIndex: number) {
    this.draftStore.dispatch(PNSActions.editPNS({pns: line}));
    this.draftStore.dispatch(HDRActions.updateBalance({pns: diffLine}));
    if (pageIndex === 1)
      this.resetIndex(1);
    else if (pageIndex === 2)
      this.resetIndex(2);
    this.snackBar.open(`Line Item Edited`, 'Close');
    this.isSalesReturnStore.dispatch(InternalSalesReturnActions.recalculateDocBalance());
  }

  addLink(link: bl_fi_generic_doc_link_RowClass) {
    this.draftStore.dispatch(LinkActions.addLink({link}));
  }

  editLink(link: bl_fi_generic_doc_link_RowClass) {
    this.draftStore.dispatch(LinkActions.editLink({link}));
  }

  deleteLink(guid: string) {
    this.draftStore.dispatch(LinkActions.deleteLink({guid}));
  }

  deleteExistingLine(line: bl_fi_generic_doc_line_RowClass, diffLine: bl_fi_generic_doc_line_RowClass) {
    this.draftStore.dispatch(PNSActions.editPNS({pns: line})); // Update line with status DELETED
    this.draftStore.dispatch(HDRActions.updateBalance({pns: diffLine})); // Update HDR pricing
    this.resetIndex(2);
    this.snackBar.open(`Line Item Deleted`, 'Close');
    this.isSalesReturnStore.dispatch(InternalSalesReturnActions.recalculateDocBalance());
  }

  deleteLine(guid: string, diffLine: bl_fi_generic_doc_line_RowClass, pageIndex: number) {
    this.draftStore.dispatch(PNSActions.deletePNS({guid})); // Remove from line array entirely
    this.draftStore.dispatch(HDRActions.updateBalance({pns: diffLine})); // Update HDR pricing
    if (pageIndex === 1)
      this.resetIndex(1);
    else if (pageIndex === 2)
      this.resetIndex(2);
    this.snackBar.open(`Line Item Deleted`, 'Close');
    this.isSalesReturnStore.dispatch(InternalSalesReturnActions.recalculateDocBalance());
  }

  editGenDocLine(genDoc: GenericDocContainerModel) {
    this.lineStore.dispatch(LineItemActions.editGenLineItemInit({genDoc}));
    this.isSalesReturnStore.dispatch(InternalSalesReturnActions.recalculateDocBalance());
  }

  addSettlementMethod(line: bl_fi_generic_doc_line_RowClass, pageIndex: number) {
    this.draftStore.dispatch(SettlementActions.addSettlmentInit({settlement: line, pageIndex: pageIndex}));
    this.isSalesReturnStore.dispatch(InternalSalesReturnActions.recalculateDocBalance());
  }

  editSettlementMethod(line: bl_fi_generic_doc_line_RowClass, diffAmt: any, pageIndex: number) {
    this.draftStore.dispatch(SettlementActions.editSettlementInit({
      settlement: line,
      diffAmt: diffAmt,
      pageIndex: pageIndex
    }));
    this.isSalesReturnStore.dispatch(InternalSalesReturnActions.recalculateDocBalance());
  }

  deleteExistingSettlementMethod(line: bl_fi_generic_doc_line_RowClass, diffAmt: any) {
    this.draftStore.dispatch(SettlementActions.deleteExistingSettlementInit({settlement: line, diffAmt: diffAmt}));
    this.isSalesReturnStore.dispatch(InternalSalesReturnActions.recalculateDocBalance());
  }

  deleteSettlementMethod(guid: string, diffAmt: any, pageIndex: number) {
    this.draftStore.dispatch(SettlementActions.deleteSettlementInit({
      guid: guid,
      diffAmt: diffAmt,
      pageIndex: pageIndex
    }));
    this.isSalesReturnStore.dispatch(InternalSalesReturnActions.recalculateDocBalance());
  }

  resetDraft(showMessage?: boolean) {
    this.isSalesReturnStore.dispatch(InternalSalesReturnActions.resetDraft());
    if (showMessage)
      this.snackBar.open(`Sales Return Reset`, 'Close');
    this.isSalesReturnStore.dispatch(InternalSalesReturnActions.recalculateDocBalance());
  }

  addContra(contra: bl_fi_generic_doc_arap_contra_RowClass) {
    this.draftStore.dispatch(ContraActions.addContra({contra}));
    this.isSalesReturnStore.dispatch(InternalSalesReturnActions.editedGenDoc({edited: true}));
    this.isSalesReturnStore.dispatch(InternalSalesReturnActions.recalculateDocBalance());
    this.isSalesReturnStore.dispatch(InternalSalesReturnActions.refreshArapListing({refreshArapListing: true}));
  }

  deleteContra(guid: string) {
    this.draftStore.dispatch(ContraActions.deleteContra({guid}));
    this.isSalesReturnStore.dispatch(InternalSalesReturnActions.editedGenDoc({edited: true}));
    this.isSalesReturnStore.dispatch(InternalSalesReturnActions.recalculateDocBalance());
    this.isSalesReturnStore.dispatch(InternalSalesReturnActions.refreshArapListing({refreshArapListing: true}));
  }

  createCustomer(customerExt: EntityContainerModel) {
    this.customerExtStore.dispatch(CustomerActions.createCustomer({customerExt}));
    this.customerExtStore.dispatch(CustomerActions.resetDraft());
    this.updateInstance(0, {
      deactivateAdd: false,
      deactivateList: false
    });
    this.resetIndex(4);
  }

  startDraft() {
    this.customerExtStore.dispatch(CustomerActions.startDraft());
  }

  updateDraftHdr(entity: EntityContainerModel) {
    this.customerExtStore.dispatch(CustomerActions.updateDraft({entity, line: null}));
  }

  updateMainOnKOImport(genDocHdr: GenericDocContainerModel) {
    this.draftStore.dispatch(HDRActions.updateMainOnKOImport({genDocHdr}));
  }

  saveFileImportState() {
    this.viewCacheStore.dispatch(ViewCacheActions.cacheFileImport({ cache: this.viewColState }));
  }


}
