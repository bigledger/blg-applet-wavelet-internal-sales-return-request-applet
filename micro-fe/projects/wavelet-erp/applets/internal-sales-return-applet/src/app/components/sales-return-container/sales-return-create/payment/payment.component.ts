import { AfterViewChecked, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { bl_fi_generic_doc_hdr_RowClass, bl_fi_generic_doc_line_RowClass } from 'blg-akaun-ts-lib';
import * as moment from 'moment';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { salesReturnSearchModel } from '../../../../models/advanced-search-models/internal-sales-return.model';
import { PNSSelectors, SettlementSelectors } from '../../../../state-controllers/draft-controller/store/selectors';
import { DraftStates } from '../../../../state-controllers/draft-controller/store/states';
import { InternalSalesReturnStates } from '../../../../state-controllers/internal-sales-return-controller/store/states';
import { InternalSalesReturnActions } from '../../../../state-controllers/internal-sales-return-controller/store/actions';
import { InternalSalesReturnSelectors } from '../../../../state-controllers/internal-sales-return-controller/store/selectors';
import { AppletSettings } from '../../../../models/applet-settings.model';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';

@Component({
  selector: 'app-internal-sales-return-payment-listing',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, OnDestroy {

  @Input() localState: any;
  @Input() draft$: Observable<bl_fi_generic_doc_hdr_RowClass>;
  @Output() settlementCreate = new EventEmitter();
  @Output() settlementEdit = new EventEmitter();

  protected subs = new SubSink();

  pns$ = this.draftStore.select(PNSSelectors.selectAll);
  settlement$ = this.draftStore.select(SettlementSelectors.selectAll);
  genDocLock$ = this.store.select(InternalSalesReturnSelectors.selectGenDocLock);

  gridApi;
  searchModel = salesReturnSearchModel;
  pns: bl_fi_generic_doc_line_RowClass[];
  rowData: bl_fi_generic_doc_line_RowClass[];
  postingStatus;
  status;
  amountSignumPaymentVoucher = 1;
  totalSettlement;
  docArapBalance;
  docOpenAmount;
  editMode;
  genDocLock: boolean;

  ENABLE_EDIT_PAYMENT_DATE: boolean;

  appletSettings$ = combineLatest([
    this.sessionStore.select(SessionSelectors.selectMasterSettings),
    this.sessionStore.select(SessionSelectors.selectPersonalSettings)
  ]).pipe(map(([a, b]) => ({ ...a, ...b })));

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilterComponentParams: { suppressFilterButton: true },
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true,
  };

  columnsDefs = [
    {
      headerName: 'Date', field: 'date_txn', type: 'rightAligned',
      valueFormatter: (params) => moment(params.value).format('YYYY-MM-DD'), floatingFilter: true
    },
    {
      headerName: 'Amount', field: 'amount_net', type: 'numericColumn', floatingFilter: true,
      valueFormatter: (params) => typeof (params.value) === 'number' ? params.value.toFixed(2) : params.value
    },
    { headerName: 'Details', field: 'item_name', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true },
    { headerName: 'Remarks', field: 'item_remarks', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true },
  ];

  total = '0.00';
  outstanding = '0.00';

  constructor(
    protected readonly draftStore: Store<DraftStates>,
    private readonly store: Store<InternalSalesReturnStates>,
    private readonly sessionStore: Store<SessionStates>,) { }

  ngOnInit() {
    this.subs.sink = this.genDocLock$.subscribe(lock=>{
      this.genDocLock = lock;
    })
    this.subs.sink = this.appletSettings$.subscribe((resolve: AppletSettings) => {
      this.ENABLE_EDIT_PAYMENT_DATE = resolve?.ENABLE_EDIT_PAYMENT_DATE ? resolve.ENABLE_EDIT_PAYMENT_DATE : false;
    })
    this.subs.sink = this.store.select(InternalSalesReturnSelectors.selectEditMode).subscribe(data => {
      this.editMode = data;
    })
    this.subs.sink = this.pns$.subscribe({
      next: resolve => {
        this.pns = resolve.filter(x => x.status === 'ACTIVE');
      }
    })
    this.subs.sink = this.settlement$.subscribe({
      next: resolve => {
        this.rowData = resolve.filter(x => x.status === 'ACTIVE');
      }
    })

    this.subs.sink = this.draft$.subscribe(resolve => {
      // if users cannot edit stl date, then stl_date = hdr_date
      if (!this.ENABLE_EDIT_PAYMENT_DATE) {
        for (const row of this.rowData) {
          row.date_txn = resolve.date_txn;
        }
      }
      this.postingStatus = resolve.posting_status;
      this.status = resolve.status;
      this.total = this.rowData.length ? this.rowData.map(r =>
        parseFloat(r.amount_txn?.toString())).reduce((acc, c) =>
          (acc + c)).toFixed(2) : '0.00';
      this.totalSettlement = Number(this.total) * this.amountSignumPaymentVoucher;
      this.store.dispatch(InternalSalesReturnActions.selectTotalSettlement({ totalSettlement: this.totalSettlement }))
      if (this.total === 'NaN') {
        this.total = '0.00';
      }
      const debt = this.pns.length ? this.pns.map(r =>
        parseFloat(r.amount_txn?.toString())).reduce((acc, c) =>
          (acc + c)).toFixed(2) : '0.00';
      this.outstanding = (parseFloat(debt) - parseFloat(this.total)).toFixed(2);
      if (this.outstanding === 'NaN') {
        this.outstanding = '0.00';
      }

      this.subs.sink = this.store.select(InternalSalesReturnSelectors.selectedDocArapBalance).subscribe(data => {
        this.docArapBalance = data;
      })

      this.subs.sink = this.store.select(InternalSalesReturnSelectors.selectedDocOpenAmount).subscribe(data => {
        this.docOpenAmount = data;
      })
    });

  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.gridApi.forEachNode(a => {
      if (a.data.guid === this.localState.selectedLine) {
        a.setSelected(true);
      }
    });
  }

  onNext() {
    this.settlementCreate.emit();
  }

  posting() {
    if(this.genDocLock){
      return false;
    }
    
    if ((this.postingStatus === 'FINAL' || this.postingStatus === 'VOID' || this.postingStatus === 'DISCARDED') || (this.status !== "ACTIVE" && this.status !== "TEMP" && this.status !== null)) {
      return false;
    }
    else {
      return true;
    }
  }

  onRowClicked(settlement: bl_fi_generic_doc_line_RowClass) {
    this.settlementEdit.emit(settlement);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
