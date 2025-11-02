import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ComponentStore } from '@ngrx/component-store';
import { bl_fi_generic_doc_line_RowClass, SettlementMethodContainerModel } from 'blg-akaun-ts-lib';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from '../../../../../facades/view-column.facade';
import { AppConfig } from 'projects/shared-utilities/visa';

interface LocalState {
  deactivateReturn: boolean;
}

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore, DatePipe]
})
export class AddPaymentComponent extends ViewColumnComponent {

  protected subs = new SubSink();

  protected compName = 'Add Payment';
  protected index = 10;
  protected localState: LocalState;
  protected prevLocalState: any;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  
  prevIndex: number;
  apiVisa = AppConfig.apiVisa
  form: FormGroup;
  paymentMethodForm: FormGroup;

  years = [...Array(10).keys()].map(i => parseInt(this.datePipe.transform(new Date(), 'yyyy'), 10) + i);

  leftColControls: {
    label: string,
    formControl: string,
    type: string,
    readonly: boolean,
    hint: string
  }[] = [];

  settlementContainer: SettlementMethodContainerModel;
  currSettlementType = '';
  settlementMethod = new FormControl();
  invalid = true;

  constructor(
    private viewColFacade: ViewColumnFacade,
    private readonly componentStore: ComponentStore<LocalState>,
    private datePipe: DatePipe) {
    super();
  }

