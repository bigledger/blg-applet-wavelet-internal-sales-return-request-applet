import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLineItemIssueLinkEditActivityComponent } from './issue-link-edit-activity.component';

describe('EditLineItemIssueLinkEditActivityComponent', () => {
  let component: EditLineItemIssueLinkEditActivityComponent;
  let fixture: ComponentFixture<EditLineItemIssueLinkEditActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLineItemIssueLinkEditActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLineItemIssueLinkEditActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
