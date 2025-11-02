import { Injectable } from '@angular/core';
import { ViewColumnState } from 'projects/shared-utilities/application-controller/store/states/view-col.states';
import { ViewColumn } from 'projects/shared-utilities/view-column';
import { CompanyCreateComponent } from '../components/company-container/company-create/company-create.component';
import { CompanyEditComponent } from '../components/company-container/company-edit/company-edit.component';
import { CompanyListingComponent } from '../components/company-container/company-listing/company-listing.component';

@Injectable()
export class CompanyPagesService {

  private initialState: ViewColumnState = {
    firstColumn: new ViewColumn(0, CompanyListingComponent, 'Company Listing', {
      deactivateAdd: false,
      deactivateList: false,
    }),
    secondColumn: null,
    viewCol: [
      new ViewColumn(0, CompanyListingComponent, 'Company Listing', {
        deactivateAdd: false,
        deactivateList: false,
      }),
      new ViewColumn(1, CompanyCreateComponent, 'Company Create', {
      deactivateReturn: false,
      selectedIndex: 0,
    }),
      new ViewColumn(2, CompanyEditComponent, 'Company Edit', {
      deactivateReturn: false,
      selectedIndex: 0,
    })
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
