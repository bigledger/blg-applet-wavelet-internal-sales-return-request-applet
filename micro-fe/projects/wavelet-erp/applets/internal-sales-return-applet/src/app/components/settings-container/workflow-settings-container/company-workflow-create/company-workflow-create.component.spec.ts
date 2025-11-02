import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcessResolutionEditComponent } from './process-resolution-edit.component';

describe('ProcessResolutionEditComponent', () => {
  let component: ProcessResolutionEditComponent;
  let fixture: ComponentFixture<ProcessResolutionEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessResolutionEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessResolutionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
