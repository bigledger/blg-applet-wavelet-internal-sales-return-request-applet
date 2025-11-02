import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalizationContainerComponent } from './personalization-container.component';

describe('PersonalizationComponent', () => {
  let component: PersonalizationContainerComponent;
  let fixture: ComponentFixture<PersonalizationContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalizationContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalizationContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
