import { Injectable } from '@angular/core';
import { InternalJobSheetCreateLineItemComponent } from '../components/internal-job-sheet-container/internal-job-sheet-create-line-item/internal-job-sheet-create-line-item.component';
import { InternalJobSheetCreateComponent } from '../components/internal-job-sheet-container/internal-job-sheet-create/internal-job-sheet-create.component';
import { InternalJobSheetListingComponent } from '../components/internal-job-sheet-container/internal-job-sheet-listing/internal-job-sheet-listing.component';
import { InternalJobSheetSelectShippingAddressComponent } from '../components/internal-job-sheet-container/internal-job-sheet-select-shipping-address/internal-job-sheet-select-shipping-address.component';
import { InternalJobSheetSelectCustomerComponent } from '../components/internal-job-sheet-container/internal-job-sheet-select-customer/internal-job-sheet-select-customer.component';
import { InternalJobSheetViewComponent } from '../components/internal-job-sheet-container/internal-job-sheet-view/internal-job-sheet-view.component';
import { InternalJobSheetSelectBillingAddressComponent } from '../components/internal-job-sheet-container/internal-job-sheet-select-billing-address/internal-job-sheet-select-billing-address.component';
import { InternalJobSheetAddLineItemComponent } from '../components/internal-job-sheet-container/internal-job-sheet-line-item/internal-job-sheet-add-line-item.component';
import { InternalJobSheetSelectSettlementComponent } from '../components/internal-job-sheet-container/internal-job-sheet-select-settlement/internal-job-sheet-select-settlement.component';
import { InternalJobSheetEditLineItemComponent } from '../components/internal-job-sheet-container/internal-job-sheet-edit-line-item/internal-job-sheet-edit-line-item.component';
import { InternalJobSheetAddRelatedDocumentsComponent } from '../components/internal-job-sheet-container/internal-job-sheet-add-related-documents/internal-job-sheet-add-related-documents.component';
import { InternalJobSheetAddContraComponent } from '../components/internal-job-sheet-container/internal-job-sheet-add-contra/internal-job-sheet-add-contra.component';
import { InternalJobSheetAddAttachmentsComponent } from '../components/internal-job-sheet-container/internal-job-sheet-add-attachments/internal-job-sheet-add-attachments.component';
import { ViewColumnState } from 'projects/shared-utilities/application-controller/store/states/view-col.states';
import { ViewColumn } from 'projects/shared-utilities/view-column';
import { LogTimeComponent } from '../components/internal-job-sheet-container/internal-job-sheet-edit-issue/edit-issue-worklogs//log-time/log-time.component';
import { InternalJobSheetEditIssueComponent } from '../components/internal-job-sheet-container/internal-job-sheet-edit-issue/internal-job-sheet-edit-issue.component';
import { EditPaymentComponent } from '../components/internal-job-sheet-container/edit-payment/edit-payment.component';
import { InternalJobSheetSelectContraComponent } from '../components/internal-job-sheet-container/internal-job-sheet-select-contra/internal-job-sheet-select-contra.component';
import { EditContraComponent } from '../components/internal-job-sheet-container/edit-contra/edit-contra.component';
@Injectable()
export class InternalJobSheetPagesService {

  private initialState: ViewColumnState = {
    firstColumn:  new ViewColumn(0, InternalJobSheetListingComponent, 'Internal Job Sheet Listing', {
      deactivateAdd: false,
      deactivateList: false
    }),
    secondColumn: null,
    viewCol: [
      new ViewColumn(0, InternalJobSheetListingComponent, 'Internal Job Sheet Listing', {
        deactivateAdd: false,
        deactivateList: false
      }),
      new ViewColumn(1, InternalJobSheetViewComponent, 'Internal Job Sheet View', {
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
      }),
      new ViewColumn(2, InternalJobSheetCreateComponent, 'Internal Job Sheet Create', {
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
      }),
      new ViewColumn(3, InternalJobSheetCreateLineItemComponent, 'Select Line Item', {
        deactivateReturn: false,
        deactivateFIList: false,
        // deactivateSearchItemList: false,
        // deactivateJobsheetItemList: false,
        // deactivateQuotationItemList: false,
        // deactivatePreviousSOList: false,
        selectedIndex: 0
      }),
      new ViewColumn(4, InternalJobSheetSelectShippingAddressComponent, 'Select Shipping Address', {
        deactivateAdd: false,
        deactivateReturn: false,
        deactivateList: false
      }),
      new ViewColumn(5, InternalJobSheetSelectCustomerComponent, 'Select Customer', {
        deactivateAdd: false,
        deactivateReturn: false,
        deactivateList: false
      }),
      new ViewColumn(6, InternalJobSheetSelectBillingAddressComponent, 'Select Billing Address', {
        deactivateAdd: false,
        deactivateReturn: false,
        deactivateList: false
      }),
      new ViewColumn(7, InternalJobSheetAddLineItemComponent, 'Add Line Item', {
        deactivateReturn: false,
        selectedIndex: 0
      }),
      new ViewColumn(8, InternalJobSheetSelectSettlementComponent, 'Add Payment', {
        deactivateReturn: false
      }),
      new ViewColumn(9, InternalJobSheetEditLineItemComponent, 'Edit Line Item', {
        deactivateReturn: false,
        selectedIndex: 0,
        deleteConfirmation: false,
        deactivateAddDoc: false,
        deliveryDetailsEdit: false
      }),
      new ViewColumn(10, InternalJobSheetAddRelatedDocumentsComponent, 'Add Related Documents', {
        deactivateReturn: false,
        deactivateList: false
      }),
      new ViewColumn(11, InternalJobSheetSelectContraComponent, 'Select Contra', {
        deactivateReturn: false,
        deactivateList: false
      }),
      new ViewColumn(12, InternalJobSheetAddAttachmentsComponent, 'Add Attachments', {
        deactivateReturn: false
      }),
      new ViewColumn(13, InternalJobSheetEditIssueComponent, 'Add Attachments', {
        deactivateReturn: false
      }),
      new ViewColumn(14, LogTimeComponent, 'Log Time', {
        deactivateReturn: false,
        deactivateAdd: false
      }),
      new ViewColumn(15, EditPaymentComponent, 'Edit Payment', {
        deactivateReturn: false,
        deleteConfirmation: false
      }),
      new ViewColumn(16, InternalJobSheetAddContraComponent, 'Add Contra', {
        deactivateReturn: false,
        deactivateList: false
      }),
      new ViewColumn(17, EditContraComponent, 'Edit Contra', {
        deactivateReturn: false
      }),

      // new ViewColumn(15, InternalSalesOrderViewContraDetailsComponent, 'Contra Details', {
      //   deactivateReturn: false
      // }),
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
