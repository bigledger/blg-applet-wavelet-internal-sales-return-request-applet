import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AttachmentsListingComponent } from './attachments-listing.component';

describe('AttachmentsListingComponent', () => {
  let component: AttachmentsListingComponent;
  let fixture: ComponentFixture<AttachmentsListingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachmentsListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
