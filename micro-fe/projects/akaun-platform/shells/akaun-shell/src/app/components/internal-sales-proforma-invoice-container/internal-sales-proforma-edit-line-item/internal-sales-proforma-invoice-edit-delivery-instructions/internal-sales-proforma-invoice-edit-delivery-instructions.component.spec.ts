import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InternalSalesProformaInvoiceEditDeliveryInstructions } from './internal-sales-proforma-invoice-edit-delivery-instructions.component';

describe('AccountDeliveryDetailsComponent', () => {
  let component: InternalSalesProformaInvoiceEditDeliveryInstructions;
  let fixture: ComponentFixture<InternalSalesProformaInvoiceEditDeliveryInstructions>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalSalesProformaInvoiceEditDeliveryInstructions ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalSalesProformaInvoiceEditDeliveryInstructions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
