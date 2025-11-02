import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrintableFormatSettingsContainerComponent } from './printable-format-settings-container.component';


describe('PrintableFormatSettingsContainerComponent', () => {
  let component: PrintableFormatSettingsContainerComponent;
  let fixture: ComponentFixture<PrintableFormatSettingsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrintableFormatSettingsContainerComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintableFormatSettingsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
