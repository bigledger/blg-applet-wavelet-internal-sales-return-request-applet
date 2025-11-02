import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIssueActivityComponent } from './edit-issue-activity.component';

describe('EditIssueActivityComponent', () => {
  let component: EditIssueActivityComponent;
  let fixture: ComponentFixture<EditIssueActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditIssueActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIssueActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
