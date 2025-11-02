export interface Companies {
  code: string;
  data: Data[];
  message: string;
}

export interface getCurrency {
  country: string;
  currency_code: string;
}

export interface PostCompany {
  code: string;
  data: string;
  message: string;
}

export interface Data {
  appMessageEventTable: string;
  totalRecords: string;
  guid: string,
  entityHdrGuid: string;
  code: string;
  name: string;
  abbreviation: string;
  description: string;
  taxRegistrationNum: string;
  currency: string;
  registrationNum: string;
  status: string;
  customFieldDtoList: any[];
}

export interface Phonecodes {
  countries: Phonecode
}

export interface Phonecode {
  code: string;
  name: string;
}

export interface Company {
  bl_fi_mst_comp: {
    guid: string;
    code: any;
    name: any;
    abbreviation: any;
    descr: any;
    tax_registration_id: any;
    comp_registration_num: any;
    ccy_code: any;
    property_json: any;
    entity_hdr_guid: any;
    log_json: any;
    status: any;
    revision: any;
    vrsn: any;
  },
  bl_fi_mst_comp_ext: Array<companyext>
}

export interface CompanyCustomDTO {
  appMessageEventTable: string;
  totalRecords: string;
  lineGUID: string;
  extType: string;
  extCode: string;
  paramCode: string;
  paramName: string;
  paramType: string;
  valueString: string;
  valueNumeric: string;
  valueDate: string;
  valueFile: string;
  valueJson: any;
  propertyJson: any;
  paramOptionJson: any;
  createDate: string;
  updatedDate: string;
}

export interface companyext {
  guid: string;
  comp_hdr_guid: any;
  comp_line_guid: any;
  ext_type: any;
  ext_code: any;
  ext_option: any;
  property_json: any;
  param_code: any;
  param_name: any;
  param_type: any;
  param_option_json: any;
  value_string: any;
  value_file: any;
  value_numeric: any;
  value_datetime: any;
  value_json: any;
  created_date: any;
  updated_date: any;
}
