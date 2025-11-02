import { CommonModule} from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AgGridModule } from 'ag-grid-angular';
import { UtilitiesModule } from 'projects/shared-utilities/utilities/utilities.module';
import { SalesReturnFileExportContainerComponent } from './sales-return-file-export-container.component';
import { SalesReturnFileExportListingComponent } from './sales-return-file-export-listing/sales-return-file-export.component';
import { BlgAkaunNgLibModule } from 'blg-akaun-ng-lib';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SalesReturnFileExportFeatureKey, SalesReturnFileExportReducer } from '../../state-controllers/sales-return-file-export-controller/store/reducers/sales-return-file-export.reducers';
import { SalesReturnFileExportEffects } from '../../state-controllers/sales-return-file-export-controller/store/effects';

@NgModule({
  declarations: [
    SalesReturnFileExportContainerComponent,
    SalesReturnFileExportListingComponent,
  ],
  imports: [
    CommonModule,
    UtilitiesModule,
    BlgAkaunNgLibModule,
    BrowserModule,
    BrowserAnimationsModule,
    AgGridModule,
    StoreModule.forFeature(SalesReturnFileExportFeatureKey, SalesReturnFileExportReducer),
    EffectsModule.forFeature([SalesReturnFileExportEffects]),
  ],
  entryComponents: [
    SalesReturnFileExportListingComponent,
   ]
})
export class salesReturnFileExportContainerModule { }
