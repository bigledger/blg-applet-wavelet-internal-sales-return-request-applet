import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CreditTermContainerModel, bl_fi_mst_entity_ext_RowClass, CreditTermService, ApiVisa, CustomerService, EntityService } from 'blg-akaun-ts-lib';
import { Store } from '@ngrx/store';
import { switchMap, toArray } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
// import { DataSharingService } from '../../../../../services-old/data-sharing.service';
import { AppConfig } from 'projects/shared-utilities/visa';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { ViewColumnFacade } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/facades/view-column.facade';
import { CustomerConstants } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/models/customer-constants';
import { CustomerActions } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/actions';
import { CustomerSelectors } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/selectors';
import { CustomerStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/states';

@Component({
  selector: 'app-credit-terms',
  templateUrl: './credit-terms.component.html',
  styleUrls: ['./credit-terms.component.css'],
})
export class CreditTermsComponent extends ViewColumnComponent implements OnInit {

  deactivateReturn$;
  form: FormGroup;
  form1: FormGroup;
  form2: FormGroup;
  @Input() customerExt$: Observable<any>;

  addSuccess: string;
  isClicked: string;

  public selection;
  creditterms: any;
  codeTerms: any;
  guidterms: any;
  codeEntityTerms: any;
  creditTermArr: any = [];
  creditTermArr2: any = [];
  newCreditTermArr: any = [];
  newCreditTermArr2: any = [];
  testGuid: any = [];
  allTestGuid: any = [];
  allGuidTerm: any = [];
  storeTerm: any = [];
  selectedLevel: any = [];

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

  protected readonly index = 4;
  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  prevIndex: number;
  private prevLocalState: any;
  custGuid: string;
  haveError = false;
  message: any;
  x: any = [];
  selectedOption: string;
  gridApi: any;
  termCheck: Subscription;
  termGet: Subscription;
  custCheck: Subscription;

  constructor(
    private fb: FormBuilder,
    private viewColFacade: ViewColumnFacade,
    private readonly store: Store<CustomerStates>,
    private creditTermService: CreditTermService,
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
      this.getTerm(guid);
    });

    // Form for new credit term
    this.form1 = this.fb.group({
      code: ['', Validators.compose([Validators.required,])],
      name: ['', Validators.compose([Validators.required,])],
      status: [''],
      year: [''],
      month: [''],
      day: [''],
      addyear: [''],
      addmonth: [''],
      addday: [''],
    });
    this.form1.patchValue({
      status: 'ACTIVE',
    });

    // this.getTerm();

    // Select the existing credit term
    this.form2 = this.fb.group({
      currentTerm: [null],
      term: ['', Validators.compose([Validators.required,])],
    });

    this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
  }

  getCustomer(guid: any) {
    this.termGet = this.customerService.getByGuid(guid, this.apiVisa).subscribe((resp: any) => {
      this.form.patchValue({
        custname: resp.data.bl_fi_mst_entity_hdr.name,
      });
      // resp.data.bl_fi_mst_entity_ext.forEach((ext) => {
      //   if(ext.param_code === CustomerConstants.CUSTOMER_CODE) {
      // if(ext.value_string) {
      this.form.patchValue({
        custcode: resp.data.bl_fi_mst_entity_hdr.customer_code.toString(),
      });
      // }
      // }
      // });
    });
  }

  getTerm(guid: any) {
    this.creditTermService.get(this.apiVisa).pipe(
      switchMap((x: any) => {
        return x.data;
      }),
      toArray()
    ).subscribe((x: any) => {
      this.creditterms = x;
      for (const key in this.creditterms) {
        this.creditTermArr.push({
          guid: this.creditterms[key].bl_fi_entity_credit_term_hdr.guid,
          code: this.creditterms[key].bl_fi_entity_credit_term_hdr.code,
          name: this.creditterms[key].bl_fi_entity_credit_term_hdr.name,
          status: this.creditterms[key].bl_fi_entity_credit_term_hdr.status,
          year: this.creditterms[key].bl_fi_entity_credit_term_hdr.set_year,
          month: this.creditterms[key].bl_fi_entity_credit_term_hdr.set_month,
          day: this.creditterms[key].bl_fi_entity_credit_term_hdr.set_day,
          addday: this.creditterms[key].bl_fi_entity_credit_term_hdr.add_day,
          addyear: this.creditterms[key].bl_fi_entity_credit_term_hdr.add_year,
          addmonth: this.creditterms[key].bl_fi_entity_credit_term_hdr.add_month,
        });
        this.newCreditTermArr = this.creditTermArr;

      }
      this.custCheck = this.customerService.getByGuid(guid, this.apiVisa).subscribe((resp: any) => {
        resp.data.bl_fi_mst_entity_ext.forEach((ext) => {
          if (ext.param_code === CustomerConstants.CREDIT_TERMS) {
            this.testGuid = ext.value_json.guid;
            this.allTestGuid.push(this.testGuid);

            const index = this.newCreditTermArr.findIndex(b => b.guid === this.testGuid);
            if (index > -1) {
              this.newCreditTermArr.splice(index, 1);
            }
          }
        });
      });
    });
  }

  // CHECK IF THE CODE IS ALREADY THERE OR NOT
  onCheck() {
    this.creditTermService.get(this.apiVisa).pipe(
      switchMap((x: any) => {
        return x.data;
      }),
    ).subscribe((x: any) => {
      this.codeTerms = x.bl_fi_entity_credit_term_hdr.code;
      this.storeTerm.push(x.bl_fi_entity_credit_term_hdr.code);

      const isTermExist = this.form1.value.code;
      console.log(isTermExist);

      if (this.storeTerm.find(a => a === isTermExist)) {
        this.form1.controls['code'].setErrors({ exist: true });
        this.message = 'Code already exist';
      } else {
      }
    });
  }


  onSave() {
    const userGuid = localStorage.getItem('guid');
    const date = new Date();
    // New Form
    if (this.selection === 1) {
      this.form1.patchValue(
        {
          createdBy: userGuid,
          createdDate: date,
          modifiedBy: userGuid,
          modifiedDate: date,
        });

      const newtermdata = this.createNewCustomerExt(
        CustomerConstants.CREDIT_TERMS,
        CustomerConstants.CREDIT_TERMS, 'JSON',
        this.form1.value
      );

      this.store.dispatch(CustomerActions.createTermExt({
        ext: newtermdata
      }));
      const newterm = this.createNewTermCustomerExt();
      this.store.dispatch(CustomerActions.addNewCreditTerm({
        addNewCreditTerm: newterm
      }));
      this.form1.reset();
    }
    // Existing
    else {
      this.form2.patchValue(
        {
          createdBy: userGuid,
          createdDate: date,
          modifiedBy: userGuid,
          modifiedDate: date,
        });
      const selectedTerm = [];
      const newtermdata = this.createNewCustomerExt(
        CustomerConstants.CREDIT_TERMS,
        CustomerConstants.CREDIT_TERMS, 'JSON',
        this.form2.value.term
      );
      this.store.dispatch(CustomerActions.createTermExt({
        ext: newtermdata
      }))

      this.form2.reset();

      this.toastr.success(
        'Your credit term has been added!  Please save your data to prevent losses.',
        'Success',
        { tapToDismiss: true, progressBar: true, timeOut: 2000 });
    }

  }
  applyCreditTermFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.newCreditTermArr = this.creditTermArr.filter((option) => option.code.toLowerCase().includes(filterValue) ||
      option.name.toLowerCase().includes(filterValue));
  }

  onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateAdd: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
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

  createNewTermCustomerExt() {
    const obj = new CreditTermContainerModel();
    obj.bl_fi_entity_credit_term_hdr.code = this.form1.value.code;
    obj.bl_fi_entity_credit_term_hdr.name = this.form1.value.name;
    obj.bl_fi_entity_credit_term_hdr.status = this.form1.value.status;
    obj.bl_fi_entity_credit_term_hdr.set_year = this.form1.value.year;
    obj.bl_fi_entity_credit_term_hdr.set_month = this.form1.value.month;
    obj.bl_fi_entity_credit_term_hdr.set_day = this.form1.value.day;
    obj.bl_fi_entity_credit_term_hdr.add_year = this.form1.value.addyear;
    obj.bl_fi_entity_credit_term_hdr.add_month = this.form1.value.addmonth;
    obj.bl_fi_entity_credit_term_hdr.add_day = this.form1.value.addday;
    return obj;
  }

  ngOnDestroy() {
    this.termGet.unsubscribe();
    this.custCheck.unsubscribe();
  }
}
