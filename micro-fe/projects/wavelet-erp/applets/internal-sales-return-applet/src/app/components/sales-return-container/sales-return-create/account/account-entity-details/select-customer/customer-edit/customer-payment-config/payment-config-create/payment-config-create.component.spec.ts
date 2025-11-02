import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePaymentConfigComponent } from './payment-config-create.component';

describe('CreatePaymentConfigComponent', () => {
  let component: CreatePaymentConfigComponent;
  let fixture: ComponentFixture<CreatePaymentConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreatePaymentConfigComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePaymentConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
