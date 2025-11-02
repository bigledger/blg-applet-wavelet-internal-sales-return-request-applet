import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PurchaseOrderCreateDeliveryDetailsComponent } from './delivery-details.component';

describe('PurchaseOrderCreateDeliveryDetailsComponent', () => {
  let component: PurchaseOrderCreateDeliveryDetailsComponent;
  let fixture: ComponentFixture<PurchaseOrderCreateDeliveryDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseOrderCreateDeliveryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderCreateDeliveryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
