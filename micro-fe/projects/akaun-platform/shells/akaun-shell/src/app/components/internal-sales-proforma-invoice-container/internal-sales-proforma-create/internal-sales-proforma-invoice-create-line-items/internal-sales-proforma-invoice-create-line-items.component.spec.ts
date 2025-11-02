import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InternalSalesProformaInvoiceCreateLineItemsComponent } from './internal-sales-proforma-invoice-create-line-items.component';

describe('InternalSalesOrderCreateLineItemsComponent', () => {
  let component: InternalSalesProformaInvoiceCreateLineItemsComponent;
  let fixture: ComponentFixture<InternalSalesProformaInvoiceCreateLineItemsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalSalesProformaInvoiceCreateLineItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalSalesProformaInvoiceCreateLineItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
