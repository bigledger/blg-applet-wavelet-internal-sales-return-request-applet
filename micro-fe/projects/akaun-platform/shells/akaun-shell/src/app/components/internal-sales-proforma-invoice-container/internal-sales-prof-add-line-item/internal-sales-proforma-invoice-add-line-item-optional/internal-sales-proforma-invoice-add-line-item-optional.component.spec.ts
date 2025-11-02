import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InternalSalesProformaInvoiceAddLineItemOptionalComponent } from './internal-sales-proforma-invoice-add-line-item-optional.component';

describe('InternalSalesProformaInvoiceAddLineItemOptionalComponent', () => {
  let component: InternalSalesProformaInvoiceAddLineItemOptionalComponent;
  let fixture: ComponentFixture<InternalSalesProformaInvoiceAddLineItemOptionalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalSalesProformaInvoiceAddLineItemOptionalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalSalesProformaInvoiceAddLineItemOptionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
