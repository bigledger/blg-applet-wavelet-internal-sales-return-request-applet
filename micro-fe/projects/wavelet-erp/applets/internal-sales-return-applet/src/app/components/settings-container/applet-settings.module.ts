import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DropDownModule } from "blg-akaun-ng-lib";
import { MaterialModule } from "projects/shared-utilities/modules/material.module";
import { SettingsModule } from "projects/shared-utilities/modules/settings/settings.module";
import { DefaultSettingsComponent } from "./default-settings/default-settings.component";
import { BranchSettingsModule } from "./branch-settings/branch-settings.module";
import { FieldConfigurationComponent } from "./field-configuration/field-configuration.component";
import { SettingsContainerComponent } from "./settings-container.component";
import { ReleaseNotesComponent } from './release-notes/release-notes.component';
import { AppletLogComponent } from './applet-log/applet-log.component';
import { UtilitiesModule } from "projects/shared-utilities/utilities/utilities.module";

@NgModule({
  declarations: [
    SettingsContainerComponent,
    FieldConfigurationComponent,
    DefaultSettingsComponent,
    ReleaseNotesComponent,
    AppletLogComponent
  ],
  imports: [
    CommonModule,
    DropDownModule,
    MaterialModule,
    SettingsModule,
    UtilitiesModule,
    BranchSettingsModule
  ]
})
export class AppletSettingsModule {}
