import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { EMPTY, iif, of } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from '../../../../facades/view-column.facade';
import { SalesReturnActions } from '../../../../state-controllers/sales-return-controller/store/actions';
import { SalesReturnSelectors } from '../../../../state-controllers/sales-return-controller/store/selectors';
import { SalesReturnStates } from '../../../../state-controllers/sales-return-controller/store/states';

interface LocalState {
  deactivateReturn: boolean;
  deleteConfirmation: boolean;
}

@Component({
  selector: 'app-edit-contra',
  templateUrl: './edit-contra.component.html',
  styleUrls: ['./edit-contra.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class EditContraComponent extends ViewColumnComponent {

  protected subs = new SubSink();

  protected compName = 'Edit Contra';
  protected index = 17;
  protected localState: LocalState;
  protected prevLocalState: any;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateReturn$ = this.componentStore.select(state => state.deactivateReturn);
  readonly deleteConfirmation$ = this.componentStore.select(state => state.deleteConfirmation);

  contraLink$ = this.store.select(SalesReturnSelectors.selectContraLink);

  prevIndex: number;
  form: FormGroup;

  leftColControls = [
    // {label: 'Branch', formControl: 'branch', type: 'text', readonly: true},
    // {label: 'Doc No', formControl: 'docNo', type: 'text', readonly: true},
    { label: 'Server Doc Type', formControl: 'serverDocType', type: 'text', readonly: true },
    { label: 'Doc Date', formControl: 'docDate', type: 'text', readonly: true },
    { label: 'Transaction Date', formControl: 'transactionDate', type: 'date', readonly: true },
    { label: 'Contra Amount', formControl: 'contraAmount', type: 'text', readonly: true },
  ];

  deleteConfirmation = false;

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
      // branch: new FormControl(),
      // docNo: new FormControl(),
      serverDocType: new FormControl(),
      docDate: new FormControl(),
      transactionDate: new FormControl(new Date()),
      contraAmount: new FormControl(),
    });
    this.subs.sink = this.contraLink$.subscribe({
      next: resolve => {
        this.form.patchValue({
          // branch: resolve.bl_fi_generic_doc_arap_contra.code_branch,
          // docNo: resolve.bl_fi_generic_doc_arap_contra.server_doc_1,
          serverDocType: resolve.bl_fi_generic_doc_arap_contra.server_doc_type_doc_2,
          docDate: resolve.bl_fi_generic_doc_arap_contra.date_doc_2,
          transactionDate: resolve.bl_fi_generic_doc_arap_contra.date_txn,
          contraAmount: resolve.bl_fi_generic_doc_arap_contra.amount_contra,
        });
      }
    });
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
  }

  onDelete() {
    if (this.deleteConfirmation) {
      this.deleteConfirmation = false;
      this.componentStore.patchState({ deleteConfirmation: false });
      this.store.dispatch(SalesReturnActions.deleteContraInit());
      // this.store.dispatch(PurchaseReturnActions.selectContraLink({ link: null }));
      // this.viewColFacade.deleteContraMethod(this.link.bl_fi_generic_doc_arap_contra.guid?, this.prevIndex);
    } else {
      this.deleteConfirmation = true;
      this.componentStore.patchState({ deleteConfirmation: true });
    }
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
