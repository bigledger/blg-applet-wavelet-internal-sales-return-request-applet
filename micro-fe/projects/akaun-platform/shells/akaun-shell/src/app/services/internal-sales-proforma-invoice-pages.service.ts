import { Injectable } from '@angular/core';
//import { InternalSalesProformaInvoiceCreateLineItemComponent } from '../components/internal-sales-proforma-invoice-container/internal-sales-order-create-line-item/internal-sales-proforma-invoice-create-line-item.component';
//import { InternalSalesCreateComponent } from '../components/internal-sales-order-container/internal-sales-order-create/internal-sales-proforma-invoice-create.component';
//import { InternalSalesProformaListingComponent } from '../components/internal-sales-order-container/internal-sales-proforma-invoice-listing/internal-sales-proforma-invoice-listing.component';
//import { InternalSalesProformaInvoiceSelectShippingAddressComponent } from '../components/internal-sales-order-container/internal-sales-proforma-invoice-select-shipping-address/internal-sales-proforma-invoice-select-shipping-address.component';
import { InternalSalesProformaInvoiceSelectCustomerComponent } from '../components/internal-sales-proforma-invoice-container/internal-sales-proforma-invoice-select-customer/internal-sales-proforma-invoice-select-customer.component';
import { InternalSalesProformaInvoiceViewComponent } from '../components/internal-sales-proforma-invoice-container/internal-sales-proforma-invoice-view/internal-sales-proforma-invoice-view.component';
import { InternalSalesProformaInvoiceSelectBillingAddressComponent } from '../components/internal-sales-proforma-invoice-container/internal-sales-proforma-invoice-select-billing-address/internal-sales-proforma-invoice-select-billing-address.component';
//import { InternalSalesOrderAddLineItemComponent } from '../components/internal-sales-order-container/internal-sales-order-add-line-item/internal-sales-proforma-invoice-add-line-item.component';
//import { InternalSalesOrderAddSettlementComponent } from '../components/internal-sales-order-container/internal-sales-proforma-invoice-add-settlement/internal-sales-proforma-invoice-add-settlement.component';
import {  InternalSalesProformaInvoiceEditLineItemComponent } from '../components/internal-sales-proforma-invoice-container/internal-sales-proforma-edit-line-item/internal-sales-proforma-invoice-edit-line-item.component';
//import { InternalSalesOrderAddRelatedDocumentsComponent } from '../components/internal-sales-order-container/internal-sales-order-add-related-documents/internal-sales-proforma-invoice-add-related-documents.component';
import { InternalSalesProformaInvoiceAddContraComponent } from '../components/internal-sales-proforma-invoice-container/internal-sales-proforma-invoice-add-contra/internal-sales-proforma-invoice-add-contra.component';
import { InternalSalesProformaInvoiceAddAttachmentsComponent } from '../components/internal-sales-proforma-invoice-container/internal-sales-proforma-invoice-add-attachments/internal-sales-proforma-invoice-add-attachments.component';
import { ViewColumnState } from 'projects/shared-utilities/application-controller/store/states/view-col.states';
import { ViewColumn } from 'projects/shared-utilities/view-column';
import { InternalSalesProformaInvoiceEditIssueComponent } from '../components/internal-sales-proforma-invoice-container/internal-sales-order-edit-issue/internal-sales-proforma-invoice-edit-issue.component';
import { InternalSalesProformaInvoiceSelectShippingAddressComponent } from '../components/internal-sales-proforma-invoice-container/internal-sales-proforma-invoice-select-shipping-address/internal-sales-proforma-invoice-select-shipping-address.component';
import { InternalSalesProformaInvoiceListingComponent } from '../components/internal-sales-proforma-invoice-container/internal-sales-proforma-invoice-listing/internal-sales-proforma-invoice-listing.component';
//import { InternalSalesProformaInvoiceCreateComponent } from '../components/internal-sales-proforma-invoice-container/internal-sales-order-create/internal-sales-proforma-invoice-create.component';
import { InternalSalesProformaInvoiceAddLineItemComponent } from '../components/internal-sales-proforma-invoice-container/internal-sales-prof-add-line-item/internal-sales-proforma-invoice-add-line-item.component';
import { InternalSalesProformaInvoiceAddSettlementComponent } from '../components/internal-sales-proforma-invoice-container/internal-sales-proforma-invoice-add-settlement/internal-sales-proforma-invoice-add-settlement.component';
import { InternalSalesProformaInvoiceAddRelatedDocumentsComponent } from '../components/internal-sales-proforma-invoice-container/internal-sales-proforma-invoice-add-related-documents/internal-sales-proforma-invoice-add-related-documents.component';
import { InternalSalesProformaInvoiceCreateComponent } from '../components/internal-sales-proforma-invoice-container/internal-sales-proforma-create/internal-sales-proforma-invoice-create.component';
import { InternalSalesProformaInvoiceCreateLineItemComponent } from '../components/internal-sales-proforma-invoice-container/internal-sales-create-line-item/internal-sales-proforma-invoice-create-line-item.component';

