import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PurchaseReturnListingComponent } from './purchase-return-listing.component';

describe('PurchaseReturnListingComponent', () => {
  let component: PurchaseReturnListingComponent;
  let fixture: ComponentFixture<PurchaseReturnListingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseReturnListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseReturnListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
