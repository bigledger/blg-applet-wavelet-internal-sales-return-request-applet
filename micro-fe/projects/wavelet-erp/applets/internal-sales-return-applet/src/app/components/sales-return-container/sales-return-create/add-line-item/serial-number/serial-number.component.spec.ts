import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LineItemAddSerialNumberComponent } from './serial-number.component';

describe('LineItemAddSerialNumberComponent', () => {
  let component: LineItemAddSerialNumberComponent;
  let fixture: ComponentFixture<LineItemAddSerialNumberComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LineItemAddSerialNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemAddSerialNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
