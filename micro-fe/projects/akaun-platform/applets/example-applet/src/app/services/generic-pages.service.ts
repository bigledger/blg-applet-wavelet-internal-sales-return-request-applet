import { Injectable } from '@angular/core';
import { ViewColumnState } from 'projects/shared-utilities/application-controller/store/states/view-col.states';
import { ViewColumn } from 'projects/shared-utilities/view-column';
import { GenericCreateComponent } from '../components/generic-container/generic-create/generic-create.component';
import { GenericListingComponent } from '../components/generic-container/generic-listing/generic-listing.component';

@Injectable()
export class GenericPagesService {

  private initialState: ViewColumnState = {
    firstColumn: new ViewColumn(0, GenericListingComponent, 'Generic Listing', {
      deactivateAdd: false,
      deactivateList: false,
    }),
    secondColumn: null,
    viewCol: [
      new ViewColumn(0, GenericListingComponent, 'Generic Listing', {
        deactivateAdd: false,
        deactivateList: false,
      }),
      new ViewColumn(1, GenericCreateComponent, 'Generic Create', {
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
