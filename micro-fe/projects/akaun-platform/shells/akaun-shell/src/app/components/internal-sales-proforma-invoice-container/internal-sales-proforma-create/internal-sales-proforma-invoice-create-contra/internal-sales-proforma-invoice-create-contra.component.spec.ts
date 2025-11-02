import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InternalSalesProformaInvoiceCreateContraComponent } from './internal-sales-proforma-invoice-create-contra.component';

describe('InternalSalesOrderCreateContraComponent', () => {
  let component: InternalSalesProformaInvoiceCreateContraComponent;
  let fixture: ComponentFixture<InternalSalesProformaInvoiceCreateContraComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalSalesProformaInvoiceCreateContraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalSalesProformaInvoiceCreateContraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
