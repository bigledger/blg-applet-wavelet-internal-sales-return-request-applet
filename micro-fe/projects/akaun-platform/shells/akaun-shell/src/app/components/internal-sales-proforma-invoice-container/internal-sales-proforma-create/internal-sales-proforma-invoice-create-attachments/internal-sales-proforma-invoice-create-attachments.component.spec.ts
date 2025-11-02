import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InternalSalesProformaInvoiceCreateAttachmentsComponent } from './internal-sales-proforma-invoice-create-attachments.component';

describe('InternalSalesOrderCreateAttachmentsComponent', () => {
  let component: InternalSalesProformaInvoiceCreateAttachmentsComponent;
  let fixture: ComponentFixture<InternalSalesProformaInvoiceCreateAttachmentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalSalesProformaInvoiceCreateAttachmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalSalesProformaInvoiceCreateAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
