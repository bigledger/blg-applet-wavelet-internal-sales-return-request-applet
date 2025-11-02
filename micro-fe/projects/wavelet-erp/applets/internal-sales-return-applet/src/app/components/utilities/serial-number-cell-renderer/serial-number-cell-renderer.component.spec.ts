import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerialNumberCellRendererComponent } from './serial-number-cell-renderer.component';

describe('SerialNumberCellRendererComponent', () => {
  let component: SerialNumberCellRendererComponent;
  let fixture: ComponentFixture<SerialNumberCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SerialNumberCellRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SerialNumberCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
