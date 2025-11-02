import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddLineItemCostingDetailsComponent } from './add-line-item-costing-details.component';

describe('AddLineItemCostingDetailsComponent', () => {
  let component: AddLineItemCostingDetailsComponent;
  let fixture: ComponentFixture<AddLineItemCostingDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLineItemCostingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLineItemCostingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
