import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LineJobsheetItemComponent } from './line-jobsheet-item.component';

describe('LineJobsheetItemComponent', () => {
  let component: LineJobsheetItemComponent;
  let fixture: ComponentFixture<LineJobsheetItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LineJobsheetItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineJobsheetItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
