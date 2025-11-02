import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddAttachmentsComponent } from './add-attachments.component';

describe('AddAttachmentsComponent', () => {
  let component: AddAttachmentsComponent;
  let fixture: ComponentFixture<AddAttachmentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAttachmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
