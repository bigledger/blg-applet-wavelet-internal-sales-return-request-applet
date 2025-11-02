import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalSalesOrderCreateComponent } from './internal-sales-order-create.component';

describe('InternalSalesOrderCreateComponent', () => {
  let component: InternalSalesOrderCreateComponent;
  let fixture: ComponentFixture<InternalSalesOrderCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalSalesOrderCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalSalesOrderCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
