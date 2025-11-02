import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { bl_fi_generic_doc_line_RowClass, SettlementMethodContainerModel, SettlementMethodService, Pagination } from 'blg-akaun-ts-lib';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { Subject, EMPTY, iif, of, combineLatest } from 'rxjs';
import { delay, mergeMap, map, takeUntil } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from '../../../../../facades/view-column.facade';
import { HDRSelectors } from '../../../../../state-controllers/draft-controller/store/selectors';
import { DraftStates } from '../../../../../state-controllers/draft-controller/store/states';
import { AppletSettings } from '../../../../../models/applet-settings.model';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';
import {SettlementTypeOptions} from '../../../../../models/constants/settlement-type.constants'
import { SettlementAdjustmentActions } from '../../../../../state-controllers/draft-controller/store/actions';
import { InternalSalesReturnActions } from '../../../../../state-controllers/internal-sales-return-controller/store/actions';
import { InternalSalesReturnSelectors } from '../../../../../state-controllers/internal-sales-return-controller/store/selectors';
import { InternalSalesReturnStates } from '../../../../../state-controllers/internal-sales-return-controller/store/states';


interface LocalState {
  deactivateReturn: boolean;
  deleteConfirmation: boolean;
}

@Component({
  selector: "app-edit-settlement-adjustment",
  templateUrl: "./edit-settlement-adjustment.component.html",
  styleUrls: ["./edit-settlement-adjustment.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore, DatePipe],
})
export class EditSettlementAdjustmentComponent extends ViewColumnComponent {
  protected subs = new SubSink();

  protected compName = 'Edit settlement-adjustment';
  protected index = 47;
  protected localState: LocalState;
  protected prevLocalState: any;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deleteConfirmation$ = this.componentStore.select(state => state.deleteConfirmation);
  readonly payment$ = this.store.select(InternalSalesReturnSelectors.selectSettlementAdjustment);
  readonly order$ = this.store.select(InternalSalesReturnSelectors.selectSalesReturn);

  prevIndex: number;
  payment: bl_fi_generic_doc_line_RowClass;
  deleteConfirmation: boolean;
  apiVisa = AppConfig.apiVisa
  form: FormGroup;
  paymentMethodForm: FormGroup;
  postingStatus;
  status;
  itemGuid;

  settlementList: SettlementMethodContainerModel[];
  settlementListStored: SettlementMethodContainerModel[];
  settlementGroupOptionsFilterCtrl: FormControl = new FormControl();
  settlementTypeOptionsFilterCtrl: FormControl = new FormControl();
  protected _onDestroy = new Subject<void>();
  settlementGroupOptions = SettlementTypeOptions.values;
  settlementContainer: SettlementMethodContainerModel;
  currentSettlementGroup = '';

  draft$ = this.draftStore.select(HDRSelectors.selectHdr);

  years = [...Array(10).keys()].map(i => parseInt(this.datePipe.transform(new Date(), 'yyyy'), 10) + i);

  leftColControls: {
    label: string,
    formControl: string,
    type: string,
    readonly: boolean,
    hint: string,
    hidden?: boolean,
    mandatory?: boolean
  }[] = [];

  appletSettings$ = combineLatest([
    this.sessionStore.select(SessionSelectors.selectMasterSettings),
    this.sessionStore.select(SessionSelectors.selectPersonalSettings)
  ]).pipe(map(([a, b]) => ({ ...a, ...b })));

  HIDE_CARD_NO: boolean;
  HIDE_NAME: boolean;
  HIDE_CARD_ISSUER: boolean;
  HIDE_CARD_EXPIRY: boolean;
  HIDE_APPROVAL_CODE: boolean;
  HIDE_BATCH: boolean;
  HIDE_CARD_TYPE: boolean;
  HIDE_CVV: boolean;

  MANDATORY_CARD_NO: boolean;
  MANDATORY_NAME: boolean;
  MANDATORY_CARD_ISSUER: boolean;
  MANDATORY_CARD_EXPIRY: boolean;
  MANDATORY_APPROVAL_CODE: boolean;
  MANDATORY_BATCH: boolean;
  MANDATORY_CARD_TYPE: boolean;
  MANDATORY_CVV: boolean;

  ENABLE_EDIT_PAYMENT_DATE: boolean = false;

  currSettlementType = '';
  settlementMethod = new FormControl();
  invalid = true;
  selectedBranchGuid: string;

  constructor(
    private viewColFacade: ViewColumnFacade,
    private readonly componentStore: ComponentStore<LocalState>,
    private datePipe: DatePipe,
    protected readonly draftStore: Store<DraftStates>,
    private readonly store: Store<InternalSalesReturnStates>,
    private cdr: ChangeDetectorRef,
    private stlService: SettlementMethodService,
    private readonly sessionStore: Store<SessionStates>,
    ) {
    super();
  }


  posting() {
    if ((this.postingStatus === "FINAL" || this.postingStatus === 'VOID' || this.postingStatus === "DISCARDED") || (this.status !== "ACTIVE" && this.status !== null)) {
      return false;
    }
    else {
      return true;
    }
  }

  ngOnInit() {
    this.subs.sink = this.appletSettings$.subscribe((resolve: AppletSettings) => {
      this.HIDE_CARD_NO = resolve?.HIDE_CARD_NO;
      this.HIDE_NAME = resolve?.HIDE_NAME;
      this.HIDE_CARD_ISSUER = resolve?.HIDE_CARD_ISSUER;
      this.HIDE_CARD_EXPIRY = resolve?.HIDE_CARD_EXPIRY;
      this.HIDE_APPROVAL_CODE = resolve?.HIDE_APPROVAL_CODE;
      this.HIDE_BATCH = resolve?.HIDE_BATCH;
      this.HIDE_CARD_TYPE = resolve?.HIDE_CARD_TYPE;
      this.HIDE_CVV = resolve?.HIDE_CVV;

      this.MANDATORY_CARD_NO = resolve?.MANDATORY_CARD_NO;
      this.MANDATORY_NAME = resolve?.MANDATORY_NAME;
      this.MANDATORY_CARD_ISSUER = resolve?.MANDATORY_CARD_ISSUER;
      this.MANDATORY_CARD_EXPIRY = resolve?.MANDATORY_CARD_EXPIRY;
      this.MANDATORY_APPROVAL_CODE = resolve?.MANDATORY_APPROVAL_CODE;
      this.MANDATORY_BATCH = resolve?.MANDATORY_BATCH;
      this.MANDATORY_CARD_TYPE = resolve?.MANDATORY_CARD_TYPE;
      this.MANDATORY_CVV = resolve?.MANDATORY_CVV;

      this.ENABLE_EDIT_PAYMENT_DATE = resolve?.ENABLE_EDIT_PAYMENT_DATE ? resolve.ENABLE_EDIT_PAYMENT_DATE : false;
    });

    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.subs.sink = this.localState$.subscribe( a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
    this.form = new FormGroup({
      settlementGroup: new FormControl(),
      settlementType: new FormControl()
    });
    this.subs.sink = this.payment$.subscribe({ next: resolve => this.payment = resolve })
    if (this.payment) {
      console.log('this.payment',this.payment)
       this.itemGuid =  this.payment.item_guid.toString()
      this.settlementMethod.setValue(this.itemGuid)
      console.log("payment",this.payment);
      this.form.patchValue({
        settlementGroup: this.payment.settlement_type,
      })
      this.onSettlementGroupChange(this.payment);

    }
    this.subs.sink = this.deleteConfirmation$.pipe(
      mergeMap(a => {
        return iif(() => a, of(a).pipe(delay(3000)), of(EMPTY));
      })
    ).subscribe(resolve => {
      if (resolve === true) {
        this.componentStore.patchState({deleteConfirmation: false});
        this.deleteConfirmation = false;
      }
    });

    this.subs.sink = this.draft$.subscribe(response=>{
      this.selectedBranchGuid = response.guid_branch.toString();
      this.postingStatus = response.posting_status;
      this.status = response.status;
    })

    this.settlementGroupOptionsFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterSettlementGroupOptions();
    });

    this.settlementTypeOptionsFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterSettlementTypeOptions();
    });
  }

  onSettlementGroupChange(e: any){
    console.log("egroup",e);
    this.currentSettlementGroup = e.settlement_type;
    const pagi = new Pagination();
    pagi.conditionalCriteria = [
          { columnName: 'value_string', operator: '=', value: this.currentSettlementGroup }]
    this.stlService.getByCriteria(pagi, this.apiVisa).subscribe(
      response => {
        if (response.data) {
          this.settlementList = response.data;
          console.log("settlementlist",this.settlementList)

          this.settlementListStored = this.settlementList;

          this.form.patchValue({
            settlementType: this.itemGuid
          })

          this.onSettlementTypeChange(this.itemGuid);

          this.cdr.detectChanges();
        }
      });
  }

  onSettlementTypeChange(e: any) {
    this.subs.sink = this.stlService.getByGuid(e, this.apiVisa).subscribe(itemData => {
      console.log("guid",e);
      this.settlementContainer = itemData.data;
      this.currSettlementType = itemData.data.bl_fi_mst_item_exts.find( ext => ext.param_code === 'SETTLEMENT_TYPE').value_string.toString();
      console.log("currSettlementType",this.currSettlementType);
      switch (this.currSettlementType) {
        case 'CASH':
          this.invalid = false;
          this.form = new FormGroup({
            date: new FormControl(new Date(), Validators.required),
            amount: new FormControl('0.00', Validators.compose([Validators.min(0.01), Validators.required])),
            remarks: new FormControl(),
          });
          this.leftColControls = [
            { label: 'Date*', formControl: 'date', type: 'date', readonly: false, hint: '', mandatory: true },
            { label: 'Amount*', formControl: 'amount', type: 'money', readonly: false, hint: '', mandatory: true },
            { label: 'Remarks', formControl: 'remarks', type: 'text-area', readonly: false, hint: '' },
          ];
          this.cdr.detectChanges()
          break;

        case 'CASH_BACK':
          this.invalid = false;
          this.form = new FormGroup({
            date: new FormControl(new Date(), Validators.required),
            cashBack: new FormControl('', Validators.required),
            amount: new FormControl('0.00', Validators.compose([Validators.min(0.01), Validators.required])),
            cashBackForSettlement: new FormControl(),
            remarks: new FormControl(),
          });

          this.leftColControls = [
            { label: 'Date*', formControl: 'date', type: 'date', readonly: false, hint: '', mandatory: true },
            { label: 'Cash Back*', formControl: 'cashBack', type: 'money', readonly: false, hint: '', mandatory: true },
            { label: 'Amount*', formControl: 'amount', type: 'money', readonly: false, hint: '', mandatory: true },
            { label: 'Cash Back for Settlement', formControl: 'cashBackForSettlement', type: 'text', readonly: true, hint: '' },
            { label: 'Remarks', formControl: 'remarks', type: 'text-area', readonly: false, hint: '' },
          ];
          this.cdr.detectChanges()
          break;

        case 'CREDIT_CARD': case 'DEBIT_CARD':
          this.invalid = false;
          this.form = new FormGroup({
            date: new FormControl(new Date(), Validators.required),
            amount: new FormControl('0.00', Validators.compose([Validators.min(0.01), Validators.required])),
            remarks: new FormControl(),
            // If mandatory field, then validator is required
            cardNo: this.MANDATORY_CARD_NO ? new FormControl('', Validators.required) : new FormControl(''),
            nameOnCard: this.MANDATORY_NAME ? new FormControl('', Validators.required) : new FormControl(''),
            cardIssuer: this.MANDATORY_CARD_ISSUER ? new FormControl('', Validators.required) : new FormControl(''),
            cardType: new FormControl('VISA'),
            approvalCode: this.MANDATORY_APPROVAL_CODE ? new FormControl('', Validators.required) : new FormControl(''),
            batch: this.MANDATORY_BATCH ? new FormControl('', Validators.required) : new FormControl(''),
            year: this.MANDATORY_CARD_EXPIRY ? new FormControl('', Validators.required) : new FormControl(''),
            month: this.MANDATORY_CARD_EXPIRY ? new FormControl('', Validators.required) : new FormControl(''),
            cvv: this.MANDATORY_CVV ? new FormControl('', Validators.required) : new FormControl('')
          });
          this.leftColControls = [
            { label: 'Date*', formControl: 'date', type: 'date', readonly: false, hint: '', mandatory: true },
            { label: 'Amount*', formControl: 'amount', type: 'money', readonly: false, hint: '', mandatory: true },
            { label: 'Remarks', formControl: 'remarks', type: 'text-area', readonly: false, hint: '', mandatory: true },
            { label: this.MANDATORY_CARD_NO ? 'Card No*' : 'Card No', formControl: 'cardNo', type: 'text', readonly: false, hint: '', hidden: this.HIDE_CARD_NO, mandatory: this.MANDATORY_CARD_NO },
            { label: this.MANDATORY_NAME ? 'Name on Card*' : 'Name on Card', formControl: 'nameOnCard', type: 'text', readonly: false, hint: '', hidden: this.HIDE_NAME, mandatory: this.MANDATORY_NAME },
            { label: this.MANDATORY_CARD_ISSUER ? 'Card Issuer*' : 'Card Issuer', formControl: 'cardIssuer', type: 'text', readonly: false, hint: '', hidden: this.HIDE_CARD_ISSUER, mandatory: this.MANDATORY_CARD_ISSUER },
            { label: this.HIDE_CARD_TYPE ? 'Type*' : 'Type', formControl: 'cardType', type: 'cardType', readonly: false, hint: '', hidden: this.HIDE_CARD_TYPE, mandatory: this.MANDATORY_CARD_TYPE },
            { label: this.MANDATORY_APPROVAL_CODE ? 'Approval Code*' : 'Approval Code', formControl: 'approvalCode', type: 'text', readonly: false, hint: '', hidden: this.HIDE_APPROVAL_CODE, mandatory: this.MANDATORY_APPROVAL_CODE },
            { label: this.MANDATORY_BATCH ? 'Batch*' : 'Batch', formControl: 'batch', type: 'number', readonly: false, hint: '', hidden: this.HIDE_BATCH, mandatory: this.MANDATORY_BATCH },
            { label: this.MANDATORY_CARD_EXPIRY ? 'Card Expiry*' : 'Card Expiry', formControl: 'cardExpiry', type: 'cardExpiry', readonly: false, hint: '', hidden: this.HIDE_CARD_EXPIRY, mandatory: this.MANDATORY_CARD_EXPIRY },
            { label: this.MANDATORY_CVV ? 'CVV*' : 'CVV', formControl: 'cvv', type: 'number', readonly: false, hint: '', hidden: this.HIDE_CVV, mandatory: this.MANDATORY_CVV },
          ];
          this.cdr.detectChanges()
          break;

        case 'VOUCHER':
          this.invalid = false;
          this.form = new FormGroup({
            amount: new FormControl('0.00', Validators.compose([Validators.min(0.01), Validators.required])),
            remarks: new FormControl(),
            voucherNo: new FormControl('', Validators.required)
          });
          this.leftColControls = [
            { label: 'Voucher #*', formControl: 'voucherNo', type: 'number', readonly: false, hint: '', mandatory: true },
            { label: 'Amount*', formControl: 'amount', type: 'money', readonly: false, hint: '', mandatory: true },
            { label: 'Remarks', formControl: 'remarks', type: 'text-area', readonly: false, hint: '' },
          ];
          this.cdr.detectChanges()
          break;

        case 'TT_PAYMENT':
            this.invalid = false;
            this.form = new FormGroup({
              amount: new FormControl('0.00', Validators.compose([Validators.min(0.01), Validators.required])),
              remarks: new FormControl(),
            });
            this.leftColControls = [
              { label: 'Amount*', formControl: 'amount', type: 'money', readonly: false, hint: '', mandatory: true },
              { label: 'Reference', formControl: 'remarks', type: 'text-area', readonly: false, hint: '' },
            ];
            this.cdr.detectChanges()
            break;

        case 'BANK_TRANSFER':
          this.invalid = false;
          this.form = new FormGroup({
            date: new FormControl(new Date(), Validators.required),
            amount: new FormControl('0.00', Validators.compose([Validators.min(0.01), Validators.required])),
            remarks: new FormControl(),
            transactionNo: new FormControl('', Validators.required)
          });
          this.leftColControls = [
            { label: 'Date*', formControl: 'date', type: 'date', readonly: false, hint: '', mandatory: true },
            { label: 'Amount*', formControl: 'amount', type: 'money', readonly: false, hint: '', mandatory: true },
            { label: 'Transaction No*', formControl: 'transactionNo', type: 'text', readonly: false, hint: '', mandatory: true },
            { label: 'Remarks', formControl: 'remarks', type: 'text-area', readonly: false, hint: '' },
          ];
          this.cdr.detectChanges()
          break;

        case 'MEMBERSHIP_POINT_CURRENCY':
          this.invalid = false;
          this.form = new FormGroup({
            date: new FormControl(new Date(), Validators.required),
            amount: new FormControl('0.00', Validators.compose([Validators.min(0.01), Validators.required])),
            remarks: new FormControl(),
            points: new FormControl('0.00', Validators.compose([Validators.min(0.00), Validators.required])),
            pointCurrencyForSettlement: new FormControl('', Validators.required)
          });
          this.leftColControls = [
            { label: 'Date*', formControl: 'date', type: 'date', readonly: false, hint: '', mandatory: true },
            { label: 'Point CCY*', formControl: 'points', type: 'points', readonly: false, hint: '', mandatory: true },
            { label: 'Amount*', formControl: 'amount', type: 'money', readonly: false, hint: '', mandatory: true },
            { label: 'Point Currency for Settlement*', formControl: 'pointCurrencyForSettlement', type: 'pointCurrencyForSettlement', readonly: false, hint: '', mandatory: true },
            { label: 'Remarks', formControl: 'remarks', type: 'text-area', readonly: false, hint: '' },
          ];
          this.cdr.detectChanges()
          break;

        case 'CHEQUE':
          this.invalid = false;
          this.form = new FormGroup({
            date: new FormControl(new Date(), Validators.required),
            amount: new FormControl('0.00', Validators.compose([Validators.min(0.01), Validators.required])),
            remarks: new FormControl(),
            chequeNo: new FormControl('', Validators.required),
          });
          this.leftColControls = [
            { label: 'Date*', formControl: 'date', type: 'date', readonly: false, hint: '', mandatory: true },
            { label: 'Amount*', formControl: 'amount', type: 'money', readonly: false, hint: '', mandatory: true },
            { label: 'Cheque No*', formControl: 'chequeNo', type: 'text', readonly: false, hint: '', mandatory: true },
            { label: 'Remarks', formControl: 'remarks', type: 'text-area', readonly: false, hint: '' },
          ];
          this.cdr.detectChanges()
          break;

          case 'POST_DATED_CHEQUE':
            this.invalid = false;
            this.form = new FormGroup({
              date: new FormControl(new Date(), Validators.required),
              chequeDate: new FormControl(new Date(), Validators.required),
              amount: new FormControl('0.00', Validators.compose([Validators.min(0.01), Validators.required])),
              remarks: new FormControl(),
              chequeNo: new FormControl('', Validators.required),
            });
            this.leftColControls = [
              { label: 'Date Txn*', formControl: 'date', type: 'date', readonly: false, hint: '', mandatory: true },
              { label: 'Cheque Date*', formControl: 'chequeDate', type: 'chequeDate', readonly: false, hint: '', mandatory: true },
              { label: 'Amount*', formControl: 'amount', type: 'money', readonly: false, hint: '', mandatory: true },
              { label: 'Cheque No*', formControl: 'chequeNo', type: 'text', readonly: false, hint: '', mandatory: true },
              { label: 'Remarks', formControl: 'remarks', type: 'text-area', readonly: false, hint: '' },
            ];
            this.cdr.detectChanges()
            break;

        default:
          // this.invalid = true;
          // this.leftColControls = [];

          break;
      }

      this.onLoad(itemData.data);
    })

  }

  onLoad(e: SettlementMethodContainerModel) {
    this.settlementContainer = e
    this.currSettlementType = e.bl_fi_mst_item_exts.find( ext => ext.param_code === 'SETTLEMENT_TYPE').value_string.toString();
    const line = <any>this.payment;
    this.form.controls['amount'].setValue(parseFloat(line.amount_txn.toString()).toFixed(2));
    this.form.patchValue({
      remarks: line.item_remarks,
      date: line.date_txn
    })


    if (!this.ENABLE_EDIT_PAYMENT_DATE && this.form.controls['date']) {
      this.form.controls['date'].disable();
    }

    switch (this.currSettlementType) {
      case 'CASH':
        // do nothing
      break;

      case 'CASH_BACK':
        this.form.patchValue({
          cashBack: line.line_property_json?.cashBack,
          cashBackForSettlement: line.line_property_json?.cashBackForSettlement
        })
      break;

      case 'CREDIT_CARD': case 'DEBIT_CARD':
        this.form.patchValue({
          cardNo: line.line_property_json?.cardNo,
          nameOnCard: line.line_property_json?.nameOnCard,
          cardIssuer: line.line_property_json?.cardIssuer,
          cardType: line.line_property_json?.cardType,
          approvalCode: line.line_property_json?.approvalCode,
          batch: line.line_property_json?.batch,
          cardExpiry: line.line_property_json?.cardExpiry,
          cvv: line.line_property_json?.cvv
        })
      break;

      case 'VOUCHER':
        this.form.patchValue({
          voucherNo: line.line_property_json?.voucherNo
        })
      break;

      case 'TT_PAYMENT':
      break;

      case 'BANK_TRANSFER':
        this.form.patchValue({
          transactionNo: line.line_property_json?.transactionNo
        })
      break;

      case 'MEMBERSHIP_POINT_CURRENCY':
        this.form.patchValue({
          points: line.line_property_json?.points,
          pointCurrencyforSettlement: line.line_property_json?.pointCurrencyforSettlement
        })
      break;

      case 'CHEQUE':
        this.form.patchValue({
          chequeNo: line.line_property_json?.chequeNo,
        })
      break;

      case 'POST_DATED_CHEQUE':
        this.form.patchValue({
          chequeNo: line.line_property_json?.chequeNo,
          chequeDate: line.line_property_json?.chequeDate,
          date: line.date_txn
        })
      break;

      default:
        this.invalid = true;
        this.leftColControls = [];
      break;
    }
  }

  onSave() {
    this.store.dispatch(InternalSalesReturnActions.selectEditAdjustment({value: true}));
    // const line = JSON.parse(JSON.stringify(oldLine)); // hard copy to not change existing payment
    const line = { ...this.payment }
    const v1 = {};
    this.form.enable(); // need to enable form before saving or the form.value will be empty
    this.settlementContainer.bl_fi_mst_item_exts.forEach(ext => v1[`${ext.param_code}`] = ext[`value_${ext.param_type?.toLowerCase()}`])
    line.item_guid = this.settlementContainer.bl_fi_mst_item_hdr.guid;
    line.item_code = this.settlementContainer.bl_fi_mst_item_hdr.code
    line.item_name = this.settlementContainer.bl_fi_mst_item_hdr.name;
    line.amount_net = this.form.value.amount;
    line.amount_txn = this.form.value.amount;
    line.txn_type = 'STL_MTHD';
    line.item_remarks = this.form.value.remarks;
    line.item_property_json = <any>{payment_txn_details: v1};
    line.amount_signum = 1;
    line.server_doc_type = 'INTERNAL_PAYMENT_VOUCHER';
    line.client_doc_type = 'INTERNAL_PAYMENT_VOUCHER';
    // line.guid_dimension = this.deparment.form.value.dimension;
    // line.guid_profit_center = this.deparment.form.value.profitCenter;
    // line.guid_project = this.deparment.form.value.project;
    // line.guid_segment = this.deparment.form.value.segment;

    switch (this.currSettlementType) {
      case 'CASH':
        line.date_txn = this.form.value.date;
      break;

      case 'CASH_BACK':
        line.date_txn = this.form.value.date;
        line.line_property_json = <any>{
          cashBack: this.form.value.cashBack,
          cashBackForSettlement: this.form.value.cashBackForSettlement
        }
      break;

      case 'CREDIT_CARD': case 'DEBIT_CARD':
        line.date_txn = this.form.value.date;
        line.line_property_json = <any>{
          cardNo: this.form.value.cardNo,
          nameOnCard: this.form.value.nameOnCard,
          cardIssuer: this.form.value.cardIssuer,
          cardType: this.form.value.cardType,
          approvalCode: this.form.value.approvalCode,
          batch: this.form.value.batch,
          cardExpiry: this.form.value.cardExpiry,
          cvv: this.form.value.cvv
        }
      break;

      case 'VOUCHER':
        line.date_txn = new Date();
        line.amount_net = this.form.value.amount;
        line.line_property_json = <any>{
          voucherNo: this.form.value.voucherNo
        }
      break;

      case 'TT_PAYMENT':
        line.date_txn = this.form.value.date;
        line.amount_net = this.form.value.amount;
      break;

      case 'BANK_TRANSFER':
        line.date_txn = this.form.value.date;
        line.line_property_json = <any>{
          transactionNo: this.form.value.transactionNo
        }
      break;

      case 'MEMBERSHIP_POINT_CURRENCY':
        line.date_txn = this.form.value.date;
        line.line_property_json = <any>{
          points: this.form.value.points,
          pointCurrencyForSettlement: this.form.value.pointCurrencyForSettlement
        }
      break;

      case 'CHEQUE':
        line.date_txn = this.form.value.date;
        line.line_property_json = <any>{
          chequeNo: this.form.value.chequeNo
        }
      break;

      case 'POST_DATED_CHEQUE':
        line.date_txn = this.form.value.date;
        line.line_property_json = <any>{
          chequeNo: this.form.value.chequeNo,
          chequeDate: this.form.value.chequeDate
        }
      break;

      default:
      break;
    }

    const diffAmount = parseFloat(<any>line.amount_txn) - parseFloat(<any>this.payment.amount_txn);
    this.draftStore.dispatch(SettlementAdjustmentActions.editPaymentInit({ payment: line, diffAmt: diffAmount, pageIndex:  this.prevIndex }));
  }

  onDelete() {
    if (this.deleteConfirmation) {
      this.deletePayment();
      this.deleteConfirmation = false;
      this.componentStore.patchState({ deleteConfirmation: false });
      this.store.dispatch(InternalSalesReturnActions.selectSettlement({ settlement: null }));
    } else {
      this.deleteConfirmation = true;
      this.componentStore.patchState({ deleteConfirmation: true });
    }
  }

  deletePayment() {
    console.log('deletePayment..')
    this.store.dispatch(InternalSalesReturnActions.selectEditAdjustment({value: true}));
    let index;
    this.subs.sink = this.order$.subscribe({ next: resolve => {
      index = resolve.bl_fi_generic_doc_line.findIndex(x => x.guid === this.payment.guid);
    }})
    const diffAmount = 0 - parseFloat(<any>this.payment.amount_txn);

    if (index ===-1) {
      this.draftStore.dispatch(SettlementAdjustmentActions.deletePaymentInit({ guid: this.payment.guid.toString(), diffAmt: diffAmount, pageIndex: this.prevIndex }));
    } else {
      // Change existing payment to DELETED status
      const line = {...this.payment, status: 'DELETED'};
      this.draftStore.dispatch(SettlementAdjustmentActions.deleteExistingPaymentInit({ payment: line, diffAmt: diffAmount }));
    }

  }

  protected filterSettlementGroupOptions() {
    if (!this.settlementGroupOptions) {
      return;
    }
    let search = this.settlementGroupOptionsFilterCtrl.value;
    console.log("search",search)
    if(search == ""){
      this.settlementGroupOptions = SettlementTypeOptions.values
    }
    if (!search) {
      this.settlementGroupOptions = SettlementTypeOptions.values
      // this.filteredMemberCardOptions.next(this.settlementGroupOptions.slice());
      return;
    } else {
      search = search.trim().toLowerCase();

      this.settlementGroupOptions = this.settlementGroupOptions.filter(
          (option) => option.viewValue.toLowerCase().indexOf(search) > -1
        )

    }
  }

  protected filterSettlementTypeOptions() {
    if (!this.settlementList) {
      return;
    }
    let search = this.settlementTypeOptionsFilterCtrl.value;
    console.log("search",search)
    if(search == ""){
      this.settlementList = this.settlementListStored
    }
    if (!search) {
      this.settlementList = this.settlementListStored
      // this.filteredMemberCardOptions.next(this.settlementList.slice());
      return;
    } else {
      search = search.trim().toLowerCase();

      this.settlementList = this.settlementList.filter(
          (option) => option.bl_fi_mst_item_hdr.code.toLowerCase().indexOf(search) > -1
        )

    }
  }

  disableSave() {
    return this.invalid || this.form.invalid;
  }

  onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateReturn: false,
      deactivateAdd: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
