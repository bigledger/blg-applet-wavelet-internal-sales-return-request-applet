import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingLocationCellRendererComponent } from './shipping-location-cell-renderer.component';

describe('ShippingLocationCellRendererComponent', () => {
  let component: ShippingLocationCellRendererComponent;
  let fixture: ComponentFixture<ShippingLocationCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShippingLocationCellRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingLocationCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
