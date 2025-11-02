import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnockoffAddComponent } from './knockoff-add.component';

describe('KnockoffAddComponent', () => {
  let component: KnockoffAddComponent;
  let fixture: ComponentFixture<KnockoffAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KnockoffAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KnockoffAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
