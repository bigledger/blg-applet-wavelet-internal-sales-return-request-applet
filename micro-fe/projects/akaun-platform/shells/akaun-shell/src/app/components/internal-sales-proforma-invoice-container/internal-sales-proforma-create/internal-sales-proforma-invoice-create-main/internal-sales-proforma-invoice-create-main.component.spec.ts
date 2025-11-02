import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InternalSalesProformaInvoiceCreateMainComponent } from './internal-sales-proforma-invoice-create-main.component';

describe('InternalSalesProformaInvoiceCreateMainComponent', () => {
  let component: InternalSalesProformaInvoiceCreateMainComponent;
  let fixture: ComponentFixture<InternalSalesProformaInvoiceCreateMainComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalSalesProformaInvoiceCreateMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalSalesProformaInvoiceCreateMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
