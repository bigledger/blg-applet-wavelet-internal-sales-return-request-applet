import { FormControl, FormGroup } from '@angular/forms';
import { SearchModel } from '../search-model';

export const salesReturnSearchModel: SearchModel = {
  label: {
    customer: 'Customer',
    // salesReturnNo: 'Sales Return No',
    creationDate: 'Creation Date',
    branch: 'Branch',
    createdBy: 'Created by' 
    // status: 'Sub Type'
  },
  dataType: {
    customer: 'string',
    // salesReturnNo: 'string',
    creationDate: 'date',
    branch: 'string',
    createdBy: 'string',
    // status: 'string'
  },

  form: new FormGroup({
    customer: new FormControl(),
    // salesReturnNo: new FormControl(),
    creationDate: new FormGroup({
      from: new FormControl(),
      to: new FormControl()
    }),
    branch: new FormControl(),
    createdBy: new FormControl(),
    // status: new FormControl()
  }),

  joins: [
    { type: 'INNER JOIN', table: 'bl_fi_mst_branch', alias: 'branch', onCondition: 'hdr.guid_branch = branch.guid', joinOnBasic: true },
    { type: 'INNER JOIN', table: 'bl_fi_mst_entity_hdr', alias: 'customer', onCondition: 'hdr.doc_entity_hdr_guid = customer.guid', joinOnBasic: true },
    { type: 'INNER JOIN', table: 'app_login_subject_ext', alias: 'subject', onCondition: 'hdr.created_by_subject_guid = subject.login_subject_guid', joinOnBasic: true }
  ],

  query: (query) => 
    `(hdr.server_doc_1 ILIKE '%${query}%' OR branch.name ILIKE '%${query}%' OR customer.name ILIKE '%${query}%' OR subject.value_string ILIKE '%${query}%') 
    AND subject.param_code= 'FIRST_NAME' AND hdr.server_doc_type = 'INTERNAL_SALES_RETURN' AND hdr.status = 'ACTIVE'`,

  table: 'bl_fi_generic_doc_hdr',

  queryCallbacks: {
    customer: query => query ? `customer.name ILIKE '%${query.trim()}%'` : '',
    // salesReturnNo: query => query  ? `hdr.server_doc_1 ILIKE '%${query}%'` : '',
    branch: query => query ? `branch.name ILIKE '%${query.trim()}%'` : '',
    creationDate: query => {
      if (query.from || query.to) {
        // assign creationDate.from to itself or creationDate.to if null
        const from = query.from ? `hdr.created_date >= '${query.from.format('YYYY-MM-DD')}'` : '';
        // assign creationDate.to to itself or creationDate.from if null
        const to = query.to ? `hdr.created_date <= '${query.to.format('YYYY-MM-DD')}'` : '';
        return `${from} ${(from && to) ? 'AND' : ''} ${to}`;
      }
      return '';
    },
    createdBy: query => query ? `subject.value_string ILIKE '%${query.trim()}%' AND subject.param_code= 'FIRST_NAME'` : ''
  },

  additionalCondition: ` AND hdr.server_doc_type = 'INTERNAL_SALES_RETURN' AND hdr.status = 'ACTIVE'`
};