import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditTermsEditComponent } from './credit-terms-edit.component';

describe('CreditTermsEditComponent', () => {
  let component: CreditTermsEditComponent;
  let fixture: ComponentFixture<CreditTermsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditTermsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditTermsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
