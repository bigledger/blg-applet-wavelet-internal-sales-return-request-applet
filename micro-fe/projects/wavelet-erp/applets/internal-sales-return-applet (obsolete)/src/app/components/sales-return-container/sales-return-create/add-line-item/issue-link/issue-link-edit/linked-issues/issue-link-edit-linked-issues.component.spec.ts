import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueLinkEditLinkedIssuesComponent } from './issue-link-edit-linked-issues.component';

describe('IssueLinkEditLinkedIssuesComponent', () => {
  let component: IssueLinkEditLinkedIssuesComponent;
  let fixture: ComponentFixture<IssueLinkEditLinkedIssuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueLinkEditLinkedIssuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueLinkEditLinkedIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
