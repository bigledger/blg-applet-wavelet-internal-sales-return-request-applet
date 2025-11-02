import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchByInvoiceComponent } from './search-by-invoice.component';

describe('SearchByInvoiceComponent', () => {
  let component: SearchByInvoiceComponent;
  let fixture: ComponentFixture<SearchByInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchByInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchByInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
