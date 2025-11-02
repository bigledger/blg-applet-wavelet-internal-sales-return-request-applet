import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { DropDownModule } from 'blg-akaun-ng-lib';
import { AgGridModule } from 'ag-grid-angular';

import { SlideRendererComponent } from '../utilities/slide-renderer/slide-renderer.component';
import { UtilitiesModule } from 'projects/shared-utilities/utilities/utilities.module';
import { SalesReturnContainerComponent } from './sales-return-container.component';
import { SalesReturnListingComponent } from './sales-return-listing/sales-return-listing.component';
import { SalesReturnCreateComponent } from './sales-return-create/sales-return-create.component';
import { SalesReturnMainComponent } from './sales-return-create/main-details/main-details.component';
import { SalesReturnAccountComponent } from './sales-return-create/account/account.component';
import { AccountEntityDetailsComponent } from './sales-return-create/account/account-entity-details/account-entity-details.component';
import { SelectCustomerListingComponent } from './sales-return-create/account/account-entity-details/select-customer/select-customer-listing.component';
import { AccountBillingAddressComponent } from './sales-return-create/account/account-billing-address/account-billing-address.component';
import { AccountShippingAddressComponent } from './sales-return-create/account/account-shipping-address/account-shipping-address.component';
import { LineItemListingComponent } from './sales-return-create/line-item/line-item-listing.component';
import { LineItemCreateComponent } from './sales-return-create/line-item/line-item-create/line-item-create.component';
import { LineSearchItemListingComponent } from './sales-return-create/line-item/line-item-create/search-item/line-search-item-listing.component';
import { LineQuotationItemListingComponent } from './sales-return-create/line-item/line-item-create/quotation-item/line-quotation-item-listing.component';
import { LineSupplierDeliveryOrderItemListingComponent } from './sales-return-create/line-item/line-item-create/supplier-delivery-order-item/line-supplier-delivery-order-item-listing.component';
import { LineJobsheetItemListingComponent } from './sales-return-create/line-item/line-item-create/jobsheet-item/line-jobsheet-item-listing.component';
import { LineSalesOrderItemListingComponent } from './sales-return-create/line-item/line-item-create/sales-order-item/line-sales-order-item-listing.component';
import { LineItemDetailsComponent } from './sales-return-create/add-line-item/item-details/item-details.component';
import { ItemDetailsMainComponent } from './sales-return-create/add-line-item/item-details/main-details/main-details.component';
import { ItemDetailsDeliveryInstructions } from './sales-return-create/add-line-item/item-details/delivery-instructions/delivery-instructions.component';
import { AddLineItemComponent } from './sales-return-create/add-line-item/add-line-item.component';
import { ItemDetailsDepartmentComponent } from './sales-return-create/add-line-item/item-details/department/department.component';
import { ItemDetailsRelatedDocumentsComponent } from './sales-return-create/add-line-item/item-details/related-documents/related-documents.component';
import { RelatedDocumentsCopyFromComponent } from './sales-return-create/add-line-item/item-details/related-documents/copy-from/copy-from.component';
import { RelatedDocumentsCopyToComponent } from './sales-return-create/add-line-item/item-details/related-documents/copy-to/copy-to.component';
import { ItemDetailsDeliveryDetailsComponent } from './sales-return-create/add-line-item/item-details/delivery-details/delivery-details.component';
import { LineItemSerialNumberComponent } from './sales-return-create/add-line-item/serial-number/serial-number.component';
import { LineItemBatchNumberComponent } from './sales-return-create/add-line-item/batch-number/batch-number.component';
import { LineItemBatchNumberListingComponent } from './sales-return-create/add-line-item/batch-number/batch-number-listing/batch-number-listing.component';
import { LineItemBinNumberComponent } from './sales-return-create/add-line-item/bin-number/bin-number.component';
import { LineItemBinNumberListingComponent } from './sales-return-create/add-line-item/bin-number/bin-number-listing/bin-number-listing.component';
import { SerialNumberScanComponent } from './sales-return-create/add-line-item/serial-number/serial-number-scan/serial-number-scan.component';
import { SerialNumberImportComponent } from './sales-return-create/add-line-item/serial-number/serial-number-import/serial-number-import.component';
import { SerialNumberListingComponent } from './sales-return-create/add-line-item/serial-number/serial-number-listing/serial-number-listing.component';
import { LineItemCostingDetailsComponent } from './sales-return-create/add-line-item/costing-details/costing-details.component';
import { LineItemPricingDetailsComponent } from './sales-return-create/add-line-item/pricing-details/pricing-details.component';
import { LineItemIssueLinkListingComponent } from './sales-return-create/add-line-item/issue-link/issue-link-listing/issue-link-listing.component';
import { LineItemIssueLinkEditComponent } from './sales-return-create/add-line-item/issue-link/issue-link-edit/issue-link-edit.component';
import { IssueLinkEditDetailsComponent } from './sales-return-create/add-line-item/issue-link/issue-link-edit/details/issue-link-edit-details.component';
import { IssueLinkEditPlanningComponent } from './sales-return-create/add-line-item/issue-link/issue-link-edit/planning/issue-link-edit-planning.component';
import { IssueLinkEditAttachmentComponent } from './sales-return-create/add-line-item/issue-link/issue-link-edit/attachment/issue-link-edit-attachment.component';
import { IssueLinkEditCommentComponent } from './sales-return-create/add-line-item/issue-link/issue-link-edit/comment/issue-link-edit-comment.component';
import { IssueLinkEditSubtasksComponent } from './sales-return-create/add-line-item/issue-link/issue-link-edit/subtasks/issue-link-edit-subtasks.component';
import { IssueLinkEditLinkedIssuesComponent } from './sales-return-create/add-line-item/issue-link/issue-link-edit/linked-issues/issue-link-edit-linked-issues.component';
import { IssueLinkEditWorklogComponent } from './sales-return-create/add-line-item/issue-link/issue-link-edit/worklog/issue-link-edit-worklog.component';
import { IssueLinkEditActivityComponent } from './sales-return-create/add-line-item/issue-link/issue-link-edit/activity/issue-link-edit-activity.component';
import { IssueLinkEditLogTimeComponent } from './sales-return-create/add-line-item/issue-link/issue-link-edit/worklog/log-time/log-time.component';
import { DeliveryDetailsComponent } from './sales-return-create/delivery-details/delivery-details.component';
import { PaymentListingComponent } from './sales-return-create/payment/payment-listing.component';
import { DepartmentComponent } from './sales-return-create/department/department.component';
import { ContraListingComponent } from './sales-return-create/contra/contra-listing.component';
import { ContraSelectDocumentComponent } from './sales-return-create/contra/select-document/contra-select-document.component';
import { AddContraComponent } from './sales-return-create/contra/add-contra/add-contra.component';
import { EditContraComponent } from './sales-return-edit/edit-contra/edit-contra.component';
import { SelectBillingAddressComponent } from './sales-return-create/account/account-billing-address/select-billing-address/select-billing-address-listing.component';
import { SelectShippingAddressComponent } from './sales-return-create/account/account-shipping-address/select-shipping-address/select-shipping-address-listing.component';
import { MainSelectSalesAgentListingComponent } from './sales-return-create/main-details/select-sales-agent/select-sales-agent-listing.component';
import { AddPaymentComponent } from './sales-return-create/payment/add-payment/add-payment.component';
import { EditPaymentComponent } from './sales-return-edit/edit-payment/edit-payment.component';
import { SalesReturnEditComponent } from './sales-return-edit/sales-return-edit.component';
import { EditLineItemComponent } from './sales-return-edit/edit-line-item/edit-line-item.component';
import { SalesReturnExportComponent } from './sales-return-create/export/export.component';
import { reducers } from '../../state-controllers/sales-return-controller/store/reducers';
import { SalesReturnEffects } from '../../state-controllers/sales-return-controller/store/effects';
import { ItemEffects } from '../../state-controllers/sales-return-controller/store/effects';
import { SalesReturnFeatureKey } from '../../state-controllers/sales-return-controller/store/reducers';
import { AdvancedSearchModule } from '../utilities/advanced-search/advanced-search.module';
import { AppletUtilitiesModule } from '../../applet-utilities.module';
import { AddAttachmentsComponent } from './sales-return-edit/attachments/add-attachments/add-attachments.component';
import { AttachmentsListingComponent } from './sales-return-edit/attachments/attachments-listing.component';
import { HeaderDocLinkComponent } from './sales-return-edit/header-doc-link/header-doc-link.component';
import { HeaderDocLinkCopyFromComponent } from './sales-return-edit/header-doc-link/copy-from/copy-from.component';
import { HeaderDocLinkCopyToComponent } from './sales-return-edit/header-doc-link/copy-to/copy-to.component';
import { MainSelectMemberListingComponent } from './sales-return-create/main-details/select-member/select-member-listing.component';
import { PostingComponent } from './sales-return-create/posting/posting.component';

