import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { bl_fi_mst_entity_ext_RowClass, bl_fi_mst_entity_line_RowClass, EntityContainerModel, Pagination, PagingResponseModel, SettlementMethodContainerModel, SettlementMethodService } from 'blg-akaun-ts-lib';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { ViewColumnFacade } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/facades/view-column.facade';
import { CustomerActions } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/actions';
import { CustomerStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/states';

import { Observable } from 'rxjs';


@Component({
  selector: 'app-contact-create',
  templateUrl: './customer-contact-create.component.html',
  styleUrls: ['./customer-contact-create.component.css']
})
export class CreateContactComponent extends ViewColumnComponent implements OnInit {

  form: FormGroup;
  formProperty: FormGroup;
  deactivateReturn$;
  @Input() customerExtLineItem$: Observable<bl_fi_mst_entity_line_RowClass>;

  country = [
    { value: 'MALAYSIA', viewValue: 'Malaysia' },
    { value: 'SINGAPORE', viewValue: 'Singapore' },
    { value: 'THAILAND', viewValue: 'Thailand' }
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
  protected readonly index = 4;
  prevIndex: number;
  private prevLocalState: any;
  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  newSettlement: SettlementMethodContainerModel[];
  settlementList: SettlementMethodContainerModel[];
  settlementListguid;
  settlementArr: any;
  settlementGuid: any;
  settlementName: any;
  settlementArr1: any = [];
  apiVisa = AppConfig.apiVisa;
  paging = new Pagination();
  addSuccess = 'Add';
  primary: string;
  isClicked = 'primary';
  constructor(
    private readonly store: Store<CustomerStates>,
    private fb: FormBuilder,
    private viewColFacade: ViewColumnFacade,
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.fb.group({
      contact_name: ['', Validators.required],
      contact_id: ['', Validators.required],
      position: ['', Validators.required],
      office_no: [''],
      extension_no: [''],
      mobile_no: ['', Validators.required],
      fax_no: [''],
      other_no: [''],
      email: [''],
      phone: [''],
    });

    this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
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
    const newContactLine = new bl_fi_mst_entity_line_RowClass();
    // newContactLine.contact_json = this.form.value;
    const form = this.form.value;
    newContactLine.name = form.contact_name;
    newContactLine.id_no = form.contact_id;
    this.formProperty = this.fb.group({
      position: form.position,
      office_no: form.office_no,
      extension_no: form.extension_no,
      mobile_no: form.mobile_no,
      fax_no: form.fax_no,
      other_no: form.other_no,
    });
    newContactLine.phone = form.phone;
    newContactLine.email = form.email;
    newContactLine.status = 'ACTIVE';
    newContactLine.txn_type = 'CONTACT';
    newContactLine.contact_json = this.formProperty.value;
    const date = new Date();
    newContactLine.created_date = date;
    newContactLine.updated_date = date;
    console.log('newContactLine', newContactLine);

    this.store.dispatch(CustomerActions.createContactExt({
      ext: newContactLine
    }));
    this.addSuccess = 'Success';
    this.isClicked = 'buttonSuccess';
    setTimeout(() => {
      this.addSuccess = 'Add';
      this.form.reset();
      this.isClicked = 'primary';
    }, 1500);


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
