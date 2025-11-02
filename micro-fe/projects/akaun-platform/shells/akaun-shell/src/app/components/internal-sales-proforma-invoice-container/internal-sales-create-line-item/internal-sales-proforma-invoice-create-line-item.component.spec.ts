import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InternalSalesProformaInvoiceCreateLineItemComponent} from './internal-sales-proforma-invoice-create-line-item.component';

describe('InternalSalesProformaInvoiceCreateLineItemComponent', () => {
  let component: InternalSalesProformaInvoiceCreateLineItemComponent;
  let fixture: ComponentFixture<InternalSalesProformaInvoiceCreateLineItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalSalesProformaInvoiceCreateLineItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalSalesProformaInvoiceCreateLineItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
