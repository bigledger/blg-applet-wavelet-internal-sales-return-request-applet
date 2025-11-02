import { FormControl, FormGroup } from '@angular/forms';
import { SearchModel } from 'projects/shared-utilities/models/search-model';
import { STATUS, ENTITY_TYPE, CustomerConstants } from '../customer-constants';

export const customerSearchModel: SearchModel = {
  label: {
    type: 'Entity Type',
    modifiedDate: 'Modified Date',
    status: 'Status',
  },
  dataType: {
    type: ['select', ENTITY_TYPE],
    modifiedDate: 'date',
    status: ['select', STATUS],
  },
  form: new FormGroup({
    type: new FormControl(),
    modifiedDate: new FormGroup({
      from: new FormControl(),
      to: new FormControl()
    }),
    status: new FormControl()
  }),

  query: (query) => `SELECT DISTINCT (hdr.guid) AS requiredGuid FROM bl_fi_mst_entity_hdr AS hdr LEFT JOIN bl_fi_mst_entity_ext AS ext ON hdr.guid = ext.entity_hdr_guid WHERE hdr.status = 'ACTIVE' AND (ext.param_code = 'AKN_ETY_CTG' AND ext.value_string = 'CUSTOMER') AND (ext.param_code = 'CUSTOMER_CODE' AND ext.value_json ->> 'customerCode' ILIKE '%${query}%') or ( hdr.name ILIKE '%${query}%')`,
  table: `bl_fi_mst_entity_hdr`,
  queryCallbacks: {
    type: type => type ? ` hdr.txn_type = '${type}'` : '',
    status: status => status ? ` hdr.status = '${status}'` : '',
    modifiedDate: modifiedDate => {
      if (modifiedDate.from || modifiedDate.to) {
        const from = modifiedDate.from ? modifiedDate.from : modifiedDate.to;
        const to = modifiedDate.to ? modifiedDate.to : modifiedDate.from;
        return `hdr.updated_date BETWEEN '${from.format(CustomerConstants.DateTimeFormat)}' AND '${to.format(CustomerConstants.DateTimeFormat)}'`;
      }
      return '';
    },
  },
};

