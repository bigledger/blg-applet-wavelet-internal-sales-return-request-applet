import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InternalSalesProformaInvoiceEditLineItemDepartmentComponent } from './internal-sales-proforma-invoice-edit-line-item-department.component';

describe('InternalSalesProformaInvoiceEditLineItemDepartmentComponent', () => {
  let component: InternalSalesProformaInvoiceEditLineItemDepartmentComponent;
  let fixture: ComponentFixture<InternalSalesProformaInvoiceEditLineItemDepartmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalSalesProformaInvoiceEditLineItemDepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalSalesProformaInvoiceEditLineItemDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
