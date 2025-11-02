import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueLinkEditActivityComponent } from './issue-link-edit-activity.component';

describe('IssueLinkEditActivityComponent', () => {
  let component: IssueLinkEditActivityComponent;
  let fixture: ComponentFixture<IssueLinkEditActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueLinkEditActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueLinkEditActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
