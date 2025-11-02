export interface ISCNMain {
  company: string;
  branch: string;
  location: string;
  creditLimit: string;
  transactionDate: Date;
  creditTerms: string;
  reference: string;
  remarks: string;
  permitNo: string;
  crmContact: string;
  currency: string;
  salesLead: string;
  trackingID: string;
  salesAgent: string;
  memberCard: string;
  server_doc_type: string;
  server_doc_1: string;
  server_doc_2: string;
  server_doc_3: string;
  dueDate: Date;
  processGuid: string;
  processStatusGuid: string;
  resolutionGuid: string;
  deliveryBranch: string;
  deliveryLocation: string;
  deliveryBranchCode: string;
  deliveryLocationCode: string;
  reasonOfRepair: string;
  baseCurrency: string;
  currencyRate: number;
  forexSourceHdrGuid: string;
  forexSourceHistoryGuid: string;
}

export interface ISCNDepartment {
  segment: string;
  dimension: string;
  profitCenter: string;
  project: string;
}

export interface BillingInfo {
  name: string;
  email: string;
  phoneNo: number;
}

export interface BillingAddress {
  billingAddress: string,
  addressLine1: string,
  addressLine2: string,
  addressLine3: string,
  addressLine4: string,
  addressLine5: string,
  country: string,
  city: string,
  state: string,
  stateCode: string,
  postcode: string
}
export interface ShippingInfo {
  name: string;
  email: string;
  phoneNo: number;
}

export interface ShippingAddress {
  shippingAddress: string,
  addressLine1: string,
  addressLine2: string,
  addressLine3: string,
  addressLine4: string,
  addressLine5: string,
  country: string,
  city: string,
  state: string,
  stateCode: string,
  postcode: string
}