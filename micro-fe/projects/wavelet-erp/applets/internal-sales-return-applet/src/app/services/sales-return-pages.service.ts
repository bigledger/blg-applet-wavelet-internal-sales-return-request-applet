import { Injectable } from '@angular/core';
import { ViewColumnState } from 'projects/shared-utilities/application-controller/store/states/view-col.states';
import { ViewColumn } from 'projects/shared-utilities/view-column';
// import { EditLineItemComponent } from '../components/line-items-container/line-items-edit/edit-line-item.component';
import { SelectBillingAddressComponent } from '../components/sales-return-container/sales-return-create/account/account-billing-address/select-billing-address/select-billing-address.component';
import { CustomerCreateComponent } from '../components/sales-return-container/sales-return-create/account/account-entity-details/select-customer/customer-create/customer-create.component';
import { CreditLimitsEditComponent } from '../components/sales-return-container/sales-return-create/account/account-entity-details/select-customer/customer-edit/credit-limits-main/credit-limits-edit/credit-limits-edit.component';
import { CreditLimitsComponent } from '../components/sales-return-container/sales-return-create/account/account-entity-details/select-customer/customer-edit/credit-limits-main/credit-limits/credit-limits.component';
import { CreditTermsEditComponent } from '../components/sales-return-container/sales-return-create/account/account-entity-details/select-customer/customer-edit/credit-terms-main/credit-terms-edit/credit-terms-edit.component';
import { CreditTermsComponent } from '../components/sales-return-container/sales-return-create/account/account-entity-details/select-customer/customer-edit/credit-terms-main/credit-terms/credit-terms.component';
import { CreateAddressComponent } from '../components/sales-return-container/sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-address/address-create/customer-address-create.component';
import { EditAddressComponent } from '../components/sales-return-container/sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-address/address-edit/customer-address-edit.component';
import { CreateBranchComponent } from '../components/sales-return-container/sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-branch/branch-create/branch-create.component';
import { EditBranchComponent } from '../components/sales-return-container/sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-branch/branch-edit/branch-edit.component';
import { AddCategoryComponent } from '../components/sales-return-container/sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-category/category-add/category-add.component';
import { EditCategoryComponent } from '../components/sales-return-container/sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-category/category-edit/category-edit.component';
import { CreateContactComponent } from '../components/sales-return-container/sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-contact/contact-create/customer-contact-create.component';
import { EditContactComponent } from '../components/sales-return-container/sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-contact/contact-edit/customer-contact-edit.component';
import { CustomerEditComponent } from '../components/sales-return-container/sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-edit.component';
import { EditItemPricingComponent } from '../components/sales-return-container/sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-item-pricing/item-pricing-edit/item-pricing-edit.component';
import { CreateLoginComponent } from '../components/sales-return-container/sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-login/login-create/login-create.component';
import { EditLoginComponent } from '../components/sales-return-container/sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-login/login-edit/login-edit.component';
import { CreatePaymentConfigComponent } from '../components/sales-return-container/sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-payment-config/payment-config-create/payment-config-create.component';
import { EditPaymentConfigComponent } from '../components/sales-return-container/sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-payment-config/payment-config-edit/payment-config-edit.component';
import { CreateTaxComponent } from '../components/sales-return-container/sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-tax/tax-create/customer-tax-create.component';
import { EditTaxComponent } from '../components/sales-return-container/sales-return-create/account/account-entity-details/select-customer/customer-edit/customer-tax/tax-edit/customer-tax-edit.component';
import { SelectCustomerListingComponent } from '../components/sales-return-container/sales-return-create/account/account-entity-details/select-customer/select-customer.component';
import { SelectShippingAddressComponent } from '../components/sales-return-container/sales-return-create/account/account-shipping-address/select-shipping-address/select-shipping-address.component';
import { AddLineItemComponent } from '../components/sales-return-container/sales-return-create/add-line-item/add-line-item.component';
import { LineItemIssueLinkEditComponent } from '../components/sales-return-container/sales-return-create/add-line-item/issue-link/issue-link-edit/issue-link-edit.component';
import { IssueLinkEditLogTimeComponent } from '../components/sales-return-container/sales-return-create/add-line-item/issue-link/issue-link-edit/worklog/log-time/log-time.component';
import { AddContraComponent } from '../components/sales-return-container/sales-return-create/contra/add-contra/add-contra.component';
import { ContraSelectDocumentComponent } from '../components/sales-return-container/sales-return-create/contra/select-document/contra-select-document.component';
// import { SelectBillingAddressComponent } from '../components/sales-return-container/sales-return-create/account/account-billing-address/select-billing-address/select-billing-address.component';
// import { SelectCustomerListingComponent } from '../components/sales-return-container/sales-return-create/account/account-entity-details/select-customer/select-customer.component';
// import { SelectShippingAddressComponent } from '../components/sales-return-container/sales-return-create/account/account-shipping-address/select-shipping-address/select-shipping-address.component';
// import { AddLineItemComponent } from '../components/sales-return-container/sales-return-create/add-line-item/add-line-item.component';
// import { LineItemIssueLinkEditComponent } from '../components/sales-return-container/sales-return-create/add-line-item/issue-link/issue-link-edit/issue-link-edit.component';
import { LineItemCreateComponent } from '../components/sales-return-container/sales-return-create/line-item/line-item-create/line-item-create.component';
import { MainDetailsSelectMemberComponent } from '../components/sales-return-container/sales-return-create/main-details/select-member/select-member.component';
import { SalesReturnCreateComponent } from '../components/sales-return-container/sales-return-create/sales-return-create.component';
import { AddPaymentComponent } from '../components/sales-return-container/sales-return-create/payment/add-payment/add-payment.component';
import { AddAttachmentsComponent } from '../components/sales-return-container/sales-return-edit/attachments/add-attachments/add-attachments.component';
import { ViewAttachmentComponent } from '../components/sales-return-container/sales-return-edit/attachments/view-attachment/view-attachment.component';
import { EditContraComponent } from '../components/sales-return-container/sales-return-edit/edit-contra/edit-contra.component';
import { EditLineItemComponent } from '../components/sales-return-container/sales-return-edit/edit-line-item/edit-line-item.component';
import { KnockoffAddComponent } from '../components/sales-return-container/sales-return-edit/edit-line-item/knockoff-add/knockoff-add.component';
import { KnockoffEditComponent } from '../components/sales-return-container/sales-return-edit/edit-line-item/knockoff-edit/knockoff-edit.component';
import { EditPaymentComponent } from '../components/sales-return-container/sales-return-edit/edit-payment/edit-payment.component';
import { InternalSalesReturnEditComponent } from '../components/sales-return-container/sales-return-edit/sales-return-edit.component';
// import { SelectCustomerListingComponent } from '../components/sales-return-container/sales-return-create/account/account-entity-details/select-customer/select-customer.component';
// import { SelectShippingAddressComponent } from '../components/sales-return-container/sales-return-create/account/account-shipping-address/select-shipping-address/select-shipping-address.component';
// import { SalesReturnCreateComponent } from '../components/sales-return-container/sales-return-create/sales-return-create.component';
import { SalesReturnListingComponent } from '../components/sales-return-container/sales-return-listing/sales-return-listing.component';
import { CustomerInvoiceListingComponent } from '../components/sales-return-container/sales-return-create/search-invoices/search-by-customer/invoice-listing/invoice-listing.component';
import { CustomerInvoiceLineListingComponent } from '../components/sales-return-container/sales-return-create/search-invoices/search-by-customer/invoice-listing/invoice-line-listing/invoice-line-listing.component';
import { InvoiceLineListingComponent } from '../components/sales-return-container/sales-return-create/search-invoices/search-by-invoice/invoice-line-listing/invoice-line-listing.component';
import { MainDetailsSelectEinvoiceMainDocRefNoComponent } from '../components/sales-return-container/sales-return-edit/e-invoice/submission/select-einvoice-main-doc-ref-no/select-einvoice-main-doc-ref-no.component';
import {AddSettlementAdjustmentComponent} from '../components/sales-return-container/sales-return-edit/settlement-adjustment/add-settlement-adjustment/add-settlement-adjustment.component';
import {EditSettlementAdjustmentComponent} from '../components/sales-return-container/sales-return-edit/settlement-adjustment/edit-settlement-adjustment/edit-settlement-adjustment.component';

