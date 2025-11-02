import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueLinkListingComponent } from './issue-link-listing.component';

describe('IssueLinkListingComponent', () => {
  let component: IssueLinkListingComponent;
  let fixture: ComponentFixture<IssueLinkListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueLinkListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueLinkListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
