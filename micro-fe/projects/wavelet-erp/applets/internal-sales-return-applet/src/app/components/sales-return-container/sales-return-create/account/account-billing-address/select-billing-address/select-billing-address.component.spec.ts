import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectBillingAddressComponent } from './select-billing-address.component';

describe('SelectBillingAddressComponent', () => {
  let component: SelectBillingAddressComponent;
  let fixture: ComponentFixture<SelectBillingAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectBillingAddressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectBillingAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
