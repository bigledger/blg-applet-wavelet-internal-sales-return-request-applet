import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrintableFormatListingComponent } from './printable-format-listing.component';


describe('PrintableFormatListingComponent', () => {
  let component: PrintableFormatListingComponent;
  let fixture: ComponentFixture<PrintableFormatListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrintableFormatListingComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintableFormatListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
