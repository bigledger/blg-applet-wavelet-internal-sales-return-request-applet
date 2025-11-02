export enum CustomerConstants {
  appletMainRouter = 'applets/wavelet/erp/entity/customer',
  sessionStorageTenantCodeKey = 'tenantCode',

  TENANT_CODE = 'tnt_hassan_code',

  LOGIN_SUBJECT_GUID = 'LOGIN_SUBJECT_GUID',
  DateFormat = 'YYYY-MM-DD',
  DateTimeFormat = 'YYYY-MM-DD HH:mm:ss',

  ADDRESS = 'ADDRESS',
  CONTACT_INFO = 'CONTACT_INFO',

  CUSTOMER_EXT = 'CUSTOMER_EXT',
  CUSTOMER_EDIT = 'CUSTOMER_EDIT',

  // param codes for the customer ext
  GLCODE_INFO = 'GLCODE_INFO',
  ID_NO = 'ID_NO',
  CREDIT_LIMIT_TERMS = 'CREDIT_LIMIT_TERMS',
  TAX_REG_NO = 'TAX_REG_NO',
  CUSTOMER_CODE = 'CUSTOMER_CODE',
  AKN_ETY_CTG = 'AKN_ETY_CTG',
  SHIPPING_ADDRESS = 'SHIPPING ADDRESS',
  BILLING_ADDRESS = 'BILLING ADDRESS',
  WEBSITE_URL = 'WEBSITE URL',
  CUSTOMER_REMARK = 'CUSTOMER REMARK',
  PAYMENT_CONFIG = 'PAYMENT_CONFIG',
  CONTACT_DETAILS = 'CONTACT_DETAILS',
  TAX_DETAILS = 'TAX_DETAILS',
}

export const STATUS = [
  'ACTIVE',
  'INACTIVE'
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
