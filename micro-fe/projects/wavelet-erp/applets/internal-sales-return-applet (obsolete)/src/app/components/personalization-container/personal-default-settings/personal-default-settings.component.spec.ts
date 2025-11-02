import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PersonalDefaultSettingsComponent } from './personal-default-settings.component';

describe('DefaultSettingsComponent', () => {
  let component: PersonalDefaultSettingsComponent;
  let fixture: ComponentFixture<PersonalDefaultSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalDefaultSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalDefaultSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
