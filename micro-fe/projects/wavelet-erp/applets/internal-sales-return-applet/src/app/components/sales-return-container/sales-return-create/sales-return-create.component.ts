import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
// import { MainDetailsComponent } from './main-details/main-details.component';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { bl_fi_generic_doc_line_RowClass, GenericDocARAPContainerModel } from 'blg-akaun-ts-lib';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { debounceTime, distinctUntilChanged, take } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from '../../../facades/view-column.facade';
import { BillingAddress, BillingInfo, ISCNDepartment, ISCNMain, ShippingAddress, ShippingInfo } from '../../../models/internal-sales-return.model';
import { HDRActions } from '../../../state-controllers/draft-controller/store/actions';
import { HDRSelectors, PNSSelectors } from '../../../state-controllers/draft-controller/store/selectors';
import { DraftStates } from '../../../state-controllers/draft-controller/store/states';
import { InternalSalesReturnActions } from '../../../state-controllers/internal-sales-return-controller/store/actions';
import { InternalSalesReturnStates } from '../../../state-controllers/internal-sales-return-controller/store/states';
import { AccountComponent } from './account/account.component';
import { LineItemListingComponent } from './line-item/line-item-listing.component';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { InternalSalesReturnMainComponent } from './main-details/main-details.component';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ColumnViewModelStates } from '../../../state-controllers/sales-return-view-model-controller/store/states';
import { Column4ViewModelActions } from '../../../state-controllers/sales-return-view-model-controller/store/actions';
import { UtilitiesModule } from 'projects/shared-utilities/utilities/utilities.module';

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
  styleUrls: ['./sales-return-create.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class SalesReturnCreateComponent extends ViewColumnComponent {

  protected subs = new SubSink();

  protected compName = 'Internal Sales Return Create';
  protected readonly index = 1;
  protected localState: LocalState;
  protected prevLocalState: any;
  appletSettinsgMain;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateReturn$ = this.componentStore.select(state => state.deactivateReturn);
  readonly selectedIndex$ = this.componentStore.select(state => state.selectedIndex);
  readonly accountSelectedIndex$ = this.componentStore.select(state => state.accountSelectedIndex);

  draft$ = this.draftStore.select(HDRSelectors.selectHdr);
  pns$ = this.draftStore.select(PNSSelectors.selectAll);
  // payment$ = this.draftStore.select(PaymentSelectors.selectAll);

  prevIndex: number;
  apiVisa = AppConfig.apiVisa;
  viewMode: string;

  appletSettings$ = combineLatest([
    this.sessionStore.select(SessionSelectors.selectMasterSettings),
    this.sessionStore.select(SessionSelectors.selectPersonalSettings)
  ]).pipe(map(([a, b]) => ({ ...a, ...b, DEFAULT_BRANCH: b.DEFAULT_BRANCH ? b.DEFAULT_BRANCH: a.DEFAULT_BRANCH, DEFAULT_LOCATION: b.DEFAULT_LOCATION ? b.DEFAULT_LOCATION : a.DEFAULT_LOCATION})));

  @ViewChild(MatTabGroup) matTab: MatTabGroup;
  @ViewChild(AccountComponent) account: AccountComponent;
  @ViewChild(InternalSalesReturnMainComponent) main: InternalSalesReturnMainComponent;
  @ViewChild(LineItemListingComponent) lines: LineItemListingComponent;
  selectedIndex: number;

  constructor(
    private viewModelStore: Store<ColumnViewModelStates>,
    private viewColFacade: ViewColumnFacade,
    private readonly componentStore: ComponentStore<LocalState>,
    protected readonly draftStore: Store<DraftStates>,    
    protected readonly sessionStore: Store<SessionStates>,
    protected readonly store: Store<InternalSalesReturnStates>) {
    super();
  }

  ngOnInit() {
    this.subs.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.subs.sink = this.selectedIndex$.pipe(
      take(1)
    ).subscribe({next: resolve => this.selectedIndex = resolve});
    
    this.sessionStore.select(SessionSelectors.selectMasterSettings).subscribe(data => {      
      this.appletSettinsgMain = data;
    })
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
    this.viewColFacade.resetDraft();
  }

  disableCreate() {
    return this.main?.form.invalid || this.account?.entity?.form.invalid;
  }

  onCreate() {
    this.store.dispatch(InternalSalesReturnActions.createInternalSalesReturnInit());
  }

  goToSelectMember() {
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState,
      deactivateReturn: true,
      deactivateAdd: true,
      deactivateList: true
    });
    this.viewColFacade.onNextAndReset(this.index, 3);
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
    this.store.dispatch(InternalSalesReturnActions.selectMode({ mode: 'create' }))
    this.viewModelStore.dispatch(Column4ViewModelActions.processSerialNumberListing_Reset());
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
      console.log("item",item);
      const lineItem = { ...item };
      console.log("Lineitem", lineItem);
      this.store.dispatch(InternalSalesReturnActions.selectLineItem({ lineItem }));
      if(item.item_sub_type==='SERIAL_NUMBER'){
        this.viewModelStore.dispatch(Column4ViewModelActions.processSerialNumberListing_Reset());
        const hasInvalidSerial = UtilitiesModule.checkSerialValid(<any> item.serial_no);
        //console.log('onLineItemEdit',hasInvalidSerial)
        if(hasInvalidSerial){
          this.viewModelStore.dispatch(Column4ViewModelActions.setSerialNumberTabFieldColor({color: "warn"}));
        }
        this.viewModelStore.dispatch(Column4ViewModelActions.setSerialNumberTab_ScanTab_SerialNumbersListing({serialNumberListing: <any> item.serial_no}));
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
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState,
      deactivateReturn: true,
      deactivateAdd: true,
      deActivateList: true
    });
    this.viewColFacade.onNextAndReset(this.index, 14);
  }

  goToEditContra(contra: GenericDocARAPContainerModel) {
    this.store.dispatch(InternalSalesReturnActions.selectContraLink({ link: contra }));
    if (contra && !this.localState.deactivateList) {
      this.viewColFacade.updateInstance<LocalState>(this.index, {
        ...this.localState,
        deactivateReturn: true,
        deactivateAdd: false,
        deactivateList: false,
      });
      this.viewColFacade.onNextAndReset(this.index, 16);
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
