import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditLimitsEditComponent } from './credit-limits-edit.component';

describe('CreditLimitsEditComponent', () => {
  let component: CreditLimitsEditComponent;
  let fixture: ComponentFixture<CreditLimitsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditLimitsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditLimitsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
