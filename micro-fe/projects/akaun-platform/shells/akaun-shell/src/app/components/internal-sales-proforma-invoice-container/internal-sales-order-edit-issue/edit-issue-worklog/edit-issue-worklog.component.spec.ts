import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIssueWorklogComponent } from './edit-issue-worklog.component';

describe('EditIssueWorklogComponent', () => {
  let component: EditIssueWorklogComponent;
  let fixture: ComponentFixture<EditIssueWorklogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditIssueWorklogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIssueWorklogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
