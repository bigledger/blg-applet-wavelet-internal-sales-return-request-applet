import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { Subject, combineLatest, Observable, forkJoin } from 'rxjs';
import { takeUntil, map, startWith } from 'rxjs/operators';
import { bl_fi_generic_doc_line_RowClass, SettlementMethodContainerModel, SettlementMethodService, Pagination, BranchService, FinancialItemService, BranchSettlementMethodService } from 'blg-akaun-ts-lib';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from '../../../../../facades/view-column.facade';
import { HDRSelectors } from '../../../../../state-controllers/draft-controller/store/selectors';
import { DraftStates } from '../../../../../state-controllers/draft-controller/store/states';
import { InternalSalesReturnActions } from '../../../../../state-controllers/internal-sales-return-controller/store/actions';
import { InternalSalesReturnStates } from '../../../../../state-controllers/internal-sales-return-controller/store/states';
import { InternalSalesReturnSelectors } from '../../../../../state-controllers/internal-sales-return-controller/store/selectors';
import { SettlementTypeOptions } from '../../../../../models/constants/settlement-type.constants';
import { AppletSettings } from '../../../../../models/applet-settings.model';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';
import { TabControlService } from '../../../../../services/tab-control.service'
import { SettlementMethod } from '../../../../../models/default-settlement-methods';
import { UUID } from 'angular2-uuid';
import { ListingService } from "projects/shared-utilities/services/listing-service";
import { ListingInputModel } from "projects/shared-utilities/models/listing-input.model";

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
  protected _onDestroy = new Subject<void>();

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly draft$ = this.draftStore.select(HDRSelectors.selectHdr);

  prevIndex: number;
  apiVisa = AppConfig.apiVisa
  form: FormGroup;
  settlementForm: FormGroup;
  paymentMethodForm: FormGroup;

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

  settlementList: any[];
  settlementListStored: SettlementMethodContainerModel[];
  settlementContainer: any;
  currSettlementType = '';
  currentSettlementGroup = '';
  // settlementMethod = new FormControl();
  settlementGroupOptionsFilterCtrl: FormControl = new FormControl();
  settlementTypeOptionsFilterCtrl: FormControl = new FormControl();
  settlementGroupOptions = [];
  filteredSettlementGroupOptions = [];
  filteredSettlementList: any[];
  arapBalance = '0.00';
  invalid = true;
  errorSettlementType = false;
  selectedBranchGuid: string;
  settlementAccNums: string[] = []

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

  selectedSettlementMethod;

  appletSettings$ = combineLatest([
    this.sessionStore.select(SessionSelectors.selectMasterSettings),
    this.sessionStore.select(SessionSelectors.selectPersonalSettings)
  ]).pipe(map(([a, b]) => ({ ...a, ...b })));

  constructor(
    protected listingService: ListingService,
    private viewColFacade: ViewColumnFacade,
    protected readonly draftStore: Store<DraftStates>,
    private readonly componentStore: ComponentStore<LocalState>,
    private readonly store: Store<InternalSalesReturnStates>,
    private datePipe: DatePipe,
    private readonly sessionStore: Store<SessionStates>,
    private branchService: BranchService) {
    super();
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
    // this.subs.sink = this.appletSettings$.subscribe((resolve: AppletSettings) => {
    //   this.ENABLE_EDIT_PAYMENT_DATE = resolve?.ENABLE_EDIT_PAYMENT_DATE ? resolve.ENABLE_EDIT_PAYMENT_DATE : false;
    // });
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.subs.sink = this.localState$.subscribe( a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
    this.form = new FormGroup({});

    this.settlementForm = new FormGroup({
      settlementType: new FormControl(),
      settlementMethod: new FormControl(),
    });

    this.subs.sink = this.draft$.subscribe(response=>{
      this.selectedBranchGuid = response.guid_branch?.toString();
    })
    this.filterEmptySettlementGroups();

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

  private filterEmptySettlementGroups() {
    const filteredOptions = [];
    const inputModel = {} as ListingInputModel;
    inputModel.searchColumns = [];
    inputModel.status = ['ACTIVE'];
    inputModel.orderBy = 'date_updated';
    inputModel.order = 'desc';
    inputModel.limit = null;
    inputModel.offset = 0;
    inputModel.calcTotalRecords = true;
    inputModel.showCreatedBy = false;
    inputModel.showUpdatedBy = true;
    inputModel.filterLogical = 'AND';
    inputModel.filterConditions = [
      {
        "filterColumn": "bl_fi_mst_branch_settlement_method.branch_guid",
        "filterValues": [this.selectedBranchGuid],
        "filterOperator": "="
      },
      {
        "filterColumn": "bl_fi_mst_branch_settlement_method.status",
        "filterValues": ["ACTIVE"],
        "filterOperator": "="
      }
    ];
    inputModel.filters = { "txn_class": "STL_MTHD" };
    inputModel.joins = [
      {
        'tableName': 'bl_fi_mst_branch_settlement_method',
        'joinColumn': 'hdr.guid=bl_fi_mst_branch_settlement_method.fi_item_hdr_guid',
        'columns': ["fi_item_hdr_guid","branch_guid","status"],
        'joinType': 'inner join'
      },
      {
        'tableName': 'bl_fi_mst_item_ext',
        'joinColumn': "hdr.guid=bl_fi_mst_item_ext.item_hdr_guid AND bl_fi_mst_item_ext.param_code='SETTLEMENT_TYPE'",
        'columns': ["item_hdr_guid","param_code","value_string"],
        'joinType': 'inner join'
      }
    ];
    inputModel.childs = [];

    this.listingService.get("fi-item", inputModel, this.apiVisa).toPromise()
      .then(resolved => {
        // Filter options based on the single response
        this.settlementGroupOptions = SettlementTypeOptions.values.filter(option =>
          resolved.data.some(c => c.bl_fi_mst_item_ext_value_string === option.value)
        );
        this.filteredSettlementGroupOptions = this.settlementGroupOptions;
      })
      .catch(err => {
        console.error("Error fetching data for settlement groups", err);
      });
  }

  onSettlementGroupChange(e: SettlementTypeOptions){
    this.currSettlementType = "";
    this.settlementAccNums = [];
    this.currentSettlementGroup = e.toString();
    const inputModel = {} as ListingInputModel;
      inputModel.searchColumns = [];
      inputModel.status = ['ACTIVE'];
      inputModel.orderBy = 'date_updated';
      inputModel.order = 'desc';
      inputModel.limit = null;
      inputModel.offset = 0;
      inputModel.calcTotalRecords = true;
      inputModel.showCreatedBy = false;
      inputModel.showUpdatedBy = true;
      inputModel.filterLogical = 'AND';
      inputModel.filterConditions = [];
      inputModel.filters = {
        "txn_class": "STL_MTHD"
      }
      inputModel.filterConditions.push({
          "filterColumn": "bl_fi_mst_branch_settlement_method.branch_guid",
          "filterValues": [
            this.selectedBranchGuid
          ],
          "filterOperator": "="
      }),
      inputModel.filterConditions.push({
        "filterColumn": "bl_fi_mst_branch_settlement_method.status",
        "filterValues": [
         "ACTIVE"
        ],
        "filterOperator": "="
    })

      inputModel.joins = [
        {
          'tableName': 'bl_fi_mst_branch_settlement_method',
          'joinColumn': 'hdr.guid=bl_fi_mst_branch_settlement_method.fi_item_hdr_guid',
          'columns': ["fi_item_hdr_guid","branch_guid","status"],
          'joinType': 'inner join'
        },
        {
          'tableName': 'bl_fi_mst_item_ext',
          'joinColumn': "hdr.guid=bl_fi_mst_item_ext.item_hdr_guid AND bl_fi_mst_item_ext.param_code='SETTLEMENT_TYPE'",
          'columns': ["item_hdr_guid","param_code","value_string"],
          'joinType': 'inner join'
        },
        {
          'tableName': 'bl_fi_mst_cashbook_hdr',
          'joinColumn': "hdr.cashbook_guid=bl_fi_mst_cashbook_hdr.guid",
          'columns': ["code","acc_no"],
          'joinType': 'inner join'
        },
      ];
      inputModel.childs = [];
      this.subs.sink = this.listingService.get("fi-item", inputModel, this.apiVisa).pipe(
      ).subscribe(resolved => {
        const matchedList = resolved.data.filter(c => c.bl_fi_mst_item_ext_value_string === e);
        const sortedList = matchedList.sort((a, b) =>
          a.code.localeCompare(b.code)
        );

        this.settlementList = sortedList;
        this.filteredSettlementList = sortedList;
        this.settlementListStored = sortedList;
        this.branchService.getByGuid(this.selectedBranchGuid, this.apiVisa).subscribe(res => {
          const defaultSettlementMethodsJson: SettlementMethod = res?.data?.bl_fi_mst_branch?.default_settlement_method_json as SettlementMethod;
          switch (this.currentSettlementGroup) {
            case 'CASH':
              this.selectedSettlementMethod = this.filteredSettlementList.find(item => item.code === defaultSettlementMethodsJson.default_settlement_cash);
              break;
            case 'CREDIT_CARD':
              this.selectedSettlementMethod = this.filteredSettlementList.find(item => item.code === defaultSettlementMethodsJson.default_settlement_credit_card);
              break;
            case 'DEBIT_CARD':
              this.selectedSettlementMethod = this.filteredSettlementList.find(item => item.code === defaultSettlementMethodsJson.default_settlement_debit_card);
              break;
            case 'VOUCHER':
              this.selectedSettlementMethod = this.filteredSettlementList.find(item => item.code === defaultSettlementMethodsJson.default_settlement_voucher);
              break;
            case 'BANK_TRANSFER':
              this.selectedSettlementMethod = this.filteredSettlementList.find(item => item.code === defaultSettlementMethodsJson.default_settlement_bank_transfer);
              break;
            case 'CHEQUE':
              this.selectedSettlementMethod = this.filteredSettlementList.find(item => item.code === defaultSettlementMethodsJson.default_settlement_cheque);
              break;
            case 'OTHERS':
              this.selectedSettlementMethod = this.filteredSettlementList.find(item => item.code === defaultSettlementMethodsJson.default_settlement_others);
              break;
            case 'E_WALLET':
              this.selectedSettlementMethod = this.filteredSettlementList.find(item => item.code === defaultSettlementMethodsJson.default_settlement_ewallet);
              break;
            case 'MEMBERSHIP_POINT_CURRENCY':
              this.selectedSettlementMethod = this.filteredSettlementList.find(item => item.code === defaultSettlementMethodsJson.default_settlement_membership_point_currency);
              break;
          }
          if(this.selectedSettlementMethod){
            this.settlementForm.patchValue({
              settlementMethod: this.selectedSettlementMethod
            });
            this.onSettlementTypeChange(this.selectedSettlementMethod);
          }
        })
      }, err => {
        console.error(err);
      });
  }

  onSettlementTypeChange(e: any) {
    console.log("settlementTypechange",e);
    this.settlementContainer = e;
    this.currSettlementType = e.bl_fi_mst_item_ext_value_string;
    console.log("this.currSettlementType",this.currSettlementType)

    switch (this.currSettlementType) {
      case 'CASH':
        this.invalid = false;
        this.form = new FormGroup({
          date: new FormControl(new Date(), Validators.required),
          amount: new FormControl(this.arapBalance, Validators.compose([Validators.min(0.01), Validators.required])),
          remarks: new FormControl(),
        });
        this.leftColControls = [
          { label: 'Date*', formControl: 'date', type: 'date', readonly: false, hint: '', mandatory: true },
          { label: 'Amount*', formControl: 'amount', type: 'money', readonly: false, hint: '', mandatory: true },
          { label: 'Remarks', formControl: 'remarks', type: 'text-area', readonly: false, hint: '' },
        ];
        break;

      case 'CASH_BACK':
        this.invalid = false;
        this.form = new FormGroup({
          date: new FormControl(new Date(), Validators.required),
          cashBack: new FormControl('', Validators.required),
          amount: new FormControl(this.arapBalance, Validators.compose([Validators.min(0.01), Validators.required])),
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
        break;

      case 'CREDIT_CARD':
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
          { label: this.MANDATORY_APPROVAL_CODE ? 'Approval Code*' : 'Approval Code', formControl: 'approvalCode', type: 'number', readonly: false, hint: '', hidden: this.HIDE_APPROVAL_CODE, mandatory: this.MANDATORY_APPROVAL_CODE },
          { label: this.MANDATORY_BATCH ? 'Batch*' : 'Batch', formControl: 'batch', type: 'number', readonly: false, hint: '', hidden: this.HIDE_BATCH, mandatory: this.MANDATORY_BATCH },
          { label: this.MANDATORY_CARD_EXPIRY ? 'Card Expiry*' : 'Card Expiry', formControl: 'cardExpiry', type: 'cardExpiry', readonly: false, hint: '', hidden: this.HIDE_CARD_EXPIRY, mandatory: this.MANDATORY_CARD_EXPIRY },
          { label: this.MANDATORY_CVV ? 'CVV*' : 'CVV', formControl: 'cvv', type: 'number', readonly: false, hint: '', hidden: this.HIDE_CVV, mandatory: this.MANDATORY_CVV },
        ];
        break;

      case 'DEBIT_CARD':
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
          { label: this.MANDATORY_APPROVAL_CODE ? 'Approval Code*' : 'Approval Code', formControl: 'approvalCode', type: 'number', readonly: false, hint: '', hidden: this.HIDE_APPROVAL_CODE, mandatory: this.MANDATORY_APPROVAL_CODE },
          { label: this.MANDATORY_BATCH ? 'Batch*' : 'Batch', formControl: 'batch', type: 'number', readonly: false, hint: '', hidden: this.HIDE_BATCH, mandatory: this.MANDATORY_BATCH },
          { label: this.MANDATORY_CARD_EXPIRY ? 'Card Expiry*' : 'Card Expiry', formControl: 'cardExpiry', type: 'cardExpiry', readonly: false, hint: '', hidden: this.HIDE_CARD_EXPIRY, mandatory: this.MANDATORY_CARD_EXPIRY },
          { label: this.MANDATORY_CVV ? 'CVV*' : 'CVV', formControl: 'cvv', type: 'number', readonly: false, hint: '', hidden: this.HIDE_CVV, mandatory: this.MANDATORY_CVV },
        ];
        break;

      case 'VOUCHER':
        this.invalid = false;
        this.form = new FormGroup({
          amount: new FormControl(this.arapBalance, Validators.compose([Validators.min(0.01), Validators.required])),
          remarks: new FormControl(),
          voucherNo: new FormControl('', Validators.required)
        });
        this.leftColControls = [
          { label: 'Voucher #*', formControl: 'voucherNo', type: 'number', readonly: false, hint: '', mandatory: true },
          { label: 'Amount*', formControl: 'amount', type: 'money', readonly: false, hint: '', mandatory: true },
          { label: 'Remarks', formControl: 'remarks', type: 'text-area', readonly: false, hint: '' },
        ];
        break;

      case 'TT_PAYMENT':
          this.invalid = false;
          this.form = new FormGroup({
            amount: new FormControl(this.arapBalance, Validators.compose([Validators.min(0.01), Validators.required])),
            remarks: new FormControl(),
          });
          this.leftColControls = [
            { label: 'Amount*', formControl: 'amount', type: 'money', readonly: false, hint: '', mandatory: true },
            { label: 'Reference', formControl: 'remarks', type: 'text-area', readonly: false, hint: '' },
          ];
          break;

      case 'BANK_TRANSFER':
        this.invalid = false;
        this.form = new FormGroup({
          date: new FormControl(new Date(), Validators.required),
          amount: new FormControl(this.arapBalance, Validators.compose([Validators.min(0.01), Validators.required])),
          remarks: new FormControl(),
          transactionNo: new FormControl('', Validators.required)
        });
        this.leftColControls = [
          { label: 'Date*', formControl: 'date', type: 'date', readonly: false, hint: '', mandatory: true },
          { label: 'Amount*', formControl: 'amount', type: 'money', readonly: false, hint: '', mandatory: true },
          { label: 'Transaction No*', formControl: 'transactionNo', type: 'text', readonly: false, hint: '', mandatory: true },
          { label: 'Remarks', formControl: 'remarks', type: 'text-area', readonly: false, hint: '' },
        ];
        break;

      case 'MEMBERSHIP_POINT_CURRENCY':
        this.invalid = false;
        this.form = new FormGroup({
          date: new FormControl(new Date(), Validators.required),
          amount: new FormControl(this.arapBalance, Validators.compose([Validators.min(0.01), Validators.required])),
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
        break;

      case 'CHEQUE':
        this.invalid = false;
        this.form = new FormGroup({
          date: new FormControl(new Date(), Validators.required),
          amount: new FormControl(this.arapBalance, Validators.compose([Validators.min(0.01), Validators.required])),
          remarks: new FormControl(),
          chequeNo: new FormControl('', Validators.required),
        });
        this.leftColControls = [
          { label: 'Date*', formControl: 'date', type: 'date', readonly: false, hint: '', mandatory: true },
          { label: 'Amount*', formControl: 'amount', type: 'money', readonly: false, hint: '', mandatory: true },
          { label: 'Cheque No*', formControl: 'chequeNo', type: 'text', readonly: false, hint: '', mandatory: true },
          { label: 'Remarks', formControl: 'remarks', type: 'text-area', readonly: false, hint: '' },
        ];
        break;

        case 'POST_DATED_CHEQUE':
          this.invalid = false;
          this.form = new FormGroup({
            date: new FormControl(new Date(), Validators.required),
            chequeDate: new FormControl(new Date(), Validators.required),
            amount: new FormControl(this.arapBalance, Validators.compose([Validators.min(0.01), Validators.required])),
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
          break;
          case 'OTHERS' : case 'FPX_EMANDATE': case 'E_WALLET': case 'E_WALLET': case 'PAYMENT_GATEWAY': case 'OPEN_CREDIT':
            this.invalid = false;
            this.form = new FormGroup({
              date: new FormControl(new Date(), Validators.required),
              amount: new FormControl(this.arapBalance, Validators.compose([Validators.min(0.01), Validators.required])),
              reference: new FormControl('', Validators.required),
            });
            this.leftColControls = [
              {label: 'Date*', formControl: 'date', type: 'date', readonly: false, hint: ''},
              {label: 'Amount*', formControl: 'amount', type: 'money', readonly: false, hint: ''},
              {label: 'Reference No*', formControl: 'reference', type: 'text', readonly: false, hint: ''}
            ];
          break;
      default:
        this.form = new FormGroup({});   // reset the form group
        this.invalid = true;
        this.leftColControls = [];
        break;
    }

    if (!this.ENABLE_EDIT_PAYMENT_DATE && this.form.controls['date']) {
      this.subs.sink = this.draft$.subscribe(resolve => {
        this.form.patchValue({
          date: resolve.date_txn
        })
      })
      this.form.controls['date'].disable();
    }
  }

  onAdd() {
    const line = new bl_fi_generic_doc_line_RowClass();
    const v1 = {};
    //this.settlementContainer.bl_fi_mst_item_exts.forEach(ext => v1[`${ext.param_code}`] = ext[`value_${ext.param_type?.toLowerCase()}`])
    line.guid = UUID.UUID();
    line.item_guid = this.settlementContainer.guid;
    line.item_code = this.settlementContainer.code
    line.item_name = this.settlementContainer.name;
    line.amount_net = this.form.value.amount;
    line.amount_txn = this.form.value.amount;
    line.settlement_type = this.currSettlementType;
    line.txn_type = 'STL_MTHD';
    line.item_remarks = this.form.value.remarks;
    line.item_property_json = <any>{payment_txn_details: v1};
    line.status = 'ACTIVE';
    line.amount_signum = 1;
    // line.guid_dimension = this.deparment.form.value.dimension;
    // line.guid_profit_center = this.deparment.form.value.profitCenter;
    // line.guid_project = this.deparment.form.value.project;
    // line.guid_segment = this.deparment.form.value.segment;

    switch (this.currSettlementType) {
      case 'CASH':
        line.amount_signum = 1;
        line.server_doc_type = 'INTERNAL_PAYMENT_VOUCHER';
        line.client_doc_type = 'INTERNAL_PAYMENT_VOUCHER';
        line.date_txn = this.form.value.date;
      break;

      case 'E_WALLET':
        line.amount_signum = 1;
        line.server_doc_type = 'INTERNAL_PAYMENT_VOUCHER';
        line.client_doc_type = 'INTERNAL_PAYMENT_VOUCHER';
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
        line.amount_signum = 1;
        line.server_doc_type = 'INTERNAL_PAYMENT_VOUCHER';
        line.client_doc_type = 'INTERNAL_PAYMENT_VOUCHER';
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

      case 'DEBIT_CARD':
        line.date_txn = this.form.value.date;
        line.amount_signum = 1;
        line.server_doc_type = 'INTERNAL_PAYMENT_VOUCHER';
        line.client_doc_type = 'INTERNAL_PAYMENT_VOUCHER';
        line.line_property_json = <any>{
          cardNo: this.form.value.cardNo,
          nameOnCard: this.form.value.nameOnCard,
          cardIssuer: this.form.value.cardIssuer,
          cardType: this.form.value.cardType,
          approvalCode: this.form.value.approvalCode,
          batch: this.form.value.batch,
          cardExpiry: this.form.value.cardExpiry,
          cvv: this.form.value.cvv
        };
      break;

      case 'VOUCHER':
        line.amount_signum = 1;
        line.server_doc_type = 'INTERNAL_PAYMENT_VOUCHER';
        line.client_doc_type = 'INTERNAL_PAYMENT_VOUCHER';
        line.date_txn = new Date();
        line.amount_net = this.form.value.amount;
        line.line_property_json = <any>{
          voucherNo: this.form.value.voucherNo
        }
      break;

      case 'TT_PAYMENT':
        line.amount_signum = 1;
        line.server_doc_type = 'INTERNAL_PAYMENT_VOUCHER';
        line.client_doc_type = 'INTERNAL_PAYMENT_VOUCHER';
        line.date_txn = this.form.value.date;
        line.amount_net = this.form.value.amount;
      break;

      case 'BANK_TRANSFER':
        line.amount_signum = 1;
        line.server_doc_type = 'INTERNAL_PAYMENT_VOUCHER';
        line.client_doc_type = 'INTERNAL_PAYMENT_VOUCHER';
        line.date_txn = this.form.value.date;
        line.line_property_json = <any>{
          transactionNo: this.form.value.transactionNo
        }
      break;

      case 'MEMBERSHIP_POINT_CURRENCY':
        line.amount_signum = 1;
        line.server_doc_type = 'INTERNAL_PAYMENT_VOUCHER';
        line.client_doc_type = 'INTERNAL_PAYMENT_VOUCHER';
        line.date_txn = this.form.value.date;
        line.line_property_json = <any>{
          points: this.form.value.points,
          pointCurrencyForSettlement: this.form.value.pointCurrencyForSettlement
        }
      break;

      case 'CHEQUE':
        line.amount_signum = 1;
        line.date_txn = this.form.value.date;
        line.line_property_json = <any>{
          chequeNo: this.form.value.chequeNo
        }
        line.server_doc_type = 'INTERNAL_PAYMENT_VOUCHER';
        line.client_doc_type = 'INTERNAL_PAYMENT_VOUCHER';
      break;

      case 'POST_DATED_CHEQUE':
        line.amount_signum = 1;
        line.server_doc_type = 'INTERNAL_PAYMENT_VOUCHER';
        line.client_doc_type = 'INTERNAL_PAYMENT_VOUCHER';
        line.date_txn = this.form.value.date;
        line.line_property_json = <any>{
          chequeNo: this.form.value.chequeNo,
          chequeDate: this.form.value.chequeDate
        }
      break;

      default:
      break;
    }
    console.log('payment', line);
    this.viewColFacade.addSettlementMethod(line, this.prevIndex);
  }

  protected filterSettlementGroupOptions() {
    if (!this.settlementGroupOptions) {
      return;
    }
    let search = this.settlementGroupOptionsFilterCtrl.value;
    console.log("search",search)
    if(search == ""){
      this.settlementGroupOptions = this.filteredSettlementGroupOptions;
    }
    if (!search) {
      this.settlementGroupOptions = this.filteredSettlementGroupOptions;
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
    if (!this.settlementListStored) {
      return;
    }
    let search = this.settlementTypeOptionsFilterCtrl.value;
    console.log("search",search)
    if(search == ""){
      this.filteredSettlementList = this.settlementListStored
    }
    if (!search) {
      this.filteredSettlementList = this.settlementListStored
      // this.filteredMemberCardOptions.next(this.settlementList.slice());
      return;
    } else {
      search = search.trim().toLowerCase();

      this.filteredSettlementList = this.filteredSettlementList.filter(
          (option) => option.code.toLowerCase().indexOf(search) > -1
        )
    }
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
