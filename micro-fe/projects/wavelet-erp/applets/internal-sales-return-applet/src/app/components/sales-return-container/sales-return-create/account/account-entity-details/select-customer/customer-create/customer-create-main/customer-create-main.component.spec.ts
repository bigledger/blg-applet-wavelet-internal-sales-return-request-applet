import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCreateMainComponent } from './customer-create-main.component';

describe('CustomerCreateMainComponent', () => {
  let component: CustomerCreateMainComponent;
  let fixture: ComponentFixture<CustomerCreateMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerCreateMainComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCreateMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
