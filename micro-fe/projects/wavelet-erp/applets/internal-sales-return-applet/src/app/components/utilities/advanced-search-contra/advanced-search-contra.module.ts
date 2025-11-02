import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { UtilitiesModule } from "projects/shared-utilities/utilities/utilities.module";
import { AdvancedSearchContraComponent } from "./advanced-search-contra.component";

@NgModule({
  declarations: [
    AdvancedSearchContraComponent
  ],
  imports: [
    CommonModule,
    UtilitiesModule,
  ],
  exports: [
    AdvancedSearchContraComponent
  ]
})
export class AdvancedSearchContraModule { }
