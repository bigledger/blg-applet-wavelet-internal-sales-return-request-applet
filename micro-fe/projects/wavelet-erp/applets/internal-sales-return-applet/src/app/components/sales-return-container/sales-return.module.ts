import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DropDownModule } from 'blg-akaun-ng-lib';
import { AgGridModule } from 'ag-grid-angular';
import { UtilitiesModule } from 'projects/shared-utilities/utilities/utilities.module';
import { NgxMatIntlTelInputModule } from 'ngx-mat-intl-tel-input';
import { SalesReturnContainerComponent } from './sales-return-container.component';
// import { SalesReturnCreateComponent } from './sales-return-create/sales-return-create.component';
import { InternalSalesReturnMainComponent } from './sales-return-create/main-details/main-details.component';
import { LineItemCreateComponent } from './sales-return-create/line-item/line-item-create/line-item-create.component';
import { PaymentComponent } from './sales-return-create/payment/payment.component';
import { PostingComponent } from './sales-return-create/posting/posting.component';
import { DepartmentComponent } from './sales-return-create/department/department.component';
import { DeliveryDetailsComponent } from './sales-return-create/delivery-details/delivery-details.component';
import { SlideRendererComponent } from '../utilities/slide-renderer/slide-renderer.component';
import { reducers } from '../../state-controllers/internal-sales-return-controller/store/reducers';
import { InternalSalesReturnFeatureKey } from '../../state-controllers/internal-sales-return-controller/store/reducers/internal-sales-return.reducers';
import { InternalSalesReturnEffects } from '../../state-controllers/internal-sales-return-controller/store/effects';
import { AppletUtilitiesModule } from '../../applet-utilities.module';
import { SalesReturnListingComponent } from './sales-return-listing/sales-return-listing.component';
// import { ContraComponent } from './sales-return-create/contra/contra.component';
import { LineSearchItemListingComponent } from './sales-return-create/line-item/line-item-create/search-item/line-search-item-listing.component';
import { LineSalesOrderItemListingComponent } from './sales-return-create/line-item/line-item-create/sales-order-item/line-sales-order-item-listing.component';
import { LineJobsheetItemListingComponent } from './sales-return-create/line-item/line-item-create/jobsheet-item/line-jobsheet-item-listing.component';
import { LineDeliveryOrderItemListingComponent } from './sales-return-create/line-item/line-item-create/delivery-order-item/line-delivery-order-item-listing.component';
import { AccountEntityDetailsComponent } from './sales-return-create/account/account-entity-details/account-entity-details.component';
import { SelectCustomerListingComponent } from './sales-return-create/account/account-entity-details/select-customer/select-customer.component';
import { AccountBillingAddressComponent } from './sales-return-create/account/account-billing-address/account-billing-address.component';
import { AccountShippingAddressComponent } from './sales-return-create/account/account-shipping-address/account-shipping-address.component';
import { SelectShippingAddressComponent } from './sales-return-create/account/account-shipping-address/select-shipping-address/select-shipping-address.component';
import { SelectBillingAddressComponent } from './sales-return-create/account/account-billing-address/select-billing-address/select-billing-address.component';
import { AddLineItemComponent } from './sales-return-create/add-line-item/add-line-item.component';
import { LineItemCostingDetailsComponent } from './sales-return-create/add-line-item/costing-details/costing-details.component';
import { LineItemPricingDetailsComponent } from './sales-return-create/add-line-item/pricing-details/pricing-details.component';
// import { LineItemSerialNumberComponent } from './sales-return-create/add-line-item/serial-number/serial-number.component';
// import { IssueLinkEditComponent } from './sales-return-create/add-line-item/issue-link/issue-link-edit/issue-link-edit.component';
// import { IssueLinkListingComponent } from './sales-return-create/add-line-item/issue-link/issue-link-listing/issue-link-listing.component';
import { IssueLinkEditActivityComponent } from './sales-return-create/add-line-item/issue-link/issue-link-edit/activity/activity.component';
import { IssueLinkEditAttachmentComponent } from './sales-return-create/add-line-item/issue-link/issue-link-edit/attachment/attachment.component';
import { IssueLinkEditCommentComponent } from './sales-return-create/add-line-item/issue-link/issue-link-edit/comment/comment.component';
import { IssueLinkEditDetailsComponent } from './sales-return-create/add-line-item/issue-link/issue-link-edit/details/details.component';
import { IssueLinkEditLinkedIssuesComponent } from './sales-return-create/add-line-item/issue-link/issue-link-edit/linked-issues/linked-issues.component';
import { IssueLinkEditPlanningComponent } from './sales-return-create/add-line-item/issue-link/issue-link-edit/planning/planning.component';
import { IssueLinkEditSubtasksComponent } from './sales-return-create/add-line-item/issue-link/issue-link-edit/subtasks/subtasks.component';
import { IssueLinkEditWorklogComponent } from './sales-return-create/add-line-item/issue-link/issue-link-edit/worklog/worklog.component';
import { IssueLinkEditLogTimeComponent } from './sales-return-create/add-line-item/issue-link/issue-link-edit/worklog/log-time/log-time.component';
// import { SerialNumberImportComponent } from './sales-return-create/add-line-item/serial-number/serial-number-import/serial-number-import.component';
// import { SerialNumberScanComponent } from './sales-return-create/add-line-item/serial-number/serial-number-scan/serial-number-scan.component';
// import { ItemDetailsDocLinkComponent } from './sales-return-create/add-line-item/item-details/doc-link/doc-link.component';
// import { ItemDetailsDocLinkFromComponent } from './sales-return-create/add-line-item/item-details/doc-link/from/from.component';
// import { ItemDetailsDocLinkToComponent } from './sales-return-create/add-line-item/item-details/doc-link/to/to.component';
import { ItemDetailsMainComponent } from './sales-return-create/add-line-item/item-details/main-details/main-details.component';
// import { ItemDetailsDeliveryInstructions } from './sales-return-create/add-line-item/item-details/delivery-instructions/delivery-instructions.component';
// import { ItemDetailsDeliveryDetailsComponent } from './sales-return-create/add-line-item/item-details/delivery-details/delivery-details.component';
import { LineItemDetailsComponent } from './sales-return-create/add-line-item/item-details/item-details.component';
// import { ItemDetailsDepartmentComponent } from './sales-return-create/add-line-item/item-details/department/department.component';
import { LineItemIssueLinkListingComponent } from './sales-return-create/add-line-item/issue-link/issue-link-listing/issue-link-listing.component';
import { LineItemIssueLinkEditComponent } from './sales-return-create/add-line-item/issue-link/issue-link-edit/issue-link-edit.component';
import { SalesReturnCreateComponent } from './sales-return-create/sales-return-create.component';
import { AccountComponent } from './sales-return-create/account/account.component';
import { ItemDetailsDocLinkComponent } from './sales-return-create/add-line-item/item-details/doc-link/doc-link.component';
import { ItemDetailsDeliveryInstructions } from './sales-return-create/add-line-item/item-details/delivery-instructions/delivery-instructions.component';
import { ItemDetailsDocLinkToComponent } from './sales-return-create/add-line-item/item-details/doc-link/to/to.component';
import { ItemDetailsDocLinkFromComponent } from './sales-return-create/add-line-item/item-details/doc-link/from/from.component';
import { ItemDetailsDeliveryDetailsComponent } from './sales-return-create/add-line-item/item-details/delivery-details/delivery-details.component';
import { ItemDetailsDepartmentComponent } from './sales-return-create/add-line-item/item-details/department/department.component';
import { AttachmentsListingComponent } from './sales-return-edit/attachments/attachments-listing.component';
import { InternalSalesReturnEditExportComponent } from './sales-return-edit/export/export.component';
import { EditContraComponent } from './sales-return-edit/edit-contra/edit-contra.component';
import { EditPaymentComponent } from './sales-return-edit/edit-payment/edit-payment.component';
import { EditLineItemComponent } from './sales-return-edit/edit-line-item/edit-line-item.component';
import { ViewAttachmentComponent } from './sales-return-edit/attachments/view-attachment/view-attachment.component';
import { AddAttachmentsComponent } from './sales-return-edit/attachments/add-attachments/add-attachments.component';
import { InternalSalesReturnEditComponent } from './sales-return-edit/sales-return-edit.component';
import { MainDetailsSelectMemberComponent } from './sales-return-create/main-details/select-member/select-member.component';
import { AddPaymentComponent } from './sales-return-create/payment/add-payment/add-payment.component';
import { ContraListingComponent } from './sales-return-create/contra/contra-listing.component';
import { ContraSelectDocumentComponent } from './sales-return-create/contra/select-document/contra-select-document.component';
import { AddContraComponent } from './sales-return-create/contra/add-contra/add-contra.component';
// import { AdvancedSearchISCNModule } from '../utilities/advanced-search-iscn 2/advanced-search-iscn.module';
import { LineQuotationItemListingComponent } from './sales-return-create/line-item/line-item-create/quotation-item/line-quotation-item-listing.component';
import { LineItemListingComponent } from './sales-return-create/line-item/line-item-listing.component';
import { LineItemAddSerialNumberComponent } from './sales-return-create/add-line-item/serial-number/serial-number.component';
import { SerialNumberScanComponent } from './sales-return-create/add-line-item/serial-number/scan/scan.component';
import { SerialNumberImportComponent } from './sales-return-create/add-line-item/serial-number/import/import.component';
import { LineItemAddBinNumberComponent } from './sales-return-create/add-line-item/bin-number/bin-number.component';
import { LineItemAddBatchNumberComponent } from './sales-return-create/add-line-item/batch-number/batch-number.component';
import { AdvancedSearchISCNModule } from '../utilities/advanced-search-iscn/advanced-search-iscn.module';
import { CopyQuotationItemComponent } from './sales-return-create/line-item/line-item-create/copy-quotation-item/copy-quotation-item.component';
import { KoBySalesOrderItemComponent } from './sales-return-create/line-item/line-item-create/ko-by-sales-order-item/ko-by-sales-order-item.component';
import { KoForSalesOrderItemComponent } from './sales-return-create/line-item/line-item-create/ko-for-sales-order-item/ko-for-sales-order-item.component';
import { KoByJobsheetItemComponent } from './sales-return-create/line-item/line-item-create/ko-by-jobsheet-item/ko-by-jobsheet-item.component';
import { KoForJobsheetItemComponent } from './sales-return-create/line-item/line-item-create/ko-for-jobsheet-item/ko-for-jobsheet-item.component';
import { KoByDeliveryOrderItemComponent } from './sales-return-create/line-item/line-item-create/ko-by-delivery-order-item/ko-by-delivery-order-item.component';
import { KoForDeliveryOrderItemComponent } from './sales-return-create/line-item/line-item-create/ko-for-delivery-order-item/ko-for-delivery-order-item.component';
import { KnockoffAddComponent } from './sales-return-edit/edit-line-item/knockoff-add/knockoff-add.component';
import { KnockoffEditComponent } from './sales-return-edit/edit-line-item/knockoff-edit/knockoff-edit.component';
import { CustomerCreateComponent } from './sales-return-create/account/account-entity-details/select-customer/customer-create/customer-create.component';
import { CustomerCreateMainComponent } from './sales-return-create/account/account-entity-details/select-customer/customer-create/customer-create-main/customer-create-main.component';
import { CustomerEditComponent } from './sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-edit.component';
import { CustomerPaymentConfigComponent } from './sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-payment-config/customer-payment-config.component';
import { EditPaymentConfigComponent } from './sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-payment-config/payment-config-edit/payment-config-edit.component';
import { CreatePaymentConfigComponent } from './sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-payment-config/payment-config-create/payment-config-create.component';
import { CustomerLoginComponent } from './sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-login/customer-login.component';
import { CreateLoginComponent } from './sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-login/login-create/login-create.component';
import { EditLoginComponent } from './sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-login/login-edit/login-edit.component';
import { CreateTaxComponent } from './sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-tax/tax-create/customer-tax-create.component';
import { EditTaxComponent } from './sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-tax/tax-edit/customer-tax-edit.component';
import { CreateAddressComponent } from './sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-address/address-create/customer-address-create.component';
import { EditAddressComponent } from './sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-address/address-edit/customer-address-edit.component';
import { CustomerAddressComponent } from './sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-address/customer-address.component';
import { CreateContactComponent } from './sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-contact/contact-create/customer-contact-create.component';
import { EditContactComponent } from './sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-contact/contact-edit/customer-contact-edit.component';
import { CustomerContactComponent } from './sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-contact/customer-contact.component';
import { EditBranchComponent } from './sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-branch/branch-edit/branch-edit.component';
import { CreateBranchComponent } from './sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-branch/branch-create/branch-create.component';
import { CreditTermsMainComponent } from './sales-return-create/account/account-entity-details/select-customer/customer-edit/credit-terms-main/credit-terms-main.component';
import { CreditTermsComponent } from './sales-return-create/account/account-entity-details/select-customer/customer-edit/credit-terms-main/credit-terms/credit-terms.component';
import { CustomerBranchComponent } from './sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-branch/customer-branch.component';
import { CreditTermsEditComponent } from './sales-return-create/account/account-entity-details/select-customer/customer-edit/credit-terms-main/credit-terms-edit/credit-terms-edit.component';
import { CreditLimitsMainComponent } from './sales-return-create/account/account-entity-details/select-customer/customer-edit/credit-limits-main/credit-limits-main.component';
import { CreditLimitsComponent } from './sales-return-create/account/account-entity-details/select-customer/customer-edit/credit-limits-main/credit-limits/credit-limits.component';
import { CreditLimitsEditComponent } from './sales-return-create/account/account-entity-details/select-customer/customer-edit/credit-limits-main/credit-limits-edit/credit-limits-edit.component';
import { CustomerItemPricingComponent } from './sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-item-pricing/customer-item-pricing-listing.component';
import { EditItemPricingComponent } from './sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-item-pricing/item-pricing-edit/item-pricing-edit.component';
import { CustomerTaxComponent } from './sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-tax/customer-tax.component';
import { CustomerCategoryComponent } from './sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-category/customer-category.component';
import { EditCategoryComponent } from './sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-category/category-edit/category-edit.component';
import { AddCategoryComponent } from './sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-category/category-add/category-add.component';
import { customerFeatureKey } from '../../state-controllers/customer-controller/reducers/customer.reducers';
import { reducerss } from '../../state-controllers/customer-controller/reducers';
import { CustomerEffects } from '../../state-controllers/customer-controller/effects/customer.effects';
import { CreditLimitEffect } from '../../state-controllers/customer-controller/effects/credit-limits.effects';
import { CreditTermEffect } from '../../state-controllers/customer-controller/effects/credit-terms.effects';
import { FroalaEditorModule } from 'angular-froala-wysiwyg';
import { ImportKnockOffComponent } from './sales-return-create/import-knock-off/import-knock-off.component';
import { KnockOffSalesOrderComponent } from './sales-return-create/import-knock-off/knock-off-sales-order/knock-off-sales-order.component';
import { KnockOffJobsheetComponent } from './sales-return-create/import-knock-off/knock-off-jobsheet/knock-off-jobsheet.component';
import { KnockOffDeliveryOrderComponent } from './sales-return-create/import-knock-off/knock-off-delivery-order/knock-off-delivery-order.component';
import { KnockOffSalesInvoiceComponent } from './sales-return-create/import-knock-off/knock-off-sales-invoice/knock-off-sales-invoice.component';
import { SearchInvoicesComponent } from './sales-return-create/search-invoices/search-invoices.component';
import { SearchByCustomerComponent } from './sales-return-create/search-invoices/search-by-customer/search-by-customer.component';
import { SearchBySerialNumberComponent } from './sales-return-create/search-invoices/search-by-serial-number/search-by-serial-number.component';
import { CustomerInvoiceListingComponent } from './sales-return-create/search-invoices/search-by-customer/invoice-listing/invoice-listing.component';
import { CustomerInvoiceLineListingComponent } from './sales-return-create/search-invoices/search-by-customer/invoice-listing/invoice-line-listing/invoice-line-listing.component';
import { SearchByInvoiceComponent } from './sales-return-create/search-invoices/search-by-invoice/search-by-invoice.component';
import { InvoiceLineListingComponent  } from './sales-return-create/search-invoices/search-by-invoice/invoice-line-listing/invoice-line-listing.component';
import { SerialNumberCellRendererComponent } from '../utilities/serial-number-cell-renderer/serial-number-cell-renderer.component';
import { CustomToolTipComponent } from '../utilities/custom-tool-tip/custom-tool-tip.component';
import { HeaderDocLinkComponent } from './sales-return-edit/header-doc-link/header-doc-link.component';
import { FromComponent } from './sales-return-edit/header-doc-link/from/from.component';
import { ToComponent } from './sales-return-edit/header-doc-link/to/to.component';
import { columnViewModelFeatureKey, columnViewModelReducers } from '../../state-controllers/sales-return-view-model-controller/store/reducers';
import { AdvancedSearchContraModule } from '../utilities/advanced-search-contra/advanced-search-contra.module';
import { PaginationClientSideV2Component } from 'projects/shared-utilities/utilities/pagination-client-side-v2/pagination-client-side-v2.component';
import { SalesReturnARAPComponent } from "./sales-return-edit/arap/arap-details.component";
import { DateCellRendererComponent } from '../utilities/date-cell-renderer/date-cell-renderer.component';
import { DeliveryRegionCellRendererComponent } from '../utilities/delivery-region-cell-renderer/delivery-region-cell-renderer.component';
import { ShippingBranchCellRendererComponent } from '../utilities/shipping-branch-cell-renderer/shipping-branch-cell-renderer.component';
import { ShippingLocationCellRendererComponent } from '../utilities/shipping-location-cell-renderer/shipping-location-cell-renderer.component';
import { NGX_MAT_DATE_FORMATS, NgxMatDateAdapter, NgxMatDateFormats, NgxMatDatetimePickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular-material-components/moment-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomNgxDatetimeAdapter } from 'projects/shared-utilities/customNgxDatetimeAdapter';
import { DeliveryTypeCellRendererComponent } from 'projects/shared-utilities/utilities/delivery-type-cell-renderer/delivery-type-cell-renderer.component';
import { RequireDeliveryCellRendererComponent } from 'projects/shared-utilities/utilities/require-delivery-cell-renderer/require-delivery-cell-renderer.component';
import { ButtonDeleteRendererComponent } from '../button-del-renderer/button-del-renderer.component';
import { PaginationClientSideV3Component } from 'projects/shared-utilities/utilities/pagination-client-side-v3/pagination-client-side-v3.component';
import { CustomFooterComponent } from '../utilities/custom-footer/custom-footer.component';
import { Column4ViewModelEffects } from '../../state-controllers/sales-return-view-model-controller/store/effects/column_4_view_model.effects';
import { EInvoiceComponent } from "./sales-return-edit/e-invoice/e-invoice.component";
import { PendingPostingToIRBOrBatchQueueComponent } from "./sales-return-edit/e-invoice/pending-posting-to-irb-or-batch-queue/pending-posting-to-irb-or-batch-queue.component";
import { PendingInBatchQueueComponent } from "./sales-return-edit/e-invoice/pending-in-batch-queue/pending-in-batch-queue.component";
import { PendingSubmissionToIRBComponent } from "./sales-return-edit/e-invoice/pending-submission-to-irb/pending-submission-to-irb.component";
import { SubmittedToIRBComponent } from "./sales-return-edit/e-invoice/submitted-to-irb/submitted-to-irb.component";
import { SubmissionComponent } from "./sales-return-edit/e-invoice/submission/submission.component";
import { CommunicationComponent } from "./sales-return-edit/e-invoice/communication/communication.component";
import { CancellationComponent } from "./sales-return-edit/e-invoice/cancellation/cancellation.component";
import { IntercompanyTransactionComponent } from './sales-return-create/account/account-entity-details/intercompany-transaction/intercompany-transaction.component';
import { SelectBranchIntercompanyConfigComponent } from './sales-return-create/account/account-entity-details/intercompany-transaction/select-branch-intercompany-config/select-branch-intercompany-config.component';
import { TabControlService } from '../../services/tab-control.service';
import { ProgressComponent } from "./sales-return-edit/e-invoice/progress/progress.component";
import { EinvoiceNotificationQueueListingComponent } from './sales-return-edit/e-invoice/notification-queue-listing/notification-queue-listing.component';
import { MainDetailsSelectEinvoiceMainDocRefNoComponent } from './sales-return-edit/e-invoice/submission/select-einvoice-main-doc-ref-no/select-einvoice-main-doc-ref-no.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import {SettlementAdjustmentListingComponent} from "./sales-return-edit/settlement-adjustment/settlement-adjustment-listing.component";
import {AddSettlementAdjustmentComponent} from './sales-return-edit/settlement-adjustment/add-settlement-adjustment/add-settlement-adjustment.component';
import {EditSettlementAdjustmentComponent} from './sales-return-edit/settlement-adjustment/edit-settlement-adjustment/edit-settlement-adjustment.component';
import { LineItemGroupItemComponent } from './sales-return-create/add-line-item/group-item/group-item.component';
import { GroupInputTextCellRendererComponent } from './sales-return-create/add-line-item/group-item/input-text-cell-renderer/input-text-cell-renderer.component';