  ngOnInit() {
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.subs.sink = this.localState$.subscribe( a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
    this.form = new FormGroup({});
  }

  onSettlementTypeChange(e: SettlementMethodContainerModel) {
    this.settlementContainer = e;
    this.currSettlementType = e.bl_fi_mst_item_exts.find( ext => ext.param_code === 'SETTLEMENT_TYPE').value_string.toString();
    switch (this.currSettlementType) {
      case 'CASH':
        this.invalid = false;
        this.form = new FormGroup({
          date: new FormControl(new Date(), Validators.required),
          amount: new FormControl('0.00', Validators.compose([Validators.min(0.01), Validators.required])),
          remarks: new FormControl(),
        });
        this.leftColControls = [
          { label: 'Date*', formControl: 'date', type: 'date', readonly: false, hint: '' },
          { label: 'Amount*', formControl: 'amount', type: 'money', readonly: false, hint: '' },
          { label: 'Remarks', formControl: 'remarks', type: 'text-area', readonly: false, hint: '' },
        ];
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
          { label: 'Date*', formControl: 'date', type: 'date', readonly: false, hint: '' },
          { label: 'Cash Back*', formControl: 'cashBack', type: 'money', readonly: false, hint: '' },
          { label: 'Amount*', formControl: 'amount', type: 'money', readonly: false, hint: '' },
          { label: 'Cash Back for Settlement', formControl: 'cashBackForSettlement', type: 'text', readonly: true, hint: '' },
          { label: 'Remarks', formControl: 'remarks', type: 'text-area', readonly: false, hint: '' },
        ];
        break;

      case 'CREDIT_CARD':
        this.invalid = false;
        this.form = new FormGroup({
          date: new FormControl(new Date(), Validators.required),
          amount: new FormControl('0.00', Validators.compose([Validators.min(0.01), Validators.required])),
          remarks: new FormControl(),
          cardNo: new FormControl('', Validators.required),
          nameOnCard: new FormControl('', Validators.required),
          cardIssuer: new FormControl('', Validators.required),
          cardType: new FormControl('VISA'),
          year: new FormControl('', Validators.required),
          month: new FormControl('', Validators.required),
          cvv: new FormControl('', Validators.required)
        });
        this.leftColControls = [
          { label: 'Date*', formControl: 'date', type: 'date', readonly: false, hint: '' },
          { label: 'Amount*', formControl: 'amount', type: 'money', readonly: false, hint: '' },
          { label: 'Remarks', formControl: 'remarks', type: 'text-area', readonly: false, hint: '' },
          { label: 'Card No*', formControl: 'cardNo', type: 'number', readonly: false, hint: '' },
          { label: 'Name on Card*', formControl: 'nameOnCard', type: 'text', readonly: false, hint: '' },
          { label: 'Card Issuer*', formControl: 'cardIssuer', type: 'text', readonly: false, hint: '' },
          { label: 'Type*', formControl: 'cardType', type: 'cardType', readonly: false, hint: '' },
          { label: 'Card Expiry', formControl: 'cardExpiry', type: 'cardExpiry', readonly: false, hint: '' },
          { label: 'CVV*', formControl: 'cvv', type: 'number', readonly: false, hint: '' },
        ];
        break;

      case 'VOUCHER':
        this.invalid = false;
        this.form = new FormGroup({
          amount: new FormControl('0.00', Validators.compose([Validators.min(0.01), Validators.required])),
          remarks: new FormControl(),
          voucherNo: new FormControl('', Validators.required)
        });
        this.leftColControls = [
          { label: 'Voucher #*', formControl: 'voucherNo', type: 'number', readonly: false, hint: '' },
          { label: 'Amount*', formControl: 'amount', type: 'money', readonly: false, hint: '' },
          { label: 'Remarks', formControl: 'remarks', type: 'text-area', readonly: false, hint: '' },
        ];
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
          { label: 'Date*', formControl: 'date', type: 'date', readonly: false, hint: '' },
          { label: 'Amount*', formControl: 'amount', type: 'money', readonly: false, hint: '' },
          { label: 'Transaction No*', formControl: 'transactionNo', type: 'number', readonly: false, hint: '' },
          { label: 'Remarks', formControl: 'remarks', type: 'text-area', readonly: false, hint: '' },
        ];
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
          { label: 'Date*', formControl: 'date', type: 'date', readonly: false, hint: '' },
          { label: 'Point CCY*', formControl: 'points', type: 'points', readonly: false, hint: '' },
          { label: 'Amount*', formControl: 'amount', type: 'money', readonly: false, hint: '' },
          { label: 'Point Currency for Settlement*', formControl: 'pointCurrencyForSettlement', type: 'pointCurrencyForSettlement', readonly: false, hint: '' },
          { label: 'Remarks', formControl: 'remarks', type: 'text-area', readonly: false, hint: '' },
        ];
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
          { label: 'Date*', formControl: 'date', type: 'date', readonly: false, hint: '' },
          { label: 'Amount*', formControl: 'amount', type: 'money', readonly: false, hint: '' },
          { label: 'Cheque No*', formControl: 'chequeNo', type: 'number', readonly: true, hint: '' },
          { label: 'Remarks', formControl: 'remarks', type: 'text-area', readonly: false, hint: '' },
        ];
        break;
        
      default:
        // this.invalid = true;
        // this.leftColControls = [];
        break;
    }
  }

  onAdd() {
    const line = new bl_fi_generic_doc_line_RowClass();
    const v1 = {};
    this.settlementContainer.bl_fi_mst_item_exts.forEach(ext => v1[`${ext.param_code}`] = ext[`value_${ext.param_type.toLowerCase()}`])
    line.item_guid = this.settlementContainer.bl_fi_mst_item_hdr.guid;
    line.item_code = this.settlementContainer.bl_fi_mst_item_hdr.code
    line.item_name = this.settlementContainer.bl_fi_mst_item_hdr.name;
    line.amount_net = this.form.value.amount;
    line.amount_txn = this.form.value.amount;
    line.txn_type = 'STL_MTHD';
    line.item_remarks = this.form.value.remarks;
    line.item_property_json = <any>{payment_txn_details: v1};
    line.status = 'ACTIVE';
    // line.guid_dimension = this.deparment.form.value.dimension;
    // line.guid_profit_center = this.deparment.form.value.profitCenter;
    // line.guid_project = this.deparment.form.value.project;
    // line.guid_segment = this.deparment.form.value.segment;

    switch (this.currSettlementType) {
      case 'CASH':
        line.amount_signum = -1;
        line.server_doc_type = 'INTERNAL_RECEIPT_VOUCHER';
        line.client_doc_type = 'INTERNAL_RECEIPT_VOUCHER';
        line.date_txn = this.form.value.date;
      break;

      case 'CASH_BACK':
        line.amount_signum = 1;
        line.server_doc_type = 'INTERNAL_PAYMENT_VOUCHER';
        line.client_doc_type = 'INTERNAL_PAYMENT_VOUCHER';
        line.date_txn = this.form.value.date;
        line.line_property_json = <any>{
          cashBack: this.form.value.cashBack,
          cashBackForSettlement: this.form.value.cashBackForSettlement
        }
      break;

      case 'CREDIT_CARD':
        line.date_txn = this.form.value.date;
        line.amount_signum = -1;
        line.server_doc_type = 'INTERNAL_RECEIPT_VOUCHER';
        line.client_doc_type = 'INTERNAL_RECEIPT_VOUCHER';
        line.line_property_json = <any>{
          cardNo: this.form.value.cardNo,
          nameOnCard: this.form.value.nameOnCard,
          cardIssuer: this.form.value.cardIssuer,
          cardType: this.form.value.cardType,
          cardExpiry: this.form.value.cardExpiry,
          cvv: this.form.value.cvv
        }
      break;

      case 'VOUCHER':
        line.amount_signum = -1;
        line.server_doc_type = 'INTERNAL_RECEIPT_VOUCHER';
        line.client_doc_type = 'INTERNAL_RECEIPT_VOUCHER';
        line.date_txn = new Date();
        line.amount_net = this.form.value.amount;
        line.line_property_json = <any>{
          voucherNo: this.form.value.voucherNo
        }
      break;

      case 'BANK_TRANSFER':
        line.amount_signum = -1;
        line.server_doc_type = 'INTERNAL_RECEIPT_VOUCHER';
        line.client_doc_type = 'INTERNAL_RECEIPT_VOUCHER';
        line.date_txn = new Date();
        line.line_property_json = <any>{
          transcationNo: this.form.value.transcationNo
        }
      break;

      case 'MEMBERSHIP_POINT_CURRENCY':
        line.amount_signum = -1;
        line.server_doc_type = 'INTERNAL_RECEIPT_VOUCHER';
        line.client_doc_type = 'INTERNAL_RECEIPT_VOUCHER';
        line.date_txn = new Date();
        line.line_property_json = <any>{
          points: this.form.value.points,
          pointCurrencyForSettlement: this.form.value.pointCurrencyForSettlement
        }
      break;

      case 'CHEQUE':
        line.amount_signum = -1;
        line.date_txn = new Date();
        line.line_property_json = <any>{
          chequeNo: this.form.value.chequeNo
        }
      break;

      default:
      break;
    }
    console.log('payment', line);
    this.viewColFacade.addPaymentMethod(line, this.prevIndex); 
  }

  disableAdd() {
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