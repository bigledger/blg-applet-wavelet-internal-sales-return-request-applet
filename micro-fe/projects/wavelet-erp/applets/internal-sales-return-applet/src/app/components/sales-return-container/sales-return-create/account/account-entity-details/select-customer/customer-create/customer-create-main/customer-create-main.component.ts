import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ApiVisa, AssetsService, bl_fi_mst_entity_line_RowClass, CountryService, CurrencyService, EntityBusinessNatureHdrService, EntityContainerModel, GlcodeService } from 'blg-akaun-ts-lib';
import { AppConfig } from 'projects/shared-utilities/visa';
import { ARAPTypeOptions } from 'projects/wavelet-erp/shared-utilities/models/entity-constant.model';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink2';
import { switchMap, toArray } from 'rxjs/operators';
import { MonthOptions } from 'projects/shared-utilities/models/constants.model';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { Store } from '@ngrx/store';
import { ENTITY } from '../../../../../../../../models/customer-constants';

@Component({
  selector: 'app-customer-create-main',
  templateUrl: './customer-create-main.component.html',
  styleUrls: ['./customer-create-main.component.css']
})
export class CustomerCreateMainComponent implements OnInit {

  protected subs = new SubSink();

  @Input() draft$: Observable<EntityContainerModel>;

  @Output() updateDraft = new EventEmitter<any>();
  @Output() validDraft = new EventEmitter<any>();

  form: FormGroup;

  apiVisa = AppConfig.apiVisa;

  arapType = ARAPTypeOptions.values;
  type = [
    { value: 'CORPORATE', viewValue: 'CORPORATE' },
    { value: 'INDIVIDUAL', viewValue: 'INDIVIDUAL' }
  ];
  status = [
    { value: 'ACTIVE', viewValue: 'ACTIVE' },
    { value: 'INACTIVE', viewValue: 'INACTIVE' }
  ];
  idType = [
    { value: 'PASSPORT', viewValue: 'PASSPORT' },
    { value: 'IDENTITY_CARD', viewValue: 'IDENTITY CARD (IC)' }
  ];
  gender = [
    { value: 'MALE', viewValue: 'MALE' },
    { value: 'FEMALE', viewValue: 'FEMALE' },
    { value: 'TRANS', viewValue: 'TRANSGENDER' },
    { value: 'RNS', viewValue: 'RATHER NOT SAY' },
  ];
  months = MonthOptions.values;
  eType = ENTITY;


  id_placeholder = 'ID Number';
  taxID_placeholder = 'Tax Registration Number'
  newGlCode: any = [];
  glCodeArr: any = [];

  glcodeGuid: any;
  glCodeArr1: any = [];
  glcodeName: any;
  newGlCode1: any = [];
  currency: any;
  currencyCode: any;
  currencyName: any;
  currencyArr: any = [];
  newCurrencyArr: any = [];
  countries: any;
  countryArr: any = [];
  newCountryArr: any = [];
  businessNatures: any;
  businessNatureArr: any = [];
  newBusinessNatureArr: any = [];
  types: any = [];
  newCurrency: any;
  isEmployee = false;
  constructor(
    private fb: FormBuilder,
    private glcodeService: GlcodeService,
    private currencyService: CurrencyService,
    private countryService: CountryService,
    private businessNatureService: EntityBusinessNatureHdrService,
    private readonly sessionStore: Store<SessionStates>,
  ) { }

