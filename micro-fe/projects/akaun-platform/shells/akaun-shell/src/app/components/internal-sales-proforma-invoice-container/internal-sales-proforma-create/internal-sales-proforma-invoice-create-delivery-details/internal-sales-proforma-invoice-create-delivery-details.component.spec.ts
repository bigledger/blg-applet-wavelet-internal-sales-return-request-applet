import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InternalSalesProformaInvoiceCreateDeliveryDetailsComponent } from './internal-sales-proforma-invoice-create-delivery-details.component';

describe('InternalSalesOrderCreateDeliveryDetailsComponent', () => {
  let component: InternalSalesProformaInvoiceCreateDeliveryDetailsComponent;
  let fixture: ComponentFixture<InternalSalesProformaInvoiceCreateDeliveryDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalSalesProformaInvoiceCreateDeliveryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalSalesProformaInvoiceCreateDeliveryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
