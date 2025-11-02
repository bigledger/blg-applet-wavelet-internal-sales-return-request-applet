import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { bl_fi_generic_doc_hdr_RowClass } from 'blg-akaun-ts-lib';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink2';
import { InternalSalesReturnStates } from '../../../../../state-controllers/internal-sales-return-controller/store/states';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-account-billing-address',
  templateUrl: './account-billing-address.component.html',
  styleUrls: ['./account-billing-address.component.css']
})
export class AccountBillingAddressComponent implements OnInit, OnDestroy {

  @Input() draft$: Observable<bl_fi_generic_doc_hdr_RowClass>;
  @Output() selectBilling = new EventEmitter();
  @Output() updateBillTo = new EventEmitter();
  @Output() updateBillingAddress = new EventEmitter();

  protected subs = new SubSink();

  billingForm: FormGroup;
  addressForm: FormGroup;

  showSelectBillingButton = true;

  billingCenterColControls = [
    { label: 'Name', formControl: 'name', type: 'text', readonly: false },
  ];
  billingLeftColControls = [
    { label: 'Email', formControl: 'email', type: 'email', readonly: false },
  ];

  billingRightColControls = [
    { label: 'Phone No', formControl: 'phoneNo', type: 'number', readonly: false },
  ];

  addressLeftColControls = [
    { label: 'Billing Address', formControl: 'billingAddress', type: 'billingAddress', readonly: false },
    { label: 'Address Line 2', formControl: 'addressLine2', type: 'text', readonly: false },
    { label: 'Address Line 4', formControl: 'addressLine4', type: 'text', readonly: false },
    { label: 'Country', formControl: 'country', type: 'text', readonly: false },
    { label: 'City', formControl: 'city', type: 'text', readonly: false },
  ];

  addressRightColControls = [
    { label: 'Address Line 1', formControl: 'addressLine1', type: 'text', readonly: false },
    { label: 'Address Line 3', formControl: 'addressLine3', type: 'text', readonly: false },
    { label: 'Address Line 5', formControl: 'addressLine5', type: 'text', readonly: false },
    { label: 'State', formControl: 'state', type: 'text', readonly: false },
    { label: 'Postcode', formControl: 'postcode', type: 'text', readonly: false },
  ];

  constructor(protected readonly store: Store<InternalSalesReturnStates>,) { }

  ngOnInit() {
    this.billingForm = new FormGroup({
      name: new FormControl(),
      email: new FormControl(),
      phoneNo: new FormControl(),
    });
    this.addressForm = new FormGroup({
      billingAddress: new FormControl(),
      addressLine1: new FormControl(),
      addressLine2: new FormControl(),
      addressLine3: new FormControl(),
      addressLine4: new FormControl(),
      addressLine5: new FormControl(),
      country: new FormControl(),
      city: new FormControl(),
      state: new FormControl(),
      stateCode: new FormControl(),
      postcode: new FormControl()
    });
    this.addressForm.disable();

    this.subs.sink = this.draft$.subscribe({
      next: (resolve: any) => {
        if (resolve.doc_entity_hdr_guid)
          this.addressForm.controls['billingAddress'].enable();
        if (resolve.billing_json && resolve.billing_json.billingAddress)
          this.addressForm.enable();
        this.addressForm.patchValue({
          billingAddress: resolve.billing_json?.billingAddress?.name,
          addressLine1: resolve.billing_json?.billingAddress?.address_line_1,
          addressLine2: resolve.billing_json?.billingAddress?.address_line_2,
          addressLine3: resolve.billing_json?.billingAddress?.address_line_3,
          addressLine4: resolve.billing_json?.billingAddress?.address_line_4,
          addressLine5: resolve.billing_json?.billingAddress?.address_line_5,
          country: resolve.billing_json?.billingAddress?.country,
          city: resolve.billing_json?.billingAddress?.city,
          state: resolve.billing_json?.billingAddress?.state,
          stateCode: resolve.billing_json?.billingAddress?.stateCode,
          postcode: resolve.billing_json?.billingAddress?.postal_code
        });
        this.billingForm.patchValue({
          name: resolve.billing_json?.billingInfo?.name,
          email: resolve.billing_json?.billingInfo?.email,
          phoneNo: resolve.billing_json?.billingInfo?.phoneNo,
        });

        if (resolve.posting_status == 'VOID' || resolve.posting_status == 'DISCARDED') {
          this.addressForm.disable();
          this.billingForm.disable();
          this.showSelectBillingButton = false;
        }
      }
    });
  }

  selectAddress() {
    this.selectBilling.emit();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}