@Injectable()
export class SalesReturnPagesService {


  private initialState: ViewColumnState = {
    firstColumn: new ViewColumn(0, SalesReturnListingComponent, 'Internal Sales Return Listing', {
      deactivateAdd: false,
      deactivateList: false,
    }),
    secondColumn: null,
    viewCol: [
      new ViewColumn(0, SalesReturnListingComponent, 'Internal Sales Return Listing', {
        deactivateAdd: false,
        deactivateList: false,
      }),
      new ViewColumn(1, SalesReturnCreateComponent, 'Internal Sales Return Create', {
        deactivateReturn: false,
        deactivateAdd: false,
        deactivateList: false,
        selectedIndex: 0,
        accountSelectedIndex: 0
      }),
      new ViewColumn(2, InternalSalesReturnEditComponent, 'Internal Sales Return Edit', {
        deactivateReturn: false,
        deactivateAdd: false,
        deactivateList: false,
        selectedIndex: 0,
        accountSelectedIndex: 0,
        selectedSearchIndex: 0
      }),
      new ViewColumn(3, MainDetailsSelectMemberComponent, 'Select Member', {
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
        salesReturnOrderEdit: false
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
        deactivateAdd: false,
      }),
      new ViewColumn(15, AddContraComponent, 'Add Contra', {
        deactivateReturn: false
      }),
      new ViewColumn(16, EditContraComponent, 'Edit Contra', {
        deactivateReturn: false
      }),
      new ViewColumn(17, AddAttachmentsComponent, 'Add Attachments', {
      }),
      new ViewColumn(18, ViewAttachmentComponent, 'View Attachment', {
      }),
      new ViewColumn(19, KnockoffAddComponent, 'Add Knockoff', {
        deactivateReturn: false,
      }),
      new ViewColumn(20, KnockoffEditComponent, 'Edit Knockoff', {
        deactivateReturn: false,
      }),
      new ViewColumn(21, CustomerCreateComponent, 'Customer Create', {
        deactivateReturn: false,
        selectedIndex: 0,
      }),
      new ViewColumn(22, CustomerEditComponent, 'Customer Edit', {
        deactivateReturn: false,
        deactivateList: false,
        selectedIndex: 0,
        LimitIndex: 0,
      }),
      new ViewColumn(23, AddCategoryComponent, 'Entity Category Add', {
        deactivateReturn: false,
        selectedIndex: 0,
      }),
      new ViewColumn(24, EditCategoryComponent, 'Entity Category Edit', {
        deactivateReturn: false,
        selectedIndex: 0,
      }),
      new ViewColumn(25, CreateLoginComponent, 'Customer Login Create', {
        deactivateReturn: false,
        selectedIndex: 0,
      }),
      new ViewColumn(26, EditLoginComponent, 'Customer Login Edit', {
        deactivateReturn: false,
        selectedIndex: 0,
      }),
      new ViewColumn(27, CreatePaymentConfigComponent, 'Customer Payment Create', {
        deactivateReturn: false,
        selectedIndex: 0,
      }),
      new ViewColumn(28, EditPaymentConfigComponent, 'Customer Payment Edit', {
        deactivateReturn: false,
        selectedIndex: 0,
      }),
      new ViewColumn(29, CreateTaxComponent, 'Customer Tax Create', {
        deactivateReturn: false,
        selectedIndex: 0,
      }),
      new ViewColumn(30, EditTaxComponent, 'Customer Tax Edit', {
        deactivateReturn: false,
        selectedIndex: 0,
      }),
      new ViewColumn(31, CreateAddressComponent, 'Customer Address Create', {
        deactivateReturn: false,
        selectedIndex: 0,
      }),
      new ViewColumn(32, EditAddressComponent, 'Customer Address Edit', {
        deactivateReturn: false,
        selectedIndex: 0,
      }),
      new ViewColumn(33, CreateContactComponent, 'Customer Contact Create', {
        deactivateReturn: false,
        selectedIndex: 0,
      }),
      new ViewColumn(34, EditContactComponent, 'Customer Contact Edit', {
        deactivateReturn: false,
        selectedIndex: 0,
      }),
      new ViewColumn(35, CreateBranchComponent, 'Customer Branch Create', {
        deactivateReturn: false,
        selectedIndex: 0,
      }),
      new ViewColumn(36, EditBranchComponent, 'Customer Branch Edit', {
        deactivateReturn: false,
        selectedIndex: 0,
      }),
      new ViewColumn(37, EditItemPricingComponent, 'Entity Item Pricing Edit', {
        deactivateReturn: false,
        selectedIndex: 0,
        rowIndexList: null,
      }),
      new ViewColumn(38, CreditTermsComponent, 'Customer Credit Term Create', {
        deactivateReturn: false,
        selectedIndex: 0,
      }),
      new ViewColumn(39, CreditTermsEditComponent, 'Customer Credit Term Edit', {
        deactivateReturn: false,
        selectedIndex: 0,
      }),
      new ViewColumn(40, CreditLimitsComponent, 'Customer Credit Limit Create', {
        deactivateReturn: false,
        selectedIndex: 0,
      }),
      new ViewColumn(41, CreditLimitsEditComponent, 'Customer Credit Limit Edit', {
        deactivateReturn: false,
        selectedIndex: 0,
      }),
      new ViewColumn(42, CustomerInvoiceListingComponent, 'Customer Invoice Listing', {
        deactivateReturn: false,
        selectedIndex: 0,
      }),
      new ViewColumn(43, CustomerInvoiceLineListingComponent, 'Customer Invoice Line Listing', {
        deactivateReturn: false,
        selectedIndex: 0,
      }),
      new ViewColumn(44, InvoiceLineListingComponent, 'Invoice Line Listing', {
        deactivateReturn: false,
        selectedIndex: 0,
      }),
      new ViewColumn(45, MainDetailsSelectEinvoiceMainDocRefNoComponent, 'Select Einvoice Main Doc Ref No', {
          deactivateReturn: false,
        }),
      new ViewColumn(46, AddSettlementAdjustmentComponent, 'Add Payment Adjustment', {
        deactivateReturn: false,
      }),
      new ViewColumn(47, EditSettlementAdjustmentComponent, 'Edit Payment Adjustment', {
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
