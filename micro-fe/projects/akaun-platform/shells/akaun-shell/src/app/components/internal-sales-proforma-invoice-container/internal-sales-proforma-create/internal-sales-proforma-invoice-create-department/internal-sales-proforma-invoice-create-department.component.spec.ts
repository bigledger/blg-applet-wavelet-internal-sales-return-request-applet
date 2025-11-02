import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InternalSalesProformaInvoiceCreateDepartmentComponent } from './internal-sales-proforma-invoice-create-department.component';

describe('InternalSalesOrderCreateDepartmentComponent', () => {
  let component: InternalSalesProformaInvoiceCreateDepartmentComponent;
  let fixture: ComponentFixture<InternalSalesProformaInvoiceCreateDepartmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalSalesProformaInvoiceCreateDepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalSalesProformaInvoiceCreateDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
