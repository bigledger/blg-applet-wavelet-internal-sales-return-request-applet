import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AddPrintableFormatComponent } from './add-printable-format.component';


describe('AddPrintableFormatComponent', () => {
  let component: AddPrintableFormatComponent;
  let fixture: ComponentFixture<AddPrintableFormatComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddPrintableFormatComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPrintableFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