@Injectable()
export class InternalSalesOrderPagesService {

  // TODO: thinking of using a hashmap and need to get rid of adding index manually into pages component
  private initialState: ViewColumnState = {
    firstColumn:  new ViewColumn(0, InternalSalesProformaInvoiceListingComponent, 'Internal Sales Proforma Invoice Listing', {
      deactivateAdd: false,
      deactivateList: false,
      selectedRowIndex: null
    }),
    secondColumn: null,
    viewCol: [
      new ViewColumn(0, InternalSalesProformaInvoiceListingComponent, 'Internal Sales Proforma Invoice Listing', {
        deactivateAdd: false,
        deactivateList: false,
        selectedRowIndex: null,
      }),
      new ViewColumn(1, InternalSalesProformaInvoiceViewComponent, 'Internal Sales Proforma Invoice View', {
        deactivateAdd: false,
        deactivateReturn: false,
        deactivateCustomer: false,
        deactivateSalesAgent: false,
        deactivateShippingInfo: false,
        deactivateBillingInfo: false,
        deactivateLineItem: false,
        deactivateSettlement: false,
        deactivateAddContra: false,
        deactivateAddAttachments: false,
        selectedIndex: 0,
        childSelectedIndex: 0,
        selectedLineItemRowIndex: null,
        deleteConfirmation: false
      }),
      new ViewColumn(2, InternalSalesProformaInvoiceCreateComponent, 'Internal Sales Proforma Invoice Create', {
        deactivateAdd: false,
        deactivateReturn: false,
        deactivateCustomer: false,
        deactivateSalesAgent: false,
        deactivateShippingInfo: false,
        deactivateBillingInfo: false,
        deactivateLineItem: false,
        deactivateSettlement: false,
        deactivateAddContra: false,
        deactivateAddAttachments: false,
        selectedIndex: 0,
        childSelectedIndex: 0,
        selectedLineItemRowIndex: null
      }),
      new ViewColumn(3, InternalSalesProformaInvoiceCreateLineItemComponent, 'Select Line Item', {
        deactivateReturn: false,
        deactivateFIList: false,
        // deactivateSearchItemList: false,
        // deactivateJobsheetItemList: false,
        // deactivateQuotationItemList: false,
        // deactivatePreviousSOList: false,
        selectedIndex: 0
      }),
      new ViewColumn(4, InternalSalesProformaInvoiceSelectShippingAddressComponent, 'Select Shipping Address', {
        deactivateAdd: false,
        deactivateReturn: false,
        deactivateList: false
      }),
      new ViewColumn(5, InternalSalesProformaInvoiceSelectCustomerComponent, 'Select Customer', {
        deactivateAdd: false,
        deactivateReturn: false,
        deactivateList: false
      }),
      new ViewColumn(6, InternalSalesProformaInvoiceSelectBillingAddressComponent, 'Select Billing Address', {
        deactivateAdd: false,
        deactivateReturn: false,
        deactivateList: false
      }),
      new ViewColumn(7, InternalSalesProformaInvoiceAddLineItemComponent, 'Add Line Item', {
        deactivateReturn: false,
        selectedIndex: 0
      }),
      new ViewColumn(8, InternalSalesProformaInvoiceAddSettlementComponent, 'Add Settlement', {
        deactivateReturn: false
      }),
      new ViewColumn(9,  InternalSalesProformaInvoiceEditLineItemComponent, 'Edit Line Item', {
        deactivateReturn: false,
        selectedIndex: 0,
        deleteConfirmation: false,
        deactivateAddDoc: false,
        deliveryDetailsEdit: false
      }),
      new ViewColumn(10, InternalSalesProformaInvoiceAddRelatedDocumentsComponent, 'Add Related Documents', {
        deactivateReturn: false,
        deactivateList: false
      }),
      new ViewColumn(11, InternalSalesProformaInvoiceAddContraComponent, 'Add Contra', {
        deactivateReturn: false,
        deactivateList: false
      }),
      new ViewColumn(12, InternalSalesProformaInvoiceAddAttachmentsComponent, 'Add Attachments', {
        deactivateReturn: false
      }),
      new ViewColumn(13, InternalSalesProformaInvoiceEditIssueComponent, 'Add Attachments', {
        deactivateReturn: false
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
