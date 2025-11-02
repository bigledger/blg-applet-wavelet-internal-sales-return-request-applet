import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditTermsMainComponent } from './credit-terms-main.component';

describe('CreditTermslimitsMainComponent', () => {
  let component: CreditTermsMainComponent;
  let fixture: ComponentFixture<CreditTermsMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditTermsMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditTermsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
