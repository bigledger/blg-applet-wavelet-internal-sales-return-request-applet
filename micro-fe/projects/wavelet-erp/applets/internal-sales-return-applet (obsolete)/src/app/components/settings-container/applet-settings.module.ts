import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DropDownModule } from "blg-akaun-ng-lib";
import { MaterialModule } from "projects/shared-utilities/modules/material.module";
import { SettingsModule } from "projects/shared-utilities/modules/settings/settings.module";
import { UtilitiesModule } from "projects/shared-utilities/utilities/utilities.module";
import { AppletUtilitiesModule } from "../../applet-utilities.module";
import { DefaultSettingsComponent } from "./default-settings/default-settings.component";
import { FieldConfigurationComponent } from "./field-configuration/field-configuration.component";
import { SettingsContainerComponent } from "./settings-container.component";

@NgModule({
  declarations: [
    SettingsContainerComponent,
    FieldConfigurationComponent,
    DefaultSettingsComponent,
  ],
  imports: [
    CommonModule,
    DropDownModule,
    MaterialModule,
    SettingsModule,
    UtilitiesModule,
    AppletUtilitiesModule,
  ]
})
export class AppletSettingsModule { }
