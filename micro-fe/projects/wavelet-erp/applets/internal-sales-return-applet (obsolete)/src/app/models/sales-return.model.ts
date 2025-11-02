export interface SIMain {
  branch: string;
  location: string;
  salesAgent: string;
  // creditLimit: string;
  transactionDate: Date;
  creditTerms: string;
  reference: string;
  remarks: string;
  permitNo: string;
  crmContact: string;
  currency: string;
  salesLead: string;
  trackingID: string;
}

export interface SIDepartment {
  segment: string;
  dimension: string;
  profitCenter: string;
  project: string;
}

export interface SIPosting {
  journalStatus: string;
  inventoryStatus: string;
  membershipStatus: string;
  cashbookStatus: string;
  taxStatus: string;
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
  postcode: string
}