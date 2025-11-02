import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InternalSalesProformaInvoiceAddLineItemMainComponent } from './internal-sales-proforma-invoice-add-line-item-main.component';

describe('InternalSalesProformaInvoiceSelectItemMainComponent', () => {
  let component: InternalSalesProformaInvoiceAddLineItemMainComponent;
  let fixture: ComponentFixture<InternalSalesProformaInvoiceAddLineItemMainComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalSalesProformaInvoiceAddLineItemMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalSalesProformaInvoiceAddLineItemMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
