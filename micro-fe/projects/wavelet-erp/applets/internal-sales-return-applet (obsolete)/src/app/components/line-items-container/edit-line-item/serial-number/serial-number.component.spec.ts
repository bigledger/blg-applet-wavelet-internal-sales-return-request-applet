import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EditLineItemSerialNumberComponent } from './serial-number.component';


describe('EditLineItemSerialNumberComponent', () => {
  let component: EditLineItemSerialNumberComponent;
  let fixture: ComponentFixture<EditLineItemSerialNumberComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLineItemSerialNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLineItemSerialNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
