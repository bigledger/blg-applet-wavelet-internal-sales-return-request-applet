import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { bl_fi_mst_entity_ext_RowClass, bl_fi_mst_entity_line_RowClass, bl_fi_mst_entity_payment_method_RowClass, bl_fi_mst_item_ext_RowClass, CountryService, EntityPaymentMethodContainerModel, Pagination, PagingResponseModel, SettlementMethodContainerModel, SettlementMethodService } from 'blg-akaun-ts-lib';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { switchMap, toArray } from 'rxjs/operators';
import { AppConfig } from 'projects/shared-utilities/visa';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { SubSink } from 'subsink2';
import { C } from '@angular/cdk/keycodes';

import { ViewColumnFacade } from '../../../../../../../../../facades/view-column.facade';
import { CustomerActions } from '../../../../../../../../../state-controllers/customer-controller/actions';
import { CustomerSelectors } from '../../../../../../../../../state-controllers/customer-controller/selectors';
import { CustomerStates } from '../../../../../../../../../state-controllers/customer-controller/states';
import { CustomerConstants, SettlementTypeOptions } from '../../../../../../../../../models/customer-constants';

@Component({
  selector: 'app-payment-edit',
  templateUrl: './payment-config-edit.component.html',
  styleUrls: ['./payment-config-edit.component.css']
})
export class EditPaymentConfigComponent extends ViewColumnComponent implements OnInit {

  form: FormGroup;

  @Input() customerExtLineItem$: Observable<bl_fi_mst_entity_line_RowClass>;
  priceConfigInfo: FormGroup;
  deactivateReturn$;
  // @Input() customerExtLineItem$: Observable<bl_fi_mst_entity_line_RowClass>;

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
  paymentType = [
    { value: 'CASH', viewValue: 'Cash' },
    { value: 'BANK TRANSFER', viewValue: 'Bank Transfer' },
    { value: 'CREDIT CARD', viewValue: 'Credit Card' },
    { value: 'TNG E-WALLET', viewValue: 'TNG e-Wallet' },
    { value: 'VOUCHER', viewValue: 'Voucher' },
    { value: 'CHEQUE', viewValue: 'Cheque' },
    { value: 'JOMPAY', viewValue: 'JomPay' },
    { value: 'TELEGRAPHIC TRANSFER', viewValue: 'Telegraphic Transfer' },
    { value: 'GIRO', viewValue: 'GIRO' },
    { value: 'OTHERS', viewValue: 'Others' },
  ];
  country = [
    { value: 'Malaysia', viewValue: 'Malaysia' },
    { value: 'Singapore', viewValue: 'Singapore' },
    { value: 'Thailand', viewValue: 'Thailand' },
    { value: 'Indonesia', viewValue: 'Indonesia' }
  ];
  protected readonly index = 18;
  prevIndex: number;
  private prevLocalState: any;
  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  newSettlement: any[];
  settlementList: SettlementMethodContainerModel[];
  settlementListguid;
  settlementIdentifierCodeList = SettlementTypeOptions.values;
  settlementIdentifierCode: string;
  settlementExtList: bl_fi_mst_item_ext_RowClass[];
  settlementExt: bl_fi_mst_item_ext_RowClass[];
  settlementArr: any;
  settlementGuid: any;
  settlementName: any;
  settlementArr1: any = [];
  apiVisa = AppConfig.apiVisa;
  paging = new Pagination();
  @Input() customerExt$: Observable<any>;
  paymentExt: any;
  addSuccess = 'Save';
  isClicked = 'primary';
  countryArr: any = [];
  newCountryArr: any = [];
  countries: any;
  customerGuid: string;
  protected subs = new SubSink()
  selectedCustomerGuid$: Observable<string> = this.store.select(CustomerSelectors.selectGuid);
  constructor(private fb: FormBuilder,
    private countryService: CountryService,
    private readonly store: Store<CustomerStates>,
    private viewColFacade: ViewColumnFacade,
    private settlementMethodService: SettlementMethodService,
  ) {
    super();
  }

