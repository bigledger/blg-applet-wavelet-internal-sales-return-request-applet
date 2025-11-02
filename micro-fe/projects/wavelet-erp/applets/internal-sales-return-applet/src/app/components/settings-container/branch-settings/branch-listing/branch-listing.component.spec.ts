import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamPermissionLisitingComponent } from './team-permission-listing.component';

describe('TeamPermissionLisitingComponent', () => {
  let component: TeamPermissionLisitingComponent;
  let fixture: ComponentFixture<TeamPermissionLisitingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamPermissionLisitingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamPermissionLisitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});