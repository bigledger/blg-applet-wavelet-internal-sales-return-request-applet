export interface InternalJSMain {
  branch: string;
  location: string;
  reference: string;
  creditTerms: string;
  creditLimit: string;
  transactionDate: Date;
  salesAgent: string;
  currency: string;
  groupDiscount: string;
  groupDiscountAmount: any;
  salesLead: string;
  shipVia: string;
  trackingID: string;
  remarks: string;
  memberCard: string;
  crmContact: string;
  permitNo: string;
}

export interface InternalJSDepartment {
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

export interface ShippingInfo {
  name: string;
  email: string;
  phoneNo: number;
}
