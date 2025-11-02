import { Injectable } from "@angular/core";
import { ViewColumnState } from "projects/shared-utilities/application-controller/store/states/view-col.states";
import { ViewColumn } from "projects/shared-utilities/view-column";
import { ReasonSettingsCreateComponent } from "../components/settings-container/reason-settings-container/reason-settings-create/reason-settings-create.component";
import { ReasonSettingsEditComponent } from "../components/settings-container/reason-settings-container/reason-settings-edit/reason-settings-edit.component";
import { ReasonSettingsListingComponent } from "../components/settings-container/reason-settings-container/reason-settings-listing/reason-settings-listing.component";

@Injectable()
export class ReasonSettingsPagesService{
    
    private initialState: ViewColumnState = {
        firstColumn: new ViewColumn(0, ReasonSettingsListingComponent, 'Reason Settings Listing', {
            deactivateAdd: false,
            deactivateList: false,
        }),
        secondColumn: null,
        viewCol: [
            new ViewColumn(0, ReasonSettingsListingComponent, 'Reason Settings Listing', {
                deactivateAdd: false,
                deactivateList: false,
            }),
            new ViewColumn(1, ReasonSettingsCreateComponent, 'Add Reason Settings', {
                deactivateReturn: false,
                deactivateAdd: false,
                deactivateList: false,
            }),
            new ViewColumn(2, ReasonSettingsEditComponent, 'Edit Reason Settings', {
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