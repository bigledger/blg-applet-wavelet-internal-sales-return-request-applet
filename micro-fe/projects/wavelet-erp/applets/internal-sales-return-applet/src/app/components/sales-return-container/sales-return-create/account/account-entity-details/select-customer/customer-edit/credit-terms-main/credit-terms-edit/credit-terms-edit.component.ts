import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Pagination, AppLoginPrincipalTenantService } from 'blg-akaun-ts-lib';
import { isEmpty } from 'lodash';
import * as moment from 'moment';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { ViewColumnFacade } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/facades/view-column.facade';
import { CustomerConstants } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/models/customer-constants';
import { CustomerActions } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/actions';
import { CustomerSelectors } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/selectors';
import { CustomerStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/states';


import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-credit-terms-edit',
  templateUrl: './credit-terms-edit.component.html',
  styleUrls: ['./credit-terms-edit.component.css']
})
export class CreditTermsEditComponent extends ViewColumnComponent implements OnInit {

  form: FormGroup;
  gridApi;
  deactivateReturn$;
  @Input() customerExt$: Observable<any>;
  termExt: any;
  apiVisa = AppConfig.apiVisa;


  month = [
    { value: '1', viewValue: 'January' },
    { value: '2', viewValue: 'February' },
    { value: '3', viewValue: 'March' },
    { value: '4', viewValue: 'April' },
    { value: '5', viewValue: 'May' },
    { value: '6', viewValue: 'Jun' },
    { value: '7', viewValue: 'July' },
    { value: '8', viewValue: 'August' },
    { value: '9', viewValue: 'September' },
    { value: '10', viewValue: 'October' },
    { value: '11', viewValue: 'November' },
    { value: '12', viewValue: 'December' },
  ];
  day = [
    { value: '1', viewValue: '1' },
    { value: '2', viewValue: '2' },
    { value: '3', viewValue: '3' },
    { value: '4', viewValue: '4' },
    { value: '5', viewValue: '5' },
    { value: '6', viewValue: '6' },
    { value: '7', viewValue: '7' },
    { value: '8', viewValue: '8' },
    { value: '9', viewValue: '9' },
    { value: '10', viewValue: '10' },
    { value: '11', viewValue: '11' },
    { value: '12', viewValue: '12' },
    { value: '13', viewValue: '13' },
    { value: '14', viewValue: '14' },
    { value: '15', viewValue: '15' },
    { value: '16', viewValue: '16' },
    { value: '17', viewValue: '17' },
    { value: '18', viewValue: '18' },
    { value: '19', viewValue: '19' },
    { value: '20', viewValue: '20' },
    { value: '21', viewValue: '21' },
    { value: '22', viewValue: '22' },
    { value: '23', viewValue: '23' },
    { value: '24', viewValue: '24' },
    { value: '25', viewValue: '25' },
    { value: '26', viewValue: '26' },
    { value: '27', viewValue: '27' },
    { value: '28', viewValue: '28' },
    { value: '29', viewValue: '29' },
    { value: '30', viewValue: '30' },
    { value: '31', viewValue: '31' }
  ];

  status = [
    { value: 'ACTIVE', viewValue: 'ACTIVE' },
    { value: 'INACTIVE', viewValue: 'INACTIVE' }
  ];

  protected readonly index = 4;
  prevIndex: number;
  private prevLocalState: any;
  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  paging = new Pagination();
  guid: string;
  addSuccess = 'Update';
  isClicked = 'primary';
  createdBy;
  modified_date;
  created_date;
  modifiedBy;
  cust: Subscription;
  login: Subscription;

  constructor(
    private readonly store: Store<CustomerStates>,
    private fb: FormBuilder,
    private viewColFacade: ViewColumnFacade,
    private appLoginPrincipalService: AppLoginPrincipalTenantService,
  ) {
    super();
  }

  ngOnInit() {

    this.form = this.fb.group(
      {
        code: ['', [Validators.required]],
        name: [''],
        status: [''],
        year: [''],
        month: [''],
        day: [''],
        addyear: [''],
        addmonth: [''],
        addday: [''],
        createdDate: [],
        createdBy: [],
        modifiedBy: [],
        modifiedDate: [],
      }
    );
    this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.customerExt$ = this.store.select(CustomerSelectors.selectExt);
    let extData;
    this.cust = this.customerExt$.subscribe(
      data => {
        this.termExt = data[0];
        console.log(data, 'this is rowdata term');
        extData = data[0].value_json;
        let userGuid = localStorage.getItem('guid');
        let date = new Date();
        this.form.patchValue(
          {
            guid: data[0].guid,
            code: extData.code,
            name: extData.name,
            status: extData.status,
            year: extData.year,
            month: extData.month.toString(),
            day: extData.day.toString(),
            addyear: extData.addyear,
            addmonth: extData.addmonth,
            addday: extData.addday,
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

  onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateAdd: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  onSave() {

    this.termExt.value_json = this.form.value;
    this.store.dispatch(CustomerActions.editTermLine({ guid: this.form.value.guid, ext: this.termExt }));
    this.addSuccess = 'Success';
    this.isClicked = 'buttonSuccess';
    setTimeout(() => {
      this.addSuccess = 'Update';
      this.isClicked = 'primary';
    }, 1500)
  }

  onGridReady(event) {
    this.gridApi = event.api;
    this.gridApi.closeToolPanel();
  }

  onRemove() {
    this.form.patchValue(
      {
        status: 'DELETED'
      },
    );
    this.termExt.status = 'DELETED';
    this.onSave();
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateAdd: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }
}
