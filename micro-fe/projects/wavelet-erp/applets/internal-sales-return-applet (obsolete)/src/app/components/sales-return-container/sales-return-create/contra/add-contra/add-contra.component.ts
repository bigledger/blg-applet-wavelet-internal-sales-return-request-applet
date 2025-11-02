import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { GenericDocARAPContainerModel } from 'blg-akaun-ts-lib';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from '../../../../../facades/view-column.facade';
import { SalesReturnStates } from '../../../../../state-controllers/sales-return-controller/store/states';
import { SalesReturnActions } from '../../../../../state-controllers/sales-return-controller/store/actions';
import { SalesReturnSelectors } from '../../../../../state-controllers/sales-return-controller/store/selectors';
import { formatMoneyInForm } from 'projects/shared-utilities/format.utils';

interface LocalState {
  deactivateReturn: boolean;
}

@Component({
  selector: 'app-internal-sales-return-add-contra',
  templateUrl: './add-contra.component.html',
  styleUrls: ['./add-contra.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class AddContraComponent extends ViewColumnComponent {

  protected subs = new SubSink();

  protected compName = 'Add Contra';
  protected index = 16;
  protected localState: LocalState;
  protected prevLocalState: any;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateReturn$ = this.componentStore.select(state => state.deactivateReturn);

  contraDoc$ = this.store.select(SalesReturnSelectors.selectContraDoc);

  prevIndex: number;
  form: FormGroup;

  leftColControls = [
    { label: 'Doc No', formControl: 'docNo', type: 'text', readonly: true },
    { label: 'Branch', formControl: 'branch', type: 'text', readonly: true },
    { label: 'Server Doc Type', formControl: 'serverDocType', type: 'text', readonly: true },
    { label: 'Doc Date', formControl: 'docDate', type: 'date', readonly: false },
    { label: 'Transaction Date', formControl: 'transactionDate', type: 'date', readonly: false },
    { label: 'Contra Amount', formControl: 'contraAmount', type: 'money', readonly: false },
  ];

  constructor(
    private viewColFacade: ViewColumnFacade,
    private readonly store: Store<SalesReturnStates>,
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
      transactionDate: new FormControl(new Date()),
      contraAmount: new FormControl(),
    });
    this.subs.sink = this.contraDoc$.subscribe({
      next: resolve => {
        console.log(resolve);
        this.form.patchValue({
          docNo: resolve.bl_fi_generic_doc_hdr.server_doc_1.toString(),
          branch: resolve.bl_fi_generic_doc_hdr.code_branch,
          serverDocType: resolve.bl_fi_generic_doc_hdr.server_doc_type,
          docDate: resolve.bl_fi_generic_doc_hdr.date_txn,
        });
        this.form.controls['contraAmount'].setValidators(Validators.compose([
          Validators.required, Validators.max((<any>resolve.bl_fi_generic_doc_hdr).arap_bal)]));
      }
    });
  }

  formatMoney(e: number) {
    this.form.controls['contraAmount'].patchValue(formatMoneyInForm(e));
  }

  disableAdd() {
    return this.form.invalid;
  }

  onAdd() {
    const contra = new GenericDocARAPContainerModel();
    // only saving contra amt and transaction date for now
    contra.bl_fi_generic_doc_arap_contra.amount_contra = this.form.value.contraAmount;
    contra.bl_fi_generic_doc_arap_contra.date_txn = this.form.value.transactionDate;
    this.store.dispatch(SalesReturnActions.addContraInit({ contraDoc: contra }));
    // this.viewColFacade.addContraMethod(contra, this.prevIndex);
  }

  onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateReturn: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}