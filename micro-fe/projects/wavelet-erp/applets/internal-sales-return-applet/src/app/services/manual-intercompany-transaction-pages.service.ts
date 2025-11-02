import { Injectable } from '@angular/core';
import { ViewColumnState } from 'projects/shared-utilities/application-controller/store/states/view-col.states';
import { ViewColumn } from 'projects/shared-utilities/view-column';

import { ManualIntercompanyTransactionListingComponent } from '../components/manual-intercompany-transaction/manual-intercompany-transaction-listing/manual-intercompany-transaction-listing.component';

@Injectable()
export class ManualIntercompanyTransactionPagesService {

  private initialState: ViewColumnState = {
    firstColumn:  new ViewColumn(0, ManualIntercompanyTransactionListingComponent, 'Manual Intercompany Transaction Listing', {
      deactivateAdd: false,
      deactivateList: false
    }),
    secondColumn: null,
    viewCol: [
      new ViewColumn(0, ManualIntercompanyTransactionListingComponent, 'Manual Intercompany Transaction Listing', {
        deactivateAdd: false,
        deactivateList: false
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
