import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnockOffSalesOrderComponent } from './knock-off-sales-order.component';

describe('KnockOffSalesOrderComponent', () => {
  let component: KnockOffSalesOrderComponent;
  let fixture: ComponentFixture<KnockOffSalesOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KnockOffSalesOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KnockOffSalesOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
