import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InternalSalesProformaInvoiceAddLineItemComponent } from './internal-sales-proforma-invoice-add-line-item.component';

describe('InternalSalesProformaInvoiceAddLineItemComponent', () => {
  let component: InternalSalesProformaInvoiceAddLineItemComponent;
  let fixture: ComponentFixture<InternalSalesProformaInvoiceAddLineItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalSalesProformaInvoiceAddLineItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalSalesProformaInvoiceAddLineItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
