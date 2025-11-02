import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { EMPTY, iif, of } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from '../../../../facades/view-column.facade';
import { InternalSalesReturnActions } from '../../../../state-controllers/internal-sales-return-controller/store/actions';
import { InternalSalesReturnSelectors } from '../../../../state-controllers/internal-sales-return-controller/store/selectors';
import { InternalSalesReturnStates } from '../../../../state-controllers/internal-sales-return-controller/store/states';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppletSettings } from '../../../../models/applet-settings.model';
import {DocumentShortCodesClass} from "blg-akaun-ts-lib";
import {UtilitiesModule} from "../../../../../../../../../shared-utilities/utilities/utilities.module";


interface LocalState {
  deactivateReturn: boolean;
  deleteConfirmation: boolean;
}

@Component({
  selector: 'app-internal-sales-return-edit-contra',
  templateUrl: './edit-contra.component.html',
  styleUrls: ['./edit-contra.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class EditContraComponent extends ViewColumnComponent {

  EDIT_CONTRA_TXN_DATE: boolean;
  enableSave = false;
  appletSettings$ = combineLatest([
    this.sessionStore.select(SessionSelectors.selectMasterSettings),
    this.sessionStore.select(SessionSelectors.selectPersonalSettings)
  ]).pipe(map(([a, b]) => ({ ...a, ...b })));

  protected subs = new SubSink();

  protected compName = 'EditnContra';
  protected index = 16;
  protected localState: LocalState;
  protected prevLocalState: any;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateReturn$ = this.componentStore.select(state => state.deactivateReturn);
  readonly deleteConfirmation$ = this.componentStore.select(state => state.deleteConfirmation);

  contraLink$ = this.store.select(InternalSalesReturnSelectors.selectContraLink);

  contraDoc$ = this.store.select(InternalSalesReturnSelectors.selectContraDoc);

  prevIndex: number;
  form: FormGroup;

  leftColControls;

  deleteConfirmation = false;
  docArapBalance;
  contraAmountToBeMultipliedWith;
  arapBalance;
  contraGuid;
  guid_doc_1_hdr;

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

    this.subs.sink = this.appletSettings$.subscribe((resolve: AppletSettings) => {
      this.EDIT_CONTRA_TXN_DATE = resolve?.EDIT_CONTRA_TXN_DATE;
    });

    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.form = new FormGroup({
      docShortCode: new FormControl(),
      docNo: new FormControl(),
      serverDocType: new FormControl(),
      docDate: new FormControl(),
      transactionDate: new FormControl(new Date()),
      contraAmount: new FormControl('', [Validators.required, Validators.pattern(/^\d*\.?\d+$/)]),
      docArapBalance: new FormControl(),
      arapBalance : new FormControl(),
      newDocArapBalance: new FormControl(),
    });

    this.leftColControls = [
      { label: 'Doc Date', formControl: 'docDate', type: 'date', readonly: true },
      { label: 'Transaction Date', formControl: 'transactionDate', type: 'date', readonly: !this.EDIT_CONTRA_TXN_DATE },
      { label: 'Contra Document Ar/Ap Balance', formControl: 'arapBalance', type: 'text', readonly: true },
      { label: 'PDN Doc ARAP Balance', formControl: 'docArapBalance', type: 'text', readonly: true },
      { label: 'Contra Amount', formControl: 'contraAmount', type: 'text', readonly: true },
    ];

    this.store.select(InternalSalesReturnSelectors.selectedDocArapBalance).subscribe(data => {
      this.docArapBalance = data;
      this.form.patchValue({
        docArapBalance: data?.toFixed(2),
      });
    });

    // this.subs.sink = this.contraDoc$.subscribe({
    //   next: resolve => {
    //   this.arapBalance = resolve['arap_bal'];
    //   console.log("Contra doc -->",resolve);
    //   this.form.patchValue({
    //   docNo: resolve['server_doc_1'].toString(),
    //   branch: resolve['code_branch'],
    //   arapBalance: resolve['arap_bal']
    //   });
    //   }
    // });

    this.subs.sink = this.contraLink$.subscribe({
      next: (resolve: any) => {
        this.arapBalance = resolve.amount_contra;
        this.contraGuid = resolve.guid;
        this.guid_doc_1_hdr = resolve.docHdrGuid;
        this.form.patchValue({
          docShortCode: DocumentShortCodesClass.serverDocTypeToShortCodeMapper(resolve.server_doc_type_doc_2?.toString()),
          docNo: resolve?.bl_fi_generic_doc_hdr_server_doc_1,
          arapBalance: resolve.amount_contra,
          serverDocType: resolve.server_doc_type_doc_2,
          docDate: UtilitiesModule.dateFormatter(resolve.date_doc_2),
          transactionDate: UtilitiesModule.dateFormatter(resolve.date_txn),
          contraAmount: resolve.amount_contra,
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

  onDateChange() {
    this.enableSave = true;
  }
  onSave() {
    console.log("Trying to update date", this.form.value.transactionDate);
    this.store.dispatch(
      InternalSalesReturnActions.updateContraInit({txn_date: this.form.value.transactionDate})
    );
  }


  onDelete() {
    this.store.dispatch(InternalSalesReturnActions.refreshArapListing({refreshArapListing : true}));
    if (this.deleteConfirmation) {
      this.deleteConfirmation = false;
      this.componentStore.patchState({ deleteConfirmation: false });
      this.store.dispatch(InternalSalesReturnActions.deleteContraInit({guid: this.contraGuid, docHdrGuid: this.guid_doc_1_hdr}));
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
