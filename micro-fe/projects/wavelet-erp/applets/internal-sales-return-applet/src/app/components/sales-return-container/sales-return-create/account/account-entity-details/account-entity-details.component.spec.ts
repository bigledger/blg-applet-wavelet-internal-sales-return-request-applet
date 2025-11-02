import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountEntityDetailsComponent } from './account-entity-details.component';

describe('AccountEntityDetailsComponent', () => {
  let component: AccountEntityDetailsComponent;
  let fixture: ComponentFixture<AccountEntityDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountEntityDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountEntityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
