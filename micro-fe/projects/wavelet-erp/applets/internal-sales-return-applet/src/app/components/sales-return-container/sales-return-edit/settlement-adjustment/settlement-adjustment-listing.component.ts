import { AfterViewChecked, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { bl_fi_generic_doc_hdr_RowClass, bl_fi_generic_doc_line_RowClass } from 'blg-akaun-ts-lib';
import * as moment from 'moment';
import { Observable, combineLatest, Subject } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { SettlementAdjustmentSelectors, PNSSelectors, SettlementSelectors } from '../../../../state-controllers/draft-controller/store/selectors';
import { SettlementAdjustmentActions } from '../../../../state-controllers/draft-controller/store/actions';
import { DraftStates } from '../../../../state-controllers/draft-controller/store/states';
import { InternalSalesReturnActions } from '../../../../state-controllers/internal-sales-return-controller/store/actions';
import { InternalSalesReturnSelectors } from '../../../../state-controllers/internal-sales-return-controller/store/selectors';
import { InternalSalesReturnStates } from '../../../../state-controllers/internal-sales-return-controller/store/states';
import { UtilitiesModule } from "projects/shared-utilities/utilities/utilities.module";
import { AppletSettings } from '../../../../models/applet-settings.model';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';
import { GridOptions } from 'ag-grid-enterprise';
import { SessionActions } from "projects/shared-utilities/modules/session/session-controller/actions";
import {salesReturnSearchModel} from "../../../../models/advanced-search-models/internal-sales-return.model";

@Component({
  selector: 'app-sales-return-settlement-adjustment-listing',
  templateUrl: './settlement-adjustment-listing.component.html',
  styleUrls: ['./settlement-adjustment-listing.component.scss']
})
export class SettlementAdjustmentListingComponent implements OnInit, OnDestroy {

  @Input() localState: any;
  @Input() draft$: Observable<bl_fi_generic_doc_hdr_RowClass>;
  @Output() settlementaAdjustmentCreate = new EventEmitter();
  @Output() settlementaAdjustmentEdit = new EventEmitter();
  genDocLock$ = this.store.select(InternalSalesReturnSelectors.selectGenDocLock);

  protected subs = new SubSink();

  pns$ = this.draftStore.select(PNSSelectors.selectAll);
  payment$ = this.draftStore.select(SettlementAdjustmentSelectors.selectAll);
  private columnMoveSubject: Subject<void> = new Subject<void>();
  private debounceTimeMs = 500;
  gridOptions: GridOptions | undefined;
  gridApi;
  searchModel = salesReturnSearchModel;
  pns: bl_fi_generic_doc_line_RowClass[];
  rowData: bl_fi_generic_doc_line_RowClass[];
  amountSignumPaymentVoucher = 1;
  totalSettlement;
  docArapBalance;
  editMode;
  docOpenAmount = 0;
  postingStatus;
  status;
  hdr: any;
  genDocLock: boolean;

  appletSettings$ = combineLatest([
    this.sessionStore.select(SessionSelectors.selectMasterSettings),
    this.sessionStore.select(SessionSelectors.selectPersonalSettings)
  ]).pipe(map(([a, b]) => ({ ...a, ...b })));

  ENABLE_EDIT_PAYMENT_DATE: boolean = false;

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
      headerName: 'Date', field: 'date_txn',
      valueFormatter: (params) => moment(params.value).format('YYYY-MM-DD'), floatingFilter: true
    },
    {
      headerName: 'Amount', field: 'amount_net', type: 'numericColumn', floatingFilter: true,
      valueFormatter: (params) => typeof (params.value) === 'number' ? params.value.toFixed(2) : params.value
    },
    { headerName: 'Details', field: 'item_name', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true },
    { headerName: 'Remarks', field: 'item_remarks', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true },
  ];

  total = 0;
  outstanding = 0;
  adjustmentStatus;
  isEdit = false;
  totalAdjustment;
  totalPayment;
  constructor(
    protected readonly draftStore: Store<DraftStates>,
    protected readonly store: Store<InternalSalesReturnStates>,
    private readonly sessionStore: Store<SessionStates>) { }

  ngOnInit() {
    this.gridOptions = {};
    this.subs.sink = combineLatest([
      this.store.select(InternalSalesReturnSelectors.selectEditMode),
      this.genDocLock$,
      this.pns$,
      this.payment$,
      this.appletSettings$,
      this.store.select(InternalSalesReturnSelectors.selectSettlementMethodAdjustment),
      this.draftStore.select(SettlementAdjustmentSelectors.selectTotalSettlementAdjustment),
      this.store.select(InternalSalesReturnSelectors.selectEditAdjustment),
      this.draftStore.select(SettlementSelectors.selectTotalSettlement)
    ]).pipe(
      ).subscribe({next: ([
        mode, lock, pns, paymentAdjustment, appletSettings, settlementMethodAdjustment, totalAdjustment, isEditAdjustment, paymentTotal
      ]:any) => {
        this.isEdit = isEditAdjustment;
        this.editMode = mode;
        this.genDocLock = lock;
        this.pns = pns.filter(x => x.status === 'ACTIVE');
        this.rowData = paymentAdjustment.filter(x => x.status === 'ACTIVE');
        this.ENABLE_EDIT_PAYMENT_DATE = appletSettings?.ENABLE_EDIT_PAYMENT_DATE ? appletSettings.ENABLE_EDIT_PAYMENT_DATE : false;
        this.totalAdjustment = totalAdjustment;
        this.adjustmentStatus = settlementMethodAdjustment?settlementMethodAdjustment?.bl_fi_generic_doc_settlement_method_adjustment.adjustment_status: null;
        this.totalPayment = paymentTotal;
        console.log('paymentTotal =====>', paymentTotal)
        console.log('totalAdjustment =====>', totalAdjustment)
        console.log('isEdit =====>', this.isEdit)
        console.log('disableAdjust =====>', this.disableAdjust())
        console.log('canAddAdjustment =====>', this.canAddAdjustment())
    }});



    this.subs.sink = this.draft$.subscribe(resolve => {
      // if users cannot edit stl date, then stl_date = hdr_date
      if (!this.ENABLE_EDIT_PAYMENT_DATE) {
        for (const row of this.rowData) {
          row.date_txn = resolve.date_txn;
        }
      }
      this.hdr = resolve;
      this.postingStatus = resolve.posting_status;
      this.status = resolve.status;
      this.total = this.rowData.length ? this.rowData.map(r =>
        parseFloat(r.amount_txn?.toString())).reduce((acc, c) =>
          (acc + c)) : 0;
        this.totalSettlement = Number(this.total) * this.amountSignumPaymentVoucher;
        this.store.dispatch(InternalSalesReturnActions.selectTotalSettlement({totalSettlement : this.totalSettlement}))

      if (!this.total) {
        this.total = 0;
        this.totalSettlement = 0;
        this.store.dispatch(InternalSalesReturnActions.selectTotalSettlement({totalSettlement : this.totalSettlement}))
      }


      const debt = this.pns.length ? this.pns.map(r =>
        parseFloat(r.amount_txn?.toString())).reduce((acc, c) =>
          (acc + c)) : 0;
      this.outstanding = debt - this.total;
      if (!this.outstanding) {
        this.outstanding = 0;
      }
      this.store.select(InternalSalesReturnSelectors.selectedDocArapBalance).subscribe(data => {
        this.docArapBalance = data;
      })
      this.store.select(InternalSalesReturnSelectors.selectedDocOpenAmount).subscribe(data => {
        this.docOpenAmount = data;
      })
    });

  }


  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
  }

  onNext() {
    this.settlementaAdjustmentCreate.emit();
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

  onRowClicked(payment: bl_fi_generic_doc_line_RowClass) {
    this.settlementaAdjustmentEdit.emit(payment);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  isForex(){
    return (this.hdr.base_doc_ccy && this.hdr.base_doc_ccy !== this.hdr.doc_ccy);
  }

  getForex(amt) {
    if (this.isForex()) {
      if (this.hdr.base_doc_xrate && this.hdr.base_doc_xrate !== 0) {
        amt = parseFloat(amt) / this.hdr.base_doc_xrate;
      }
      else {
        amt = 0;
      }
      return '(' + this.hdr.base_doc_ccy + ' ' + UtilitiesModule.currencyFormatter(amt) + ')';
    }
    return '';
  }

  getTotal() {
    return UtilitiesModule.currencyFormatter(this.totalSettlement);
  }

  getOpenAmount() {
    return UtilitiesModule.currencyFormatter(this.docOpenAmount);
  }

  getARAP() {
    return UtilitiesModule.currencyFormatter(this.docArapBalance);
  }

  disableAdjust(){
    const totalSettlement = parseFloat(this.totalPayment);
    const totalAdjustment = parseFloat(this.totalAdjustment);
    return !this.isEdit || (totalAdjustment !== totalSettlement);
  }

  canAddAdjustment(){
    const totalSettlement = parseFloat(this.totalPayment);
    const totalAdjustment = parseFloat(this.totalAdjustment);
    return (totalAdjustment !== totalSettlement);
  }


  onAdjust(){
    this.draftStore.dispatch(SettlementAdjustmentActions.adjustSettlement())
  }
}
