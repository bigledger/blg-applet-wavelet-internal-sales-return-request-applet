import { FormGroup } from "@angular/forms";
import { LabelContainerModel, LabelListContainerModel } from "blg-akaun-ts-lib";

import * as moment from "moment";
import { CustomerConstants } from "./customer-constants";



export class CustomerViewModel {
  guid: string;
  code: string;
  name: string;
  txn_type: string;
  status: string;
  date_created: string;
  date_updated: string;
  currency: string;
  level_value: string;
  descr: string;
}

export class CustomerAddressViewModel {
  addressType: {
    name: string;
    currentCountry: string;
    address_line_1: string;
    address_line_2: string;
    address_line_3: string;
    address_line_4: string;
    address_line_5: string;
    country: string;
    state: string;
    city: string;
    postal_code: string;
  };
}

export function containerToViewModelCat(data: LabelContainerModel): CustomerViewModel {
  var hdr = data.bl_fi_mst_label_hdr;
  var create_date = moment(hdr.date_created).format(CustomerConstants.DateTimeFormat)
  var updated_date = moment(hdr.date_updated).format(CustomerConstants.DateTimeFormat)
  return {
    guid: hdr.guid,
    txn_type: hdr.txn_type,
    code: hdr.code,
    name: hdr.name,
    descr: hdr.descr,
    level_value: hdr.level_value,
    date_created: create_date,
    date_updated: updated_date,
    status: hdr.status,
  } as CustomerViewModel;
}

