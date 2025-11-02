import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueLinkEditComponent } from './issue-link-edit.component';

describe('IssueLinkEditComponent', () => {
  let component: IssueLinkEditComponent;
  let fixture: ComponentFixture<IssueLinkEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueLinkEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueLinkEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
