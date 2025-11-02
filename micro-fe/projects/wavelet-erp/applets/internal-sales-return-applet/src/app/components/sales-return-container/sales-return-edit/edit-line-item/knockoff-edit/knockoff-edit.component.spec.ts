import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnockoffEditComponent } from './knockoff-edit.component';

describe('KnockoffEditComponent', () => {
  let component: KnockoffEditComponent;
  let fixture: ComponentFixture<KnockoffEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KnockoffEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KnockoffEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
