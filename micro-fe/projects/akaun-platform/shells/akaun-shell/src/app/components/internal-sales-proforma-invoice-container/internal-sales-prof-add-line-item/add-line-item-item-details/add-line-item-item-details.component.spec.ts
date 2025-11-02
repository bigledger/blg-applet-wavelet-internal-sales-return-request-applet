import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddLineItemItemDetailsComponent } from './add-line-item-item-details.component';

describe('AddLineItemItemDetailsComponent', () => {
  let component: AddLineItemItemDetailsComponent;
  let fixture: ComponentFixture<AddLineItemItemDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLineItemItemDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLineItemItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
