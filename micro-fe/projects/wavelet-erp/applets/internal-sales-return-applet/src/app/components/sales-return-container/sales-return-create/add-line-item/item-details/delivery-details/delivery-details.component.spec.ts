import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ItemDetailsDeliveryDetailsComponent } from './delivery-details.component';

describe('ItemDetailsDeliveryDetailsComponent', () => {
  let component: ItemDetailsDeliveryDetailsComponent;
  let fixture: ComponentFixture<ItemDetailsDeliveryDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemDetailsDeliveryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDetailsDeliveryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
