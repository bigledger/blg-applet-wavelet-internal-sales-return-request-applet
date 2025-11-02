import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KoForJobsheetItemComponent } from './ko-for-jobsheet-item.component';

describe('KoForJobsheetItemComponent', () => {
  let component: KoForJobsheetItemComponent;
  let fixture: ComponentFixture<KoForJobsheetItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KoForJobsheetItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KoForJobsheetItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
