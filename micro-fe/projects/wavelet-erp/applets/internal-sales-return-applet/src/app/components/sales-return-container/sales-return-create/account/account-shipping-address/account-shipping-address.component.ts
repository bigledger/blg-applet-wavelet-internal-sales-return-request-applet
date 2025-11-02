import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { bl_fi_generic_doc_hdr_RowClass } from 'blg-akaun-ts-lib';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink2';
import { Store } from '@ngrx/store';
import { InternalSalesReturnStates } from '../../../../../state-controllers/internal-sales-return-controller/store/states';

@Component({
  selector: 'app-account-shipping-address',
  templateUrl: './account-shipping-address.component.html',
  styleUrls: ['./account-shipping-address.component.css']
})
export class AccountShippingAddressComponent implements OnInit, OnDestroy {

  @Input() draft$: Observable<bl_fi_generic_doc_hdr_RowClass>;
  @Output() selectShipping = new EventEmitter();
  @Output() updateShipTo = new EventEmitter();
  @Output() updateShippingAddress = new EventEmitter();

  protected subs = new SubSink();

  shippingForm: FormGroup;
  addressForm: FormGroup;

  showSelectShippingButton = true;

  shippingCenterColControls = [
    { label: 'Recipient Name', formControl: 'name', type: 'text', readonly: false },
  ];

  shippingLeftColControls = [
    { label: 'Email', formControl: 'email', type: 'email', readonly: false },
  ];

  shippingRightColControls = [
    { label: 'Phone No', formControl: 'phoneNo', type: 'number', readonly: false },
  ];

  addressLeftColControls = [
    { label: 'Shipping Address', formControl: 'shippingAddress', type: 'shippingAddress', readonly: false },
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
    this.shippingForm = new FormGroup({
      name: new FormControl(),
      email: new FormControl(),
      phoneNo: new FormControl(),
    });
    this.addressForm = new FormGroup({
      shippingAddress: new FormControl(),
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
      next: (resolve) => {
        if (resolve.doc_entity_hdr_guid) {
          this.addressForm.controls['shippingAddress'].enable();
        }
        if (resolve.delivery_entity_json && resolve.delivery_entity_json.shippingAddress)
          this.addressForm.enable();
        this.addressForm.patchValue({
          shippingAddress: resolve.delivery_entity_json?.shippingAddress?.name,
          addressLine1: resolve.delivery_entity_json?.shippingAddress?.address_line_1,
          addressLine2: resolve.delivery_entity_json?.shippingAddress?.address_line_2,
          addressLine3: resolve.delivery_entity_json?.shippingAddress?.address_line_3,
          addressLine4: resolve.delivery_entity_json?.shippingAddress?.address_line_4,
          addressLine5: resolve.delivery_entity_json?.shippingAddress?.address_line_5,
          country: resolve.delivery_entity_json?.shippingAddress?.country,
          city: resolve.delivery_entity_json?.shippingAddress?.city,
          state: resolve.delivery_entity_json?.shippingAddress?.state,
          stateCode: resolve.delivery_entity_json?.shippingAddress?.stateCode,
          postcode: resolve.delivery_entity_json?.shippingAddress?.postal_code
        });
        this.shippingForm.patchValue({
          name: resolve.delivery_entity_json?.shippingInfo?.name,
          email: resolve.delivery_entity_json?.shippingInfo?.email,
          phoneNo: resolve.delivery_entity_json?.shippingInfo?.phoneNo,
        });

        if (resolve.posting_status == 'VOID' || resolve.posting_status == 'DISCARDED') {
          this.addressForm.disable();
          this.shippingForm.disable();
          this.showSelectShippingButton = false;
        }
      }
    });
  }

  selectAddress() {
    this.selectShipping.emit();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}