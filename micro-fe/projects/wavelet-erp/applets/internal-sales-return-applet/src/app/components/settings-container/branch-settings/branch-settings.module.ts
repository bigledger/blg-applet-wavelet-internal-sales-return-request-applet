import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { EffectsModule } from '@ngrx/effects';
import { UtilitiesModule } from 'projects/shared-utilities/utilities/utilities.module';
import { BranchListingComponent } from './branch-listing/branch-listing.component';
import { BranchEditComponent } from './branch/branch.component';
import { BranchDetailsComponent } from './branch/branch-details/branch-details.component';
import { SettlementAddComponent } from './branch/select-settlement/settlement-add/settlement-add.component';
import { SettlementEditComponent } from './branch/select-settlement/settlement-edit/settlement-edit.component';
import { SelectSettlementComponent } from './branch/select-settlement/select-settlement.component';
import { BranchSettingsContainerComponent } from './branch-settings-container.component';
import { StoreModule } from '@ngrx/store';
import { branchSettingsFeatureKey } from '../../../state-controllers/branch-settings-controller/reducers/branch-settings.reducers';
import { reducers } from '../../../state-controllers/branch-settings-controller/reducers';
import { BlgAkaunNgLibModule } from 'blg-akaun-ng-lib';
import { BranchSettingsEffects } from '../../../state-controllers/branch-settings-controller/effects/branch-settings.effects';
import { MaterialModule } from 'projects/shared-utilities/modules/material.module';
import { ItemCategoryFilterComponent } from './branch/item-category-filter/item-category-filter.component';
import { MenuListComponent } from './branch/menu-list/menu-list.component';
import { ViewColumnFacade } from '../../../facades/view-column.facade';
import { BranchPricingSchemeListingComponent } from './branch/pricing-scheme/listing/listing.component';
import { BranchPricingSchemeCreateComponent } from './branch/pricing-scheme/create/create.component';
import { BranchPricingSchemeEditComponent } from './branch/pricing-scheme/edit/edit.component';
import { DefaultPrintableFormatComponent } from './branch/default-printable-format/default-printable-format.component';
import { DefaultSettlementMethodComponent } from './branch/default-settlement-method/default-settlement-method.component';
import { SelectGroupDiscountItemComponent } from '../../utilities/select-group-discount-item/select-group-discount-item.component';
import { SelectDefaultSettlementItemComponent } from '../../utilities/select-default-settlement-method/select-default-settlement-method.component';
import { PricingSchemeBranchComponent } from '../../utilities/pricing-scheme-branch/pricing-scheme.component';

@NgModule({
  declarations: [
    BranchSettingsContainerComponent,
    BranchListingComponent,
    BranchEditComponent,
    BranchDetailsComponent,
    SelectSettlementComponent,
    SettlementEditComponent,
    SettlementAddComponent,
    ItemCategoryFilterComponent,
    MenuListComponent,
    BranchPricingSchemeListingComponent,
    BranchPricingSchemeCreateComponent,
    BranchPricingSchemeEditComponent,
    DefaultPrintableFormatComponent,
    DefaultSettlementMethodComponent,
    SelectGroupDiscountItemComponent,
    SelectDefaultSettlementItemComponent,
    PricingSchemeBranchComponent
  ],
  imports: [
    BlgAkaunNgLibModule,
    CommonModule,
    MaterialModule,
    UtilitiesModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule.withComponents([]),
    FlexLayoutModule,
    NgxMatSelectSearchModule,
    StoreModule.forFeature(branchSettingsFeatureKey, reducers.branchSettings),
    EffectsModule.forFeature([BranchSettingsEffects]),

  ],
  providers: [ViewColumnFacade]
})
export class BranchSettingsModule { }