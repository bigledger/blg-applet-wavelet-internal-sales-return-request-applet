import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnockOffDeliveryOrderComponent } from './knock-off-delivery-order.component';

describe('KnockOffDeliveryOrderComponent', () => {
  let component: KnockOffDeliveryOrderComponent;
  let fixture: ComponentFixture<KnockOffDeliveryOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KnockOffDeliveryOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KnockOffDeliveryOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
