import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KoForDeliveryOrderItemComponent } from './ko-for-delivery-order-item.component';

describe('KoForDeliveryOrderItemComponent', () => {
  let component: KoForDeliveryOrderItemComponent;
  let fixture: ComponentFixture<KoForDeliveryOrderItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KoForDeliveryOrderItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KoForDeliveryOrderItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
