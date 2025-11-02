import { Injectable } from '@angular/core';
import { SalesReturnListingComponent } from '../components/sales-return-container/sales-return-listing/sales-return-listing.component';
import { SalesReturnCreateComponent } from '../components/sales-return-container/sales-return-create/sales-return-create.component';
import { SelectCustomerListingComponent } from '../components/sales-return-container/sales-return-create/account/account-entity-details/select-customer/select-customer-listing.component';
import { AddLineItemComponent } from '../components/sales-return-container/sales-return-create/add-line-item/add-line-item.component';
import { LineItemIssueLinkEditComponent } from '../components/sales-return-container/sales-return-create/add-line-item/issue-link/issue-link-edit/issue-link-edit.component';
import { IssueLinkEditLogTimeComponent } from '../components/sales-return-container/sales-return-create/add-line-item/issue-link/issue-link-edit/worklog/log-time/log-time.component';
import { ContraSelectDocumentComponent } from '../components/sales-return-container/sales-return-create/contra/select-document/contra-select-document.component';
import { AddContraComponent } from '../components/sales-return-container/sales-return-create/contra/add-contra/add-contra.component';
import { EditContraComponent } from '../components/sales-return-container/sales-return-edit/edit-contra/edit-contra.component';
import { SelectBillingAddressComponent } from '../components/sales-return-container/sales-return-create/account/account-billing-address/select-billing-address/select-billing-address-listing.component';
import { SelectShippingAddressComponent } from '../components/sales-return-container/sales-return-create/account/account-shipping-address/select-shipping-address/select-shipping-address-listing.component';
import { MainSelectSalesAgentListingComponent } from '../components/sales-return-container/sales-return-create/main-details/select-sales-agent/select-sales-agent-listing.component';
import { MainSelectMemberListingComponent } from '../components/sales-return-container/sales-return-create/main-details/select-member/select-member-listing.component';
import { AddPaymentComponent } from '../components/sales-return-container/sales-return-create/payment/add-payment/add-payment.component';
import { SalesReturnEditComponent } from '../components/sales-return-container/sales-return-edit/sales-return-edit.component';
import { EditLineItemComponent } from '../components/sales-return-container/sales-return-edit/edit-line-item/edit-line-item.component';
import { EditPaymentComponent } from '../components/sales-return-container/sales-return-edit/edit-payment/edit-payment.component';
import { LineItemCreateComponent } from '../components/sales-return-container/sales-return-create/line-item/line-item-create/line-item-create.component';
import { AddAttachmentsComponent } from '../components/sales-return-container/sales-return-edit/attachments/add-attachments/add-attachments.component';
import { ViewColumnState } from 'projects/shared-utilities/application-controller/store/states/view-col.states';
import { ViewColumn } from 'projects/shared-utilities/view-column';
import { LineItemBinNumberListingComponent } from '../components/sales-return-container/sales-return-create/add-line-item/bin-number/bin-number-listing/bin-number-listing.component';
import { LineItemBatchNumberListingComponent } from '../components/sales-return-container/sales-return-create/add-line-item/batch-number/batch-number-listing/batch-number-listing.component';

@Injectable()
export class SalesReturnPagesService {

  private initialState: ViewColumnState = {
    firstColumn:  new ViewColumn(0, SalesReturnListingComponent, 'Sales Return Listing', {
      deactivateAdd: false,
      deactivateList: false
    }),
    secondColumn: null,
    viewCol: [
      new ViewColumn(0, SalesReturnListingComponent, 'Sales Return Listing', {
        deactivateAdd: false,
        deactivateList: false
      }),
      new ViewColumn(1, SalesReturnCreateComponent, 'Sales Return Create', {
        deactivateReturn: false,
        deactivateAdd: false,
        deactivateList: false,
        selectedIndex: 0,
        accountSelectedIndex: 0
      }),
      new ViewColumn(2, SalesReturnEditComponent, 'Sales Return Edit', {
        deactivateReturn: false,
        deactivateAdd: false,
        deactivateList: false,
        selectedIndex: 0,
        accountSelectedIndex: 0
      }),   
      new ViewColumn(3, MainSelectSalesAgentListingComponent, 'Main Select Sales Agent Listing', {
        deactivateReturn: false,
      }),
      new ViewColumn(4, SelectCustomerListingComponent, 'Select Customer Listing', {
        deactivateReturn: false,
      }),
      new ViewColumn(5, SelectBillingAddressComponent, 'Select Billing Address', {
        deactivateReturn: false,
      }),
      new ViewColumn(6, SelectShippingAddressComponent, 'Select Shipping Address', {
        deactivateReturn: false,
      }),
      new ViewColumn(7, LineItemCreateComponent, 'Line Item Create', {
        deactivateReturn: false,
        deactivateAdd: false,
        selectedIndex: 0,
        SalesReturnEdit: false
      }),
      new ViewColumn(8, AddLineItemComponent, 'Add Line Item', {
        deactivateReturn: false,
        selectedIndex: 0,
        itemSelectedIndex: 0,
        serialSelectedIndex: 0,
      }),
      new ViewColumn(9, EditLineItemComponent, 'Edit Line Item', {
        deactivateReturn: false,
        selectedIndex: 0,
        itemSelectedIndex: 0,
        serialSelectedIndex: 0,
        deleteConfirmation: false
      }),
      new ViewColumn(10, AddPaymentComponent, 'Add Payment', {
        deactivateReturn: false,
      }),   
      new ViewColumn(11, EditPaymentComponent, 'Edit Payment', {
        deactivateReturn: false,
        deleteConfirmation: false
      }),
      new ViewColumn(12, LineItemIssueLinkEditComponent, 'Edit Issue', {
        deactivateReturn: false,
        deactivateList: false,
        selectedIndex: 0
      }),
      new ViewColumn(13, IssueLinkEditLogTimeComponent, 'Log Time', {
        deactivateReturn: false,
        deactivateAdd: false
      }),
      new ViewColumn(14, ContraSelectDocumentComponent, 'Contra Select Document', {
        deactivateReturn: false,
        deactivateAdd: false
      }),
      new ViewColumn(15, AddAttachmentsComponent, 'Add Attachments', {
        deactivateReturn: false,
      }),
      new ViewColumn(16, AddContraComponent, 'Add Contra', {
        deactivateReturn: false
      }),
      new ViewColumn(17, EditContraComponent, 'Edit Contra', {
        deactivateReturn: false
      }),
      new ViewColumn(18, MainSelectMemberListingComponent, 'Main Select Member Listing', {
        deactivateReturn: false,
      }),
      new ViewColumn(19, LineItemBinNumberListingComponent, 'Bin Number Listing', {
        deactivateReturn: false,
      }),
      new ViewColumn(20, LineItemBatchNumberListingComponent, 'Batch Number Listing', {
        deactivateReturn: false,
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
