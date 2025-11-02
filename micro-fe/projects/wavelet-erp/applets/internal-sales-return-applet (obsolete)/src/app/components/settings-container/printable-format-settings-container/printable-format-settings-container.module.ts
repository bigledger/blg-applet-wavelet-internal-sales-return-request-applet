import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AgGridModule } from 'ag-grid-angular';
import { UtilitiesModule } from 'projects/shared-utilities/utilities/utilities.module';
import { PrintableFormatEffects } from '../../../state-controllers/printable-format-controller/store/effects';
import { reducers } from '../../../state-controllers/printable-format-controller/store/reducers';
import { PrintableFormatFeatureKey } from '../../../state-controllers/printable-format-controller/store/reducers/printable-format.reducers';
import { SlideRendererComponent } from '../../utilities/slide-renderer/slide-renderer.component';
import { AddPrintableFormatComponent } from './add-printable-format/add-printable-format.component';
import { EditPrintableFormatComponent } from './edit-printable-format/edit-printable-format.component';
import { PrintableFormatListingComponent } from './printable-format-listing/printable-format-listing.component';
import { PrintableFormatSettingsContainerComponent } from './printable-format-settings-container.component';

@NgModule({
  declarations: [
    PrintableFormatSettingsContainerComponent,
    PrintableFormatListingComponent,
    AddPrintableFormatComponent,
    EditPrintableFormatComponent
  ],
  imports: [
    CommonModule,
    UtilitiesModule,
    AgGridModule.withComponents([SlideRendererComponent]),
    StoreModule.forFeature(PrintableFormatFeatureKey, reducers.printableFormat),
    EffectsModule.forFeature([PrintableFormatEffects])
  ]
})
export class PrintableFormatSettingsModule { }
