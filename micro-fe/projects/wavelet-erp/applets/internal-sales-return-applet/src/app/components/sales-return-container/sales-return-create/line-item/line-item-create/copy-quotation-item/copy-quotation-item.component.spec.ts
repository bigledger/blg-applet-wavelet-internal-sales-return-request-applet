import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyQuotationItemComponent } from './copy-quotation-item.component';

describe('CopyQuotationItemComponent', () => {
  let component: CopyQuotationItemComponent;
  let fixture: ComponentFixture<CopyQuotationItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyQuotationItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyQuotationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
