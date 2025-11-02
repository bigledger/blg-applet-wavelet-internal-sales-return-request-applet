import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalSalesOrderContraDetailsComponent } from './internal-sales-order-contra-details.component';

describe('InternalSalesOrderContraDetailsComponent', () => {
  let component: InternalSalesOrderContraDetailsComponent;
  let fixture: ComponentFixture<InternalSalesOrderContraDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalSalesOrderContraDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalSalesOrderContraDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
