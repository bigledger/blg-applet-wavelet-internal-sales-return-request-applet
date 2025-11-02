import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineItemsContainerComponent } from './line-items-container.component';

describe('LineItemsContainerComponent', () => {
  let component: LineItemsContainerComponent;
  let fixture: ComponentFixture<LineItemsContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineItemsContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
