import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccountShippingAddressComponent } from './account-shipping-address.component';

describe('AccountShippingAddressComponent', () => {
  let component: AccountShippingAddressComponent;
  let fixture: ComponentFixture<AccountShippingAddressComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountShippingAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountShippingAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
