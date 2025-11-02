import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LineItemsListingComponent } from './line-items-listing.component';

describe('LineItemsListingComponent', () => {
  let component: LineItemsListingComponent;
  let fixture: ComponentFixture<LineItemsListingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LineItemsListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
