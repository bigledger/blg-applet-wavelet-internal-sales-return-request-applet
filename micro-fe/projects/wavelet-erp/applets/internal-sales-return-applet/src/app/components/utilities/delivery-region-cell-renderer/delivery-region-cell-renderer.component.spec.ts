import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryRegionCellRendererComponent } from './delivery-region-cell-renderer.component';

describe('DeliveryRegionCellRendererComponent', () => {
  let component: DeliveryRegionCellRendererComponent;
  let fixture: ComponentFixture<DeliveryRegionCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryRegionCellRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryRegionCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
