import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppletLogComponent } from './applet-log.component';

describe('AppletLogComponent', () => {
  let component: AppletLogComponent;
  let fixture: ComponentFixture<AppletLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppletLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppletLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
