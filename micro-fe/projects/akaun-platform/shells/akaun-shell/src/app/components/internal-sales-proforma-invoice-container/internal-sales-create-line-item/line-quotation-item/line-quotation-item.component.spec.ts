import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LineQuotationItemComponent } from './line-quotation-item.component';

describe('LineQuotationItemComponent', () => {
  let component: LineQuotationItemComponent;
  let fixture: ComponentFixture<LineQuotationItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LineQuotationItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineQuotationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
