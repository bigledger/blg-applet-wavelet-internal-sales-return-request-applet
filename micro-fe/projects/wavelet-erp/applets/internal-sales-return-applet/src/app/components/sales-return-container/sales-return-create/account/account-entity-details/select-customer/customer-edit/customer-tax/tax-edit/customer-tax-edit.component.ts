import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiResponseModel, bl_fi_mst_entity_ext_RowClass, bl_fi_mst_entity_line_RowClass, Pagination, SettlementMethodContainerModel, TaxCodeCfgService, TaxCodeContainerModel, } from 'blg-akaun-ts-lib';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppConfig } from 'projects/shared-utilities/visa';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { ViewColumnFacade } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/facades/view-column.facade';
import { CustomerConstants } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/models/customer-constants';
import { CustomerActions } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/actions';
import { CustomerSelectors } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/selectors';
import { CustomerStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/states';


@Component({
  selector: 'app-payment-edit',
  templateUrl: './customer-tax-edit.component.html',
  styleUrls: ['./customer-tax-edit.component.css']
})
export class EditTaxComponent extends ViewColumnComponent implements OnInit {

  form: FormGroup;

  // @Input() customerExtLineItem$: Observable<bl_fi_mst_entity_line_RowClass>;
  taxInfo: FormGroup;
  deactivateReturn$;
  // @Input() customerExtLineItem$: Observable<bl_fi_mst_entity_line_RowClass>;

  country = [
    { value: 'Malaysia', viewValue: 'Malaysia' },
    { value: 'Singapore', viewValue: 'Singapore' },
    { value: 'Thailand', viewValue: 'Thailand' },
    { value: 'Indonesia', viewValue: 'Indonesia' }
  ];
  taxType: any;
  malaysiaTaxType = [
    { value: 'GST-INPUT', viewValue: 'GST Input' },
    { value: 'GST-OUTPUT', viewValue: 'GST Output' },
    { value: 'SST-SLS-INPUT', viewValue: 'SST Sales Tax Input' },
    { value: 'SST-SLS-OUTPUT', viewValue: 'SST Sales Tax Output' },
    { value: 'SST-SVC-INPUT', viewValue: 'SST Service Tax Input' },
    { value: 'SST-SVC-OUTPUT', viewValue: 'SST Service Tax Output' },
    { value: 'WTH-INPUT', viewValue: 'Withholding Tax Input' },
    { value: 'WTH-OUTPUT', viewValue: 'Withholding Tax Output' },

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

  protected readonly index = 20;
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
  @Input() customerExt$: Observable<any>;
  taxData: any[];
  selectedCountry: any;
  taxCode: any[] = [];
  editData: any[] = [];
  taxExt: any;
  isClicked = 'primary';
  addSuccess = 'Add';
  constructor(private fb: FormBuilder,
    private readonly store: Store<CustomerStates>,
    private viewColFacade: ViewColumnFacade,
    private taxService: TaxCodeCfgService,
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
      guid: ['', Validators.required],
      status: [''],
    });

    this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.customerExt$ = this.store.select(CustomerSelectors.selectExt);
    this.customerExt$.subscribe(
      data => {
        this.taxExt = data[0];
        console.log(data, 'this is rowdata payment');
        const extData = data[0].ext.value_json;
        this.editData = [];
        this.editData = data;

        this.onCountryChange(extData.country);
        if (this.taxCode) {
          this.taxInfo.patchValue(
            {
              country: extData.country,
              tax_code: extData.tax_code,
              tax_type: extData.tax_type,
              tax_rate: extData.tax_rate,
              tax_option: extData.tax_option,
              guid: data[0].ext.guid,
            },
          );
          console.log(this.taxInfo.value.tax_code, 'exem');
        }
      }
    );
  }
  onCountryChange(type) {
    // if (type.value === 'Malaysia') {
    //   this.taxType = this.malaysiaTaxType;
    // } else if (type.value === 'Singapore') {
    //   this.taxType = this.singaporeTaxType;
    // } else if (type.value === 'Thailand') {
    //   this.taxType = this.thailandTaxType;
    // }
    let firstCall = false;
    let country;
    if (type.value) {
      country = type.value;
    } else {
      firstCall = true;
      country = type;
    }
    this.taxData = [];
    this.taxType = [];
    this.taxCode = [];
    this.selectedCountry = country;
    const paging = new Pagination();
    paging.conditionalCriteria = [
      { columnName: 'tax_country', operator: '=', value: country },
      // { columnName: "tax_gst_type", operator: "=", value: type },
      { columnName: 'calcTotalRecords', operator: '=', value: 'true' },
    ];
    console.log('getlabellist paging', paging);
    this.taxService.getByCriteria(paging, this.apiVisa).subscribe(
      (resp: ApiResponseModel<TaxCodeContainerModel>) => {
        console.log('getlabellist resp', resp);
        if (resp.data != null) {
          this.taxData = resp.data;
          if (firstCall) {
            this.onTypeChange(this.editData[0].ext.value_json.tax_type);
          }
          resp.data.forEach((taxType) => {
            console.log('insid', taxType);
            if (this.taxType.findIndex(function (e) { return e.tax_gst_type === taxType.bl_fi_cfg_tax_code.tax_gst_type; }) === -1) {
              this.taxType.push(taxType.bl_fi_cfg_tax_code);
              console.log('inside type', taxType);
            }
          });
        } else {
          console.log('ERROR getLabelList: empty data');
        }
      },
      (error) => {
        console.log('ERROR getLabelList: ', error);
      }
    );

  }
  onTypeChange(type) {
    console.log('ERROR getLabelList:type ', type);
    let selectedTaxType;
    if (type.value) {
      selectedTaxType = type.value;
    } else {
      selectedTaxType = type;
    }
    this.taxCode = [];
    console.log(this.taxData, 'taxdata');

    this.taxData.forEach((taxType) => {
      console.log(this.selectedCountry, 'thisdsfa is type');
      if (taxType.bl_fi_cfg_tax_code.tax_gst_type.toString() == selectedTaxType.toString() && taxType.bl_fi_cfg_tax_code.tax_country.toString() == this.selectedCountry
      ) {
        this.taxCode.push(taxType.bl_fi_cfg_tax_code);
      }
    });
  }
  onCodeChange(type) {
    console.log(type, 'code typw');
    this.taxData.forEach((taxType) => {
      if (type.value == taxType.bl_fi_cfg_tax_code.tax_code) {
        this.taxInfo.patchValue({
          tax_rate: taxType.bl_fi_cfg_tax_code.tax_rate_filing
          // tax_code: type.value.tax_code
        });
      }
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
    console.log('this is onsave', this.taxInfo.value);
    let datatopass;
    const substring = '.';
    let adjPrice: string = this.taxInfo.value.tax_rate.toString();
    if (adjPrice.includes(substring)) {
      datatopass = adjPrice;
    } else if (adjPrice) {
      adjPrice += '.00';
      datatopass = adjPrice;
    }
    this.taxInfo.patchValue(
      {
        tax_rate: datatopass,
      });
    console.log(this.taxInfo.value.guid, 'value');
    this.taxExt.ext.value_json = this.taxInfo.value;
    this.store.dispatch(CustomerActions.editTaxExt({ guid: this.taxInfo.value.guid, ext: this.taxExt.ext }));
    // this.taxInfo.reset();
    this.addSuccess = 'Success';
    this.isClicked = 'buttonSuccess';
    setTimeout(() => {
      this.addSuccess = 'Add';
      this.isClicked = 'primary';
    }, 1500);
  }
  onRemove() {
    this.taxInfo.patchValue(
      {
        status: 'DELETED'
      },
    );
    this.taxExt.ext.status = 'DELETED';
    this.store.dispatch(CustomerActions.editTaxExt({ guid: this.taxInfo.value.guid, ext: this.taxExt.ext }));
    this.taxInfo.reset();
    this.addSuccess = 'DELETED';
    this.onReturn();
  }

}
