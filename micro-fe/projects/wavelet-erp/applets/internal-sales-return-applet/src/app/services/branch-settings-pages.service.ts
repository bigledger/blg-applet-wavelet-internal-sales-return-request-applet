import { Injectable } from '@angular/core';
import { ViewColumnState } from 'projects/shared-utilities/application-controller/store/states/view-col.states';
import { ViewColumn } from 'projects/shared-utilities/view-column';
import { BranchListingComponent } from '../components/settings-container/branch-settings/branch-listing/branch-listing.component';
import { SettlementAddComponent } from '../components/settings-container/branch-settings/branch/select-settlement/settlement-add/settlement-add.component';
import { SettlementEditComponent } from '../components/settings-container/branch-settings/branch/select-settlement/settlement-edit/settlement-edit.component';
import { BranchEditComponent } from '../components/settings-container/branch-settings/branch/branch.component';
import { BranchPricingSchemeListingComponent } from '../components/settings-container/branch-settings/branch/pricing-scheme/listing/listing.component';
import { BranchPricingSchemeCreateComponent } from '../components/settings-container/branch-settings/branch/pricing-scheme/create/create.component';
import { BranchPricingSchemeEditComponent } from '../components/settings-container/branch-settings/branch/pricing-scheme/edit/edit.component';


@Injectable()

// This is where we need to change the view columns.
export class BranchSettingsPagesService {

  private initialState: ViewColumnState = {
    firstColumn: new ViewColumn(0, BranchListingComponent, 'Branch Listing', {
      deactivateAdd: false,
      deactivateList: false,
    }),
    secondColumn: null,
    viewCol: [
      new ViewColumn(0, BranchListingComponent, 'Branch Listing', {
        deactivateAdd: false,
        deactivateList: false
      }),
      new ViewColumn(1, BranchEditComponent, 'Settlement Method', {
        deactivateReturn: false,
        selectedIndex: 0,
        deactivateAdd: false,
        deactivateList: false
      }),
      new ViewColumn(2, SettlementAddComponent, 'Add Settlement', {
        deactivateReturn: false,
        selectedIndex: 0
      }),
      new ViewColumn(3, SettlementEditComponent, 'Edit Settlement', {
        deactivateReturn: false,
        selectedIndex: 0
      }),
      new ViewColumn(4, BranchPricingSchemeCreateComponent, 'Branch Pricing Scheme Create', {
        deactivateReturn: false,
        selectedIndex: 0
      }),
      new ViewColumn(5, BranchPricingSchemeEditComponent, 'Branch Pricing Scheme Edit', {
        deactivateReturn: false,
        selectedIndex: 0
      }),

    ],
    breadCrumbs: [],
    leftDrawer: [],
    rightDrawer: [],
    singleColumn: false,
    prevIndex: null
  };

  get pages() {
    return this.initialState;
  }

  constructor() { }
}