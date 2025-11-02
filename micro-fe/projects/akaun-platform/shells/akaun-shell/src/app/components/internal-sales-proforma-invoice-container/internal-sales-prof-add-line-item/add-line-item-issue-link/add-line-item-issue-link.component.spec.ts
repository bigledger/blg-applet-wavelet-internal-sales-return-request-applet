import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddLineItemIssueLinkComponent } from './add-line-item-issue-link.component';

describe('AddLineItemIssueLinkComponent', () => {
  let component: AddLineItemIssueLinkComponent;
  let fixture: ComponentFixture<AddLineItemIssueLinkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLineItemIssueLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLineItemIssueLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
