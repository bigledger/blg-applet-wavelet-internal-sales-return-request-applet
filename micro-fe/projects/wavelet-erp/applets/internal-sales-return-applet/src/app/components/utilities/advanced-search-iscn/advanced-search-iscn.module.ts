import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { UtilitiesModule } from "projects/shared-utilities/utilities/utilities.module";
import { AdvancedSearchISCNComponent } from "./advanced-search-iscn.component";

@NgModule({
  declarations: [
    AdvancedSearchISCNComponent
  ],
  imports: [
    CommonModule,
    UtilitiesModule,
  ],
  exports: [
    AdvancedSearchISCNComponent
  ]
})
export class AdvancedSearchISCNModule { }
