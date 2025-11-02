import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalSalesProformaInvoiceEditIssueComponent } from './internal-sales-proforma-invoice-edit-issue.component';

describe('InternalSalesProformaInvoiceEditIssueComponent', () => {
  let component: InternalSalesProformaInvoiceEditIssueComponent;
  let fixture: ComponentFixture<InternalSalesProformaInvoiceEditIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalSalesProformaInvoiceEditIssueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalSalesProformaInvoiceEditIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
