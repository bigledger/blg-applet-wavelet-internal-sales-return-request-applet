import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ApiVisa, AppLoginPrincipalTenantService, AssetsService, CompanyContainerModel, CurrencyService, Pagination, } from 'blg-akaun-ts-lib';
import { isEmpty } from 'lodash';
import * as moment from 'moment';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { ViewColumnFacade } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/facades/view-column.facade';
import { CustomerActions } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/actions';
import { CustomerSelectors } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/selectors';
import { CustomerStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/states';
import { Observable, Subscription } from 'rxjs';
import { SubSink } from 'subsink2';



@Component({
  selector: 'app-credit-limits-edit',
  templateUrl: './credit-limits-edit.component.html',
  styleUrls: ['./credit-limits-edit.component.css']
})
export class CreditLimitsEditComponent extends ViewColumnComponent implements OnInit {

  form: FormGroup;
  customerExt$: Observable<any>;
  deactivateReturn$;
  companyContainerModel = new CompanyContainerModel();
  apiVisa = AppConfig.apiVisa;
  // : ApiVisa = {
  //   tenantCode: sessionStorage.getItem('tenantCode'),
  //   api_domain_url: environment.api_domain,
  //   jwt_secret: localStorage.getItem('authToken'),
  // };

  status = [
    { value: 'ACTIVE', viewValue: 'ACTIVE' },
    { value: 'INACTIVE', viewValue: 'INACTIVE' }
  ];

  cust: Subscription;
  login: Subscription;
  protected subs = new SubSink();
  selected = 'active';
  protected readonly index = 4;
  prevIndex: number;
  private prevLocalState: any;
  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  paging = new Pagination();
  currencyCode: any;
  currencyName: any;
  currency;
  limitExt: any;
  createdBy;
  modified_date;
  created_date;
  modifiedBy;
  addSuccess = 'Update';
  isClicked = 'primary';

  currencyArr: any = [];
  newCurrencyArr: any = [];
  newCurrency: any;
  currencyLimit: any = [];
  newCurrencyLimit: any = [];

  constructor(
    private readonly store: Store<CustomerStates>,
    private fb: FormBuilder,
    private viewColFacade: ViewColumnFacade,
    private currencyService: CurrencyService,
    private appLoginPrincipalService: AppLoginPrincipalTenantService,
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.fb.group(
      {
        code: [''],
        name: [''],
        status: [''],
        amount: [''],
        create: [''],
        creation: [''],
        modby: [''],
        moddate: [''],
        currency: [],
        currentCurrency: [''],
        createdDate: [],
        createdBy: [],
        modifiedBy: [],
        modifiedDate: [],
      }
    );
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);

    this.getCurrency();

    this.customerExt$ = this.store.select(CustomerSelectors.selectExt);
    let extData;
    let userGuid = localStorage.getItem('guid');
    let date = new Date();
    this.cust = this.customerExt$.subscribe(
      (data) => {
        this.limitExt = data[0];
        console.log(data, 'this is rowdata limit');
        extData = data[0].value_json;
        console.log("This is the problem", extData);
        this.form.patchValue(
          {
            guid: extData.guid,
            code: extData.code,
            name: extData.name,
            status: extData.status,
            currency: extData.currency,
            amount: extData.amount,
            createdDate: this.DateConvert(date),
            modifiedDate: this.DateConvert(date),
            createdBy: this.convertUser1(userGuid),
            modifiedBy: this.convertUser(userGuid)
          }
        );
      }
    );
  }

  ngOnDestroy() {
    this.cust.unsubscribe();
    this.login.unsubscribe();
  }

  convertUser1(createdBy: any) {
    const pagination = new Pagination();
    pagination.conditionalCriteria.length = 0;
    pagination.conditionalCriteria.push({
      columnName: "subject_guid",
      operator: '=',
      value: createdBy,
    }),
      pagination.conditionalCriteria.push({
        columnName: "principal_type",
        operator: "=",
        value: 'EMAIL_USERNAME',
      });
    console.log("date pagination", pagination);
    this.login = this.appLoginPrincipalService.getByCriteria(pagination, this.apiVisa).subscribe((response) => {
      console.log("inside the convert user", response)
      if (!isEmpty(response) && response.data[0].app_login_principal.principal_id !== null) {
        this.form.controls['createdBy'].setValue(response.data[0].app_login_principal.principal_id.toString(),);
      }
    });
  }

  convertUser(createdBy: any) {
    const pagination = new Pagination();
    pagination.conditionalCriteria.length = 0;
    pagination.conditionalCriteria.push({
      columnName: "subject_guid",
      operator: "=",
      value: createdBy,
    }),
      pagination.conditionalCriteria.push({
        columnName: "principal_type",
        operator: "=",
        value: 'EMAIL_USERNAME',
      });
    console.log("date pagination", pagination);
    this.login = this.appLoginPrincipalService.getByCriteria(pagination, this.apiVisa).subscribe((response) => {
      console.log("inside the convert user", response)
      if (!isEmpty(response) && response.data[0].app_login_principal.principal_id !== null) {
        this.form.controls['modifiedBy'].setValue(response.data[0].app_login_principal.principal_id.toString(),);
      }
    }
    );
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

  getCurrency() {
    this.subs.sink = this.currencyService.get(this.apiVisa).subscribe((x: any) => {
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

  onSave() {
    this.limitExt.value_json = this.form.value;
    this.store.dispatch(CustomerActions.editLimitLine({ guid: this.form.value.guid, ext: this.limitExt }));
    this.addSuccess = 'Success';
    this.isClicked = 'buttonSuccess';
    setTimeout(() => {
      this.addSuccess = 'Update';
      this.isClicked = 'primary';
    }, 1500)
  }

  onRemove() {
    this.form.patchValue(
      {
        status: 'DELETED'
      },
    );
    this.limitExt.status = 'DELETED';
    this.onSave();
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateAdd: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

}
