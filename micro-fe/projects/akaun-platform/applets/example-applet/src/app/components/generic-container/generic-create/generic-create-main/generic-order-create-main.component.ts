import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BlgFormControls } from 'blg-akaun-ng-lib';
import { AppConfig } from 'projects/shared-utilities/visa';
import { SubSink } from 'subsink2';
@Component({
  selector: 'app-generic-create-main',
  templateUrl: './generic-create-main.component.html',
  styleUrls: ['./generic-create-main.component.css']
})
export class GenericCreateMainComponent implements OnInit, OnDestroy {

  @Output() shippingInfo = new EventEmitter();
  @Output() billingInfo = new EventEmitter();
  apiVisa = AppConfig.apiVisa;

  private subs = new SubSink();

  form: FormGroup;

  controls: BlgFormControls[] = [
    {label: 'Doc No', formControl: 'docNo', type: 'number', readonly: false, required: false},
    {label: 'Customer Name', formControl: 'customerType', type: 'number', readonly: false, required: false},
    {label: 'Customer Type', formControl: 'customerName', type: 'text', readonly: false, required: false},
    {label: 'Credit Term', formControl: 'creditTerm', type: 'text', readonly: false, required: false},
    {label: 'Sales Agent', formControl: 'salesAgent', type: 'text', readonly: false, required: false},
    {label: 'Shipping Info', formControl: 'shippingInfo', type: 'text', readonly: false, required: false},
    {label: 'Billing Info', formControl: 'billingInfo', type: 'text', readonly: false, required: false},
    {label: 'Ship Via', formControl: 'shipVia', type: 'text', readonly: false, required: false},
    {label: 'Remarks', formControl: 'remarks', type: 'text-area', readonly: false, required: false},
  ];

  constructor() { }

  ngOnInit() {
    this.form = new FormGroup({
      branch: new FormControl(),
      location: new FormControl(),
      docNo: new FormControl(),
      customerType: new FormControl(),
      customerName: new FormControl(),
      creditTerm: new FormControl(),
      salesAgent: new FormControl(),
      shippingInfo: new FormControl(),
      billingInfo: new FormControl(),
      shipVia: new FormControl(),
      remarks: new FormControl(),
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}

