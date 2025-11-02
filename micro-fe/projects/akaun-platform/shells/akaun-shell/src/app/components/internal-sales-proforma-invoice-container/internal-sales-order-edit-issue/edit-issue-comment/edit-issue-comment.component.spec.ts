import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIssueCommentComponent } from './edit-issue-comment.component';

describe('EditIssueCommentComponent', () => {
  let component: EditIssueCommentComponent;
  let fixture: ComponentFixture<EditIssueCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditIssueCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIssueCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
