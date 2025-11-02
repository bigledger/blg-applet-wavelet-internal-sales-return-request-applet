import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvancedSearchIPVComponent } from './advanced-search-ipv.component';


describe('AdvancedSearchComponentIPV', () => {
  let component: AdvancedSearchIPVComponent;
  let fixture: ComponentFixture<AdvancedSearchIPVComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdvancedSearchIPVComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedSearchIPVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
