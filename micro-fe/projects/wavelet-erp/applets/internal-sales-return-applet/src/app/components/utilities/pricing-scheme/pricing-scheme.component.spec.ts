import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingSchemeComponent } from './pricing-scheme.component';

describe('PricingSchemeComponent', () => {
  let component: PricingSchemeComponent;
  let fixture: ComponentFixture<PricingSchemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricingSchemeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
