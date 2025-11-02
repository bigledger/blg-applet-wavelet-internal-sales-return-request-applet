import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnockOffJobsheetComponent } from './knock-off-jobsheet.component';

describe('KnockOffJobsheetComponent', () => {
  let component: KnockOffJobsheetComponent;
  let fixture: ComponentFixture<KnockOffJobsheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KnockOffJobsheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KnockOffJobsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
