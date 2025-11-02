import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LineSearchItemComponent } from './line-search-item.component';

describe('LineSearchItemComponent', () => {
  let component: LineSearchItemComponent;
  let fixture: ComponentFixture<LineSearchItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LineSearchItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineSearchItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
