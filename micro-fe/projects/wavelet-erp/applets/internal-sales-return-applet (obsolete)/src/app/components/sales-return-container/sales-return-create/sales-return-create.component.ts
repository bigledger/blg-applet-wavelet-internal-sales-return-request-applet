import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { bl_fi_generic_doc_line_RowClass } from 'blg-akaun-ts-lib';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from '../../../facades/view-column.facade';
import { BillingAddress, BillingInfo, ShippingAddress, ShippingInfo, SIDepartment, SIMain, SIPosting } from '../../../models/sales-return.model';
import { HDRActions } from '../../../state-controllers/draft-controller/store/actions';
import { HDRSelectors } from '../../../state-controllers/draft-controller/store/selectors';
import { DraftStates } from '../../../state-controllers/draft-controller/store/states';
import { SalesReturnActions } from '../../../state-controllers/sales-return-controller/store/actions';
import { SalesReturnStates } from '../../../state-controllers/sales-return-controller/store/states';
import { SalesReturnAccountComponent } from './account/account.component';
import { LineItemListingComponent } from './line-item/line-item-listing.component';
import { SalesReturnMainComponent } from './main-details/main-details.component';

interface LocalState {
  deactivateReturn: boolean;
  deactivateAdd: boolean;
  deactivateList: boolean;
  selectedIndex: number;
  accountSelectedIndex: number;
  selectedLine: any;
}

@Component({
  selector: 'app-sales-return-create',
  templateUrl: './sales-return-create.component.html',
  styleUrls: ['./sales-return-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class SalesReturnCreateComponent extends ViewColumnComponent {

  protected subs = new SubSink();

  protected compName = 'Sales Return Create';
  protected readonly index = 1;
  protected localState: LocalState;
  protected prevLocalState: any;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateReturn$ = this.componentStore.select(state => state.deactivateReturn);
  readonly selectedIndex$ = this.componentStore.select(state => state.selectedIndex);
  readonly accountSelectedIndex$ = this.componentStore.select(state => state.accountSelectedIndex);

  draft$ = this.draftStore.select(HDRSelectors.selectHdr);
  // pns$ = this.draftStore.select(PNSSelectors.selectAll);
  // payment$ = this.draftStore.select(PaymentSelectors.selectAll);

  prevIndex: number;
  apiVisa = AppConfig.apiVisa;
  viewMode: string;

  @ViewChild(MatTabGroup) matTab: MatTabGroup;
  @ViewChild(SalesReturnAccountComponent) account: SalesReturnAccountComponent;
  @ViewChild(SalesReturnMainComponent) main: SalesReturnMainComponent;
  @ViewChild(LineItemListingComponent) lines: LineItemListingComponent;

  constructor(
    private viewColFacade: ViewColumnFacade,
    private readonly componentStore: ComponentStore<LocalState>,
    protected readonly draftStore: Store<DraftStates>,
    protected readonly store: Store<SalesReturnStates>) {
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

  onUpdateMain(form: SIMain) {
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

  onUpdateDepartmentInfo(form: SIDepartment) {
    this.draftStore.dispatch(HDRActions.updateDepartment({ form }));
  }

  onUpdatePostingInfo(form: SIPosting) {
    this.draftStore.dispatch(HDRActions.updatePosting({ form }));
  }

  onReset() {
    this.viewColFacade.resetDraft(true);
  }

  disableCreate() {
    return this.main?.form.invalid || !this.lines?.rowData.length || this.account?.entity?.form.invalid;
  }

  onCreate() {
    this.store.dispatch(SalesReturnActions.createSalesReturnsInit());
  }

  goToSelectSalesAgent() {
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState,
      deactivateReturn: true,
      deactivateAdd: true,
      deactivateList: true
    });
    this.viewColFacade.onNextAndReset(this.index, 3);
  }

  goToSelectMember() {
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState,
      deactivateReturn: true,
      deactivateAdd: true,
      deactivateList: true
    });
    this.viewColFacade.onNextAndReset(this.index, 18);
  }

  goToSelectEntity() {
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState,
      deactivateReturn: true,
      deactivateAdd: true,
      deactivateList: true
    });
    this.viewColFacade.onNextAndReset(this.index, 4);
  }

  goToSelectBilling() {
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState,
      deactivateReturn: true,
      deactivateAdd: true,
      deactivateList: true
    });
    this.viewColFacade.onNextAndReset(this.index, 5);
  }

  goToSelectShipping() {
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState,
      deactivateReturn: true,
      deactivateAdd: true,
      deactivateList: true
    });
    this.viewColFacade.onNextAndReset(this.index, 6);
  }

  goToLineItemCreate() {
    this.store.dispatch(SalesReturnActions.selectMode({ mode: 'create' }))
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState,
      deactivateAdd: true,
      deactivateReturn: true,
      deactivateList: true
    });
    this.viewColFacade.onNextAndReset(this.index, 7);
  }

  goToLineItemEdit(item: bl_fi_generic_doc_line_RowClass) {
    if (item && !this.localState.deactivateList) {
      const lineItem = { ...item };
      this.store.dispatch(SalesReturnActions.selectLineItem({ lineItem }));
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

  goToPaymentCreate() {
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState,
      deactivateAdd: true,
      deactivateReturn: true,
      deactivateList: true
    });
    this.viewColFacade.onNextAndReset(this.index, 10);
  }

  goToPaymentEdit(payment: bl_fi_generic_doc_line_RowClass) {
    if (payment && !this.localState.deactivateList) {
      this.store.dispatch(SalesReturnActions.selectPayment({ payment }))
      this.viewColFacade.updateInstance(this.index, {
        ...this.localState,
        deactivateAdd: true,
        deactivateReturn: true,
        deactivateList: false,
        selectedLine: payment.guid
      });
      this.viewColFacade.onNextAndReset(this.index, 11);
    }
  }

  onReturn() {
    this.viewColFacade.updateInstance<LocalState>(this.prevIndex, {
      ...this.prevLocalState,
      deactivateAdd: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  ngOnDestroy() {
    if (this.matTab) {
      this.viewColFacade.updateInstance<LocalState>(this.index, {
        ...this.localState,
        selectedIndex: this.matTab.selectedIndex,
        accountSelectedIndex: this.account.matTab.selectedIndex,
      });
    }
    this.subs.unsubscribe();
  }

}