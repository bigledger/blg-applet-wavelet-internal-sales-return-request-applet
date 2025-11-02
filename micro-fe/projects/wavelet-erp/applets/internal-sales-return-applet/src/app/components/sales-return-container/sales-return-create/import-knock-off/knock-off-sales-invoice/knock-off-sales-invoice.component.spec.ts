import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnockOffSalesInvoiceComponent } from './knock-off-sales-invoice.component';

describe('KnockOffSalesInvoiceComponent', () => {
  let component: KnockOffSalesInvoiceComponent;
  let fixture: ComponentFixture<KnockOffSalesInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KnockOffSalesInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KnockOffSalesInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
