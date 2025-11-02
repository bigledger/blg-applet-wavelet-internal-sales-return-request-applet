import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LineItemListingComponent } from './line-item-listing.component';

describe('LineItemListingComponent', () => {
  let component: LineItemListingComponent;
  let fixture: ComponentFixture<LineItemListingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LineItemListingComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
