import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SerialNumberImportComponent } from './serial-number-import.component';

describe('SerialNumberImportComponent', () => {
  let component: SerialNumberImportComponent;
  let fixture: ComponentFixture<SerialNumberImportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SerialNumberImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerialNumberImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
