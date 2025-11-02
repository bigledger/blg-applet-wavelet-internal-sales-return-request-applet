import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EditLineSerialNumberScanComponent } from './serial-number-scan.component';

describe('EditLineSerialNumberScanComponent', () => {
  let component: EditLineSerialNumberScanComponent;
  let fixture: ComponentFixture<EditLineSerialNumberScanComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLineSerialNumberScanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLineSerialNumberScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
