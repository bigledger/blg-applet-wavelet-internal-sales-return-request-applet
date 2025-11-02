import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InternalSalesProformaInvoiceAddSettlementComponent } from './internal-sales-proforma-invoice-add-settlement.component';

describe('InternalSalesProformaInvoiceAddSettlementComponent', () => {
  let component: InternalSalesProformaInvoiceAddSettlementComponent;
  let fixture: ComponentFixture<InternalSalesProformaInvoiceAddSettlementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalSalesProformaInvoiceAddSettlementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalSalesProformaInvoiceAddSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
