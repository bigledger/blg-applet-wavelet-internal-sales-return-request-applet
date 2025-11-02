import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIssueLinkedIssuesComponent } from './edit-issue-linked-issues.component';

describe('EditIssueLinkedIssuesComponent', () => {
  let component: EditIssueLinkedIssuesComponent;
  let fixture: ComponentFixture<EditIssueLinkedIssuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditIssueLinkedIssuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIssueLinkedIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
