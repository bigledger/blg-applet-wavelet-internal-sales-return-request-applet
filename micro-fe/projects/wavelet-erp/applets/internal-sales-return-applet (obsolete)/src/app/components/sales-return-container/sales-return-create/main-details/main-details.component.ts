import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppConfig } from 'projects/shared-utilities/visa';
import { SubSink } from 'subsink2';
import { Observable } from 'rxjs';
import { bl_fi_generic_doc_hdr_RowClass, BranchContainerModel, GuidDataFieldInterface, MembershipCardService } from 'blg-akaun-ts-lib';
import { DraftStates } from '../../../../state-controllers/draft-controller/store/states';
import { SalesReturnStates } from '../../../../state-controllers/sales-return-controller/store/states';
import { SalesReturnSelectors } from '../../../../state-controllers/sales-return-controller/store/selectors';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-sales-return-main-details',
  templateUrl: './main-details.component.html',
  styleUrls: ['./main-details.component.scss'],
})
export class SalesReturnMainComponent implements OnInit, OnDestroy {

  @Input() draft$: Observable<bl_fi_generic_doc_hdr_RowClass>;
  @Output() updateMain = new EventEmitter();
  @Output() selectSalesAgent = new EventEmitter();
  @Output() selectMember = new EventEmitter();
  
  protected subs = new SubSink();

  membercard$;

  creditTerms$ = this.store.select(SalesReturnSelectors.selectEntity).pipe(
    map(a =>  a?.bl_fi_mst_entity_ext.filter(e => e.param_code === 'CREDIT_TERMS')));
  
  apiVisa = AppConfig.apiVisa;
  public form: FormGroup;
  selectedBranch: GuidDataFieldInterface;
  creditTermsList = [];

  constructor(
    protected readonly draftStore: Store<DraftStates>,
    protected readonly store: Store<SalesReturnStates>,
    private membercardService: MembershipCardService,) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      branch: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
      salesAgent: new FormControl('', Validators.required),
      transactionDate: new FormControl(),
      creditTerms: new FormControl('', Validators.required),
      reference: new FormControl(),
      remarks: new FormControl(),
      permitNo: new FormControl(),
      crmContact: new FormControl(),
      membercard: new FormControl(),
      currency: new FormControl(),
      salesLead: new FormControl(),
      trackingID: new FormControl()
    });
    this.form.controls['creditTerms'].disable();

    this.subs.sink = this.draft$.subscribe(resolve => {
      this.form.patchValue({
        branch: resolve.guid_branch,
        location: resolve.guid_store,
        salesAgent: resolve.property_json?.salesAgent?.salesAgentName,
        transactionDate: resolve.date_txn ? resolve.date_txn : new Date().toISOString().split('T')[0],
        creditTerms: (<any>resolve).doc_entity_hdr_json?.creditTerms,
        reference: resolve.doc_reference,
        remarks: resolve.doc_remarks,        
        // creditLimit: (<any>resolve).doc_entity_hdr_json?.creditLimit,
        permitNo: (<any>resolve).doc_entity_hdr_json?.permitNo,
        crmContact: resolve.contact_key_guid,
        membercard: resolve.property_json?.member?.memberCardNo,
        currency: resolve.doc_ccy,
        salesLead: (<any>resolve).doc_entity_hdr_json?.salesLead ? (<any>resolve)?.doc_entity_hdr_json?.salesLead : 'Corporate',
        trackingID: (<any>resolve).doc_entity_hdr_json?.trackingID
      });
    });

    this.subs.sink = this.creditTerms$.subscribe({ next: resolve => {
      if (resolve?.length) {
        this.form.controls['creditTerms'].enable();
        this.creditTermsList = resolve;
      }
    }});
  }

  onBranchSelected(e: BranchContainerModel) {
    this.selectedBranch = e.bl_fi_mst_branch.guid;
  }

  goToSelectSalesAgent() {
    this.selectSalesAgent.emit();
  }

  goToSelectMember() {
    this.selectMember.emit();
  }
  
  ngOnDestroy() {
    this.subs.unsubscribe();  
  }

}