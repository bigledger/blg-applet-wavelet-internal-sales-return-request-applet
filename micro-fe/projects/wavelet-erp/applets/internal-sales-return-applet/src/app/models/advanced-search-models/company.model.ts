import { FormControl, FormGroup } from '@angular/forms';
import { SearchModel } from 'projects/shared-utilities/models/search-model';

export const companySearchModel: SearchModel = {
  label: {
    companyName: 'Company Name',
    compRegNo: 'Company Registration Number',
    modifiedDate: 'Modified Date',
    status: 'Status'
  },
  dataType: {
    companyName: 'string',
    compRegNo: 'string',
    modifiedDate: 'date',
    status: ['select', ['ACTIVE', 'CLOSED']]
  },
  form: new FormGroup({
    companyName: new FormControl(),
    compRegNo: new FormControl(),
    modifiedDate: new FormGroup({
      from: new FormControl(),
      to: new FormControl()
    }),
    status: new FormControl()
  }),

  joins: [
    {
      type: 'INNER JOIN',
      table: 'bl_fi_mst_comp_ext',
      alias: 'entity',
      onCondition: 'entity.comp_hdr_guid = hdr.guid',
      joinOnBasic: false
    }
  ],

  query: (query) => query ? `hdr.code ILIKE '%${query}%' OR hdr.name ILIKE '%${query}%' OR hdr.comp_registration_num ILIKE '%${query}%' AND hdr.status!='DELETED'` : `hdr.status!='DELETED'`,

  table: 'bl_fi_mst_comp',

  queryCallbacks: {
    companyName: companyName => companyName ? `UPPER(hdr.name) ILIKE UPPER('%${companyName}%')` : '',
    status: status => status ? `entity.value_string ilike '${status}'` : '',
    compRegNo: compRegNo => compRegNo ? `hdr.comp_registration_num ilike '%${compRegNo}%'` : '',
    modifiedDate: modifiedDate => {
      if (modifiedDate.from || modifiedDate.to) {
        // assign modifiedDate.from to itself or modifiedDate.to if null
        const from = modifiedDate.from ? modifiedDate.from : modifiedDate.to;
        // assign creationDate.to to itself or creationDate.from if null
        const to = modifiedDate.to ? modifiedDate.to : modifiedDate.from;
        return `hdr.modified_date >= '${from.format('YYYY-MM-DD')}' AND hdr.modified_date <= '${to.format('YYYY-MM-DD')}'`
      }
      return ''
    },
  }
};

