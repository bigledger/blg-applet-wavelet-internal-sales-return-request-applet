import { FormControl, FormGroup } from '@angular/forms';
import { SearchModel } from './search-model';

export const internalJobSheetSearchModel: SearchModel = {
  label: {
    docNo: 'Job Sheet No',
    branchName: 'Branch',
    customerName: 'Customer Name',
    createdDate: 'Created Date',
    createdBy: 'Created by'
  },
  dataType: {
    docNo: 'string',
    branchName: 'string',
    customerName: 'string',
    createdDate: 'date',
    createdBy: 'string',
  },
  form: new FormGroup({
    docNo: new FormControl(),
    branchName: new FormControl(),
    customerName: new FormControl(),
    createdDate: new FormGroup({
      from: new FormControl(),
      to: new FormControl()
    }),
    createdBy: new FormControl(),
  }),
  query: (query) => query.trim() ? `(hdr.server_doc_1 ILIKE '%${query.trim()}%' OR branch.name ILIKE '%${query.trim()}%' OR customer.name ILIKE '%${query.trim()}%' OR subject.value_string ILIKE '%${query.trim()}%') AND hdr.server_doc_type = 'INTERNAL_JOBSHEET' AND subject.param_code= 'FIRST_NAME' AND hdr.status = 'ACTIVE'`: null,
  table: `bl_fi_generic_doc_hdr`,
  // query: (query) =>
  //   `(hdr.server_doc_1 ILIKE '%${query}%' OR branch.name ILIKE '%${query}%' OR customer.name ILIKE '%${query}%' OR subject.value_string ILIKE '%${query}%')
  //   AND subject.param_code= 'FIRST_NAME' AND hdr.server_doc_type = 'INTERNAL_JOBSHEET' AND hdr.status = 'ACTIVE'`,
  joins: [
    { type: 'INNER JOIN', table: 'bl_fi_mst_branch', alias: 'branch', onCondition: 'hdr.guid_branch = branch.guid', joinOnBasic: true },
    { type: 'INNER JOIN', table: 'bl_fi_mst_entity_hdr', alias: 'customer', onCondition: 'hdr.doc_entity_hdr_guid = customer.guid', joinOnBasic: true },
    { type: 'INNER JOIN', table: 'app_login_subject_ext', alias: 'subject', onCondition: 'hdr.created_by_subject_guid = subject.login_subject_guid', joinOnBasic: true }
  ],
  queryCallbacks: {
    docNo: docNo => docNo ? `hdr.server_doc_1 ILIKE '%${docNo.trim()}%'` : '',
    branchName: branchName => branchName ? `branch.name ILIKE '%${branchName.trim()}%'` : '',
    customerName: customerName => customerName ? `customer.name ILIKE '%${customerName.trim()}%'` : '',
    createdDate: createdDate => {
      if (createdDate.from || createdDate.to) {
        var from = createdDate.from ? createdDate.from : createdDate.to;
        var to = createdDate.to ? createdDate.to : createdDate.from;
        return `hdr.created_date >= '${from.format('YYYY-MM-DD HH:mm:ss')}' AND hdr.created_date <= '${to.format('YYYY-MM-DD HH:mm:ss')}'`;
      }
      return '';
    },
    createdBy: query => query ? `subject.value_string ILIKE '%${query.trim()}%' AND subject.param_code= 'FIRST_NAME'` : ''
  },
  additionalCondition: ` AND hdr.server_doc_type = 'INTERNAL_JOBSHEET' AND hdr.status = 'ACTIVE'`
};

