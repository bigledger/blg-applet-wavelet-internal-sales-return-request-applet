import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkflowSettingsContainerComponent } from './workflow-settings-container.component';


describe('WorkflowSettingsContainerComponent', () => {
  let component: WorkflowSettingsContainerComponent;
  let fixture: ComponentFixture<WorkflowSettingsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkflowSettingsContainerComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowSettingsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
