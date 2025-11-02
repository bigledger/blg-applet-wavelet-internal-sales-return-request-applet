import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueLinkEditWorklogComponent } from './issue-link-edit-worklog.component';

describe('IssueLinkEditWorklogComponent', () => {
  let component: IssueLinkEditWorklogComponent;
  let fixture: ComponentFixture<IssueLinkEditWorklogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueLinkEditWorklogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueLinkEditWorklogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
