import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KoBySalesOrderItemComponent } from './ko-by-sales-order-item.component';

describe('KoBySalesOrderItemComponent', () => {
  let component: KoBySalesOrderItemComponent;
  let fixture: ComponentFixture<KoBySalesOrderItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KoBySalesOrderItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KoBySalesOrderItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
