import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIssueMainDetailsComponent } from './edit-issue-main-details.component';

describe('EditIssueMainDetailsComponent', () => {
  let component: EditIssueMainDetailsComponent;
  let fixture: ComponentFixture<EditIssueMainDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditIssueMainDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIssueMainDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
