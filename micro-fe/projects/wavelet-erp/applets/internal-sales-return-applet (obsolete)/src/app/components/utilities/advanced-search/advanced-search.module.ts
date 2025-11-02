import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { UtilitiesModule } from "projects/shared-utilities/utilities/utilities.module";
import { AdvancedSearchComponent } from "./advanced-search.component";

@NgModule({
  declarations: [
    AdvancedSearchComponent
  ],
  imports: [
    CommonModule,
    UtilitiesModule,
  ],
  exports: [
    AdvancedSearchComponent
  ]
})
export class AdvancedSearchModule {}
  