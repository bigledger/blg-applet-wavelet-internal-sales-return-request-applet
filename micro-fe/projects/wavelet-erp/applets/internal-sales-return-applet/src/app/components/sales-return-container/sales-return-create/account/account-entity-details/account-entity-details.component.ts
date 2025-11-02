import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { bl_fi_generic_doc_hdr_RowClass } from 'blg-akaun-ts-lib';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink2';
import { InternalSalesReturnSelectors } from '../../../../../state-controllers/internal-sales-return-controller/store/selectors';
import { InternalSalesReturnStates } from '../../../../../state-controllers/internal-sales-return-controller/store/states';
import { Store} from '@ngrx/store';

export class CustomerView {
  id;
  guid;
  name;
  code;
  type;
  glCode;
  creditTerms;
  creditLimit;
  currency;
  description;
  status;
  entity_id;
  tax;
  updated_date;
  modifiedBy;
  created_date;
  createdBy;
}

@Component({
  selector: 'app-account-entity-details',
  templateUrl: './account-entity-details.component.html',
  styleUrls: ['./account-entity-details.component.css']
})
export class AccountEntityDetailsComponent implements OnInit, OnDestroy {

  @Input() draft$: Observable<bl_fi_generic_doc_hdr_RowClass>;
  @Output() selectEntity = new EventEmitter();
  @Output() accountStatusChange = new EventEmitter<string>();
  genDocLock$ = this.store.select(InternalSalesReturnSelectors.selectGenDocLock);

  protected subs = new SubSink();

  public form: FormGroup;
  postingStatus;
  genDocLock:boolean;

  leftColControls = [
    { label: 'Entity Id*', formControl: 'entityId', type: 'entityId', readonly: false },
    { label: 'Status', formControl: 'status', type: 'text', readonly: true },
    { label: 'Identity Type', formControl: 'identityType', type: 'number', readonly: true },
    { label: 'Currency', formControl: 'currency', type: 'number', readonly: true },
    { label: 'Description', formControl: 'description', type: 'number', readonly: true },
    { label: 'Phone Number', formControl: 'phoneNumber', type: 'number', readonly: true },
  ];

  rightColControls = [
    { label: 'Entity Name', formControl: 'entityName', type: 'text', readonly: true },
    { label: 'Entity Type', formControl: 'entityType', type: 'text', readonly: true },
    { label: 'ID Number', formControl: 'idNumber', type: 'text', readonly: true },
    { label: 'GL Code', formControl: 'glCode', type: 'text', readonly: true },
    { label: 'Email', formControl: 'email', type: 'email', readonly: true }
  ];

  constructor(protected readonly store: Store<InternalSalesReturnStates>,
  ) { }

  ngOnInit() {
    this.subs.sink = this.genDocLock$.subscribe(lock=>{
      this.genDocLock = lock;
    })
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

    this.subs.sink = this.form.statusChanges.subscribe((status) => {
      console.log("Account Status", status);
      this.accountStatusChange.emit(status);
    });

    this.form.get('entityId').markAsTouched();

    this.subs.sink = this.draft$.subscribe({
      next: (resolve: any) => {
        this.postingStatus === resolve.posting_status;
        if (
          resolve.posting_status === "FINAL" ||
          resolve.posting_status === "VOID" ||
          resolve.posting_status === "DISCARDED"  || this.genDocLock ||
          (resolve.status !== "ACTIVE" &&
            resolve.status !== "TEMP" &&
            resolve.status !== null)
        ) {
          this.form.controls["entityId"].disable();
        } else {
          this.form.controls["entityId"].enable();
        }

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
      }
    });
  }

  selectCustomer() {
    this.selectEntity.emit();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}