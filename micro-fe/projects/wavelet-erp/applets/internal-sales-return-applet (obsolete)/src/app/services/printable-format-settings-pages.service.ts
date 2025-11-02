import { Injectable } from '@angular/core';
import { ViewColumnState } from 'projects/shared-utilities/application-controller/store/states/view-col.states';
import { ViewColumn } from 'projects/shared-utilities/view-column';
import { AddPrintableFormatComponent } from '../components/settings-container/printable-format-settings-container/add-printable-format/add-printable-format.component';
import { EditPrintableFormatComponent } from '../components/settings-container/printable-format-settings-container/edit-printable-format/edit-printable-format.component';
import { PrintableFormatListingComponent } from '../components/settings-container/printable-format-settings-container/printable-format-listing/printable-format-listing.component';

@Injectable()
export class PrintableFormatSettingsPagesService {

    private initialState: ViewColumnState = {
        firstColumn: new ViewColumn(0, PrintableFormatListingComponent, 'Printable Format Listing', {
            deactivateAdd: false,
            deactivateList: false,
        }),
        secondColumn: null,
        viewCol: [
            new ViewColumn(0, PrintableFormatListingComponent, 'Printable Format Listing', {
                deactivateAdd: false,
                deactivateList: false,
            }),
            new ViewColumn(1, AddPrintableFormatComponent, 'Add Printable Format', {
                deactivateReturn: false,
                deactivateAdd: false,
                deactivateList: false,
            }),
            new ViewColumn(2, EditPrintableFormatComponent, 'Edit Printable Format', {
                deactivateReturn: false,
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
