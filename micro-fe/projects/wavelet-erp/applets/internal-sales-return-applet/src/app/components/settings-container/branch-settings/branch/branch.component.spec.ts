import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamPermissionEditComponent } from './team-permission-edit.component';

describe('TeamPermissionEditComponent', () => {
  let component: TeamPermissionEditComponent;
  let fixture: ComponentFixture<TeamPermissionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamPermissionEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamPermissionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});