import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AgGridModule } from "ag-grid-angular";
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DropDownModule } from 'blg-akaun-ng-lib';
import { NgxMatIntlTelInputModule } from 'ngx-mat-intl-tel-input';
import { FroalaEditorModule } from 'angular-froala-wysiwyg';

import { BlgAkaunNgLibModule } from "blg-akaun-ng-lib";
import { UtilitiesModule } from "projects/shared-utilities/utilities/utilities.module";
import { ManualIntercompanyTransactionComponent } from "./manual-intercompany-transaction.component";
import { ManualIntercompanyTransactionListingComponent } from "./manual-intercompany-transaction-listing/manual-intercompany-transaction-listing.component";
import { IntercompanyProcessingQueueListingComponent } from "./manual-intercompany-transaction-listing/intercompany-processing-queue-listing/intercompany-processing-queue-listing.component";
import { GenericDocumentIntercompanyLinkListingComponent } from "./manual-intercompany-transaction-listing/generic-doc-intercompany-link-listing/generic-doc-intercompany-link-listing.component";
// import { AdvancedSearchModule } from '../utilities/advanced-search/advanced-search.module';
// import { spaceContainerAllocationColumnViewModelFeatureKey, spaceContainerAllocationColumnViewModelReducers } from "../../state-controllers/space-controller-allocation-view-model-controller/reducers";

@NgModule({
    declarations: [
        ManualIntercompanyTransactionComponent,
        ManualIntercompanyTransactionListingComponent,
        IntercompanyProcessingQueueListingComponent,
        GenericDocumentIntercompanyLinkListingComponent

    ],
    imports: [
        CommonModule,
        UtilitiesModule,
        DropDownModule,
        BlgAkaunNgLibModule,
        NgxMatIntlTelInputModule,
        BrowserModule,
        BrowserAnimationsModule,
        AgGridModule,
        FroalaEditorModule.forRoot(),
        // AdvancedSearchModule,
        // StoreModule.forFeature(spaceContainerAllocationColumnViewModelFeatureKey, spaceContainerAllocationColumnViewModelReducers),
    ],
    exports: [ManualIntercompanyTransactionComponent]
})
export class ManualIntercompanyTransactionModule {
    constructor() { }
}