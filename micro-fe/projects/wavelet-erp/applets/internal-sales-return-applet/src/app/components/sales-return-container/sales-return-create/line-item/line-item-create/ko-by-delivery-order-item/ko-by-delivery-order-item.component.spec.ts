import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KoByDeliveryOrderItemComponent } from './ko-by-delivery-order-item.component';

describe('KoByDeliveryOrderItemComponent', () => {
  let component: KoByDeliveryOrderItemComponent;
  let fixture: ComponentFixture<KoByDeliveryOrderItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KoByDeliveryOrderItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KoByDeliveryOrderItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
