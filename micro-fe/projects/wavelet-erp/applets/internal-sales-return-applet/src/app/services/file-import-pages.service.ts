import { Injectable } from '@angular/core';
import { FileImportListingComponent } from '../components/file-import-container/file-import-listing/file-import-listing.component';
import { FileImportCreateComponent } from '../components/file-import-container/file-import-create/file-import-create.component';
import { ViewColumnState } from 'projects/shared-utilities/application-controller/store/states/view-col.states';
import { ViewColumn } from 'projects/shared-utilities/view-column';
import { ImportFileEditComponent } from '../components/file-import-container/file-import-edit/file-import-edit.component';
import { HelperCheckingListingErrorComponent } from '../components/file-import-container/file-import-edit/helper-checking-listing/helper-checking-listing-error/helper-checking-listing-error.component';

@Injectable()
export class FileImportPagesService {

  private initialState: ViewColumnState = {
    firstColumn:  new ViewColumn(0, FileImportListingComponent, 'File Import Listing', {
      deactivateAdd: false,
      deactivateList: false
    }),
    secondColumn: null,
    viewCol: [
      new ViewColumn(0, FileImportListingComponent, 'File Import Listing', {
        deactivateAdd: false,
        deactivateList: false
      }),
      new ViewColumn(1, FileImportCreateComponent, 'File Import Create', {
        deactivateReturn: false,
        deactivateAdd: false,
        deactivateList: false,
        selectedIndex: 0,
        accountSelectedIndex: 0
      }),
      new ViewColumn(2, ImportFileEditComponent, 'File Import Edit', {
        deactivateReturn: false,
        deactivateAdd: false,
        deactivateList: false,
        selectedIndex: 0,
        accountSelectedIndex: 0
      }),
      new ViewColumn(3, HelperCheckingListingErrorComponent, 'Helper Checking Error Listing', {
				deactivateReturn: false,
				selectedIndex: 0,
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
