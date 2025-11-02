import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SlideRendererComponent } from './slide-renderer.component';

describe('SlideRendererComponent', () => {
  let component: SlideRendererComponent;
  let fixture: ComponentFixture<SlideRendererComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SlideRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
