import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SerialNumberScanComponent } from './serial-number-scan.component';

describe('SerialNumberScanComponent', () => {
  let component: SerialNumberScanComponent;
  let fixture: ComponentFixture<SerialNumberScanComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SerialNumberScanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerialNumberScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
