import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompanyDropdownComponent } from './company-dropdown.component';

describe('CompanyDropdownComponent', () => {
  let component: CompanyDropdownComponent;
  let fixture: ComponentFixture<CompanyDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
