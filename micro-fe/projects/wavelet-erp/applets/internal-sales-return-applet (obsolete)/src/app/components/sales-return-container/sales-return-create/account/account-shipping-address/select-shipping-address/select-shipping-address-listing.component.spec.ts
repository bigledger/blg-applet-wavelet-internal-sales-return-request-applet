import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PurchaseOrderSelectShippingAddressComponent } from './select-shipping-address-listing.component';

describe('PurchaseOrderSelectShippingAddressComponent', () => {
  let component: PurchaseOrderSelectShippingAddressComponent;
  let fixture: ComponentFixture<PurchaseOrderSelectShippingAddressComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseOrderSelectShippingAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderSelectShippingAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
