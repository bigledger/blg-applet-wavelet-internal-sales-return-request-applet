import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { bl_fi_generic_doc_hdr_RowClass } from 'blg-akaun-ts-lib';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink2';

@Component({
  selector: 'app-account-entity-details',
  templateUrl: './account-entity-details.component.html',
  styleUrls: ['./account-entity-details.component.css']
})
export class AccountEntityDetailsComponent implements OnInit, OnDestroy {

  @Input() draft$: Observable<bl_fi_generic_doc_hdr_RowClass>;
  @Output() selectEntity = new EventEmitter();
  
  protected subs = new SubSink();

  public form: FormGroup;

  leftColControls = [
    { label: 'Entity Id*', formControl: 'entityId', type: 'entityId', readonly: false },
    { label: 'Status', formControl: 'status', type: 'text', readonly: true },
    { label: 'Identity Type', formControl: 'identityType', type: 'number', readonly: true },
    { label: 'Currency', formControl: 'currency', type: 'number', readonly: true },
    { label: 'Description', formControl: 'description', type: 'number', readonly: true },
    { label: 'Phone Number', formControl: 'phoneNumber', type: 'number', readonly: true },
    // {label: 'Direct Line', formControl: 'directLine', type: 'number', readonly: true},
    // {label: 'Mobile Number', formControl: 'mobileNumber', type: 'number', readonly: true},
  ];

  rightColControls = [
    { label: 'Entity Name', formControl: 'entityName', type: 'text', readonly: true },
    { label: 'Entity Type', formControl: 'entityType', type: 'text', readonly: true },
    { label: 'ID Number', formControl: 'idNumber', type: 'text', readonly: true },
    { label: 'GL Code', formControl: 'glCode', type: 'text', readonly: true },
    { label: 'Email', formControl: 'email', type: 'email', readonly: true }
  ];

  constructor() {}

  ngOnInit() {
    this.form = new FormGroup({
      entityId: new FormControl('', Validators.required),
      entityName: new FormControl(),
      status: new FormControl(),
      email: new FormControl(),
      phoneNumber: new FormControl(),
      glCode: new FormControl(),
      idNumber: new FormControl(),
      entityType: new FormControl(),
      identityType: new FormControl(),
      description: new FormControl(),
      currency: new FormControl(),
    });
    this.subs.sink = this.draft$.subscribe({ next: (resolve: any) => {
      this.form.patchValue({
        entityId: resolve.doc_entity_hdr_json?.entityId,
        entityName: resolve.doc_entity_hdr_json?.entityName,
        status: resolve.doc_entity_hdr_json?.status,
        email: resolve.doc_entity_hdr_json?.email,
        phoneNumber: resolve.doc_entity_hdr_json?.phoneNumber,
        glCode: resolve.doc_entity_hdr_json?.glCode,
        idNumber: resolve.doc_entity_hdr_json?.idNumber,
        entityType: resolve.doc_entity_hdr_json?.entityType,
        identityType: resolve.doc_entity_hdr_json?.identityType,
        description: resolve.doc_entity_hdr_json?.description,
        currency: resolve.doc_entity_hdr_json?.currency,
      });      
    }});
  }

  selectCustomer() {
    this.selectEntity.emit();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}