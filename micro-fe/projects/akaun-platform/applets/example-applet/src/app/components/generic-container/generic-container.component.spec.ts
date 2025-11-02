import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalContainerComponent } from './approval-container.component';

describe('InternalPackingOrderContainerComponent', () => {
  let component: ApprovalContainerComponent;
  let fixture: ComponentFixture<ApprovalContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
