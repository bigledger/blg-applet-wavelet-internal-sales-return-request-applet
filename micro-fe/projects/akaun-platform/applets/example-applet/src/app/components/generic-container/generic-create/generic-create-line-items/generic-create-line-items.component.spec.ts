import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalSalesOrderCreateLineItemsComponent } from './internal-sales-order-create-line-items.component';

describe('InternalSalesOrderCreateLineItemsComponent', () => {
  let component: InternalSalesOrderCreateLineItemsComponent;
  let fixture: ComponentFixture<InternalSalesOrderCreateLineItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalSalesOrderCreateLineItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalSalesOrderCreateLineItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
