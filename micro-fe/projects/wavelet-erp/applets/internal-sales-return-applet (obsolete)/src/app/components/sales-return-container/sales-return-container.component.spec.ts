import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PurchaseReturnContainerComponent } from './purchase-return-container.component';

describe('PurchaseReturnContainerComponent', () => {
  let component: PurchaseReturnContainerComponent;
  let fixture: ComponentFixture<PurchaseReturnContainerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseReturnContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseReturnContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
