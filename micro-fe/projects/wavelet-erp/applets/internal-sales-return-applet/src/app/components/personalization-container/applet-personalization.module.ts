import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'projects/shared-utilities/modules/material.module';
import { PersonalizationContainerComponent } from './personalization-container.component';
import { DropDownModule } from 'blg-akaun-ng-lib';
import { PersonalizationModule } from 'projects/shared-utilities/modules/personalization/personalization.module';
import { PersonalDefaultSettingsComponent } from './personal-default-settings/personal-default-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PersonalizationContainerComponent,
    PersonalDefaultSettingsComponent
  ],
  imports: [
    CommonModule,
    DropDownModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    PersonalizationModule
  ]
})
export class AppletPersonalizationModule { }
