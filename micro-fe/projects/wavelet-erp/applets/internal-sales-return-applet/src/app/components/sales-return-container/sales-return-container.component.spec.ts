import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SalesReturnContainerComponent } from './sales-return-container.component';

describe('SalesReturnContainerComponent', () => {
  let component: SalesReturnContainerComponent;
  let fixture: ComponentFixture<SalesReturnContainerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SalesReturnContainerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesReturnContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