@NgModule({
  declarations: [
    SalesReturnContainerComponent,
    SalesReturnListingComponent,
    SalesReturnCreateComponent,
    SalesReturnEditComponent,
    SalesReturnMainComponent,
    MainSelectSalesAgentListingComponent,
    SalesReturnAccountComponent,
    AccountEntityDetailsComponent,
    SelectCustomerListingComponent,
    AccountBillingAddressComponent,
    SelectBillingAddressComponent,
    AccountShippingAddressComponent,
    SelectShippingAddressComponent,
    LineItemListingComponent,
    LineItemCreateComponent,
    LineSearchItemListingComponent,
    LineQuotationItemListingComponent,
    LineSupplierDeliveryOrderItemListingComponent,
    LineJobsheetItemListingComponent,
    LineSalesOrderItemListingComponent,
    AddLineItemComponent,
    EditLineItemComponent,
    LineItemDetailsComponent,
    ItemDetailsMainComponent,
    ItemDetailsDeliveryInstructions,
    ItemDetailsDepartmentComponent,
    ItemDetailsRelatedDocumentsComponent,
    RelatedDocumentsCopyFromComponent,
    RelatedDocumentsCopyToComponent,
    ItemDetailsDeliveryDetailsComponent,
    LineItemSerialNumberComponent,
    LineItemBatchNumberComponent,
    LineItemBatchNumberListingComponent,
    LineItemBinNumberComponent,
    LineItemBinNumberListingComponent,
    SerialNumberScanComponent,
    SerialNumberImportComponent,
    SerialNumberListingComponent,
    LineItemCostingDetailsComponent,
    LineItemPricingDetailsComponent,
    LineItemIssueLinkListingComponent,
    LineItemIssueLinkEditComponent,
    IssueLinkEditDetailsComponent,
    IssueLinkEditPlanningComponent,
    IssueLinkEditAttachmentComponent,
    IssueLinkEditCommentComponent,
    IssueLinkEditSubtasksComponent,
    IssueLinkEditLinkedIssuesComponent,
    IssueLinkEditWorklogComponent,
    IssueLinkEditLogTimeComponent,
    IssueLinkEditActivityComponent,
    DeliveryDetailsComponent,
    PaymentListingComponent,
    AddPaymentComponent,
    EditPaymentComponent,
    DepartmentComponent,
    ContraListingComponent,
    ContraSelectDocumentComponent,
    AddContraComponent,
    EditContraComponent,
    SalesReturnExportComponent,
    AttachmentsListingComponent,
    AddAttachmentsComponent,
    HeaderDocLinkComponent,
    HeaderDocLinkCopyFromComponent,
    HeaderDocLinkCopyToComponent,
    MainSelectMemberListingComponent,
    PostingComponent
  ],
  imports: [
    CommonModule,
    UtilitiesModule,
    DropDownModule,
    AdvancedSearchModule,
    AppletUtilitiesModule,
    AgGridModule.withComponents([SlideRendererComponent]),
    StoreModule.forFeature(SalesReturnFeatureKey, reducers),
    EffectsModule.forFeature([SalesReturnEffects, ItemEffects])
  ]
})
export class SalesReturnModule {}
