import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalSalesOrderListingComponent } from './generic-listing.component';

describe('InternalSalesOrderListingComponent', () => {
  let component: InternalSalesOrderListingComponent;
  let fixture: ComponentFixture<InternalSalesOrderListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalSalesOrderListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalSalesOrderListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
