import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueLinkEditSubtasksComponent } from './issue-link-edit-subtasks.component';

describe('IssueLinkEditSubtasksComponent', () => {
  let component: IssueLinkEditSubtasksComponent;
  let fixture: ComponentFixture<IssueLinkEditSubtasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueLinkEditSubtasksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueLinkEditSubtasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
