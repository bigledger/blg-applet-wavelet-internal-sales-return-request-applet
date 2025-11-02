
import { Component, ChangeDetectionStrategy, ViewChild, ViewChildren, QueryList, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { ComponentStore } from '@ngrx/component-store';
import { select, Store } from '@ngrx/store';
// tslint:disable-next-line: max-line-length
import { ApiVisa, AppLoginPrincipalTenantService, bl_fi_mst_entity_ext_RowClass, bl_fi_mst_entity_line_RowClass, bl_fi_mst_entity_payment_method_RowClass, CurrencyService, CustomerService, EntityContainerModel, EntityLoginSubjectLinkService, EntityPaymentMethodContainerModel, GlcodeService, Pagination } from 'blg-akaun-ts-lib';
import { isEmpty } from 'lodash';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { LicenseKeyConstants } from 'projects/shared-utilities/license-keys';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { ViewColumnFacade } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/facades/view-column.facade';
import { CustomerConstants } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/models/customer-constants';
import { CustomerActions } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/actions';
import { CustomerSelectors } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/selectors';
import { CustomerStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/states';
import { ARAPTypeOptions } from 'projects/wavelet-erp/shared-utilities/models/entity-constant.model';
import { Observable, of, Subscription } from 'rxjs';
// import { toArray } from 'rxjs-compat/operator/toArray';
import { mergeMap, switchMap, tap, toArray } from 'rxjs/operators';
import { SubSink } from 'subsink2';


interface LocalState {
  deactivateReturn: boolean;
  deactivateList: boolean;
  selectedIndex: number;
  LimitIndex: number;
}
@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class CustomerEditComponent extends ViewColumnComponent implements OnInit, OnDestroy {

  protected compName = 'Customer Edit';
  protected readonly index = 12;
  private localState: LocalState;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateReturn$ = this.componentStore.select(state => state.localState.deactivateReturn);
  readonly deactivateList$ = this.componentStore.select(state => state.localState.deactivateList);
  readonly selectedIndex$ = this.componentStore.select(state => state.localState.selectedIndex);
  readonly LimitIndex$ = this.componentStore.select(state => state.localState.LimitIndex);

  prevIndex: number;
  private prevLocalState: any;

  customerExt$: Observable<any>;
  editLoginTab$: Observable<any>;
  editPaymentTab$: Observable<any>;
  editPaymentConfigTab$: Observable<bl_fi_mst_entity_payment_method_RowClass[]>;
  editTaxTab$: Observable<any>;
  editAddressTab$: Observable<any>;
  address$: any;
  editContactTab$: Observable<any>;
  editCreditTerm$: Observable<any>;
  editCreditLimit$: Observable<any>;
  @ViewChildren(MatTabGroup) maingroup: QueryList<MatTabGroup>;

  @ViewChild(MatTabGroup, { static: true }) matTab: MatTabGroup;
  toggleColumn$: Observable<boolean>;
  public form: FormGroup;
  froalaOptions: any = {
    placeholderText: 'Key in remarks',
    key: LicenseKeyConstants.FROALA_KEY
  };
  // Decide what you want to have here
  customer: EntityContainerModel;
  paymentConfigModel: EntityPaymentMethodContainerModel = new EntityPaymentMethodContainerModel;
  guidSubs: Subscription;
  customerLogin: Subscription;
  id_placeholder = 'ID Number';
  taxID_placeholder = 'Tax Registration Number'
  newGlCode: any = [];
  glCodeArr: any = [];
  editBranchTab$: Observable<any>;
  glcodeGuid: any;
  glCodeArr1: any = [];
  glcodeName: any;
  newGlCode1: any = [];
  currency: any;
  currencyCode: any;
  currencyName: any;
  currencyArr: any = [];
  newCurrencyArr: any = [];
  countryArr: any = [];
  newCountryArr: any = [];
  types: any = [];
  created_by: string;
  apiVisa = AppConfig.apiVisa;
  // : ApiVisa = {
  //   tenantCode: sessionStorage.getItem('tenantCode'),
  //   api_domain_url: environment.api_domain,
  //   jwt_secret: localStorage.getItem('authToken'),
  // };
  arapType = ARAPTypeOptions.values;
  type = [
    { value: 'CORPORATE', viewValue: 'CORPORATE' },
    { value: 'INDIVIDUAL', viewValue: 'INDIVIDUAL' }
  ];
  idType = [
    { value: 'PASSPORT', viewValue: 'PASSPORT' },
    { value: 'IDENTITY_CARD', viewValue: 'IDENTITY CARD (IC)' }
  ];
  status = [
    { value: 'ACTIVE', viewValue: 'ACTIVE' },
    { value: 'INACTIVE', viewValue: 'INACTIVE' }
  ];
  gender = [
    { value: 'MALE', viewValue: 'MALE' },
    { value: 'FEMALE', viewValue: 'FEMALE' },
    { value: 'TRANS', viewValue: 'TRANSGENDER' },
    { value: 'RNS', viewValue: 'RATHER NOT SAY' },
  ]

  guid: Observable<string>;
  newCurrency: any;
  getCurrency$: Observable<any>;
  isRequired = new FormControl(false);
  tempContainer: EntityContainerModel = new EntityContainerModel();
  protected subs = new SubSink();
  itemCategory$: Observable<any[]>;

  constructor(
    private toastr: ToastrService,
    private appLoginPrincipalService: AppLoginPrincipalTenantService,
    private _entityLoginSubjectLinkService: EntityLoginSubjectLinkService,
    private viewColFacade: ViewColumnFacade,
    private readonly componentStore: ComponentStore<{ localState: LocalState }>,
    private readonly store: Store<CustomerStates>,
    private customerService: CustomerService,
    private fb: FormBuilder,
    private glcodeService: GlcodeService,
    private currencyService: CurrencyService,
  ) {
    super();
  }

  ngOnInit() {
    // this.getLogin();

    this.form = this.fb.group({
      code: [{ value: '', disabled: true }],
      name: ['', Validators.compose([Validators.required])],
      type: ['', Validators.required],
      id_number: [],
      gender: [],
      id_type: [{ value: 'IDENTITY_CARD' }],
      currency: [],
      currentCurrency: [''],
      status: [''],
      taxID: [''],
      description: [],
      arap_type: [],
      glCode: [],
      currentGlCode: [],
      createdDate: [],
      createdBy: [],
      modifiedBy: [],
      updatedDate: [],
      remark: [''],
      email: [''],
      phone: ['']
    });
    this.form.patchValue({
      id_type: 'IDENTITY_CARD',
    });
    this.toggleColumn$ = this.viewColFacade.toggleColumn$;
    this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState({ localState: a });
    });
    this.customerExt$ = this.store.select(CustomerSelectors.selectContainer);
    // this.editAddressTab$ = this.store.select(CustomerSelectors.selectAddressExt);
    this.editAddressTab$ = this.store.select(CustomerSelectors.selectAddress);


    this.itemCategory$ = this.store.select(CustomerSelectors.selectItemCategory);
    this.subs.sink = this.customerExt$.subscribe(resolve => this.tempContainer = resolve);

    this.glCode();
    this.getCurrency();
    this.getByGuid();
  }
  // getCurrency() {
  //   this.currencyService.get(this.apiVisa).subscribe((x: any) => {
  //     for (const key in x.data) {
  //       if (x.data[key].bl_fi_mst_ccy.code === 'MYR') {
  //         this.currencyArr.unshift(
  //           x.data[key].bl_fi_mst_ccy
  //         );
  //       }
  //       this.currencyArr.push(x.data[key].bl_fi_mst_ccy);
  //     }
  //     this.newCurrency = this.currencyArr;
  //   });
  // }
  getCurrency() {
    let currency;
    if (this.newCurrency == null) {
      this.store.dispatch(CustomerActions.getCurrency({ currency: currency }));
    }
    this.getCurrency$ = this.store.select(CustomerSelectors.selectCurrency);
    this.subs.sink = this.getCurrency$.subscribe((eCurrency) => {
      if (eCurrency) {
        currency = eCurrency;
        for (const key in currency.data) {
          if (currency.data[key]) {
            if (currency.data[key].bl_fi_mst_ccy.code === 'MYR') {
              this.currencyArr.unshift(currency.data[key].bl_fi_mst_ccy);
            }
            this.currencyArr.push(currency.data[key].bl_fi_mst_ccy);
          }
        }
        this.newCurrency = this.currencyArr;
      }
    });
  }
  glCode() {
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
    // getting the currency

  }
  getByGuid() {

    this.editPaymentTab$ = this.store.select(CustomerSelectors.selectPaymentConfig);
    this.editPaymentConfigTab$ = this.store.select(CustomerSelectors.selectNewPaymentConfig);
    // this.editLoginTab$ = this.store.select(CustomerSelectors.selectLogin);
    this.editTaxTab$ = this.store.select(CustomerSelectors.selectTax);
    this.editAddressTab$ = this.store.select(CustomerSelectors.selectAddress);
    this.editContactTab$ = this.store.select(CustomerSelectors.selectContact);
    this.editBranchTab$ = this.store.select(CustomerSelectors.selectBranch);
    this.editCreditTerm$ = this.store.select(CustomerSelectors.selectTerm);
    this.editCreditLimit$ = this.store.select(CustomerSelectors.selectLimit);

    const apiVisa = AppConfig.apiVisa;


    this.guidSubs = this.store.select(CustomerSelectors.selectGuid).pipe(
      mergeMap(guid => {
        if (!this.tempContainer || this.tempContainer.bl_fi_mst_entity_hdr.guid.toString() !== guid) {
          return this.customerService.getByGuid(guid, apiVisa).pipe(
            tap(x => {
              this.customer = x.data;
              this.form.reset();
              this.store.dispatch(CustomerActions.loadAddress({ allAddress: this.customer.bl_fi_mst_entity_hdr.addresses_json }))
              this.store.dispatch(CustomerActions.createContainerDraftInit({ entity: x.data }));
            }));
        } else {
          this.customer = this.tempContainer;
          return of(this.tempContainer);
        }
      })
    ).subscribe();
    this.subs.sink = this.customerExt$.subscribe((entity) => {
      if (entity) {
        const response: EntityContainerModel = entity;
        this.form.patchValue({
          name: response.bl_fi_mst_entity_hdr.name,
          code: response.bl_fi_mst_entity_hdr.customer_code,
          type: response.bl_fi_mst_entity_hdr.txn_type,
          description: response.bl_fi_mst_entity_hdr.descr,
          status: response.bl_fi_mst_entity_hdr.status,
          phone: response.bl_fi_mst_entity_hdr.phone,
          email: response.bl_fi_mst_entity_hdr.email,
          id_type: response.bl_fi_mst_entity_hdr.id_type,
          id_number: response.bl_fi_mst_entity_hdr.id_no,
          taxID: response.bl_fi_mst_entity_hdr.tax_reg_number,
          arap_type: response.bl_fi_mst_entity_hdr.default_arap_type,
          createdDate: this.DateConvert(response.bl_fi_mst_entity_hdr.created_date),
          updatedDate: this.DateConvert(response.bl_fi_mst_entity_hdr.updated_date),
          createdBy: this.convertUser1(response.bl_fi_mst_entity_hdr.created_by_subject_guid),
          modifiedBy: this.convertUser(response.bl_fi_mst_entity_hdr.updated_by_subject_guid)
        },
        );
        response.bl_fi_mst_entity_ext.forEach((custExt) => {
          if (custExt.param_code === CustomerConstants.REMARKS) {
            if (custExt.value_json) {
              this.form.patchValue({
                remark: custExt.value_json.remark
              });
            }
          }
          if (custExt.param_code === CustomerConstants.CURRENCY) {
            if (custExt.value_json) {
              this.form.patchValue({
                currency: custExt.value_json.currency,
              });
            }
          }

          if (custExt.param_code === CustomerConstants.ID_NO) {
            this.form.patchValue({
              id_number: custExt.value_string,
            });
          }
          if (custExt.param_code === CustomerConstants.TAX_REG_NO) {
            this.form.patchValue({
              taxID: custExt.value_string
            });
          }
          if (custExt.param_code === CustomerConstants.GENDER) {
            this.form.patchValue({
              gender: custExt.value_string
            });
          }
          // if (custExt.param_code === CustomerConstants.CUSTOMER_CODE) {
          //   this.form.patchValue({
          //     code: custExt.value_string,
          //   });
          // }

          // if (custExt.param_code === CustomerConstants.CONTACT_INFO) {
          //   this.form.patchValue({
          //     faxNum: custExt.value_json.faxNum,
          //     website: custExt.value_json.website,
          //     companyIncoDate: custExt.value_json.companyIncoDate,
          //     closingDate: custExt.value_json.closingDate,
          //   });
          // }
          // if (custExt.param_code === CustomerConstants.CUSTOMER_EXT) {
          //   this.form.patchValue({
          //     // code: custExt.value_json.code,
          //     creditTerms: custExt.value_json.creditTerms,
          //     creditLimit: custExt.value_json.creditLimit,
          //     generalLine: custExt.value_json.generalLine,
          //     status: custExt.value_json.status,
          //   });
          // }
          if (custExt.param_code === CustomerConstants.GLCODE_INFO) {
            this.form.patchValue({
              glCode: custExt.value_string,
            });
          }
        }
        );
      }
    });

  }

  convertUser1(createdBy: any) {
    if (createdBy) {
      const pagintaion = new Pagination();
      pagintaion.conditionalCriteria.length = 0;
      pagintaion.conditionalCriteria.push({
        columnName: 'subject_guid',
        operator: '=',
        value: createdBy,
      })
        ,
        pagintaion.conditionalCriteria.push({
          columnName: 'principal_type',
          operator: '=',
          value: 'EMAIL_USERNAME',
        });
      this.appLoginPrincipalService.getByCriteria(pagintaion, this.apiVisa).subscribe((response) => {
        if (!isEmpty(response) && response.data[0].app_login_principal.principal_id !== null) {
          this.form.controls['createdBy'].setValue(response.data[0].app_login_principal.principal_id.toString(),);

        }
      });
    }
  }
  convertUser(createdBy: any) {
    if (createdBy) {
      const pagintaion = new Pagination();
      pagintaion.conditionalCriteria.length = 0;
      pagintaion.conditionalCriteria.push({
        columnName: 'subject_guid',
        operator: '=',
        value: createdBy,
      })
        ,
        pagintaion.conditionalCriteria.push({
          columnName: 'principal_type',
          operator: '=',
          value: 'EMAIL_USERNAME',
        });
      this.appLoginPrincipalService.getByCriteria(pagintaion, this.apiVisa).subscribe((response) => {
        if (!isEmpty(response) && response.data[0].app_login_principal.principal_id !== null) {
          this.form.controls['modifiedBy'].setValue(response.data[0].app_login_principal.principal_id.toString(),);

        }
      });
    }
  }

  DateConvert(date) {
    if (date != null && '' !== date) {
      const dates = date;
      const moments = moment(date).format('YYYY-MM-DD HH:mm:ss');
      return moments;
    } else {
      const notEdited = ' ';
      return notEdited;
    }
  }
  onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateAdd: false,
      deactivateList: false,
      rowIndexListing: null
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  offSideBar(line: bl_fi_mst_entity_line_RowClass) {
    // this.viewColFacade.selectcustomerExtLine(line);
    if (!this.localState.deactivateList) {
      this.localState.deactivateReturn = true;
      this.localState.deactivateList = true;
      this.viewColFacade.onNext(9);
    }
  }
  ngOnDestroy() {

    const d = this.maingroup.find((f, i) => i === 0);
    const e = this.maingroup.find((f, i) => i === 1);
    this.viewColFacade.updateInstance(this.index, { ...this.localState, selectedIndex: d.selectedIndex, LimitIndex: e.selectedIndex });
    this.subs.unsubscribe();
    this.guidSubs.unsubscribe();
  }
  onSave() {
    let taxtabs;
    // let paymentConfig;
    // let newPaymentConfig: bl_fi_mst_entity_payment_method_RowClass[];
    let address;
    let addressForExt;
    let contact;
    let branch;
    let term;
    let limit;
    let category;

    this.subs.sink = this.itemCategory$.subscribe(catData => {
      category = catData;
    });
    this.subs.sink = this.editTaxTab$.subscribe(
      data => {
        taxtabs = data;
      }
    );
    // this.subs.sink = this.editPaymentTab$.subscribe(
    //   data => {
    //     paymentConfig = data;
    //   }
    // );
    // this.subs.sink = this.editPaymentConfigTab$.subscribe(
    //   data => {
    //     newPaymentConfig = data;
    //   }
    // );
    this.subs.sink = this.editAddressTab$.subscribe(
      data => {
        address = data
      });
    this.subs.sink = this.editContactTab$.subscribe(
      data => {
        contact = data;
      }
    );
    this.subs.sink = this.editBranchTab$.subscribe(
      data => {
        branch = data;
      }
    );
    this.subs.sink = this.editCreditTerm$.subscribe(
      data => {
        term = data;
      }
    );
    this.subs.sink = this.editCreditLimit$.subscribe(
      data => {
        limit = data;
      }
    );


    this.customer.bl_fi_mst_entity_hdr.name = this.form.value.name;
    // this.customer.bl_fi_mst_entity_hdr.customer_code = this.form.value.code;
    this.customer.bl_fi_mst_entity_hdr.status = this.form.value.status;
    this.customer.bl_fi_mst_entity_hdr.descr = this.form.value.description;
    this.customer.bl_fi_mst_entity_hdr.email = this.form.value.email;
    this.customer.bl_fi_mst_entity_hdr.phone = this.form.value.phone;
    this.customer.bl_fi_mst_entity_hdr.id_type = this.form.value.id_type;
    this.customer.bl_fi_mst_entity_hdr.txn_type = this.form.value.type;
    this.customer.bl_fi_mst_entity_hdr.id_no = this.form.value.id_number;
    this.customer.bl_fi_mst_entity_hdr.tax_reg_number = this.form.value.taxID;
    this.customer.bl_fi_mst_entity_hdr.default_arap_type = this.form.value.arap_type;
    console.log('CUSTOMER HEADER', this.customer.bl_fi_mst_entity_hdr)

    // this.customer.bl_fi_mst_entity_ext.forEach((custExt) => {


    //   if (custExt.param_code === CustomerConstants.ID_NO) {
    //     custExt.value_string = this.form.value.id_number;
    //   }
    //   if (custExt.param_code === CustomerConstants.GLCODE_INFO) {
    //     custExt.value_string = this.form.value.glCode;
    //   }
    //   if (custExt.param_code === CustomerConstants.CURRENCY) {
    //     custExt.value_json.currency = this.form.value.currency;
    //   }
    //   if (custExt.param_code === CustomerConstants.CUSTOMER_CODE) {
    //     custExt.value_string = this.form.value.code;
    //   }
    //   if (custExt.param_code === CustomerConstants.TAX_REG_NO) {
    //     custExt.value_string = this.form.value.taxID
    //   }
    // });


    let taxNoExt;
    taxNoExt = this.customer.bl_fi_mst_entity_ext.filter(element =>
      element.param_code === CustomerConstants.TAX_REG_NO);
    if (taxNoExt.length !== 0) {
      taxNoExt[0].value_string = this.form.value.taxID;
    }


    // let codeExt: any;
    // codeExt = this.customer.bl_fi_mst_entity_ext.filter(element =>
    //   element.param_code === CustomerConstants.CUSTOMER_CODE);
    // if (codeExt.length !== 0) {
    //   codeExt.value_string = this.form.value.code;
    // } else {
    //   this.customer.bl_fi_mst_entity_ext.push(this.createNewCustomerExt
    //     (CustomerConstants.CUSTOMER_CODE, CustomerConstants.CUSTOMER_CODE, 'STRING',
    //       this.form.value.code,
    //     ));
    // }

    let currencyExt: any;
    currencyExt = this.customer.bl_fi_mst_entity_ext.filter(element =>
      element.param_code === CustomerConstants.CURRENCY);
    if (currencyExt.length !== 0) {
      if (currencyExt.value_json) {
        currencyExt.value_json.currency = this.form.value.currency;
      }

    } else {
      this.customer.bl_fi_mst_entity_ext.push(this.createNewCustomerExt(CustomerConstants.CURRENCY, CustomerConstants.CURRENCY, 'JSON', {
        'currency': this.form.value.currency,
      }
      ));
    }


    let genderExt: any;
    genderExt = this.customer.bl_fi_mst_entity_ext.filter(element =>
      element.param_code === CustomerConstants.GENDER);
    if (genderExt.length !== 0) {
      if (genderExt.value_json) {
        genderExt.value_json.currency = this.form.value.gender;
      }
    } else {
      this.customer.bl_fi_mst_entity_ext.push(this.createNewCustomerExt
        (CustomerConstants.GENDER, CustomerConstants.GENDER, 'STRING',
          this.form.value.gender,
        ));
    }

    let glCodeExt;
    glCodeExt = this.customer.bl_fi_mst_entity_ext.filter(element =>
      element.param_code === CustomerConstants.GLCODE_INFO);
    if (glCodeExt.length !== 0) {
      glCodeExt.value_string = this.form.value.glCode;
    } else {
      this.customer.bl_fi_mst_entity_ext.push(this.createNewCustomerExt
        (CustomerConstants.GLCODE_INFO, CustomerConstants.GLCODE_INFO, 'STRING',
          this.form.value.glCode,
        ));
    }

    // let idNoExt;
    // idNoExt = this.customer.bl_fi_mst_entity_ext.filter(element =>
    //   element.param_code === CustomerConstants.ID_NO);
    // if (idNoExt.length !== 0) {
    //   idNoExt.value_string = this.form.value.id_number;
    // } else {
    //   this.customer.bl_fi_mst_entity_ext.push(this.createNewCustomerExt(CustomerConstants.ID_NO, CustomerConstants.ID_NO, 'STRING',
    //     this.form.value.id_number,
    //   ));
    // }

    // remark
    const remarkExt = this.customer.bl_fi_mst_entity_ext.filter(element =>
      element.param_code === CustomerConstants.REMARKS);

    if (remarkExt.length > 0) {

      remarkExt.forEach(pt => {
        pt.value_json.remark = this.form.value.remark;
      });
    } else {

      this.customer.bl_fi_mst_entity_ext.push(this.createNewCustomerExt
        (CustomerConstants.REMARKS, CustomerConstants.REMARKS, 'JSON', {
          'remark': this.form.value.remark
        }
        ));
    }
    // const paymentExt = this.customer.bl_fi_mst_entity_ext.filter(element =>
    //   element.param_code === CustomerConstants.PAYMENT_CONFIG);
    // if (paymentExt.length !== 0) {
    //   paymentConfig.forEach(p => {
    //     paymentExt.forEach(pt => {
    //       if (pt.guid != null || p.guid != null) {
    //         if (pt.guid === p.guid) {
    //           pt.value_json = p.value_json;
    //         }
    //       }
    //     });
    //     if (!p.entity_hdr_guid) {
    //       p.entity_hdr_guid = this.customer.bl_fi_mst_entity_hdr.guid.toString();
    //       this.customer.bl_fi_mst_entity_ext.push(p);
    //     }
    //   });
    // } else {
    //   paymentConfig.forEach(pa => {
    //     pa.guid = null; pa.revision = null;
    //     pa.entity_hdr_guid = this.customer.bl_fi_mst_entity_hdr.guid.toString();
    //     this.customer.bl_fi_mst_entity_ext.push(pa);
    //   });
    // }

    //New Payment Config
    // console.log("NEW PAYMENT CONFIG",newPaymentConfig);
    // newPaymentConfig.forEach(p => {
    //   if (!p.hdr_guid) {
    //     p.hdr_guid = this.customer.bl_fi_mst_entity_hdr.guid.toString();
    //   }
    //   this.paymentConfigModel.bl_fi_mst_entity_payment_method = p;
    //   console.log("PAYMENT CONFIG MODEL", this.paymentConfigModel);
    //   this.store.dispatch(CustomerActions.createNewPaymentConfig({
    //     model: this.paymentConfigModel,
    //     // pagination: paymentConfigPagination
    //   }))
    // });





    // category
    let categoryExt;
    categoryExt = this.customer.bl_fi_mst_entity_ext.filter(element =>
      element.param_code === CustomerConstants.LIST_CATEGORY_GUID);
    if (categoryExt.length > 0) {
      categoryExt[0].value_json.guids = category.guids;
    } else {
      const categoryGuids = [];

      if (category.length > 0) {
        category.guids.forEach(pa => {
          categoryGuids.push(pa);
        });
      }
      this.customer.bl_fi_mst_entity_ext.push(this.createNewCustomerExt
        (CustomerConstants.LIST_CATEGORY_GUID, CustomerConstants.LIST_CATEGORY_GUID, 'JSON', {
          'guids': categoryGuids
        }
        ));
    }

    // address
    this.customer.bl_fi_mst_entity_hdr.addresses_json = address;

    // let addressObj = {
    //   "main_address": [],
    //   "shipping_address": [],
    //   "billing_address": []
    // };

    // address.forEach((p) => {
    //   if (p.value_json.addressType === "MAIN_ADDRESS") {
    //     addressObj["main_address"].push(p.value_json)
    //   } else if (p.value_json.addressType === "SHIPPING_ADDRESS") {
    //     addressObj["shipping_address"].push(p.value_json)
    //   } else if (p.value_json.addressType === "BILLING_ADDRESS") {
    //     addressObj["billing_address"].push(p.value_json)
    //   }
    // })

    // this.customer.bl_fi_mst_entity_hdr.addresses_json = addressObj


    // const addressExt = this.customer.bl_fi_mst_entity_ext.filter(element =>
    //   element.param_code === CustomerConstants.ADDRESS);
    // if (addressExt.length !== 0) {
    //   address.forEach(p => {
    //     addressExt.forEach(pt => {
    //       if (pt.guid != null || p.guid != null) {
    //         if (pt.guid === p.guid) {
    //           pt.value_json = p.value_json;
    //         }
    //       }
    //     });
    //     if (!p.entity_hdr_guid) {
    //       p.entity_hdr_guid = this.customer.bl_fi_mst_entity_hdr.guid.toString();
    //       this.customer.bl_fi_mst_entity_ext.push(p);
    //     }
    //   });
    // } else {
    //   address.forEach(pa => {
    //     pa.guid = null; pa.revision = null;
    //     pa.entity_hdr_guid = this.customer.bl_fi_mst_entity_hdr.guid.toString();
    //     this.customer.bl_fi_mst_entity_ext.push(pa);
    //   });
    // }

    // contact start
    const contactline = this.customer.bl_fi_mst_entity_line.filter(element =>
      element.txn_type === 'CONTACT');
    if (contactline.length !== 0) {
      contact.forEach(p => {
        contactline.forEach(pt => {
          if (pt.guid != null || p.guid != null) {
            if (pt.guid === p.guid) {
              pt = p;
              pt.revision = null;
            }
          }
        });
        if (!p.entity_hdr_guid) {
          p.guid = null;
          p.revision = null;
          p.entity_hdr_guid = this.customer.bl_fi_mst_entity_hdr.guid.toString();
          p.txn_type = 'CONTACT';
          this.customer.bl_fi_mst_entity_line.push(p);
        }
      });
    } else {
      contact.forEach(pa => {
        pa.guid = null; pa.revision = null;
        pa.entity_hdr_guid = this.customer.bl_fi_mst_entity_hdr.guid.toString();
        pa.txn_type = 'CONTACT';
        this.customer.bl_fi_mst_entity_line.push(pa);
      });
    }
    // end
    // end
    // branch start
    const branchLine = this.customer.bl_fi_mst_entity_line.filter(element =>
      element.txn_type === 'BRANCH');
    if (branchLine.length !== 0) {
      branch.forEach(p => {
        branchLine.forEach(pt => {
          if (pt.guid != null || p.guid != null) {
            if (pt.guid === p.guid) {
              pt = p;
              pt.revision = null;
            }
          }
        });
        if (!p.entity_hdr_guid) {
          p.guid = null;
          p.revision = null;
          p.entity_hdr_guid = this.customer.bl_fi_mst_entity_hdr.guid.toString();
          p.txn_type = 'BRANCH';
          this.customer.bl_fi_mst_entity_line.push(p);
        }
      });
    } else {
      branch.forEach(pa => {
        pa.guid = null; pa.revision = null;
        pa.entity_hdr_guid = this.customer.bl_fi_mst_entity_hdr.guid.toString();
        pa.txn_type = 'BRANCH';
        this.customer.bl_fi_mst_entity_line.push(pa);
      });
    }
    // end

    const taxExt = this.customer.bl_fi_mst_entity_ext.filter(element =>
      element.param_code === CustomerConstants.TAX_DETAILS);
    if (taxExt.length !== 0 && taxtabs != null) {
      taxtabs.forEach(p => {
        taxExt.forEach(pt => {
          if (pt.guid != null || p.guid != null) {
            if (pt.guid === p.guid) {
              pt.value_json = p.value_json;
            }
          }
        });
        if (!p.entity_hdr_guid) {
          p.entity_hdr_guid = this.customer.bl_fi_mst_entity_hdr.guid.toString();
          this.customer.bl_fi_mst_entity_ext.push(p);
        }
      });
    } else {
      taxtabs.forEach(pa => {
        pa.guid = null;
        pa.revision = null;
        pa.entity_hdr_guid = this.customer.bl_fi_mst_entity_hdr.guid.toString();
        this.customer.bl_fi_mst_entity_ext.push(pa);
      });
    }

    // TERM
    const termExt = this.customer.bl_fi_mst_entity_ext.filter(element =>
      element.param_code === CustomerConstants.CREDIT_TERMS);
    if (termExt.length !== 0) {
      term.forEach(p => {
        termExt.forEach(pt => {
          if (pt.guid != null || p.guid != null) {
            if (pt.guid === p.guid) {
              pt.value_json = p.value_json;
            }
          }
        });
        if (!p.entity_hdr_guid) {
          p.entity_hdr_guid = this.customer.bl_fi_mst_entity_hdr.guid.toString();
          this.customer.bl_fi_mst_entity_ext.push(p);
        }
      });
    } else {
      term.forEach(pa => {
        pa.guid = null;
        pa.revision = null;
        pa.entity_hdr_guid = this.customer.bl_fi_mst_entity_hdr.guid.toString();
        this.customer.bl_fi_mst_entity_ext.push(pa);
      });
    }

    // LIMIT
    const limitExt = this.customer.bl_fi_mst_entity_ext.filter(element =>
      element.param_code === CustomerConstants.CREDIT_LIMITS);
    if (limitExt.length !== 0) {
      limit.forEach(p => {
        limitExt.forEach(pt => {
          if (pt.guid != null || p.guid != null) {
            if (pt.guid === p.guid) {
              pt.value_json = p.value_json;
            }
          }
        });
        if (!p.entity_hdr_guid) {
          p.entity_hdr_guid = this.customer.bl_fi_mst_entity_hdr.guid.toString();
          this.customer.bl_fi_mst_entity_ext.push(p);
        }
      });
    } else {
      limit.forEach(pa => {
        pa.guid = null;
        pa.revision = null;
        pa.entity_hdr_guid = this.customer.bl_fi_mst_entity_hdr.guid.toString();
        this.customer.bl_fi_mst_entity_ext.push(pa);
      });
    }

    this.store.dispatch(CustomerActions.containerDraftUpdateInit({ entity: this.customer }));
    this.store.select(CustomerSelectors.onSaveFail).subscribe(status => {
      if (status) {
      } if (status === false) {
        this.form.reset();
        this.store.dispatch(CustomerActions.updateAgGridDone({ status: true }));
      }
    });

    this.onReturn()
  }
  onRemove() {
    this.customerService.delete(this.customer.bl_fi_mst_entity_hdr.guid.toString(), this.apiVisa).subscribe(x => {
      if (x.code === 'OK_RESPONSE') {
        this.toastr.success(
          'The Supplier has been deleted',
          'Success',
          {
            tapToDismiss: true,
            progressBar: true,
            timeOut: 1300
          }
        );
        this.form.reset();
        this.store.dispatch(CustomerActions.updateAgGridDone({ status: true }));
      } else {
        this.toastr.error(
          x.message,
          'Error',
          {
            tapToDismiss: true,
            progressBar: true,
            timeOut: 1300
          }
        );
      }
    }
    );
  }
  createNewCustomerExt(
    param_code: string,
    param_name: string,
    param_type: string,
    param_value: any,
  ) {
    const obj = new bl_fi_mst_entity_ext_RowClass();
    obj.entity_hdr_guid = this.customer.bl_fi_mst_entity_hdr.guid;
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
  applyGLCodeFilter(filterValue: string) {
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
  // applyCurrencyFilter(filterValue: string) {
  //   filterValue = filterValue.trim();
  //   filterValue = filterValue.toLowerCase();
  //   this.newCurrency = this.currencyArr.filter((option) => option.display_main.toLowerCase().includes(filterValue) ||
  //     option.display_short.toLowerCase().includes(filterValue));
  // }
  onTypeChange(type) {

    if (type.value === 'INDIVIDUAL') {

      if (this.form.value.id_type === null) {
        this.form.patchValue({
          id_type: 'IDENTITY_CARD',
        });
      }

      this.id_placeholder = 'ID Number';
      this.taxID_placeholder = 'Tax Registration Number'
      // this.isRequired = false;
    } else if (type.value === 'CORPORATE') {
      // this.isRequired
      // this.isRequired = false;
      this.id_placeholder = 'Company Registration Number';
      this.taxID_placeholder = 'Company Tax Registration Number'
    }
  }
}
