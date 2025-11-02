import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLineItemIssueLinkEditSubtasksComponent } from './issue-link-edit-subtasks.component';

describe('EditLineItemIssueLinkEditSubtasksComponent', () => {
  let component: EditLineItemIssueLinkEditSubtasksComponent;
  let fixture: ComponentFixture<EditLineItemIssueLinkEditSubtasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLineItemIssueLinkEditSubtasksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLineItemIssueLinkEditSubtasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
