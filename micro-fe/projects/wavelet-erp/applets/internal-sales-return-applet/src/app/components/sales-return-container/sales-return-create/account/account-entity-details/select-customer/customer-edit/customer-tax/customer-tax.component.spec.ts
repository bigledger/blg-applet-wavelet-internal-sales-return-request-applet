import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTaxComponent } from './customer-tax.component';

describe('CustomerTaxComponent', () => {
  let component: CustomerTaxComponent;
  let fixture: ComponentFixture<CustomerTaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerTaxComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
