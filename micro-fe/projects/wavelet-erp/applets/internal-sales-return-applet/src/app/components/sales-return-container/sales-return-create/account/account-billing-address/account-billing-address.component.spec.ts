import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountBillingAddressComponent } from './account-billing-address.component';

describe('AccountBillingAddressComponent', () => {
  let component: AccountBillingAddressComponent;
  let fixture: ComponentFixture<AccountBillingAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountBillingAddressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountBillingAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
