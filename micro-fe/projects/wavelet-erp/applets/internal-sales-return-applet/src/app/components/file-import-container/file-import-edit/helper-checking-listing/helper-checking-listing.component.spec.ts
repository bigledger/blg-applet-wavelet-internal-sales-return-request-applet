import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelperCheckingListingComponent } from './helper-checking-listing.component';

describe('HelperCheckingListingComponent', () => {
  let component: HelperCheckingListingComponent;
  let fixture: ComponentFixture<HelperCheckingListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelperCheckingListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelperCheckingListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
