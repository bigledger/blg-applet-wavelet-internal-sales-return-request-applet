import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ApiResponseModel, bl_fi_mst_entity_ext_RowClass, bl_fi_mst_entity_line_RowClass, Pagination, PagingResponseModel, SettlementMethodContainerModel, SettlementMethodService, TaxCodeCfgService, TaxCodeContainerModel } from 'blg-akaun-ts-lib';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { ViewColumnFacade } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/facades/view-column.facade';
import { CustomerConstants } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/models/customer-constants';
import { CustomerActions } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/actions';
import { CustomerStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/states';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-payment-create',
  templateUrl: './customer-tax-create.component.html',
  styleUrls: ['./customer-tax-create.component.css']
})
export class CreateTaxComponent extends ViewColumnComponent implements OnInit {

  taxInfo: FormGroup;
  deactivateReturn$;
  @Input() customerExtLineItem$: Observable<bl_fi_mst_entity_line_RowClass>;

  country = [
    { value: 'Malaysia', viewValue: 'Malaysia' },
    { value: 'Singapore', viewValue: 'Singapore' },
    { value: 'Thailand', viewValue: 'Thailand' },
    { value: 'Indonesia', viewValue: 'Indonesia' }
  ];
  taxType: any[] = [];
  malaysiaTaxType = [
    { value: 'GST-INPUT', viewValue: 'GST Input' },
    { value: 'GST-OUTPUT', viewValue: 'GST Output' },
    { value: 'SST-SLS-INPUT', viewValue: 'SST Sales Tax Input' },
    { value: 'SST-SLS-OUTPUT', viewValue: 'SST Sales Tax Output' },
    { value: 'SST-SVC-INPUT', viewValue: 'SST Service Tax Input' },
    { value: 'SST-SVC-OUTPUT', viewValue: 'SST Service Tax Output' },
    { value: 'WITH-INPUT', viewValue: 'Withholding Tax Input' },
    { value: 'WITH-OUTPUT', viewValue: 'Withholding Tax Output' },
  ];
  singaporeTaxType = [
    { value: 'VAT-SALES', viewValue: 'VAT Sales Tax' },
    { value: 'VAT-PURCHASE', viewValue: 'VAT Purchase Tax' },
  ];
  thailandTaxType = [
    { value: 'VAT-SALES', viewValue: 'VAT Sales Tax' },
    { value: 'VAT-PURCHASE', viewValue: 'VAT Purchase Tax' },
  ];
  taxOption = [
    { value: 'INCLUDE TAX', viewValue: 'Include Tax' },
    { value: 'EXCLUDE TAX', viewValue: 'Exclude Tax' },
  ];
  protected readonly index = 19;
  prevIndex: number;
  private prevLocalState: any;
  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  settlementListguid;
  settlementArr: any;
  settlementGuid: any;
  settlementName: any;
  settlementArr1: any = [];
  apiVisa = AppConfig.apiVisa;
  paging = new Pagination();
  taxData: TaxCodeContainerModel[];
  taxCode: any[] = [];
  selectedCountry: any;
  taxTypeArray: any = [];
  addSuccess = 'Add';
  isClicked = 'primary';
  constructor(
    private taxService: TaxCodeCfgService,
    private readonly store: Store<CustomerStates>,
    private fb: FormBuilder,
    private viewColFacade: ViewColumnFacade,
  ) {
    super();
  }

  ngOnInit() {
    this.taxInfo = this.fb.group({
      country: ['', Validators.required],
      tax_code: ['', Validators.required],
      tax_type: ['', Validators.required],
      tax_rate: ['', Validators.required],
      tax_option: ['', Validators.required],
    });

    this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
  }

