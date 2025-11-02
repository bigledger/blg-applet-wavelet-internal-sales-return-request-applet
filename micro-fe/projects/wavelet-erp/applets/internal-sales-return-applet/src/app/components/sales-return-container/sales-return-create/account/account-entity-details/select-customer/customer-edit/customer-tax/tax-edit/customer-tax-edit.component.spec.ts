import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTaxComponent } from './customer-tax-edit.component';

describe('EditTaxComponent', () => {
  let component: EditTaxComponent;
  let fixture: ComponentFixture<EditTaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditTaxComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
