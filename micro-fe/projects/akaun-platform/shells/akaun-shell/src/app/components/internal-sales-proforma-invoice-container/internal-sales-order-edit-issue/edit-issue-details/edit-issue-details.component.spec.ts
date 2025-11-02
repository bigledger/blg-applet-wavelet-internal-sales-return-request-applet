import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIssueDetailsComponent } from './edit-issue-details.component';

describe('EditIssueDetailsComponent', () => {
  let component: EditIssueDetailsComponent;
  let fixture: ComponentFixture<EditIssueDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditIssueDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIssueDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
