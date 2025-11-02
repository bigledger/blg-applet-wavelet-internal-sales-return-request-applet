import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportKnockOffComponent } from './import-knock-off.component';

describe('ImportKnockOffComponent', () => {
  let component: ImportKnockOffComponent;
  let fixture: ComponentFixture<ImportKnockOffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportKnockOffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportKnockOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
