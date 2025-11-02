import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditLimitsComponent } from './credit-limits.component';

describe('CreditLimitsComponent', () => {
  let component: CreditLimitsComponent;
  let fixture: ComponentFixture<CreditLimitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditLimitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditLimitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
