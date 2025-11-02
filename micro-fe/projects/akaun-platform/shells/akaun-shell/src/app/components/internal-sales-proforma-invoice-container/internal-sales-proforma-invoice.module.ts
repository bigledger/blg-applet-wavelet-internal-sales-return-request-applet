import { NgxMatDateAdapter, NgxMatDateFormats, NgxMatDatetimePickerModule, NgxMatNativeDateModule, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular-material-components/moment-adapter';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AgGridModule } from 'ag-grid-angular';
import { DropDownModule } from 'blg-akaun-ng-lib';
import { UtilitiesModule } from 'projects/shared-utilities/utilities/utilities.module';
import { CustomNgxDatetimeAdapter } from '../../models/custom-ngx-date-time-adapter';
import { InternalSalesProformaInvoiceEffects } from '../../state-controllers/internal-sales-proforma-invoice-controller/store/effects';
import { reducers } from '../../state-controllers/internal-sales-proforma-invoice-controller/store/reducers';
import { internalSalesOrderFeatureKey } from '../../state-controllers/internal-sales-proforma-invoice-controller/store/reducers/internal-sales-proforma-invoice.reducers';
import { SlideRendererComponent } from '../utilities/slide-renderer/slide-renderer.component';
import { InternalSalesProformaInvoiceAddAttachmentsComponent } from './internal-sales-proforma-invoice-add-attachments/internal-sales-proforma-invoice-add-attachments.component';
import { InternalSalesProformaInvoiceAddContraComponent } from './internal-sales-proforma-invoice-add-contra/internal-sales-proforma-invoice-add-contra.component';
import { AddLineItemCostingDetailsComponent } from './internal-sales-prof-add-line-item/add-line-item-costing-details/add-line-item-costing-details.component';
import { AddLineItemIssueLinkComponent } from './internal-sales-prof-add-line-item/add-line-item-issue-link/add-line-item-issue-link.component';
import { AddLineItemItemDetailsComponent } from './internal-sales-prof-add-line-item/add-line-item-item-details/add-line-item-item-details.component';
import { InternalSalesProformaInvoiceAddLineItemMainComponent } from './internal-sales-prof-add-line-item/add-line-item-item-details/internal-sales-proforma-invoice-add-line-item-main/internal-sales-proforma-invoice-add-line-item-main.component';
//import { AddLineItemPricingDetailsComponent } from './internal-sales-prof-add-line-item/add-line-item-pricing-details/add-line-item-pricing-details.component';
import { AddLineItemSerialNumberComponent } from './internal-sales-prof-add-line-item/add-line-item-serial-number/add-line-item-serial-number.component';
import { SerialNumberImportComponent } from './internal-sales-prof-add-line-item/add-line-item-serial-number/serial-number-import/serial-number-import.component';
import { SerialNumberScanComponent } from './internal-sales-prof-add-line-item/add-line-item-serial-number/serial-number-scan/serial-number-scan.component';
import { InternalSalesProformaInvoiceAddLineItemOptionalComponent } from './internal-sales-prof-add-line-item/internal-sales-proforma-invoice-add-line-item-optional/internal-sales-proforma-invoice-add-line-item-optional.component';
//import { InternalSalesOrderAddLineItemComponent } from './internal-sales-order-add-line-item/internal-sales-proforma-invoice-add-line-item.component';
//import { InternalSalesOrderAddRelatedDocumentsComponent } from './internal-sales-order-add-related-documents/internal-sales-proforma-invoice-add-related-documents.component';
//import { InternalSalesOrderAddSettlementComponent } from './internal-sales-proforma-invoice-add-settlement/internal-sales-proforma-invoice-add-settlement.component';
//import { InternalSalesOrderContainerComponent } from './internal-sales-order-container.component';
//import { InternalSalesOrderCreateLineItemComponent } from './internal-sales-order-create-line-item/internal-sales-profroma-invoice-create-line-item.component';
import { LineJobsheetItemComponent } from './internal-sales-create-line-item/line-jobsheet-item/line-jobsheet-item.component';
import { LinePreviousSalesOrderComponent } from './internal-sales-create-line-item/line-previous-sales-order/line-previous-sales-order.component';
import { LineQuotationItemComponent } from './internal-sales-create-line-item/line-quotation-item/line-quotation-item.component';
import { LineSearchItemComponent } from './internal-sales-create-line-item/line-search-item/line-search-item.component';
//import { AccountBillingAddressComponent } from './internal-sales-order-create/internal-sales-order-create-account/account-billing-address/account-billing-address.component';
//import { AccountEntityDetailsComponent } from './internal-sales-order-create/internal-sales-order-create-account/account-entity-details/account-entity-details.component';
//import { AccountShippingAddressComponent } from './internal-sales-order-create/internal-sales-order-create-account/account-shipping-address/account-shipping-address.component';
//import { InternalSalesOrderCreateAccountComponent } from './internal-sales-order-create/internal-sales-order-create-account/internal-sales-proforma-invoice-create-account.component';
//import { InternalSalesOrderCreateAttachmentsComponent } from './internal-sales-order-create/internal-sales-order-create-attachments/internal-sales-order-create-attachments.component';
//import { InternalSalesOrderCreateContraComponent } from './internal-sales-order-create/internal-sales-order-create-contra/internal-sales-order-create-contra.component';
//import { InternalSalesOrderCreateDeliveryDetailsComponent } from './internal-sales-order-create/internal-sales-order-create-delivery-details/internal-sales-order-create-delivery-details.component';
//import { InternalSalesOrderCreateDepartmentComponent } from './internal-sales-order-create/internal-sales-order-create-department/internal-sales-order-create-department.component';
//import { InternalSalesOrderCreateLineItemsComponent } from './internal-sales-order-create/internal-sales-order-create-line-items/internal-sales-order-create-line-items.component';
//import { InternalSalesOrderCreateMainComponent } from './internal-sales-order-create/internal-sales-order-create-main/internal-sales-order-create-main.component';
//import { InternalSalesOrderCreateSettlementComponent } from './internal-sales-order-create/internal-sales-order-create-settlement/internal-sales-order-create-settlement.component';
//import { InternalSalesOrderCreateComponent } from './internal-sales-order-create/internal-sales-proforma-invoice-create.component';
import { EditIssueActivityComponent } from './internal-sales-order-edit-issue/edit-issue-activity/edit-issue-activity.component';
import { EditIssueAttachmentComponent } from './internal-sales-order-edit-issue/edit-issue-attachment/edit-issue-attachment.component';
import { EditIssueCommentComponent } from './internal-sales-order-edit-issue/edit-issue-comment/edit-issue-comment.component';
import { EditIssueDetailsComponent } from './internal-sales-order-edit-issue/edit-issue-details/edit-issue-details.component';
import { EditIssueLinkedIssuesComponent } from './internal-sales-order-edit-issue/edit-issue-linked-issues/edit-issue-linked-issues.component';
import { EditIssueMainDetailsComponent } from './internal-sales-order-edit-issue/edit-issue-main-details/edit-issue-main-details.component';
import { EditIssueSubstasksComponent } from './internal-sales-order-edit-issue/edit-issue-substasks/edit-issue-substasks.component';
import { EditIssueWorklogComponent } from './internal-sales-order-edit-issue/edit-issue-worklog/edit-issue-worklog.component';
import { InternalSalesProformaInvoiceEditIssueComponent } from './internal-sales-order-edit-issue/internal-sales-proforma-invoice-edit-issue.component';
import { InternalSalesProformaInvoiceEditDeliveryDetailsComponent } from './internal-sales-proforma-edit-line-item/internal-sales-proforma-invoice-edit-delivery-details/internal-sales-proforma-invoice-edit-delivery-details.component';
import { InternalSalesProformaInvoiceEditDeliveryInstructions } from './internal-sales-proforma-edit-line-item/internal-sales-proforma-invoice-edit-delivery-instructions/internal-sales-proforma-invoice-edit-delivery-instructions.component';
import { InternalSalesProformaInvoiceEditLineItemDepartmentComponent } from './internal-sales-proforma-edit-line-item/internal-sales-proforma-invoice-edit-line-item-department/internal-sales-proforma-invoice-edit-line-item-department.component';
import {  InternalSalesProformaInvoiceEditLineItemMainComponent } from './internal-sales-proforma-edit-line-item/internal-sales-proforma-invoice-edit-line-item-main/internal-sales-proforma-invoice-edit-line-item-main.component';
import {  InternalSalesProformaInvoiceEditLineItemComponent } from './internal-sales-proforma-edit-line-item/internal-sales-proforma-invoice-edit-line-item.component';
//import { InternalSalesOrderEditRelatedDocumentsComponent } from './internal-sales-proforma-invoice-edit-line-item/internal-sales-proforma-invoice-edit-related-documents/internal-sales-proforma-invoice-edit-related-documents.component';
//import { InternalSalesProformaListingComponent } from./internal-sales-proforma-invoice-listing/internal-sales-order-listing.componentnt';
import { InternalSalesProformaInvoiceSelectBillingAddressComponent } from './internal-sales-proforma-invoice-select-billing-address/internal-sales-proforma-invoice-select-billing-address.component';
//import { InternalSalesProformaInvoiceSelectCustomerComponen./internal-sales-proforma-invoice-select-customer/internal-sales-proforma-invoice-select-customer.component.component';
//import { InternalSalesOrderSelectShippingAddressComponent } from './internal-sales-order-select-shipping-address/internal-sales-order-select-shipping-address.component';
//import { InternalSalesProformaInvoiceViewConvertComponent } from './internal-sales-order-view/internal-sales-proforma-invoice-view-convert/internal-sales-proforma-invoice-view-convert.component';
//import { InternalSalesProformaInvoiceViewExportComponent } from './internal-sales-proforma-invoice-view/internal-sales-proforma-invoice-view-export/internal-sales-proforma-invoice-view-export.component';
import { InternalSalesProformaInvoiceViewComponent } from './internal-sales-proforma-invoice-view/internal-sales-proforma-invoice-view.component';
//import { InternalSalesProformaListingComponent } from './internal-sales-proforma-invoice-listing/internal-sales-proforma-invoice-listing.component';
import { InternalSalesProformaInvoiceViewExportComponent } from './internal-sales-proforma-invoice-view/internal-sales-proforma-invoice-view-export/internal-sales-proforma-invoice-view-export.component';
import { InternalSalesProformaInvoiceViewConvertComponent } from './internal-sales-proforma-invoice-view/internal-sales-proforma-invoice-view-convert/internal-sales-proforma-invoice-view-convert.component';
import { InternalSalesProformaInvoiceSelectShippingAddressComponent } from './internal-sales-proforma-invoice-select-shipping-address/internal-sales-proforma-invoice-select-shipping-address.component';
import { InternalSalesProformaInvoiceSelectCustomerComponent } from './internal-sales-proforma-invoice-select-customer/internal-sales-proforma-invoice-select-customer.component';
import { InternalSalesProformaInvoiceEditRelatedDocumentsComponent } from './internal-sales-proforma-edit-line-item/internal-sales-proforma-invoice-edit-related-documents/internal-sales-proforma-invoice-edit-related-documents.component';
//import { InternalSalesProformaInvoiceAddLineItemMainComponent } from './internal-sales-order-add-line-item/add-line-item-item-details/internal-sales-proforma-invoice-add-line-item-main/internal-sales-proforma-invoice-add-line-item-main.component';
//import { InternalSalesProformaInvoiceCreateLineItemComponent } from './internal-sales-order-create-line-item/internal-sales-proforma-invoice-create-line-item.component';
//import { InternalSalesOrderAddLineItemComponent } from 'projects/wavelet-erp/applets/internal-payment-voucher-applet/src/app/components/internal-payment-voucher-container/internal-payment-voucher-add-line-item/internal-payment-voucher-add-line-item.component';
//import { InternalSalesOrderAddLineItemOptionalComponent } from 'projects/wavelet-erp/applets/internal-payment-voucher-applet/src/app/components/internal-payment-voucher-container/internal-payment-voucher-add-line-item/internal-sales-order-add-line-item-optional/internal-sales-order-add-line-item-optional.component';
//import { InternalSalesOrderCreateContraComponent } from 'projects/wavelet-erp/applets/internal-payment-voucher-applet/src/app/components/internal-payment-voucher-container/internal-payment-voucher-create/internal-payment-voucher-create-contra/internal-payment-voucher-create-contra.component';
//import { InternalSalesOrderCreateDeliveryDetailsComponent } from 'projects/wavelet-erp/applets/internal-payment-voucher-applet/src/app/components/internal-payment-voucher-container/internal-payment-voucher-create/internal-payment-voucher-create-delivery-details/internal-payment-voucher-create-delivery-details.component';
//import { InternalSalesOrderCreateDepartmentComponent } from 'projects/wavelet-erp/applets/internal-payment-voucher-applet/src/app/components/internal-payment-voucher-container/internal-payment-voucher-create/internal-payment-voucher-create-department/internal-payment-voucher-create-department.component';
//import { InternalSalesOrderCreateSettlementComponent } from 'projects/wavelet-erp/applets/internal-payment-voucher-applet/src/app/components/internal-payment-voucher-container/internal-payment-voucher-create/internal-payment-voucher-create-settlement/internal-payment-voucher-create-settlement.component';
//import { InternalSalesProformaInvoiceCreateAccountComponent } from './internal-sales-order-create/internal-sales-order-create-account/internal-sales-proforma-invoice-create-account.component';
//import { InternalSalesProformaInvoiceCreateLineItemsComponent } from './internal-sales-order-create/internal-sales-proforma-invoice-create-line-items/internal-sales-proforma-invoice-create-line-items.component';
//import { InternalSalesProformaInvoiceCreateMainComponent } from './internal-sales-order-create/internal-sales-proforma-invoice-create-main/internal-sales-proforma-invoice-create-main.component';
//import { InternalSalesProformaInvoiceCreateComponent } from './internal-sales-order-create/internal-sales-proforma-invoice-create.component';
import { InternalSalesProformaInvoiceListingComponent } from './internal-sales-proforma-invoice-listing/internal-sales-proforma-invoice-listing.component';
import { InternalSalesProformaInvoiceAddSettlementComponent } from './internal-sales-proforma-invoice-add-settlement/internal-sales-proforma-invoice-add-settlement.component';
//import { InternalSalesProformaInvoiceCreateAttachmentsComponent } from './internal-sales-order-create/internal-sales-proforma-invoice-create-attachments/internal-sales-proforma-invoice-create-attachments.component';
import { InternalSalesProformaInvoiceAddRelatedDocumentsComponent } from './internal-sales-proforma-invoice-add-related-documents/internal-sales-proforma-invoice-add-related-documents.component';
import { InternalSalesProformaInvoiceCreateLineItemComponent } from './internal-sales-create-line-item/internal-sales-proforma-invoice-create-line-item.component';
//import { AddLineItemItemDetailsComponent } from './internal-sales-prof-add-line-item/add-line-item-item-details/add-line-item-item-details.component';
//import { InternalSalesProformaInvoiceAddLineItemMainComponent } from './internal-sales-prof-add-line-item/add-line-item-item-details/internal-sales-proforma-invoice-add-line-item-main/internal-sales-proforma-invoice-add-line-item-main.component';
//import { AddLineItemSerialNumberComponent } from './internal-sales-prof-add-line-item/add-line-item-serial-number/add-line-item-serial-number.component';
import { AccountBillingAddressComponent } from './internal-sales-proforma-create/internal-sales-order-create-account/account-billing-address/account-billing-address.component';
import { AccountEntityDetailsComponent } from './internal-sales-proforma-create/internal-sales-order-create-account/account-entity-details/account-entity-details.component';
import { AccountShippingAddressComponent } from './internal-sales-proforma-create/internal-sales-order-create-account/account-shipping-address/account-shipping-address.component';
import { InternalSalesProformaInvoiceCreateAccountComponent } from './internal-sales-proforma-create/internal-sales-order-create-account/internal-sales-proforma-invoice-create-account.component';
import { InternalSalesProformaInvoiceCreateLineItemsComponent } from './internal-sales-proforma-create/internal-sales-proforma-invoice-create-line-items/internal-sales-proforma-invoice-create-line-items.component';
import { InternalSalesProformaInvoiceCreateMainComponent } from './internal-sales-proforma-create/internal-sales-proforma-invoice-create-main/internal-sales-proforma-invoice-create-main.component';
import { InternalSalesProformaInvoiceCreateComponent } from './internal-sales-proforma-create/internal-sales-proforma-invoice-create.component';
import { InternalSalesProformaInvoiceContainerComponent } from './internal-sales-proforma-invoice-container.component';
import { InternalSalesProformaInvoiceAddLineItemComponent } from './internal-sales-prof-add-line-item/internal-sales-proforma-invoice-add-line-item.component';
import { InternalSalesProformaInvoiceCreateDepartmentComponent } from './internal-sales-proforma-create/internal-sales-proforma-invoice-create-department/internal-sales-proforma-invoice-create-department.component';
import { InternalSalesProformaInvoiceCreateSettlementComponent} from './internal-sales-proforma-create/internal-sales-proforma-invoice-create-settlement/internal-sales-proforma-invoice-create-settlement.component';
import {InternalSalesProformaInvoiceCreateAttachmentsComponent} from './internal-sales-proforma-create/internal-sales-proforma-invoice-create-attachments/internal-sales-proforma-invoice-create-attachments.component';
import { InternalSalesProformaInvoiceCreateDeliveryDetailsComponent } from "./internal-sales-proforma-create/internal-sales-proforma-invoice-create-delivery-details/internal-sales-proforma-invoice-create-delivery-details.component";
import { InternalSalesProformaInvoiceCreateContraComponent } from "./internal-sales-proforma-create/internal-sales-proforma-invoice-create-contra/internal-sales-proforma-invoice-create-contra.component";
import { AddLineItemPricingDetailsComponent} from './internal-sales-prof-add-line-item/add-line-item-pricing-details/add-line-item-pricing-details.component'

const CUSTOM_DATE_FORMATS: NgxMatDateFormats  = {
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
    InternalSalesProformaInvoiceContainerComponent,
    InternalSalesProformaInvoiceListingComponent,
    InternalSalesProformaInvoiceViewComponent,
    InternalSalesProformaInvoiceCreateComponent,
    InternalSalesProformaInvoiceCreateMainComponent,
    InternalSalesProformaInvoiceCreateAccountComponent,
    InternalSalesProformaInvoiceCreateLineItemsComponent,
    InternalSalesProformaInvoiceCreateLineItemComponent,
    InternalSalesProformaInvoiceSelectShippingAddressComponent,
    InternalSalesProformaInvoiceSelectCustomerComponent,
    InternalSalesProformaInvoiceSelectBillingAddressComponent,
    AccountEntityDetailsComponent,
    AccountBillingAddressComponent,
    AccountShippingAddressComponent,
    InternalSalesProformaInvoiceAddLineItemComponent,
    InternalSalesProformaInvoiceAddSettlementComponent,
    InternalSalesProformaInvoiceAddLineItemMainComponent,
    InternalSalesProformaInvoiceCreateDepartmentComponent,
    InternalSalesProformaInvoiceCreateSettlementComponent,
    InternalSalesProformaInvoiceEditLineItemComponent,
    InternalSalesProformaInvoiceEditDeliveryInstructions,
    InternalSalesProformaInvoiceEditLineItemDepartmentComponent,
    InternalSalesProformaInvoiceEditLineItemMainComponent,
    InternalSalesProformaInvoiceEditRelatedDocumentsComponent,
    InternalSalesProformaInvoiceEditDeliveryDetailsComponent,
    InternalSalesProformaInvoiceAddLineItemOptionalComponent,
    InternalSalesProformaInvoiceCreateDeliveryDetailsComponent,
    InternalSalesProformaInvoiceCreateContraComponent,
    InternalSalesProformaInvoiceAddRelatedDocumentsComponent,
    InternalSalesProformaInvoiceAddContraComponent,
    InternalSalesProformaInvoiceAddAttachmentsComponent,
    InternalSalesProformaInvoiceCreateAttachmentsComponent,
    SlideRendererComponent,
    InternalSalesProformaInvoiceViewExportComponent,
    InternalSalesProformaInvoiceViewConvertComponent,
    LineSearchItemComponent,
    LineJobsheetItemComponent,
    LineQuotationItemComponent,
    LinePreviousSalesOrderComponent,
    AddLineItemItemDetailsComponent,
    AddLineItemSerialNumberComponent,
    AddLineItemCostingDetailsComponent,
    AddLineItemPricingDetailsComponent,
    AddLineItemIssueLinkComponent,
    SerialNumberScanComponent,
    SerialNumberImportComponent,
    InternalSalesProformaInvoiceEditIssueComponent,
    EditIssueDetailsComponent,
    EditIssueAttachmentComponent,
    EditIssueCommentComponent,
    EditIssueSubstasksComponent,
    EditIssueLinkedIssuesComponent,
    EditIssueWorklogComponent,
    EditIssueActivityComponent,
    EditIssueMainDetailsComponent
  ],
  imports: [
    CommonModule,
    UtilitiesModule,
    DropDownModule,
    AgGridModule.withComponents([SlideRendererComponent]),
    StoreModule.forFeature(internalSalesOrderFeatureKey, reducers.salesOrder),
    EffectsModule.forFeature([InternalSalesProformaInvoiceEffects]),
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule
  ],
  providers: [
    {
      provide: NgxMatDateAdapter,
      useClass: CustomNgxDatetimeAdapter,
      deps: [MAT_DATE_LOCALE, NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
  ]
})
export class InternalSalesProformaInvoiceModule { }
