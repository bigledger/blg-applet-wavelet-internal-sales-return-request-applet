import { FormControl, FormGroup } from '@angular/forms';
import { SearchModel } from './search-model-new';
import { STATUS, CURRENCY, ENTITY_TYPE, CustomerConstants } from '../constants/customer-constants';

export const customerBranchSearchModel: SearchModel = {
  label: {
    code: 'Branch Code',
    name: 'Branch Name',
    status: 'Status',
  },
  dataType: {
    code: 'string',
    name: 'string',
    status: ['select', STATUS],
  },
  form: new FormGroup({
    code: new FormControl(),
    name: new FormControl(),
    status: new FormControl()
  }),

  query: (query) => {
    return `
   ( ( hdr.code ILIKE '%${query}%' ) or ( hdr.name ILIKE '%${query}%' ) )`;
  },
  table: `bl_fi_mst_branch`,
  queryCallbacks: {
    code: code => {
      if (code) {
        return `  hdr.code ilike '%${code}%'`;
      }
      return '';
    },
    name: name => {
      if (name) {
        return `  hdr.name ilike '%${name}%'`;
      }
      return '';
    },
    status: status => {
      if (status) {
        return `  hdr.status = '%${status}%'`;
      } return '';
    },
  },
};

