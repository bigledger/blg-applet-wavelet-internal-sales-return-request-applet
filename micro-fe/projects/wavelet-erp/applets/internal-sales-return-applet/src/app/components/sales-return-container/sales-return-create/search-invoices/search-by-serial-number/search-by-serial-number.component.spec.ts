import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBySerialNumberComponent } from './search-by-serial-number.component';

describe('SearchBySerialNumberComponent', () => {
  let component: SearchBySerialNumberComponent;
  let fixture: ComponentFixture<SearchBySerialNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchBySerialNumberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBySerialNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
