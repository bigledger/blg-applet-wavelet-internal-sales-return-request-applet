import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchByCustomerComponent } from './search-by-customer.component';

describe('SearchByCustomerComponent', () => {
  let component: SearchByCustomerComponent;
  let fixture: ComponentFixture<SearchByCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchByCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchByCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
