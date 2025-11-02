import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { InternalSalesReturnEditExportComponent } from './export.component';


describe('InternalSalesReturnEditExportComponent', () => {
  let component: InternalSalesReturnEditExportComponent;
  let fixture: ComponentFixture<InternalSalesReturnEditExportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InternalSalesReturnEditExportComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalSalesReturnEditExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
