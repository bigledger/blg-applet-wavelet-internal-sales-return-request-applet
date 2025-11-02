import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KoForSalesOrderItemComponent } from './ko-for-sales-order-item.component';

describe('KoForSalesOrderItemComponent', () => {
  let component: KoForSalesOrderItemComponent;
  let fixture: ComponentFixture<KoForSalesOrderItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KoForSalesOrderItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KoForSalesOrderItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
