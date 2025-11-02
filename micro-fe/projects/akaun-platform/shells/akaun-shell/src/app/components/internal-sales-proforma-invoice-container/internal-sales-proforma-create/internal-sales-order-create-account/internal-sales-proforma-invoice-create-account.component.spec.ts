import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InternalSalesProformaInvoiceCreateAccountComponent } from './internal-sales-proforma-invoice-create-account.component';

describe('InternalSalesProformaInvoiceCreateAccountComponent', () => {
  let component: InternalSalesProformaInvoiceCreateAccountComponent;
  let fixture: ComponentFixture<InternalSalesProformaInvoiceCreateAccountComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalSalesProformaInvoiceCreateAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalSalesProformaInvoiceCreateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
