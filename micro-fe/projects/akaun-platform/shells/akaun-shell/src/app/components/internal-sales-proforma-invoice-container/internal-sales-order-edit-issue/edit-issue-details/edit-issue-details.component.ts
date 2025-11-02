import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FinancialItemContainerModel, TaxCodeContainerModel } from 'blg-akaun-ts-lib';
import { AppConfig } from 'projects/shared-utilities/visa';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SubSink } from 'subsink2';

@Component({
  selector: 'app-edit-issue-details',
  templateUrl: './edit-issue-details.component.html',
  styleUrls: ['./edit-issue-details.component.css']
})
export class EditIssueDetailsComponent implements OnInit, OnDestroy {

  @Input() item$: Observable<FinancialItemContainerModel>;
  @Input() tax$: Observable<{
    sst: TaxCodeContainerModel[],
    wht: TaxCodeContainerModel[],
  }>;

  @Output() customer = new EventEmitter();
  @Output() shippingInfo = new EventEmitter();
  @Output() billingInfo = new EventEmitter();
  apiVisa = AppConfig.apiVisa;

  private subs = new SubSink();

  form: FormGroup;

  leftColControls = [
    {label: 'Description', formControl: 'description', type: 'text-area', readonly: false, hint: ''},
    {label: 'Parent', formControl: 'parent', type: 'text', readonly: false, hint: ''},
    {label: 'Created Date', formControl: 'createdDate', type: 'date', readonly: false, hint: ''},
    {label: 'Target Start Date', formControl: 'targetStartDate', type: 'date', readonly: false, hint: ''},
    {label: 'Target End Date', formControl: 'targetEndDate', type: 'date', readonly: false, hint: ''},
    {label: 'Actual Start Date', formControl: 'actualStartDate', type: 'date', readonly: false, hint: ''},
    {label: 'Actual End Date', formControl: 'actualEndDate', type: 'date', readonly: false, hint: ''},
    {label: 'Due Date', formControl: 'dueDate', type: 'date', readonly: false, hint: ''},
  ];

  filteredUnitPrice: Observable<string[]>;
  filteredSST: Observable<TaxCodeContainerModel[]>;
  filteredWHT: Observable<TaxCodeContainerModel[]>;

  taxList: TaxCodeContainerModel[] = [];
  whtList: TaxCodeContainerModel[] = [];

  constructor() { }

  ngOnInit() {
    this.form = new FormGroup({
      description: new FormControl(''),
      parent: new FormControl(),
      createdDate: new FormControl(),
      targetStartDate: new FormControl(),
      targetEndDate: new FormControl(),
      actualStartDate: new FormControl(),
      actualEndDate: new FormControl(),
      dueDate: new FormControl(),
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
