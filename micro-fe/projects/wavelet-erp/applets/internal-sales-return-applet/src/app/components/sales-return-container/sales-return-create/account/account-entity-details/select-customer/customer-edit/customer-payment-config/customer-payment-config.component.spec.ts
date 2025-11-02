import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPaymentConfigComponent } from './customer-payment-config.component';

describe('CustomerPaymentConfigComponent', () => {
  let component: CustomerPaymentConfigComponent;
  let fixture: ComponentFixture<CustomerPaymentConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerPaymentConfigComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPaymentConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
