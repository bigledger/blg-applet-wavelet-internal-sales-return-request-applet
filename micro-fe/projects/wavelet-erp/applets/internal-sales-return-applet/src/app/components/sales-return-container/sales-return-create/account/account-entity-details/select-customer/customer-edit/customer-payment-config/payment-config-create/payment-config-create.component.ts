import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { bl_fi_mst_entity_ext_RowClass, bl_fi_mst_entity_line_RowClass, bl_fi_mst_entity_payment_method_RowClass, bl_fi_mst_item_ext_RowClass, CountryService, EntityPaymentMethodContainerModel, Pagination, PagingResponseModel, SettlementMethodContainerModel, SettlementMethodService } from 'blg-akaun-ts-lib';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';

import { ViewColumnFacade } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/facades/view-column.facade';
import { CustomerConstants, SettlementTypeOptions } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/models/customer-constants';
import { CustomerActions } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/actions';
import { CustomerSelectors } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/selectors';
import { CustomerStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/states';

import { Observable } from 'rxjs';
import { switchMap, toArray } from 'rxjs/operators';
import { SubSink } from 'subsink2';

@Component({
  selector: 'app-payment-create',
  templateUrl: './payment-config-create.component.html',
  styleUrls: ['./payment-config-create.component.css']
})
export class CreatePaymentConfigComponent extends ViewColumnComponent implements OnInit {

  priceConfigInfo: FormGroup;
  deactivateReturn$;
  @Input() customerExtLineItem$: Observable<bl_fi_mst_entity_line_RowClass>;

  payeeType = [
    { value: 'RESIDENT', viewValue: 'Resident' },
    { value: 'NON-RESIDENT', viewValue: 'Non-Resident' }
  ];
  bankType = [
    { value: 'MAYBANK', viewValue: 'Maybank' },
    { value: 'AFFIN BANK', viewValue: 'Affin Bank' },
    { value: 'AGRROBANK', viewValue: 'Agrrobank' },
    { value: 'ALLIANCE BANK', viewValue: 'Alliance Bank' },
    { value: 'AL-RAJHI MALAYSIA', viewValue: 'Al-Rajhi Malaysia' },
    { value: 'AMBANK', viewValue: 'AmBank' },
    { value: 'BANK ISLAM MALAYSIA', viewValue: 'Bank Islam Malaysia' },
    { value: 'BANK MUAMALAT MALAYSIA BERHAD', viewValue: 'Bank Muamalat Malaysia Berhad' },
    { value: 'BANK RAKYAT', viewValue: 'Bank Rakyat' },
    { value: 'BANK SIMPANAN NASIONAL(BSN)', viewValue: 'Bank Simpanan Nasional (BSN)' },
    { value: 'CIMB BANK', viewValue: 'CIMB Bank' },
    { value: 'CITYBANK MALAYSIA', viewValue: 'CityBank Malaysia' },
    { value: 'CO-OP BANK PERTAMA', viewValue: 'Co-op Bank Pertama' },
    { value: 'HONG LEONG BANK', viewValue: 'Hong Leong Bank' },
    { value: 'HSBS BANK MALAYSIA', viewValue: 'HSBC Bank Malaysia' },
    { value: 'MBSB BANK BERHAD', viewValue: 'MBSB Bank Berhad' },
    { value: 'OCBC BANK MALAYSIA', viewValue: 'OCBC Bank Malaysia' },
    { value: 'PUBLIC BANK BERHAD', viewValue: 'Public Bank Berhad' },
    { value: 'RHB BANK', viewValue: 'RHB Bank' },
    { value: 'STANDARD CHARTERED BANK MALAYSIA', viewValue: 'Standard Chartered Bank Malaysia' },
    { value: 'CITYBANK MALAYSIA', viewValue: 'UOB Malaysia Bank' },
  ];
  // paymentType = [
  //   { value: 'CASH', viewValue: 'Cash' },
  //   { value: 'BANK TRANSFER', viewValue: 'Bank Transfer' },
  //   { value: 'CREDIT CARD', viewValue: 'Credit Card' },
  //   { value: 'TNG E-WALLET', viewValue: 'TNG e-Wallet' },
  //   { value: 'VOUCHER', viewValue: 'Voucher' },
  //   { value: 'CHEQUE', viewValue: 'Cheque' },
  //   { value: 'JOMPAY', viewValue: 'JomPay' },
  //   { value: 'TELEGRAPHIC TRANSFER', viewValue: 'Telegraphic Transfer' },
  //   { value: 'GIRO', viewValue: 'GIRO' },
  //   { value: 'OTHERS', viewValue: 'Others' },
  // ];
  protected readonly index = 17;
  prevIndex: number;
  private prevLocalState: any;
  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  newSettlement: any[];
  selectedCustomerGuid$: Observable<string> = this.store.select(CustomerSelectors.selectGuid);
  customerGuid: string;
  settlementList: SettlementMethodContainerModel[];
  settlementListguid;
  settlementArr: any;
  settlementGuid: any;
  settlementName: any;
  settlementIdentifierCodeList = SettlementTypeOptions.values;
  settlementIdentifierCode: string;
  settlementExtList: bl_fi_mst_item_ext_RowClass[];
  settlementExt: bl_fi_mst_item_ext_RowClass[];
  settlementArr1: any = [];
  apiVisa = AppConfig.apiVisa;
  paging = new Pagination();
  /* Start */
  currentCountryId: any;
  taxTypeArr: any = [];

  newTaxTypeArr: any = [];
  newBankArr: any = [];
  bankArr: any = [];
  addSuccess: any;
  isClicked: any;
  countryArr: any = [];
  newCountryArr: any = [];
  countries: any;
  protected subs = new SubSink()
  constructor(
    private countryService: CountryService,
    private readonly store: Store<CustomerStates>,
    private fb: FormBuilder,
    private viewColFacade: ViewColumnFacade,
    private settlementMethodService: SettlementMethodService,
  ) {
    super();
  }

  ngOnInit() {
    this.isClicked = 'primary';
    this.addSuccess = 'Add';
    this.getAllSettlementMethods();
    this.priceConfigInfo = this.fb.group({
      residentialStatus: ['', Validators.required],
      paymentType: ['', Validators.required],
      bank: [''],
      bankCode: [''],
      bankAccNo: [''],
      bankAccName: [''],
      IBN_No: [''],
      createdBy: [''],
      createdDate: [''],
      modifiedBy: [''],
      modifiedDate: [''],
      guid: [''],
      country: [],
      currentCountry: [],
      expiryDate: [],
      revision: [],
      currentBankIdentifier: [],
      status: []
    });

    this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.getCountry();
    this.subs.sink = this.selectedCustomerGuid$.subscribe(data => {
      this.customerGuid = data;
    })
  }
  getCountry() {
    this.countryService.get(this.apiVisa).pipe(
      switchMap((x: any) => {
        return x.data;
      }),
      toArray()
    ).subscribe((x: any) => {
      this.countries = x;
      for (const key in this.countries) {
        if (this.countries[key].bl_fi_country_hdr.country_name === 'Malaysia') {
          this.countryArr.unshift({
            country_name: this.countries[key].bl_fi_country_hdr.country_name,
            country_code: this.countries[key].bl_fi_country_hdr.alpha3_code,
            state: this.countries[key].bl_fi_country_hdr.states_json
          });
        } else {
          this.countryArr.push({
            country_name: this.countries[key].bl_fi_country_hdr.country_name,
            country_code: this.countries[key].bl_fi_country_hdr.alpha3_code,
            state: this.countries[key].bl_fi_country_hdr.states_json
          });
        }
      }
      this.newCountryArr = this.countryArr;
    });
  }
  applyCountryFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.newCountryArr = this.countryArr.filter((option) => option.country_name.toLowerCase().includes(filterValue));
  }
  applyBankFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.bankType = this.bankType.filter((option) => option.viewValue.toLowerCase().includes(filterValue));
  }
  applySettlementIdentifierFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.settlementIdentifierCodeList = SettlementTypeOptions.values;
    this.settlementIdentifierCodeList = this.settlementIdentifierCodeList.filter((option) => option.viewValue.toLowerCase().includes(filterValue));
  }
  getAllSettlementMethods() {
    this.settlementMethodService.getByCriteriaPromise(this.paging, this.apiVisa)
      .then((resp: PagingResponseModel<SettlementMethodContainerModel>) => {
        this.settlementArr = resp.data;
        for (const key in this.settlementArr) {
          if (this.settlementArr[key]) {
            this.settlementGuid = this.settlementArr[key].bl_fi_mst_item_hdr.guid;
            this.settlementName = this.settlementArr[key].bl_fi_mst_item_hdr.name;
            this.settlementExtList = this.settlementArr[key].bl_fi_mst_item_exts;
            this.settlementExt = this.settlementExtList.filter((option) =>
              option.param_name == "SETTLEMENT_TYPE"
            )
            var settlementCode: string = "NO_IDENTIFIER_CODE";
            if (!!this.settlementExt[0]) {
              settlementCode = this.settlementExt[0].value_string.toString()
            }
            this.settlementArr1.push({
              settlement_guid: this.settlementGuid,
              settlement_name: this.settlementName,
              settlement_code: settlementCode
            });
            this.newSettlement = this.settlementArr1;
          }

        }
        console.log("SETTLEMENT ARRAY", this.newSettlement);
      });

  }

  onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateAdd: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
    // this.store.dispatch(CustomerActions.updateAgGridDone({ status: true }));
  }

  onSave() {
    const userGuid = localStorage.getItem('guid');
    const date = new Date();
    this.priceConfigInfo.patchValue(
      {
        createdBy: userGuid,
        createdDate: date,
        modifiedBy: userGuid,
        modifiedDate: date,
      });
    // const selectedCountry = this.newCountryArr.filter((option) => option.country_name.toLowerCase() == (this.priceConfigInfo.value.country.toLowerCase()));
    // console.log("TEST COUNTRY CODE", selectedCountry[0].country_code);

    const selectedSettlementMethod = this.newSettlement.filter((option) => option.settlement_name.toLowerCase() == (this.priceConfigInfo.value.paymentType.toLowerCase()));
    console.log("TEST SETTLEMENT NAME", selectedSettlementMethod[0].settlement_name);

    const priceConfigValue = {
      ...this.priceConfigInfo.value,
      // countryCode: selectedCountry[0].country_code.toString(),
      settlementGuid: selectedSettlementMethod[0].settlement_guid.toString()
    };

    const newPaymentConfig = this.createPaymentConfig(priceConfigValue);
    console.log("NEW PAYMENT CONFIG", newPaymentConfig);

    //Test Dispatch
    const paymentConfigModel = new EntityPaymentMethodContainerModel;
    paymentConfigModel.bl_fi_mst_entity_payment_method = newPaymentConfig;
    this.store.dispatch(CustomerActions.createNewPaymentConfig({
      model: paymentConfigModel
    }))

    // this.priceConfigInfo
    this.addSuccess = 'Success';
    this.isClicked = 'buttonSuccess';
    setTimeout(() => {
      this.addSuccess = 'Add';
      this.isClicked = 'primary';
      this.priceConfigInfo.reset();
    }, 1500);

    this.onReturn();

  }

  createNewCustomerExt(
    param_code: string,
    param_name: string,
    param_type: string,
    param_value: any,
  ) {
    const obj = new bl_fi_mst_entity_ext_RowClass();
    obj.param_name = param_name;
    obj.param_code = param_code;
    obj.status = 'ACTIVE';
    obj.param_type = param_type;
    if (param_type.toUpperCase() === 'STRING') {
      obj.value_string = param_value;
    } else if (param_type.toUpperCase() === 'DATE') {
      obj.value_datetime = param_value;
    } else if (param_type.toUpperCase() === 'NUMERIC') {
      obj.value_numeric = param_value;
    } else if (param_type.toUpperCase() === 'JSON') {
      obj.value_json = param_value;
    } else {
      obj.value_file = param_value;
    }
    return obj;
  }

  createPaymentConfig(priceConfigValue: any) {
    const userGuid = localStorage.getItem('guid');
    const date = new Date();
    const obj = new bl_fi_mst_entity_payment_method_RowClass();
    obj.hdr_guid = this.customerGuid;
    obj.item_guid = priceConfigValue.settlementGuid;
    obj.country_code = priceConfigValue.country;
    obj.account_type = priceConfigValue.paymentType;
    obj.account_name = priceConfigValue.bankAccName;
    obj.account_number = priceConfigValue.bankAccNo;
    obj.payment_provider_code = priceConfigValue.bankCode;
    obj.created_by_subject_guid = userGuid;
    obj.updated_by_subject_guid = userGuid;
    obj.created_date = date;
    obj.updated_date = date;
    obj.account_expiry = priceConfigValue.expiryDate;
    obj.payment_provider_code = priceConfigValue.bankCode;
    obj.ibn_number = priceConfigValue.IBN_No;
    obj.residential_status = priceConfigValue.residentialStatus;
    obj.bank_name = priceConfigValue.bank;

    return obj;
  }

  onPaymentMethodChange(e: string) {
    console.log("SELECTED SETTLEMENT: ", e)
    this.settlementIdentifierCode = this.newSettlement.filter((option) => option.settlement_name == e)[0].settlement_code;
    console.log("SELECTED SETTLEMENT ID CODE: ", this.settlementIdentifierCode);
    this.priceConfigInfo.patchValue({
      bankCode: this.settlementIdentifierCode
    })
  }

}
