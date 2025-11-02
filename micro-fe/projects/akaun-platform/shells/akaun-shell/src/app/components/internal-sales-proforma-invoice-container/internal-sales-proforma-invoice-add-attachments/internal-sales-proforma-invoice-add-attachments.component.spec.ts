import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InternalSalesProformaInvoiceAddAttachmentsComponent } from './internal-sales-proforma-invoice-add-attachments.component';

describe('InternalSalesProformaInvoiceAddAttachmentsComponent', () => {
  let component: InternalSalesProformaInvoiceAddAttachmentsComponent;
  let fixture: ComponentFixture<InternalSalesProformaInvoiceAddAttachmentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalSalesProformaInvoiceAddAttachmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalSalesProformaInvoiceAddAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
