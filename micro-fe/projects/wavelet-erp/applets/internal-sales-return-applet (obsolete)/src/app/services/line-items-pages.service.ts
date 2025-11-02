import { Injectable } from '@angular/core';
import { ViewColumnState } from 'projects/shared-utilities/application-controller/store/states/view-col.states';
import { ViewColumn } from 'projects/shared-utilities/view-column';
import { EditLineItemsComponent } from '../components/line-items-container/edit-line-item/edit-line-item.component';
import { EditLineItemIssueLinkEditComponent } from '../components/line-items-container/edit-line-item/issue-link/issue-link-edit/issue-link-edit.component';
import { EditLineItemIssueLinkEditLogTimeComponent } from '../components/line-items-container/edit-line-item/issue-link/issue-link-edit/worklog/log-time/log-time.component';
import { LineItemsListingComponent } from '../components/line-items-container/line-items-listing/line-items-listing.component';
import { EditLineItemBinNumberListingComponent } from '../components/line-items-container/edit-line-item/bin-number/bin-number-listing/bin-number-listing.component';
import { EditLineItemBatchNumberListingComponent } from '../components/line-items-container/edit-line-item/batch-number/batch-number-listing/batch-number-listing.component';

@Injectable()
export class LineItemsPagesService {

  private initialState: ViewColumnState = {
    firstColumn:  new ViewColumn(0, LineItemsListingComponent, 'Sales Return Line Items Listing', {
    }),
    secondColumn: null,
    viewCol: [
      new ViewColumn(0, LineItemsListingComponent, 'Sales Return Line Items Listing', {
        deactivateList: false
      }),
      new ViewColumn(1, EditLineItemsComponent, 'Edit Line Items', {
        deactivateReturn: false,
        deactivateIssueLinkList: false,
        selectedIndex: 0,
        itemSelectedIndex: 0,
        serialSelectedIndex: 0,
        deleteConfirmation: false
      }),
      new ViewColumn(2, EditLineItemIssueLinkEditComponent, 'Edit Line Item Edit Issue', {
        deactivateReturn: false,
        deactivateAdd: false,
        selectedIndex: 0,
      }),
      new ViewColumn(3, EditLineItemIssueLinkEditLogTimeComponent, 'Edit Line Item Log Time', {
        deactivateReturn: false,
        deactivateAdd: false
      }),
      new ViewColumn(4, EditLineItemBinNumberListingComponent, 'Bin Number Listing', {
        deactivateReturn: false,
      }),
      new ViewColumn(5, EditLineItemBatchNumberListingComponent, 'Batch Number Listing', {
        deactivateReturn: false,
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
