import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLineItemIssueLinkEditLinkedIssuesComponent } from './issue-link-edit-linked-issues.component';

describe('EditLineItemIssueLinkEditLinkedIssuesComponent', () => {
  let component: EditLineItemIssueLinkEditLinkedIssuesComponent;
  let fixture: ComponentFixture<EditLineItemIssueLinkEditLinkedIssuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLineItemIssueLinkEditLinkedIssuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLineItemIssueLinkEditLinkedIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