  ngOnInit() {
    this.getCurrency();
    this.form = this.fb.group({
      code: ['', Validators.compose([Validators.required])],
      name: ['', Validators.compose([Validators.required])],
      type: ['', Validators.compose([Validators.required])],
      eType: ['', Validators.compose([Validators.required])],
      gender: [],
      id_number: [],
      id_number_old: [],
      country: [],
      currentCountry: [],
      currency: ['', Validators.compose([Validators.required])],
      currentCurrency: [''],
      status: [''],
      // creditTerms: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      // creditLimit: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      description: [],
      arap_type: ['', Validators.compose([Validators.required])],
      glCode: ['', Validators.compose([Validators.required])],
      currentGlCode: [],
      taxID: [''],
      id_type: [''],
      dob: [''],
      fiscal_year_end: [],
      taxCategory: [''],
      email: [''],
      phone: [''],
      business_nature: [],
      currentBusinessNature: [],
      classification: [],
      sst_number: [],
      sst_exemption_number: [],
      gst_number: [],
      wht_number: [],
      url: [],
    });
    this.subs.sink = this.sessionStore.select(SessionSelectors.selectMasterSettings).subscribe(
      (settings) => {
        console.log("Settings", settings);
        this.form.patchValue({
          type: settings?.DEFAULT_CUST_TYPE ? settings.DEFAULT_CUST_TYPE : 'CORPORATE',
          country: settings?.DEFAULT_COUNTRY ? settings.DEFAULT_COUNTRY : null,
          currency: settings?.DEFAULT_CURRENCY ? settings.DEFAULT_CURRENCY : null,
          arap_type: 'AR_TRADE',
          eType: ['CUSTOMER'],
          status: 'ACTIVE'
        });
      }
    )

    // getting GL code
    this.glcodeService.get(this.apiVisa).pipe(
      switchMap((x: any) => {
        return x.data;
      }),
      toArray()
    ).subscribe((x: any) => {
      this.glCodeArr = x;
      for (const key in this.glCodeArr) {
        if (this.glCodeArr[key]) {
          this.glcodeGuid = this.glCodeArr[key].bl_fi_mst_glcode.guid;
          this.glcodeName = this.glCodeArr[key].bl_fi_mst_glcode.name;
          this.glCodeArr1.push({
            glcode_guid: this.glcodeGuid,
            glcode_name: this.glcodeName,
          });
        }

      }
      this.newGlCode1 = this.glCodeArr1;
      console.log('new gl code', this.newGlCode1);
    }
    );
    this.glcodeService.get(this.apiVisa)
      .subscribe(
        (x: any) => {
          x.data.forEach(data => {
            data.bl_fi_mst_glcode;
            this.glCodeArr.push(data.bl_fi_mst_glcode);
          });
          this.newGlCode = this.glCodeArr;
        }
      );

    // this.draft$.subscribe(draft => {
    // });
    this.monitorChanges();
    this.getCurrency();
    this.getCountry();
    this.getBusinessNature();
  }
  getCountry() {
    this.subs.sink = this.countryService.get(this.apiVisa).pipe(
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
            country_code: this.countries[key].bl_fi_country_hdr.alpha3_code
          });
        } else {
          this.countryArr.push({
            country_name: this.countries[key].bl_fi_country_hdr.country_name,
            country_code: this.countries[key].bl_fi_country_hdr.alpha3_code
          });
        }
      }
      this.newCountryArr = this.countryArr;
    });
  }
  getCurrency() {
    this.currencyService.get(this.apiVisa).subscribe((x: any) => {
      for (const key in x.data) {
        if (x.data[key]) {
          if (x.data[key].bl_fi_mst_ccy.code === 'MYR') {
            this.currencyArr.unshift(
              x.data[key].bl_fi_mst_ccy
            );
          }
          this.currencyArr.push(x.data[key].bl_fi_mst_ccy);
        }
      }
      this.newCurrency = this.currencyArr;
    });
  }
  getBusinessNature() {
    this.subs.sink = this.businessNatureService.getPublic(this.apiVisa).pipe(
      switchMap((x: any) => {
        return x.data;
      }),
      toArray()
    ).subscribe((x: any) => {
      this.businessNatures = x;
      for (const key in this.businessNatures) {
        this.businessNatureArr.push({
          nature_name: this.businessNatures[key].bl_fi_mst_entity_business_nature_hdr.title,
          nature_code: this.businessNatures[key].bl_fi_mst_entity_business_nature_hdr.code
        });
      }
      this.newBusinessNatureArr = this.businessNatureArr;
    })
  }
  monitorChanges() {
    this.form.valueChanges.subscribe(a => {
      this.updateDraft.emit(a);
      if (this.form.valid) {
        this.validDraft.emit('true');
      }
    }
    );
  }

  applyGLCodeFilter(filterValue: string) {
    console.log('this is filtervalue', filterValue);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.newGlCode1 = this.glCodeArr1.filter((option) => option.glcode_name.toLowerCase().includes(filterValue));
  }
  applyCurrencyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.newCurrency = this.currencyArr.filter((option) => option.display_main.toLowerCase().includes(filterValue) ||
      option.display_short.toLowerCase().includes(filterValue));
  }
  applyCountryFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.newCountryArr = this.countryArr.filter((option) => option.country_name.toLowerCase().includes(filterValue));
  }
  applyNatureFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.newBusinessNatureArr = this.businessNatureArr.filter((option) => 
      option.nature_name.toLowerCase().includes(filterValue) || option.nature_code.toLowerCase().includes(filterValue));
  }
  onTypeChange(type) {

    if (type.value === 'INDIVIDUAL') {
      if (this.form.value.id_type === null) {
        this.form.patchValue({
          id_type: 'IDENTITY_CARD',
        });
      }
      this.id_placeholder = 'ID Number';
      this.taxID_placeholder = 'Tax Registration Number'
    } else if (type.value === 'CORPORATE') {
      this.id_placeholder = 'Company Registration Number';
      this.taxID_placeholder = 'Company Tax Registration Number'
    }
  }
  onEntityChange(event: any) {
    console.log('selectedevent', event);
    if (event.value.includes('EMPLOYEE')) {
      this.isEmployee = true;
      this.type = [
        { value: 'INDIVIDUAL', viewValue: 'INDIVIDUAL' }
      ];
      this.form.patchValue({
        type: null,
      });
    } else {
      this.isEmployee = false;
      this.type = [
        { value: 'CORPORATE', viewValue: 'CORPORATE' },
        { value: 'INDIVIDUAL', viewValue: 'INDIVIDUAL' }
      ];
    }
  }
  onSubmit() {

  }
}
