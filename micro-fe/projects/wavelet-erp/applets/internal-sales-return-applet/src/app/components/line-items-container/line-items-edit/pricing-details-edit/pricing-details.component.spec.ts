import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddLineItemPricingDetailsComponent } from './pricing-details.component';

describe('AddLineItemPricingDetailsComponent', () => {
  let component: AddLineItemPricingDetailsComponent;
  let fixture: ComponentFixture<AddLineItemPricingDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLineItemPricingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLineItemPricingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
