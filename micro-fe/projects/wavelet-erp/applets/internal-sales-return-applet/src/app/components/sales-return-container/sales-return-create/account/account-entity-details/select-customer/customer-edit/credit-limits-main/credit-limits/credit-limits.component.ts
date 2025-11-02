import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Pagination, CurrencyService, CreditLimitContainerModel, bl_fi_mst_entity_ext_RowClass, bl_fi_mst_entity_line_RowClass, CreditLimitService, CustomerService } from 'blg-akaun-ts-lib';
import { ToastrService } from 'ngx-toastr';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { ViewColumnFacade } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/facades/view-column.facade';
import { CustomerConstants } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/models/customer-constants';
import { CustomerActions } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/actions';
import { CustomerSelectors } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/selectors';
import { CustomerStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/states';

import { Observable, Subscription } from 'rxjs';
import { switchMap, toArray } from 'rxjs/operators';

@Component({
  selector: 'app-credit-limits',
  templateUrl: './credit-limits.component.html',
  styleUrls: ['./credit-limits.component.css']
})

export class CreditLimitsComponent extends ViewColumnComponent implements OnInit {
  data: any;
  form: FormGroup;
  form1: FormGroup;
  form2: FormGroup;
  deactivateReturn$;
  newStatus = [
    { value: 'ACTIVE', viewValue: 'ACTIVE' },
    { value: 'INACTIVE', viewValue: 'INACTIVE' }
  ];

  currencyCode: any;
  currencyName: any;
  creditlimits: any;
  creditLimitArr: any = [];
  newCreditLimitArr: any = [];
  //currency;
  currencyArr: any = [];
  newCurrencyArr: any = [];
  newCurrency: any;
  addSuccess: string;
  isClicked: string;
  message: any;

  newlimit: CreditLimitContainerModel;
  customerguid: any;
  public selection: any;
  custGuid: string;
  haveError = false;
  codeLimits: any;
  storeLimit: any = [];
  testGuid: any = [];
  allTestGuid: any = [];
  limitCheck: Subscription;
  limitGet: Subscription;
  custCheck: Subscription;

  protected readonly index = 30;
  prevIndex: number;
  private prevLocalState: any;
  readonly localState$ = this.viewColFacade.selectLocalState(this.index);

  @Input() customerExtLineItem$: Observable<bl_fi_mst_entity_line_RowClass>;

  apiVisa = AppConfig.apiVisa;
  paging = new Pagination();
  constructor(
    private currencyService: CurrencyService,
    private fb: FormBuilder,
    private viewColFacade: ViewColumnFacade,
    private dialog: MatDialog,
    private creditLimitService: CreditLimitService,
    private readonly store: Store<CustomerStates>,
    private customerService: CustomerService,
    private toastr: ToastrService,
  ) {
    super();
  }

  ngOnInit() {

    this.form = this.fb.group(
      {
        custname: [''],
        custcode: [''],
      }
    );

    this.store.select(CustomerSelectors.selectGuid).subscribe(guid => {
      this.custGuid = guid;
      this.getCustomer(guid);
      this.getLimit(guid);
    });

    //new credit limit
    this.form1 = this.fb.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      status: [''],
      currency: ['', Validators.compose([Validators.required,])],
      amount: ['', Validators.pattern("^[0-9]*$")],
      currentCurrency: [''],
    });

    this.form1.patchValue({
      status: 'ACTIVE',
    });

    // this.getLimit();

    //existing credit term
    this.form2 = this.fb.group({
      currentLimitName: [''],
      limit: ['', [Validators.required]],
    });


    this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);

    this.getCurrency();
  }

  getLimit(guid: any) {
    this.limitGet = this.creditLimitService.get(this.apiVisa).pipe(
      switchMap((x: any) => {
        return x.data;
      }),
      toArray()
    ).subscribe((x: any) => {
      this.creditlimits = x;

      for (const key in this.creditlimits) {
        this.creditLimitArr.push({
          guid: this.creditlimits[key].bl_fi_entity_credit_limit_hdr.guid,
          name: this.creditlimits[key].bl_fi_entity_credit_limit_hdr.name,
          code: this.creditlimits[key].bl_fi_entity_credit_limit_hdr.code,
          currency: this.creditlimits[key].bl_fi_entity_credit_limit_hdr.currency,
          amount: this.creditlimits[key].bl_fi_entity_credit_limit_hdr.amount,
          status: this.creditlimits[key].bl_fi_entity_credit_limit_hdr.status,
        })
        this.newCreditLimitArr = this.creditLimitArr;
      }
      this.custCheck = this.customerService.getByGuid(guid, this.apiVisa).subscribe((resp: any) => {
        resp.data.bl_fi_mst_entity_ext.forEach((ext) => {
          if (ext.param_code === CustomerConstants.CREDIT_LIMITS) {
            this.testGuid = ext.value_json.guid;
            this.allTestGuid.push(this.testGuid);

            const index = this.newCreditLimitArr.findIndex(b => b.guid === this.testGuid);
            if (index > -1) {
              this.newCreditLimitArr.splice(index, 1);
            }
          }
        });
      });
    });


  }

  getCustomer(guid: any) {
    this.customerService.getByGuid(guid, this.apiVisa).subscribe((resp: any) => {
      this.form.patchValue({
        custname: resp.data.bl_fi_mst_entity_hdr.name,
      })
      // resp.data.bl_fi_mst_entity_ext.forEach((ext) => {
      // if(ext.param_code === CustomerConstants.CUSTOMER_CODE) {
      // if(ext.value_string) {
      this.form.patchValue({
        custcode: resp.data.bl_fi_mst_entity_hdr.customer_code,
      })
      // }
      // }
      // });
    })
  }

  applyCreditLimitFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.newCreditLimitArr = this.creditLimitArr.filter((option) => option.code.toLowerCase().includes(filterValue) ||
      option.name.toLowerCase().includes(filterValue));
  }


  getCurrency() {
    this.currencyService.get(this.apiVisa).subscribe((x: any) => {
      for (const key in x.data) {
        if (x.data[key].bl_fi_mst_ccy.code === 'MYR') {
          this.currencyArr.unshift(
            x.data[key].bl_fi_mst_ccy
          );
        }
        this.currencyArr.push(x.data[key].bl_fi_mst_ccy);
      }
      this.newCurrency = this.currencyArr;
    });
  }

  applyCurrencyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.newCurrency = this.currencyArr.filter((option) => option.display_short.toLowerCase().includes(filterValue) ||
      option.display_main.toLowerCase().includes(filterValue));
  }

  onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateAdd: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  //CHECK WHETHER THE LIMIT CODE IS THERE ALREADY OR NOT
  onCheck() {
    this.creditLimitService.get(this.apiVisa).pipe(
      switchMap((x: any) => {
        return x.data;
      }),
    ).subscribe((x: any) => {
      this.codeLimits = x.bl_fi_entity_credit_limit_hdr.code;
      this.storeLimit.push(x.bl_fi_entity_credit_limit_hdr.code);

      let isLimitExist = this.form1.value.code;
      console.log(isLimitExist);

      if (this.storeLimit.find(a => a === isLimitExist)) {
        this.form1.controls['code'].setErrors({ exist: true })
        this.message = "Code already exist";
      }
      else {
      }
    });
  }

  onSave() {

    let userGuid = localStorage.getItem('guid');
    let date = new Date();
    //New Form
    if (this.selection === 1) {
      this.form1.patchValue(
        {
          createdBy: userGuid,
          createdDate: date,
          modifiedBy: userGuid,
          modifiedDate: date,
        })

      const newlimitdata = this.createNewCustomerExt(
        CustomerConstants.CREDIT_LIMITS,
        CustomerConstants.CREDIT_LIMITS, 'JSON',
        this.form1.value
      );

      this.store.dispatch(CustomerActions.createLimitExt({
        ext: newlimitdata
      }));
      const newlimit = this.createNewFormCustomerExt(
      );
      this.store.dispatch(CustomerActions.addNewCreditLimit({
        addNewCreditLimit: newlimit
      }))
      this.form1.reset();

    }
    //Existing
    else {
      this.form2.patchValue(
        {
          createdBy: userGuid,
          createdDate: date,
          modifiedBy: userGuid,
          modifiedDate: date,
        })
      const newlimitdata = this.createNewCustomerExt(
        CustomerConstants.CREDIT_LIMITS,
        CustomerConstants.CREDIT_LIMITS, 'JSON',
        this.form2.value.limit
      );
      this.store.dispatch(CustomerActions.createLimitExt({
        ext: newlimitdata
      }))

      this.form2.reset();
      this.toastr.success(
        'Your credit limit has been added!  Please save your data to prevent losses.',
        'Success',
        { tapToDismiss: true, progressBar: true, timeOut: 2000 });

    }
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

  createNewFormCustomerExt(
  ) {
    const obj = new CreditLimitContainerModel();
    obj.bl_fi_entity_credit_limit_hdr.code = this.form1.value.code;
    obj.bl_fi_entity_credit_limit_hdr.name = this.form1.value.name;
    obj.bl_fi_entity_credit_limit_hdr.status = this.form1.value.status;
    obj.bl_fi_entity_credit_limit_hdr.currency = this.form1.value.currency;
    obj.bl_fi_entity_credit_limit_hdr.amount = this.form1.value.amount;
    return obj;
  }

  ngOnDestroy() {

    this.limitGet.unsubscribe();
    this.custCheck.unsubscribe();
  }
}
