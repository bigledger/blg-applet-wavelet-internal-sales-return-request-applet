import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderDocLinkComponent } from './header-doc-link.component';

describe('HeaderDocLinkComponent', () => {
  let component: HeaderDocLinkComponent;
  let fixture: ComponentFixture<HeaderDocLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderDocLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderDocLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
