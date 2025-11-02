import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EditLineSerialNumberImportComponent } from './serial-number-import.component';

describe('EditLineSerialNumberImportComponent', () => {
  let component: EditLineSerialNumberImportComponent;
  let fixture: ComponentFixture<EditLineSerialNumberImportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLineSerialNumberImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLineSerialNumberImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
