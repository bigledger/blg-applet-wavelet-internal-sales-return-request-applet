import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PurchaseOrderSelectBillingAddressComponent } from './select-billing-address-listing.component';

describe('PurchaseOrderSelectBillingAddressComponent', () => {
  let component: PurchaseOrderSelectBillingAddressComponent;
  let fixture: ComponentFixture<PurchaseOrderSelectBillingAddressComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseOrderSelectBillingAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderSelectBillingAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
