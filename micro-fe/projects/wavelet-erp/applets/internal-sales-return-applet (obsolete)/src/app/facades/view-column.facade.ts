import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { 
  bl_fi_generic_doc_line_RowClass,
  bl_fi_generic_doc_link_RowClass,
  bl_fi_mst_entity_line_RowClass,
  EntityContainerModel,
  GenericDocContainerModel 
} from 'blg-akaun-ts-lib';
import { ToastrService } from 'ngx-toastr';
import { ViewColActions } from 'projects/shared-utilities/application-controller/store/actions';
import { ViewColSelectors } from 'projects/shared-utilities/application-controller/store/selectors';
import { AppStates } from 'projects/shared-utilities/application-controller/store/states';
import { ViewColumnState } from 'projects/shared-utilities/application-controller/store/states/view-col.states';
import { HDRActions, LinkActions, PaymentActions, PNSActions } from '../state-controllers/draft-controller/store/actions';
import { DraftStates } from '../state-controllers/draft-controller/store/states';
import { LineItemActions } from '../state-controllers/line-item-controller/store/actions';
import { LineItemStates } from '../state-controllers/line-item-controller/store/states';
import { SalesReturnActions } from '../state-controllers/sales-return-controller/store/actions';
import { SalesReturnStates } from '../state-controllers/sales-return-controller/store/states';
import { ViewCacheActions } from '../state-controllers/view-cache-controller/store/actions';
import { ViewCacheSelectors } from '../state-controllers/view-cache-controller/store/selectors';
import { ViewCacheStates } from '../state-controllers/view-cache-controller/store/states';

@Injectable()
export class ViewColumnFacade {

  viewColState: ViewColumnState;
  salesReturnCache$ = this.viewCacheStore.select(ViewCacheSelectors.selectSICache);
  lineItemsCache$ = this.viewCacheStore.select(ViewCacheSelectors.selectLineItemsCache);
  printableFormatSettingsCache$ = this.viewCacheStore.select(ViewCacheSelectors.selectPrintableFormatSettingsCache);

  firstCol$ = this.appStore.select(ViewColSelectors.selectFirstColComp);
  secondCol$ = this.appStore.select(ViewColSelectors.selectSecondColComp);
  breadCrumbs$ = this.appStore.select(ViewColSelectors.selectBreadCrumbs);
  leftDrawer$ = this.appStore.select(ViewColSelectors.selectLeftDrawer);
  rightDrawer$ = this.appStore.select(ViewColSelectors.selectRightDrawer);
  toggleColumn$ = this.appStore.select(ViewColSelectors.selectSingleColumn);
  prevIndex$ = this.appStore.select(ViewColSelectors.selectPrevIndex);
  prevLocalState$ = () => {
    ViewColSelectors.selectPrevLocalState.release();
    return this.appStore.select(ViewColSelectors.selectPrevLocalState);
  };

  errorLog = [];

  constructor(
    private readonly appStore: Store<AppStates>,
    private readonly viewCacheStore: Store<ViewCacheStates>,
    private readonly prStore: Store<SalesReturnStates>,
    private readonly draftStore: Store<DraftStates>,
    private readonly lineStore: Store<LineItemStates>,
    private router: Router,
    private snackBar: MatSnackBar,
    private toastr: ToastrService
  ) {
    this.appStore.select(ViewColSelectors.selectViewColState).subscribe( resolve => this.viewColState = resolve);
  }

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

  savePRState() {
    this.viewCacheStore.dispatch(ViewCacheActions.cacheSI({ cache: this.viewColState }));
  }
  
  saveLineItemsState() {
    this.viewCacheStore.dispatch(ViewCacheActions.cacheLineItems({ cache: this.viewColState }));
  }

  savePrintableFormatSettingsState() {
    this.viewCacheStore.dispatch(ViewCacheActions.cachePrintableFormatSettings({ cache: this.viewColState }));
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
    this.prStore.dispatch(SalesReturnActions.selectEntity({ entity }));
    this.snackBar.open(`Some fields have been reset`, 'Close');
  }

