import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DropDownModule } from 'blg-akaun-ng-lib';

import { UtilitiesModule } from 'projects/shared-utilities/utilities/utilities.module';
import { SlideRendererComponent } from '../utilities/slide-renderer/slide-renderer.component';
import { LineItemsContainerComponent } from './line-items-container.component';
import { LineItemsListingComponent } from './line-items-listing/line-items-listing.component';
import { EditLineItemsComponent } from './edit-line-item/edit-line-item.component';
import { EditLineItemDetailsComponent } from './edit-line-item/item-details/item-details.component';
import { EditLineItemDetailsMainComponent } from './edit-line-item/item-details/main-details/main-details.component';
import { EditLineItemDetailsDeliveryInstructions } from './edit-line-item/item-details/delivery-instructions/delivery-instructions.component';
import { EditLineItemDetailsDepartmentComponent } from './edit-line-item/item-details/department/department.component';
import { EditLineItemDetailsRelatedDocumentsComponent } from './edit-line-item/item-details/related-documents/related-documents.component';
import { EditLineItemSerialNumberComponent } from './edit-line-item/serial-number/serial-number.component';
import { EditLineItemDetailsDeliveryDetailsComponent } from './edit-line-item/item-details/delivery-details/delivery-details.component';
import { EditLineItemSerialNumberListingComponent } from './edit-line-item/serial-number/serial-number-listing/serial-number-listing.component';
import { EditLineItemSerialNumberScanComponent } from './edit-line-item/serial-number/serial-number-scan/serial-number-scan.component';
import { EditLineItemSerialNumberImportComponent } from './edit-line-item/serial-number/serial-number-import/serial-number-import.component';
import { EditLineItemBatchNumberComponent } from './edit-line-item/batch-number/batch-number.component';
import { EditLineItemBatchNumberListingComponent } from './edit-line-item/batch-number/batch-number-listing/batch-number-listing.component';
import { EditLineItemBinNumberComponent } from './edit-line-item/bin-number/bin-number.component';
import { EditLineItemBinNumberListingComponent } from './edit-line-item/bin-number/bin-number-listing/bin-number-listing.component';
import { EditLineItemCostingDetailsComponent } from './edit-line-item/costing-details/costing-details.component';
import { EditLineItemPricingDetailsComponent } from './edit-line-item/pricing-details/pricing-details.component';
import { EditLineItemIssueLinkListingComponent } from './edit-line-item/issue-link/issue-link-listing/issue-link-listing.component';
import { EditLineItemIssueLinkEditComponent } from './edit-line-item/issue-link/issue-link-edit/issue-link-edit.component';
import { EditLineItemIssueLinkEditDetailsComponent } from './edit-line-item/issue-link/issue-link-edit/details/issue-link-edit-details.component';
import { EditLineItemIssueLinkEditPlanningComponent } from './edit-line-item/issue-link/issue-link-edit/planning/issue-link-edit-planning.component';
import { EditLineItemIssueLinkEditAttachmentComponent } from './edit-line-item/issue-link/issue-link-edit/attachment/issue-link-edit-attachment.component';
import { EditLineItemIssueLinkEditSubtasksComponent } from './edit-line-item/issue-link/issue-link-edit/subtasks/issue-link-edit-subtasks.component';
import { EditLineItemIssueLinkEditCommentComponent } from './edit-line-item/issue-link/issue-link-edit/comment/issue-link-edit-comment.component';
import { EditLineItemIssueLinkEditLinkedIssuesComponent } from './edit-line-item/issue-link/issue-link-edit/linked-issues/issue-link-edit-linked-issues.component';
import { EditLineItemIssueLinkEditWorklogComponent } from './edit-line-item/issue-link/issue-link-edit/worklog/issue-link-edit-worklog.component';
import { EditLineItemIssueLinkEditLogTimeComponent } from './edit-line-item/issue-link/issue-link-edit/worklog/log-time/log-time.component';
import { EditLineItemIssueLinkEditActivityComponent } from './edit-line-item/issue-link/issue-link-edit/activity/issue-link-edit-activity.component';
import { LineItemFeatureKey } from '../../state-controllers/line-item-controller/store/reducers/line-item.reducers';
import { reducers } from '../../state-controllers/line-item-controller/store/reducers';
import { LineItemEffects } from '../../state-controllers/line-item-controller/store/effects/line-item.effects';
import { AdvancedSearchModule } from '../utilities/advanced-search/advanced-search.module';
import { AppletUtilitiesModule } from '../../applet-utilities.module';

@NgModule({
  declarations: [
    LineItemsContainerComponent,
    LineItemsListingComponent,
    EditLineItemsComponent,
    EditLineItemDetailsComponent,
    EditLineItemDetailsMainComponent,
    EditLineItemDetailsDeliveryInstructions,
    EditLineItemDetailsDepartmentComponent,
    EditLineItemDetailsRelatedDocumentsComponent,
    EditLineItemDetailsDeliveryDetailsComponent,
    EditLineItemSerialNumberComponent,
    EditLineItemSerialNumberListingComponent,
    EditLineItemSerialNumberScanComponent,
    EditLineItemSerialNumberImportComponent,
    EditLineItemBatchNumberComponent,
    EditLineItemBatchNumberListingComponent,
    EditLineItemBinNumberComponent,
    EditLineItemBinNumberListingComponent,
    EditLineItemCostingDetailsComponent,
    EditLineItemPricingDetailsComponent,
    EditLineItemIssueLinkListingComponent,
    EditLineItemIssueLinkEditComponent,
    EditLineItemIssueLinkEditDetailsComponent,
    EditLineItemIssueLinkEditPlanningComponent,
    EditLineItemIssueLinkEditAttachmentComponent,
    EditLineItemIssueLinkEditCommentComponent,
    EditLineItemIssueLinkEditSubtasksComponent,
    EditLineItemIssueLinkEditLinkedIssuesComponent,
    EditLineItemIssueLinkEditWorklogComponent,
    EditLineItemIssueLinkEditLogTimeComponent,
    EditLineItemIssueLinkEditActivityComponent,
  ],
  imports: [
    CommonModule,
    UtilitiesModule,
    DropDownModule,
    AdvancedSearchModule,
    AppletUtilitiesModule,
    AgGridModule.withComponents([SlideRendererComponent]),
    StoreModule.forFeature(LineItemFeatureKey, reducers.lineItem),
    EffectsModule.forFeature([LineItemEffects]),
  ]
})
export class LineItemsModule { }
