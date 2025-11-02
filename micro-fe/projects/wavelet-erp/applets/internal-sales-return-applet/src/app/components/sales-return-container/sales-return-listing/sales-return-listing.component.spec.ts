import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesReturnListingComponent } from './sales-return-listing.component';

describe('SalesReturnListingComponent', () => {
  let component: SalesReturnListingComponent;
  let fixture: ComponentFixture<SalesReturnListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesReturnListingComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesReturnListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
