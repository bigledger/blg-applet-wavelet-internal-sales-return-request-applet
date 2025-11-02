import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PurchaseOrderAddPaymentComponent } from './add-payment.component';

describe('PurchaseOrderAddPaymentComponent', () => {
  let component: PurchaseOrderAddPaymentComponent;
  let fixture: ComponentFixture<PurchaseOrderAddPaymentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseOrderAddPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderAddPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
