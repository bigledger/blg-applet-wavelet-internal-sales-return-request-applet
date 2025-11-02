import { formatNumber } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { GenericDocARAPContainerModel } from 'blg-akaun-ts-lib';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from '../../../../../facades/view-column.facade';
import { InternalSalesReturnActions } from '../../../../../state-controllers/internal-sales-return-controller/store/actions';
import { InternalSalesReturnSelectors } from '../../../../../state-controllers/internal-sales-return-controller/store/selectors';
import { InternalSalesReturnStates } from '../../../../../state-controllers/internal-sales-return-controller/store/states';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppletSettings } from '../../../../../models/applet-settings.model';


interface LocalState {
  deactivateReturn: boolean;
}

@Component({
  selector: 'app-internal-sales-return-add-contra',
  templateUrl: './add-contra.component.html',
  styleUrls: ['./add-contra.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class AddContraComponent extends ViewColumnComponent {

  protected subs = new SubSink();

  protected compName = 'Contra Add';
  protected index = 15;
  protected localState: LocalState;
  protected prevLocalState: any;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateReturn$ = this.componentStore.select(state => state.deactivateReturn);

  contraDoc$ = this.store.select(InternalSalesReturnSelectors.selectContraDoc);

  prevIndex: number;
  form: FormGroup;
  selectedTotalExpense;
  docArapBalance;
  contraAmountToBeMultipliedWith;
  arapBalance;

  EDIT_CONTRA_TXN_DATE: boolean;
  appletSettings$ = combineLatest([
    this.sessionStore.select(SessionSelectors.selectMasterSettings),
    this.sessionStore.select(SessionSelectors.selectPersonalSettings)
  ]).pipe(map(([a, b]) => ({ ...a, ...b })));

  leftColControls;

  constructor(
    private sessionStore: Store<SessionStates>,
    private viewColFacade: ViewColumnFacade,
    private readonly store: Store<InternalSalesReturnStates>,
    private readonly componentStore: ComponentStore<LocalState>) {
    super();
  }

  ngOnInit() {
    this.subs.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
 
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.form = new FormGroup({
      branch: new FormControl(),
      docNo: new FormControl(),
      serverDocType: new FormControl(),
      docDate: new FormControl(),
      transactionDate: new FormControl(),
      contraAmount: new FormControl('', [Validators.required, Validators.pattern(/^\d*\.?\d+$/)]),
      docArapBalance: new FormControl(),
      arapBalance : new FormControl(),
      newDocArapBalance: new FormControl(),
    });

    this.subs.sink = this.appletSettings$.subscribe((resolve: AppletSettings) => {
      this.EDIT_CONTRA_TXN_DATE = resolve?.EDIT_CONTRA_TXN_DATE;
    });

    this.leftColControls = [
      { label: 'Doc No', formControl: 'docNo', type: 'text', readonly: true },
      { label: 'Branch', formControl: 'branch', type: 'text', readonly: true },
      { label: 'Server Doc Type', formControl: 'serverDocType', type: 'text', readonly: true },
      { label: 'Doc Date', formControl: 'docDate', type: 'date', readonly: false },
      { label: 'Transaction Date', formControl: 'transactionDate', type: 'date', readonly: !this.EDIT_CONTRA_TXN_DATE },
      { label: 'Contra Document Ar/Ap Balance', formControl: 'arapBalance', type: 'text', readonly: true },
      { label: 'Doc ARAP Balance', formControl: 'docArapBalance', type: 'text', readonly: true },
      { label: 'Contra Amount', formControl: 'contraAmount', type: 'money', readonly: false },
      { label: 'New PV Doc ARAP Balance', formControl: 'newDocArapBalance', type: 'calculation', readonly: true },
    ];

    this.store.select(InternalSalesReturnSelectors.selectedDocArapBalance).subscribe(data => {
      console.log("Doc Arap balance",data);
      this.docArapBalance = data;
      if(this.form){
        this.form.patchValue({
          docArapBalance: data,
        });
      }

    })
    this.subs.sink = this.contraDoc$.subscribe({
      next: resolve => {
        console.log(resolve);
        this.arapBalance = resolve.bl_fi_generic_doc_hdr.arap_bal;
        this.form.patchValue({
          docNo: resolve.bl_fi_generic_doc_hdr.server_doc_1.toString(),
          branch: resolve.bl_fi_generic_doc_hdr.code_branch,
          serverDocType: resolve.bl_fi_generic_doc_hdr.server_doc_type,
          docDate: resolve.bl_fi_generic_doc_hdr.date_txn,
          transactionDate: this.EDIT_CONTRA_TXN_DATE ? new Date() : new Date(resolve.bl_fi_generic_doc_hdr.date_txn).toISOString().split('T')[0],
          arapBalance: resolve.bl_fi_generic_doc_hdr.arap_bal
        });
        // this.form.controls['contraAmount'].setValidators(Validators.compose([
        //   Validators.required, Validators.max((<any>resolve.bl_fi_generic_doc_hdr).arap_bal)]));
      }
    });
  }

  onCalculateFromContraAmount() {
    if(this.arapBalance < 0) {
      this.contraAmountToBeMultipliedWith = -1;
    } else {
      this.contraAmountToBeMultipliedWith = 1;
    }
    const contraAmount = this.form.controls['contraAmount'].value;
    let contraAmountFinal = Number(contraAmount) * this.contraAmountToBeMultipliedWith;
    const newDocArapBalance = Number(this.docArapBalance) + Number(contraAmountFinal)
    
    this.form.patchValue({
      newDocArapBalance : newDocArapBalance
    })
  }

  formatMoney(e: number) {
    this.form.controls['contraAmount'].patchValue(formatNumber(e, 'en-US', '1.2-2').replace(/,/g, ''));
  }

  disableAdd() {
    return this.form.invalid;
  }

  onAdd() {
    this.store.dispatch(InternalSalesReturnActions.refreshArapListing({refreshArapListing : true}));
    const contra = new GenericDocARAPContainerModel();
    if(this.arapBalance < 0) {
      this.contraAmountToBeMultipliedWith = -1;
    } else {
      this.contraAmountToBeMultipliedWith = 1;
    }

    let contraAmount = this.form.value.contraAmount;
    let contraAmountFinal = Number(contraAmount) * this.contraAmountToBeMultipliedWith;
    // only saving contra amt and transaction date for now
    contra.bl_fi_generic_doc_arap_contra.amount_contra = contraAmountFinal;
    contra.bl_fi_generic_doc_arap_contra.date_txn = this.EDIT_CONTRA_TXN_DATE ? this.form.value.transactionDate : this.form.value.docDate;
    // this.store.dispatch(InternalSalesReturnActions.addContraInit({ contra: contra }));
    this.store.dispatch(InternalSalesReturnActions.addContra({ contraDoc: contra }));
    this.store.dispatch(InternalSalesReturnActions.editInternalSalesReturnBeforeContraInit());
    // this.viewColFacade.addContraMethod(contra, this.prevIndex);
  }

  onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateAdd: false,
      deactivateReturn: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}

