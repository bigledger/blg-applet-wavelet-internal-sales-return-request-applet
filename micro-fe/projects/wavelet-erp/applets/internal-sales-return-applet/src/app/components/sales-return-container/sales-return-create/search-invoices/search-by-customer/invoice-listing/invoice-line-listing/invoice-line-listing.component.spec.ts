import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceLineListingComponent } from './invoice-line-listing.component';

describe('InvoiceLineListingComponent', () => {
  let component: InvoiceLineListingComponent;
  let fixture: ComponentFixture<InvoiceLineListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceLineListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceLineListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
