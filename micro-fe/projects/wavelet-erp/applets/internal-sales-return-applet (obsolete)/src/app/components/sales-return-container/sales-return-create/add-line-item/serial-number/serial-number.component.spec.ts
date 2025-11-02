import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddLineItemSerialNumberComponent } from './add-line-item-serial-number.component';

describe('AddLineItemSerialNumberComponent', () => {
  let component: AddLineItemSerialNumberComponent;
  let fixture: ComponentFixture<AddLineItemSerialNumberComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLineItemSerialNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLineItemSerialNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
