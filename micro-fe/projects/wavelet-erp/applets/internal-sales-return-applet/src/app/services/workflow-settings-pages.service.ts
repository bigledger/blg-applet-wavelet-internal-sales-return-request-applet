import { Injectable } from '@angular/core';
import { ViewColumnState } from 'projects/shared-utilities/application-controller/store/states/view-col.states';
import { ViewColumn } from 'projects/shared-utilities/view-column';
import { CompanyListingComponent } from '../components/settings-container/workflow-settings-container/company-listing/company-listing.component';
import { CompanyWorkflowEditComponent } from '../components/settings-container/workflow-settings-container/company-workflow-edit/company-workflow-edit.component';
import { CompanyWorkflowCreateComponent } from '../components/settings-container/workflow-settings-container/company-workflow-create/company-workflow-create.component';

@Injectable()
export class WorkflowSettingsPagesService {

    private initialState: ViewColumnState = {
        firstColumn: new ViewColumn(0, CompanyListingComponent, 'Company Listing', {
            deactivateAdd: false,
            deactivateList: false,
        }),
        secondColumn: null,
        viewCol: [
            new ViewColumn(0, CompanyListingComponent, 'Company Workflow Listing', {
                deactivateAdd: false,
                deactivateList: false,
            }),
            new ViewColumn(1, CompanyWorkflowCreateComponent, 'Create Company Workflow', {
                deactivateReturn: false,
                deactivateAdd: false,
                deactivateList: false,
            }),
            new ViewColumn(2, CompanyWorkflowEditComponent, 'Edit Company Workflow', {
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
