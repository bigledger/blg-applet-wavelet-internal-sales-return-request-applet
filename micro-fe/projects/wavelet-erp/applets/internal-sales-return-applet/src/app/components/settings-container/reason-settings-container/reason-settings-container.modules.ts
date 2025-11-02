import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AgGridModule } from 'ag-grid-angular';
import { UtilitiesModule } from 'projects/shared-utilities/utilities/utilities.module';
import { ReasonEffects } from '../../../state-controllers/reason-settings-controller/store/effects';
import { ReasonSettingFeatureKey, ReasonSettingReducer } from '../../../state-controllers/reason-settings-controller/store/reducers/reason-settings.reducers';
import { SlideRendererComponent } from '../../utilities/slide-renderer/slide-renderer.component';
import { ReasonSettingsCreateComponent } from './reason-settings-create/reason-settings-create.component';
import { ReasonSettingsEditComponent } from './reason-settings-edit/reason-settings-edit.component';
import { ReasonSettingsListingComponent } from './reason-settings-listing/reason-settings-listing.component';
import { ReasonSettingsContainerComponent } from './reason-settings.container.component';

@NgModule({
    declarations:[
        ReasonSettingsContainerComponent,
        ReasonSettingsListingComponent,
        ReasonSettingsCreateComponent,
        ReasonSettingsEditComponent
    ], 
    imports:[
        CommonModule,
        UtilitiesModule,
        AgGridModule.withComponents([SlideRendererComponent]),
        EffectsModule.forFeature([ReasonEffects]),
        StoreModule.forFeature(ReasonSettingFeatureKey, ReasonSettingReducer),
    ]
})
export class ReasonSettingsModule { }