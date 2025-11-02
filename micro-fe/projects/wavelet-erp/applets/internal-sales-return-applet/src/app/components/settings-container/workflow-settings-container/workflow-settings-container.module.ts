import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AgGridModule } from 'ag-grid-angular';
import { WorkflowEffects } from '../../../state-controllers/workflow-controller/store/effects/workflow.effects';
import { reducers } from '../../../state-controllers/workflow-controller/store/reducers';
import { WorkflowFeatureKey } from '../../../state-controllers/workflow-controller/store/reducers/workflow.reducers';
import { SlideRendererComponent } from '../../utilities/slide-renderer/slide-renderer.component';
import { CompanyListingComponent } from './company-listing/company-listing.component';
import { CompanyWorkflowEditComponent } from './company-workflow-edit/company-workflow-edit.component';
import { WorkflowSettingsContainerComponent } from './workflow-settings-container.component';
import { CompanyWorkflowCreateComponent } from './company-workflow-create/company-workflow-create.component';
import { UtilitiesModule } from 'projects/shared-utilities/utilities/utilities.module';
import { CompanyDropdownComponent } from './company-workflow-create/company-dropdown/company-dropdown.component';

@NgModule({
  declarations: [
    WorkflowSettingsContainerComponent,
    CompanyListingComponent,
    CompanyWorkflowCreateComponent,
    CompanyWorkflowEditComponent,
    CompanyDropdownComponent
  ],
  imports: [
    CommonModule,
    UtilitiesModule,
    AgGridModule.withComponents([SlideRendererComponent]),
    StoreModule.forFeature(WorkflowFeatureKey, reducers.workflow),
    EffectsModule.forFeature([WorkflowEffects])
  ]
})
export class WorkflowSettingsModule { }
