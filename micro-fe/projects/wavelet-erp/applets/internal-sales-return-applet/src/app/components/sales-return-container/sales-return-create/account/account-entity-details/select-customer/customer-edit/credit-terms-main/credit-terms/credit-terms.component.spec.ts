import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditTermsComponent } from './credit-terms.component';

describe('CreditTermsComponent', () => {
  let component: CreditTermsComponent;
  let fixture: ComponentFixture<CreditTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
