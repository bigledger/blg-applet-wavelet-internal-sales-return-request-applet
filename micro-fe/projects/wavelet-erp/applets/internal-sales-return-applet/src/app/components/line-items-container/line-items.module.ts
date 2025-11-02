import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AgGridModule } from 'ag-grid-angular';
import { DropDownModule } from 'blg-akaun-ng-lib';
import { UtilitiesModule } from 'projects/shared-utilities/utilities/utilities.module';
import { LineItemEffects } from '../../state-controllers/line-item-controller/store/effects/line-item.effects';
import { reducers } from '../../state-controllers/line-item-controller/store/reducers';
import { LineItemFeatureKey } from '../../state-controllers/line-item-controller/store/reducers/line-item.reducers';
import { columnViewModelFeatureKey, columnViewModelReducers } from '../../state-controllers/sales-return-view-model-controller/store/reducers';
import { SlideRendererComponent } from '../utilities/slide-renderer/slide-renderer.component';
import { LineItemsContainerComponent } from './line-items-container.component';
import { EditLineItemCostingDetailsComponent } from './line-items-edit/costing-details-edit/costing-details.component';
import { EditLineItemComponent } from './line-items-edit/edit-line-item.component';
import { EditLineItemIssueLinkEditActivityComponent } from './line-items-edit/issue-link-edit/issue-link-edit/activity/issue-link-edit-activity.component';
import { EditLineItemIssueLinkEditAttachmentComponent } from './line-items-edit/issue-link-edit/issue-link-edit/attachment/issue-link-edit-attachment.component';
import { EditLineItemIssueLinkEditCommentComponent } from './line-items-edit/issue-link-edit/issue-link-edit/comment/issue-link-edit-comment.component';
import { EditLineItemIssueLinkEditDetailsComponent } from './line-items-edit/issue-link-edit/issue-link-edit/details/issue-link-edit-details.component';
import { EditLineItemIssueLinkEditComponent } from './line-items-edit/issue-link-edit/issue-link-edit/issue-link-edit.component';
import { EditLineItemIssueLinkEditLinkedIssuesComponent } from './line-items-edit/issue-link-edit/issue-link-edit/linked-issues/issue-link-edit-linked-issues.component';
import { EditLineItemIssueLinkEditPlanningComponent } from './line-items-edit/issue-link-edit/issue-link-edit/planning/issue-link-edit-planning.component';
import { EditLineItemIssueLinkEditSubtasksComponent } from './line-items-edit/issue-link-edit/issue-link-edit/subtasks/issue-link-edit-subtasks.component';
import { EditLineItemIssueLinkEditWorklogComponent } from './line-items-edit/issue-link-edit/issue-link-edit/worklog/issue-link-edit-worklog.component';
import { EditLineItemIssueLinkEditLogTimeComponent } from './line-items-edit/issue-link-edit/issue-link-edit/worklog/log-time/log-time.component';
import { EditLineItemIssueLinkListingComponent } from './line-items-edit/issue-link-edit/issue-link-listing/issue-link-listing.component';
import { EditLineItemDetailsDeliveryDetailsComponent } from './line-items-edit/item-details-edit/delivery-details/delivery-details.component';
import { EditLineItemDetailsDeliveryInstructions } from './line-items-edit/item-details-edit/delivery-instructions/delivery-instructions.component';
import { EditLineItemDetailsDepartmentComponent } from './line-items-edit/item-details-edit/department/department.component';
import { EditLineItemDetailsDocLinkComponent } from './line-items-edit/item-details-edit/doc-link/doc-link.component';
import { EditLineItemDetailsDocLinkFromComponent } from './line-items-edit/item-details-edit/doc-link/from/from.component';
import { EditLineItemDetailsDocLinkToComponent } from './line-items-edit/item-details-edit/doc-link/to/to.component';
import { EditLineItemDetailsComponent } from './line-items-edit/item-details-edit/item-details.component';
import { EditLineItemDetailsMainComponent } from './line-items-edit/item-details-edit/main-details/main-details.component';
import { EditLineItemPricingDetailsComponent } from './line-items-edit/pricing-details-edit/pricing-details.component';
import { EditLineItemSerialNumberImportComponent } from './line-items-edit/serial-number-edit/serial-number-import/serial-number-import.component';
import { EditLineItemSerialNumberScanComponent } from './line-items-edit/serial-number-edit/serial-number-scan/serial-number-scan.component';
import { EditLineItemSerialNumberComponent } from './line-items-edit/serial-number-edit/serial-number.component';
import { LineItemsListingComponent } from './line-items-listing/line-items-listing.component';
import { EditLineItemBatchNumberComponent } from './line-items-edit/batch-number/batch-number.component';
import { EditLineItemBinNumberComponent } from './line-items-edit/bin-number/bin-number.component';
import { PricingSchemeComponent } from '../utilities/pricing-scheme/pricing-scheme.component';

@NgModule({
  declarations: [
    LineItemsContainerComponent,
    LineItemsListingComponent,
    EditLineItemComponent,
    EditLineItemDetailsComponent,
    EditLineItemDetailsMainComponent,
    EditLineItemDetailsDeliveryInstructions,
    EditLineItemDetailsDepartmentComponent,
    EditLineItemDetailsDocLinkComponent,
    EditLineItemDetailsDocLinkFromComponent,
    EditLineItemDetailsDocLinkToComponent,
    EditLineItemDetailsDeliveryDetailsComponent,
    EditLineItemSerialNumberComponent,
    EditLineItemSerialNumberScanComponent,
    EditLineItemSerialNumberImportComponent,
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
    EditLineItemBatchNumberComponent,
    EditLineItemBinNumberComponent,
    PricingSchemeComponent,
  ],
  imports: [
    CommonModule,
    UtilitiesModule,
    DropDownModule,
    AgGridModule.withComponents([SlideRendererComponent]),
    StoreModule.forFeature(LineItemFeatureKey, reducers.lineItem),
    EffectsModule.forFeature([LineItemEffects]),
    StoreModule.forFeature(columnViewModelFeatureKey, columnViewModelReducers),
  ]
})
export class LineItemsModule { }
