import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineItemCreateComponent } from './line-item-create.component';

describe('LineItemCreateComponent', () => {
  let component: LineItemCreateComponent;
  let fixture: ComponentFixture<LineItemCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineItemCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