  addLineItem(line: bl_fi_generic_doc_line_RowClass, mode: string) {  
    this.draftStore.dispatch(PNSActions.addPNS({ pns: line }));
    if (mode === 'create')
      this.resetIndex(1);
    else if (mode === 'edit')
      this.resetIndex(2);
    this.snackBar.open(`Line Item Added`, 'Close');
  }

  editLineItem(line: bl_fi_generic_doc_line_RowClass, diffLine: bl_fi_generic_doc_line_RowClass, pageIndex: number) {
    this.draftStore.dispatch(PNSActions.editPNS({ pns: line }));
    this.draftStore.dispatch(HDRActions.updateBalance({ pns: diffLine }));
    if (pageIndex === 1)
      this.resetIndex(1);
    else if (pageIndex === 2)
      this.resetIndex(2);
    this.snackBar.open(`Line Item Edited`, 'Close');
  }

  addLink(link: bl_fi_generic_doc_link_RowClass) {    
    this.draftStore.dispatch(LinkActions.addLink({ link }));
  }

  editLink(link: bl_fi_generic_doc_link_RowClass) {    
    this.draftStore.dispatch(LinkActions.editLink({ link }));
  }

  deleteLink(guid: string) {
    this.draftStore.dispatch(LinkActions.deleteLink({ guid }));
  }

  deleteExistingLine(line: bl_fi_generic_doc_line_RowClass, diffLine: bl_fi_generic_doc_line_RowClass) {
    this.draftStore.dispatch(PNSActions.editPNS({ pns: line })); // Update line with status DELETED
    this.draftStore.dispatch(HDRActions.updateBalance({ pns: diffLine })); // Update HDR pricing
    this.resetIndex(2); 
    this.snackBar.open(`Line Item Deleted`, 'Close');
  }

  deleteLine(guid: string, diffLine: bl_fi_generic_doc_line_RowClass, pageIndex: number) {
    this.draftStore.dispatch(PNSActions.deletePNS({ guid })); // Remove from line array entirely
    this.draftStore.dispatch(HDRActions.updateBalance({ pns: diffLine })); // Update HDR pricing
    if (pageIndex === 1)
      this.resetIndex(1);
    else if (pageIndex === 2)
      this.resetIndex(2);
    this.snackBar.open(`Line Item Deleted`, 'Close');
  }

  editGenDocLine(genDoc: GenericDocContainerModel) {
    this.lineStore.dispatch(LineItemActions.editGenLineItemInit({ genDoc }));
  }

  addPaymentMethod(line: bl_fi_generic_doc_line_RowClass, pageIndex: number) {
    this.draftStore.dispatch(PaymentActions.addPaymentInit({ payment: line, pageIndex: pageIndex }));
  }

  editPaymentMethod(line: bl_fi_generic_doc_line_RowClass, diffAmt: any, pageIndex: number) {
    this.draftStore.dispatch(PaymentActions.editPaymentInit({ payment: line, diffAmt: diffAmt, pageIndex: pageIndex }));
  }

  deleteExistingPaymentMethod(line: bl_fi_generic_doc_line_RowClass, diffAmt: any) {
    this.draftStore.dispatch(PaymentActions.deleteExistingPaymentInit({ payment: line, diffAmt: diffAmt }));
  }

  deletePaymentMethod(guid: string, diffAmt: any, pageIndex: number) {
    this.draftStore.dispatch(PaymentActions.deletePaymentInit({ guid: guid, diffAmt: diffAmt, pageIndex: pageIndex }));
  }

  resetDraft(showMessage?: boolean) {
    this.prStore.dispatch(SalesReturnActions.resetDraft());
    if (showMessage)
      this.snackBar.open(`Sales Return Reset`, 'Close');
  }

}