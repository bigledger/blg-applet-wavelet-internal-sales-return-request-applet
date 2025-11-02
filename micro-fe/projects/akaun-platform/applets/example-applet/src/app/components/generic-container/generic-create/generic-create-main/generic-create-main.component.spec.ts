import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalSalesOrderCreateMainComponent } from './internal-sales-order-create-main.component';

describe('InternalSalesOrderCreateMainComponent', () => {
  let component: InternalSalesOrderCreateMainComponent;
  let fixture: ComponentFixture<InternalSalesOrderCreateMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalSalesOrderCreateMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalSalesOrderCreateMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
