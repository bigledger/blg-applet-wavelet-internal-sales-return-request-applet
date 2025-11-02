import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedIssuesComponent } from './linked-issues.component';

describe('LinkedIssuesComponent', () => {
  let component: LinkedIssuesComponent;
  let fixture: ComponentFixture<LinkedIssuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkedIssuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
