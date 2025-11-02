import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueLinkEditCommentComponent } from './issue-link-edit-comment.component';

describe('IssueLinkEditCommentComponent', () => {
  let component: IssueLinkEditCommentComponent;
  let fixture: ComponentFixture<IssueLinkEditCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueLinkEditCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueLinkEditCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
