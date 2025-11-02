import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectShippingAddressComponent } from './select-shipping-address.component';

describe('SelectShippingAddressComponent', () => {
  let component: SelectShippingAddressComponent;
  let fixture: ComponentFixture<SelectShippingAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectShippingAddressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectShippingAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
