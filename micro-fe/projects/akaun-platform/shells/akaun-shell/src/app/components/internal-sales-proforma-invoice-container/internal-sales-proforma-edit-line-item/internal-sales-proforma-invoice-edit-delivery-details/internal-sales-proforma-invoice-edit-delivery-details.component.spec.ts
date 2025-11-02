import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InternalSalesProformaInvoiceEditDeliveryDetailsComponent } from './internal-sales-proforma-invoice-edit-delivery-details.component';

describe('InternalSalesProformaInvoiceEditDeliveryDetailsComponent', () => {
  let component: InternalSalesProformaInvoiceEditDeliveryDetailsComponent;
  let fixture: ComponentFixture<InternalSalesProformaInvoiceEditDeliveryDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalSalesProformaInvoiceEditDeliveryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalSalesProformaInvoiceEditDeliveryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
