import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIssueSubstasksComponent } from './edit-issue-substasks.component';

describe('EditIssueSubstasksComponent', () => {
  let component: EditIssueSubstasksComponent;
  let fixture: ComponentFixture<EditIssueSubstasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditIssueSubstasksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIssueSubstasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
