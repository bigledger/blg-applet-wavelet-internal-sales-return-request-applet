import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditLimitsMainComponent } from './credit-limits-main.component';

describe('CreditLimitsMainComponent', () => {
  let component: CreditLimitsMainComponent;
  let fixture: ComponentFixture<CreditLimitsMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditLimitsMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditLimitsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
