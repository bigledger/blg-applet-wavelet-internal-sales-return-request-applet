export enum CustomerConstants {
  appletMainRouter = 'applets/wavelet/erp/entity/customer',
  sessionStorageTenantCodeKey = 'tenantCode',

  TENANT_CODE = 'tnt_hassan_code',

  LOGIN_SUBJECT_GUID = 'LOGIN_SUBJECT_GUID',
  DateFormat = 'YYYY-MM-DD',
  DateTimeFormat = 'YYYY-MM-DD HH:mm:ss',

  ADDRESS = 'ADDRESS',
  CURRENCY = 'CURRENCY',
  CONTACT_INFO = 'CONTACT_INFO',

  CONTACT = 'CONTACT',
  BRANCH = 'BRANCH',

  CUSTOMER_EXT = 'CUSTOMER_EXT',
  CUSTOMER_EDIT = 'CUSTOMER_EDIT',

  // param codes for the customer ext
  GLCODE_INFO = 'GLCODE_INFO',
  ID_NO = 'ID_NO',
  CREDIT_LIMIT_TERMS = 'CREDIT_LIMIT_TERMS',
  TAX_REG_NO = 'TAX_REG_NO',
  GENDER = 'GENDER',
  AKN_ETY_CTG = 'AKN_ETY_CTG',
  SHIPPING_ADDRESS = 'SHIPPING_ADDRESS',
  BILLING_ADDRESS = 'BILLING_ADDRESS',
  MAIN_ADDRESS = 'MAIN_ADDRESS',
  WEBSITE_URL = 'WEBSITE URL',
  REMARKS = 'REMARKS',
  PAYMENT_CONFIG = 'PAYMENT_CONFIG',
  CONTACT_DETAILS = 'CONTACT_DETAILS',
  TAX_DETAILS = 'TAX_DETAILS',
  CREDIT_TERMS = 'CREDIT_TERMS',
  CREDIT_LIMITS = 'CREDIT_LIMITS',
  LIST_CATEGORY_GUID = 'LIST_CATEGORY_GUID'
}

export const STATUS = [
  'ACTIVE',
  'INACTIVE'
];
export const IMPORTTYPES = [
  'DOC_CUSTOMER',
];
export const CURRENCY = [
  'ACTIVE',
  'INACTIVE'
];

export const ENTITY_TYPE = [
  'CORPORATE',
  'INDIVIDUAL'
];
export const ENTITY = [
  'CUSTOMER',
  'SUPPLIER',
  'EMPLOYEE',
  'MERCHANT'
];

export class SettlementTypeOptions {
  public static values: Option[] = [
    { value: 'BANK_TRANSFER', viewValue: 'Bank Transfer' },
    { value: 'CASH', viewValue: 'Cash' },
    { value: 'CHEQUE', viewValue: 'Cheque' },
    { value: 'CREDIT_CARD', viewValue: 'Credit Card' },
    { value: 'E_WALLET', viewValue: 'e-Wallet' },
    { value: 'FPX_EMANDATE', viewValue: 'FPX e-Mandate' },
    { value: 'PAYMENT_GATEWAY', viewValue: 'Payment Gateway' },
    { value: 'MEMBERSHIP_POINT_CURRENCY', viewValue: 'Membership Point Currency' },
    { value: 'OPEN_CREDIT', viewValue: 'Open Credit' },
    { value: 'OTHERS', viewValue: 'Others' },
    { value: 'VOUCHER', viewValue: 'Voucher' }
  ];
}

interface Option {
  value: string;
  viewValue: string;
}
