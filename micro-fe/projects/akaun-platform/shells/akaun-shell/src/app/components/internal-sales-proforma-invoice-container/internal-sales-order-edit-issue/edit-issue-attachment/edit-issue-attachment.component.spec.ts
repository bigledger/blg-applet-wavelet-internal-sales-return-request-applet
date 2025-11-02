import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIssueAttachmentComponent } from './edit-issue-attachment.component';

describe('EditIssueAttachmentComponent', () => {
  let component: EditIssueAttachmentComponent;
  let fixture: ComponentFixture<EditIssueAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditIssueAttachmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIssueAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
