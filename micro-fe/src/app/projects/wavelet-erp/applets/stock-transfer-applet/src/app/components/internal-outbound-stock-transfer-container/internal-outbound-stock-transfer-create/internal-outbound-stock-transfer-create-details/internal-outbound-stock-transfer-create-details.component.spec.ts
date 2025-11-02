import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalOutboundStockTransferCreateDetailsComponent } from './internal-outbound-stock-transfer-create-details.component';

describe('InternalOutboundStockTransferCreateDetailsComponent', () => {
  let component: InternalOutboundStockTransferCreateDetailsComponent;
  let fixture: ComponentFixture<InternalOutboundStockTransferCreateDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalOutboundStockTransferCreateDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalOutboundStockTransferCreateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
