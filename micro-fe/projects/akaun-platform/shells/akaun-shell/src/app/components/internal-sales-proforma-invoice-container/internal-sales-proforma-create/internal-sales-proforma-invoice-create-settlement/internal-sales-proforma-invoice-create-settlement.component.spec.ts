import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InternalSalesProformaInvoiceCreateSettlementComponent } from './internal-sales-proforma-invoice-create-settlement.component';

describe('InternalSalesProformaInvoiceCreateSettlementComponent', () => {
  let component: InternalSalesProformaInvoiceCreateSettlementComponent;
  let fixture: ComponentFixture<InternalSalesProformaInvoiceCreateSettlementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalSalesProformaInvoiceCreateSettlementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalSalesProformaInvoiceCreateSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
