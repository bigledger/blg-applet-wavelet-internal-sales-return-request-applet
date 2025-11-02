import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountShippingAddressComponent } from './account-shipping-address.component';

describe('AccountShippingAddressComponent', () => {
  let component: AccountShippingAddressComponent;
  let fixture: ComponentFixture<AccountShippingAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountShippingAddressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountShippingAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