const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: 'l, LTS'
  },
  display: {
    dateInput: 'YYYY-MM-DD HH:mm:ss',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};
@NgModule({
  declarations: [

    SalesReturnContainerComponent,
    SalesReturnCreateComponent,
    SalesReturnListingComponent,
    AccountComponent,
    MainDetailsSelectMemberComponent,
    LineItemCreateComponent,
    PaymentComponent,
    PostingComponent,
    DepartmentComponent,
    DeliveryDetailsComponent,
    LineItemDetailsComponent,
    LineItemIssueLinkListingComponent,
    AccountEntityDetailsComponent,
    SelectCustomerListingComponent,
    AccountBillingAddressComponent,
    SelectBillingAddressComponent,
    AccountShippingAddressComponent,
    SelectShippingAddressComponent,
    LineSearchItemListingComponent,
    LineSalesOrderItemListingComponent,
    LineJobsheetItemListingComponent,
    LineDeliveryOrderItemListingComponent,
    AddLineItemComponent,
    LineItemCostingDetailsComponent,
    ItemDetailsMainComponent,
    LineItemPricingDetailsComponent,
    LineItemIssueLinkEditComponent,
    IssueLinkEditAttachmentComponent,
    IssueLinkEditLinkedIssuesComponent,
    IssueLinkEditWorklogComponent,
    ItemDetailsDocLinkComponent,
    ItemDetailsDeliveryInstructions,
    ItemDetailsDocLinkToComponent,
    ItemDetailsDocLinkFromComponent,
    ItemDetailsDeliveryDetailsComponent,
    ItemDetailsDepartmentComponent,
    IssueLinkEditLogTimeComponent,
    IssueLinkEditSubtasksComponent,
    IssueLinkEditPlanningComponent,
    IssueLinkEditDetailsComponent,
    IssueLinkEditCommentComponent,
    IssueLinkEditActivityComponent,
    AttachmentsListingComponent,
    InternalSalesReturnEditExportComponent,
    EditPaymentComponent,
    EditContraComponent,
    EditLineItemComponent,
    ViewAttachmentComponent,
    AddAttachmentsComponent,
    InternalSalesReturnEditComponent,
    InternalSalesReturnMainComponent,
    AddPaymentComponent,
    ContraListingComponent,
    ContraSelectDocumentComponent,
    AddContraComponent,
    LineQuotationItemListingComponent,
    LineItemListingComponent,
    LineItemAddSerialNumberComponent,
    SerialNumberScanComponent,
    SerialNumberImportComponent,
    LineItemAddBinNumberComponent,
    LineItemAddBatchNumberComponent,
    CopyQuotationItemComponent,
    KoBySalesOrderItemComponent,
    KoForSalesOrderItemComponent,
    KoByJobsheetItemComponent,
    KoForJobsheetItemComponent,
    KoByDeliveryOrderItemComponent,
    KoForDeliveryOrderItemComponent,
    KnockoffAddComponent,
    KnockoffEditComponent,
    CustomerCreateComponent,
    CustomerCreateMainComponent,
    CustomerEditComponent,
    CustomerPaymentConfigComponent,
    EditPaymentConfigComponent,
    CreatePaymentConfigComponent,
    CustomerLoginComponent,
    CreateLoginComponent,
    EditLoginComponent,
    CreateTaxComponent,
    EditTaxComponent,
    CreateAddressComponent,
    EditAddressComponent,
    CustomerAddressComponent,
    CreateContactComponent,
    EditContactComponent,
    CustomerContactComponent,
    EditBranchComponent,
    CreateBranchComponent,
    CreditTermsMainComponent,
    CreditTermsComponent,
    CustomerBranchComponent,
    CreditTermsEditComponent,
    CreditLimitsMainComponent,
    CreditLimitsComponent,
    CreditLimitsEditComponent,
    CustomerItemPricingComponent,
    EditItemPricingComponent,
    CustomerTaxComponent,
    CustomerCategoryComponent,
    EditCategoryComponent,
    AddCategoryComponent,
    ImportKnockOffComponent,
    KnockOffSalesOrderComponent,
    KnockOffJobsheetComponent,
    KnockOffDeliveryOrderComponent,
    KnockOffSalesInvoiceComponent,
    SearchInvoicesComponent,
    SearchByCustomerComponent,
    SearchBySerialNumberComponent,
    CustomerInvoiceListingComponent,
    CustomerInvoiceLineListingComponent,
    SearchByInvoiceComponent,
    InvoiceLineListingComponent,
    SerialNumberCellRendererComponent,
    CustomToolTipComponent,
    HeaderDocLinkComponent,
    FromComponent,
    ToComponent,
    SalesReturnARAPComponent,
    DateCellRendererComponent,
    DeliveryRegionCellRendererComponent,
    ShippingBranchCellRendererComponent,
    ShippingLocationCellRendererComponent,
    ButtonDeleteRendererComponent,
    CustomFooterComponent,
    EInvoiceComponent,
    PendingPostingToIRBOrBatchQueueComponent,
    PendingInBatchQueueComponent,
    PendingSubmissionToIRBComponent,
    SubmittedToIRBComponent,
    SubmissionComponent,
    CommunicationComponent,
    CancellationComponent,
    ProgressComponent,
    IntercompanyTransactionComponent,
    SelectBranchIntercompanyConfigComponent,
    EinvoiceNotificationQueueListingComponent,
    MainDetailsSelectEinvoiceMainDocRefNoComponent,
    SettlementAdjustmentListingComponent,
    AddSettlementAdjustmentComponent,
    EditSettlementAdjustmentComponent,
    LineItemGroupItemComponent,
    GroupInputTextCellRendererComponent
  ],
  imports: [
    CommonModule,
    UtilitiesModule,
    NgxMatIntlTelInputModule,
    DropDownModule,
    AppletUtilitiesModule,
    AdvancedSearchISCNModule,
    AdvancedSearchContraModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    AgGridModule.withComponents([SlideRendererComponent, DateCellRendererComponent, SerialNumberCellRendererComponent, CustomToolTipComponent, DeliveryRegionCellRendererComponent, ShippingBranchCellRendererComponent, ShippingLocationCellRendererComponent, RequireDeliveryCellRendererComponent, DeliveryTypeCellRendererComponent, CustomFooterComponent]),
    StoreModule.forFeature(InternalSalesReturnFeatureKey, reducers.internalSalesReturn),
    EffectsModule.forFeature([InternalSalesReturnEffects]),
    StoreModule.forFeature(customerFeatureKey, reducerss.customer),
    EffectsModule.forFeature([CustomerEffects, CreditLimitEffect, CreditTermEffect]),
    StoreModule.forFeature(columnViewModelFeatureKey, columnViewModelReducers),
    EffectsModule.forFeature([Column4ViewModelEffects]),
    FroalaEditorModule.forRoot(),
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: NgxMatDateAdapter,
      useClass: CustomNgxDatetimeAdapter,
      deps: [MAT_DATE_LOCALE, NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    PaginationClientSideV3Component,
    TabControlService]
})
export class SalesReturnModule { }
