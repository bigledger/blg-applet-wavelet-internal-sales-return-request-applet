import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvancedSearchISCNComponent } from './advanced-search-iscn.component';


describe('AdvancedSearchISCNComponent', () => {
  let component: AdvancedSearchISCNComponent;
  let fixture: ComponentFixture<AdvancedSearchISCNComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdvancedSearchISCNComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedSearchISCNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
