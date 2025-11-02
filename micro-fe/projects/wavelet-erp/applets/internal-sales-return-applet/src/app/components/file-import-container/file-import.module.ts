import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { StoreModule } from "@ngrx/store";

import { AgGridModule } from "ag-grid-angular";
import { DropDownModule } from "blg-akaun-ng-lib";

import { UtilitiesModule } from "projects/shared-utilities/utilities/utilities.module";
import { AppletUtilitiesModule } from "../../applet-utilities.module";
import { reducers } from "../../state-controllers/file-import-controller/store/reducers";
import { FileImportFeatureKey, FileImportReducer } from "../../state-controllers/file-import-controller/store/reducers/file-import.reducers";
// import { AdvancedSearchModule } from "../utilities/advanced-search/advanced-search.module";
import { SlideRendererComponent } from "../utilities/slide-renderer/slide-renderer.component";
import { FileImportContainerComponent } from "./file-import-container.component";
import { FileImportCreateComponent } from "./file-import-create/file-import-create.component";
import { ImportFileEditComponent } from "./file-import-edit/file-import-edit.component";
import { HelperCheckingListingComponent } from "./file-import-edit/helper-checking-listing/helper-checking-listing.component";
import { HelperCheckingListingAllComponent } from "./file-import-edit/helper-checking-listing/helper-checking-listing-all/helper-checking-listing-all.component";
import { HelperCheckingListingErrorComponent } from "./file-import-edit/helper-checking-listing/helper-checking-listing-error/helper-checking-listing-error.component";
import { FileImportListingComponent } from "./file-import-listing/file-import-listing.component";
import { EffectsModule } from "@ngrx/effects";
import { FileImportEffects } from "../../state-controllers/file-import-controller/store/effects";

@NgModule({
  declarations: [
    FileImportContainerComponent,
    FileImportListingComponent,
    FileImportCreateComponent,
    ImportFileEditComponent,
    HelperCheckingListingComponent,
    HelperCheckingListingAllComponent,
    HelperCheckingListingErrorComponent,
  ],
  imports: [
    CommonModule,
    UtilitiesModule,
    DropDownModule,
    // AdvancedSearchModule,
    AppletUtilitiesModule,
    AgGridModule.withComponents([SlideRendererComponent]),
    StoreModule.forFeature(FileImportFeatureKey, FileImportReducer),
    EffectsModule.forFeature([FileImportEffects]),
  ],
  exports: [
    FileImportContainerComponent,
    FileImportListingComponent,
    FileImportCreateComponent,
    ImportFileEditComponent,
    HelperCheckingListingComponent,
    HelperCheckingListingAllComponent,
    HelperCheckingListingErrorComponent,
  ],
})
export class FileImportModule {}
