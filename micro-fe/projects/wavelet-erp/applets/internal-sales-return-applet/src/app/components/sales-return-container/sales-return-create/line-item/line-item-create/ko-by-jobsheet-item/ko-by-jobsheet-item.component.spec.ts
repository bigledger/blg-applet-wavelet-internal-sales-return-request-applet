import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KoByJobsheetItemComponent } from './ko-by-jobsheet-item.component';

describe('KoByJobsheetItemComponent', () => {
  let component: KoByJobsheetItemComponent;
  let fixture: ComponentFixture<KoByJobsheetItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KoByJobsheetItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KoByJobsheetItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
