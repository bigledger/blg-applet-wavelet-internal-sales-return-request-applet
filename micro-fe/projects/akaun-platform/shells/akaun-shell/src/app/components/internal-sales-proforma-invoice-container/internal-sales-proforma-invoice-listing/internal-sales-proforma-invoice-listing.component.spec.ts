import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InternalSalesProformaInvoiceListingComponent } from './internal-sales-proforma-invoice-listing.component';

describe('InternalSalesProformaInvoiceListingComponent', () => {
  let component: InternalSalesProformaInvoiceListingComponent;
  let fixture: ComponentFixture<InternalSalesProformaInvoiceListingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalSalesProformaInvoiceListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalSalesProformaInvoiceListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
