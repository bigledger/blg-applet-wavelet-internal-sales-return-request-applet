import { AfterViewChecked, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { bl_fi_generic_doc_hdr_RowClass } from 'blg-akaun-ts-lib';
import { Observable } from 'rxjs';
import { AccountBillingAddressComponent } from './account-billing-address/account-billing-address.component';
import { AccountEntityDetailsComponent } from './account-entity-details/account-entity-details.component';
import { AccountShippingAddressComponent } from './account-shipping-address/account-shipping-address.component';

@Component({
  selector: 'app-sales-return-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class SalesReturnAccountComponent implements AfterViewChecked {

  @Input() draft$: Observable<bl_fi_generic_doc_hdr_RowClass>;
  @Input() selectedIndex;

  @Output() selectEntity = new EventEmitter();
  @Output() selectBilling = new EventEmitter();
  @Output() selectShipping = new EventEmitter();
  @Output() updateShipTo = new EventEmitter();
  @Output() updateShippingAddress = new EventEmitter();
  @Output() updateBillTo = new EventEmitter();
  @Output() updateBillingAddress = new EventEmitter();

  @ViewChild(MatTabGroup) matTab: MatTabGroup;
  @ViewChild(AccountEntityDetailsComponent) entity: AccountEntityDetailsComponent;
  @ViewChild(AccountBillingAddressComponent) bill: AccountBillingAddressComponent;
  @ViewChild(AccountShippingAddressComponent) ship: AccountShippingAddressComponent;

  constructor() { }

  ngAfterViewChecked() {
    this.matTab.realignInkBar();
  }

}