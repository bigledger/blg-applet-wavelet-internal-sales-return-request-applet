import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InternalSalesProformaInvoiceAddRelatedDocumentsComponent } from './internal-sales-proforma-invoice-add-related-documents.component';

describe('InternalSalesProformaInvoiceAddRelatedDocumentsComponent', () => {
  let component: InternalSalesProformaInvoiceAddRelatedDocumentsComponent;
  let fixture: ComponentFixture<InternalSalesProformaInvoiceAddRelatedDocumentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalSalesProformaInvoiceAddRelatedDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalSalesProformaInvoiceAddRelatedDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
