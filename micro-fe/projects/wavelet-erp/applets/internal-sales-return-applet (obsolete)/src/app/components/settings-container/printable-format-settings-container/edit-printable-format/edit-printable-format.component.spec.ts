import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EditPrintableFormatComponent } from './edit-printable-format.component';


describe('EditPrintableFormatComponent', () => {
  let component: EditPrintableFormatComponent;
  let fixture: ComponentFixture<EditPrintableFormatComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditPrintableFormatComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPrintableFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
