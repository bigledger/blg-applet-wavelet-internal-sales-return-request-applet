import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EditItemDetailsDeliveryDetailsComponent } from './delivery-details.component';

describe('EditItemDetailsDeliveryDetailsComponent', () => {
  let component: EditItemDetailsDeliveryDetailsComponent;
  let fixture: ComponentFixture<EditItemDetailsDeliveryDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditItemDetailsDeliveryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditItemDetailsDeliveryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