  onCountryChange(type) {
    this.taxData = [];
    this.taxCode = [];
    this.taxType = [];
    this.selectedCountry = type.value;
    let paging = new Pagination();
    paging.conditionalCriteria = [
      { columnName: "tax_country", operator: "=", value: type.value },
      { columnName: "calcTotalRecords", operator: "=", value: 'true' },
    ];
    console.log("getlabellist paging", paging);
    this.taxService.getByCriteria(paging, this.apiVisa).subscribe(
      (resp: ApiResponseModel<TaxCodeContainerModel>) => {
        console.log("getlabellist resp", resp);
        this.taxTypeArray = [];
        this.taxType = [];
        if (resp.data != null) {
          this.taxData = resp.data;
          resp.data.forEach((taxType) => {
            if (this.taxTypeArray.findIndex(function (e) { return e.tax_wht_type === taxType.bl_fi_cfg_tax_code.tax_wht_type; }) === -1) {
              if (taxType.bl_fi_cfg_tax_code.tax_wht_type) {
                this.taxTypeArray.push(taxType.bl_fi_cfg_tax_code.tax_wht_type);
              }
              console.log(this.taxType, 'taxtypetax_wht_type');
            }
            if (this.taxTypeArray.findIndex(function (e) { return e.tax_gst_type === taxType.bl_fi_cfg_tax_code.tax_gst_type; }) === -1) {
              if (taxType.bl_fi_cfg_tax_code.tax_gst_type) {
                this.taxTypeArray.push(taxType.bl_fi_cfg_tax_code.tax_gst_type);
              }
              console.log(this.taxType, 'taxtypetax_gst_type');
            }
          });
        } else {
          console.log("ERROR getLabelList: empty data");
        } this.taxTypeArray.forEach((taxType) => {
          if (this.taxType.findIndex(function (e) { return e === taxType; }) === -1) {
            if (taxType) {
              this.taxType.push(taxType);
            }
            console.log(this.taxType, 'taxtypetax_gst_type');
          }
        }); console.log(this.taxType, 'after remove array');
      },
      (error) => {
        console.log("ERROR getLabelList: ", error);
      }
    );

  }

  onTypeChange(type) {
    this.taxCode = [];
    this.taxData.forEach((taxType) => {
      console.log(this.selectedCountry, 'thisdsfa is type');
      console.log(taxType, 'taxtype');
      console.log(type, 'typevalue');
      if ((taxType.bl_fi_cfg_tax_code.tax_gst_type.toString() == type.value.toString() || taxType.bl_fi_cfg_tax_code.tax_wht_type.toString() == type.value.toString())
        && taxType.bl_fi_cfg_tax_code.tax_country.toString() == this.selectedCountry
      ) {
        this.taxCode.push(taxType.bl_fi_cfg_tax_code);
      }
    })
  }

  onCodeChange(type) {
    console.log(type, 'code typw');
    this.taxInfo.patchValue({
      tax_rate: type.value.tax_rate_filing
    });
  }

  onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateAdd: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  onSave() {
    let userGuid = localStorage.getItem('guid');
    let date = new Date();
    console.log('this is onsave', userGuid, date);
    let datatopass;
    const substring = ".";
    let adjPrice: string = this.taxInfo.value.tax_rate.toString();
    if (adjPrice.includes(substring)) {
      datatopass = adjPrice;
    } else if (adjPrice) {
      adjPrice += '.00';
      datatopass = adjPrice;
    }

    this.taxInfo.patchValue(
      {
        tax_code: this.taxInfo.value.tax_code.tax_code,
        tax_rate: datatopass,
        createdBy: userGuid,
        createdDate: date,
        modifiedBy: userGuid,
        modifiedDate: date,
      })
    console.log('this is form value', this.taxInfo);

    const newTaxExt = this.createNewCustomerExt
      (CustomerConstants.TAX_DETAILS,
        CustomerConstants.TAX_DETAILS, 'JSON',
        this.taxInfo.value
      );
    this.store.dispatch(CustomerActions.createCustomerTaxExt({
      ext: newTaxExt
    }))
    this.taxInfo.reset();
    this.addSuccess = 'Success';
    this.isClicked = 'buttonSuccess';
    setTimeout(() => {
      this.addSuccess = 'Add';
      this.isClicked = 'primary';
      this.taxInfo.reset();
    }, 1500)

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

}
