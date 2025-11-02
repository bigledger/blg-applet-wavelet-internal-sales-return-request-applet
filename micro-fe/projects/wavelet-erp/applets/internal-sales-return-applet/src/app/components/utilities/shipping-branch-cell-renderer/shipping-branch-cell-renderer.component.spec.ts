import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingBranchCellRendererComponent } from './shipping-branch-cell-renderer.component';

describe('ShippingBranchCellRendererComponent', () => {
  let component: ShippingBranchCellRendererComponent;
  let fixture: ComponentFixture<ShippingBranchCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShippingBranchCellRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingBranchCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
