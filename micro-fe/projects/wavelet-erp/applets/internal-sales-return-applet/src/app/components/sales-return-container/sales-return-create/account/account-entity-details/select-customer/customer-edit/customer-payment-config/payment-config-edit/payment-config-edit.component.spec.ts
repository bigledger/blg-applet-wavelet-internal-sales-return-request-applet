import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPaymentConfigComponent } from './payment-config-edit.component';

describe('EditPaymentConfigComponent', () => {
  let component: EditPaymentConfigComponent;
  let fixture: ComponentFixture<EditPaymentConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditPaymentConfigComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPaymentConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
