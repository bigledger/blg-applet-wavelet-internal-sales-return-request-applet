import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AgGridModule } from 'ag-grid-angular';

import { CompanyContainerComponent } from './company-container.component';
import { companyFeatureKey } from '../../state-controllers/company-controller/store/selectors/company.selector';
import { reducers } from '../../state-controllers/company-controller/store/reducers';
import { CompanyEffects } from '../../state-controllers/company-controller/store/effects/company.effects';
import { CompanyCreateComponent } from './company-create/company-create.component';
import { CompanyEditComponent } from './company-edit/company-edit.component';
import { CompanyListingComponent } from './company-listing/company-listing.component';
import { UtilitiesModule } from 'projects/shared-utilities/utilities/utilities.module';

@NgModule({
  declarations: [
    CompanyContainerComponent,
    CompanyListingComponent,
    CompanyEditComponent,
    CompanyCreateComponent
  ],
  imports: [
    CommonModule,
    UtilitiesModule,
    AgGridModule,
    StoreModule.forFeature(companyFeatureKey, reducers.company),
    EffectsModule.forFeature([CompanyEffects]),
  ]
})
export class CompanyModule { }