  ngOnInit() {
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
    this.subs.sink = this.selectedCustomerGuid$.subscribe(data => {
      this.customerGuid = data;
    })
    this.customerExt$ = this.store.select(CustomerSelectors.selectExt);
    this.customerExt$.subscribe(
      data => {
        this.paymentExt = data[0];
        // let extData = data[0].ext.value_json;
        let extData = data[0];
        console.log(data, 'this is rowdata payment')
        this.priceConfigInfo.patchValue(
          {
            status: extData.status,
            paymentType: extData.config_name,
            bank: extData.bank_name,
            bankCode: extData.payment_provider_code,
            bankAccNo: extData.account_number,
            bankAccName: extData.account_name,
            IBN_No: extData.ibn_number,
            // guid: extData.guid,
            createdBy: extData.created_by_subject_guid,
            createdDate: extData.created_date,
            modifiedBy: extData.updated_by_subject_guid,
            modifiedDate: extData.updated_date,
            country: extData.country_code,
            expiryDate: extData.account_expiry,
            guid: extData.guid,
            revision: extData.revision,
            residentialStatus: extData.residential_status
          },
        );
      }
    )
    this.getCountry();
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
  applySettlementIdentifierFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.settlementIdentifierCodeList = SettlementTypeOptions.values;
    this.settlementIdentifierCodeList = this.settlementIdentifierCodeList.filter((option) => option.viewValue.toLowerCase().includes(filterValue));
  }
  getAllSettlementMethods() {
    let paging = new Pagination();
    paging.sortCriteria = [
      { columnName: 'calcTotalRecords', value: 'true' },
    ];
    this.settlementMethodService.getByCriteriaPromise(paging, this.apiVisa)
      .then((resp: PagingResponseModel<SettlementMethodContainerModel>) => {
        this.settlementArr = resp.data;
        console.log(this.settlementArr, 'settlementArr');
        for (const key in this.settlementArr) {
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
          }
          );
        }

        this.newSettlement = this.settlementArr1;
        console.log(this.newSettlement, 'newSettlement');

      });
  }
  // Telegraphic Transfer, GIRO and JOmPay
  onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateAdd: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  onSave() {
    // console.log('this is onsave', this.paymentExt);
    // this.paymentExt.ext.value_json = this.priceConfigInfo.value

    const selectedSettlementMethod = this.newSettlement.filter((option) => option.settlement_name.toLowerCase() == (this.priceConfigInfo.value.paymentType.toLowerCase()));
    console.log("TEST SETTLEMENT NAME", selectedSettlementMethod[0].settlement_name);

    const priceConfigValue = {
      ...this.priceConfigInfo.value,
      // countryCode: selectedCountry[0].country_code.toString(),
      settlementGuid: selectedSettlementMethod[0].settlement_guid.toString()
    };

    const newPaymentConfig = this.createPaymentConfig(priceConfigValue);
    console.log("NEW PAYMENT CONFIG", newPaymentConfig);

    const paymentMethodModel = new EntityPaymentMethodContainerModel;
    paymentMethodModel.bl_fi_mst_entity_payment_method = newPaymentConfig;

    this.store.dispatch(CustomerActions.editSelectedPaymentConfig({
      paymentConfig: paymentMethodModel
    }))

    // this.store.dispatch(CustomerActions.editPaymentConfigExt({ guid: this.priceConfigInfo.value.guid, ext: this.paymentExt.ext }));
    this.addSuccess = 'Success';
    this.isClicked = 'buttonSuccess';
    setTimeout(() => {
      this.addSuccess = 'Save';
      this.isClicked = 'primary';
    }, 1500)
    this.onReturn();
  }
  onRemove() {
    console.log('DELETE ATTEMPT')
    this.priceConfigInfo.patchValue(
      {
        status: 'DELETED'
      },
    );
    this.onSave();
    this.priceConfigInfo.reset();
  }

  createPaymentConfig(priceConfigValue: any) {
    const userGuid = localStorage.getItem('guid');
    const date = new Date();
    const obj = new bl_fi_mst_entity_payment_method_RowClass();
    obj.guid = priceConfigValue.guid;
    obj.hdr_guid = this.customerGuid;
    obj.item_guid = priceConfigValue.settlementGuid;
    obj.country_code = priceConfigValue.country;
    obj.account_type = priceConfigValue.paymentType;
    obj.account_name = priceConfigValue.bankAccName;
    obj.account_number = priceConfigValue.bankAccNo;
    obj.payment_provider_code = priceConfigValue.bankCode;
    obj.created_by_subject_guid = userGuid;
    obj.updated_by_subject_guid = userGuid;
    obj.created_date = priceConfigValue.createdDate;
    obj.updated_date = date;
    obj.account_expiry = priceConfigValue.expiryDate;
    obj.payment_provider_code = priceConfigValue.bankCode;
    obj.status = priceConfigValue.status;
    obj.revision = priceConfigValue.revision;
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
