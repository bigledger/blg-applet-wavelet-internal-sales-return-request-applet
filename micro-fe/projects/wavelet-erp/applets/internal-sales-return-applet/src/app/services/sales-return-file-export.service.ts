import { Injectable } from '@angular/core';
import { ViewColumnState } from 'projects/shared-utilities/application-controller/store/states/view-col.states';
import { ViewColumn } from 'projects/shared-utilities/view-column';
import { SalesReturnFileExportListingComponent } from '../components/sales-return-file-export/sales-return-file-export-listing/sales-return-file-export.component';

@Injectable()
export class SalesReturnFileExportPagesService {

  private initialState: ViewColumnState = {
    firstColumn: new ViewColumn(0, SalesReturnFileExportListingComponent, 'Sales Return File Export Listing', {
      deactivateAdd: false,
      deactivateList: false,
    }),
    secondColumn: null,
    viewCol: [
      new ViewColumn(0, SalesReturnFileExportListingComponent, 'Sales Return File Export Listing', {
        deactivateAdd: false,
        deactivateList: false,
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
