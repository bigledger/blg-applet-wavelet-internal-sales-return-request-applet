import { FormControl, FormGroup } from '@angular/forms';
import { SearchModel } from 'projects/shared-utilities/models/search-model';

export const companyWorkflowSearchModel: SearchModel = {
  label: {
    companyCode: 'Company Code',
    serverDocType: 'Server Doc Type',
    updatedDate: 'Updated Date',
    status: 'Status'
  },
  dataType: {
    companyCode: 'string',
    serverDocType: 'string',
    updatedDate: 'date',
    status: ['select', ['ACTIVE', 'CLOSED']]
  },
  form: new FormGroup({
    companyCode: new FormControl(),
    serverDocType: new FormControl(),
    updatedDate: new FormGroup({
      from: new FormControl(),
      to: new FormControl()
    }),
    status: new FormControl()
  }),

  // joins: [
  //   {
  //     type: 'INNER JOIN',
  //     table: 'bl_fi_mst_comp_ext',
  //     alias: 'entity',
  //     onCondition: 'entity.comp_hdr_guid = hdr.guid',
  //     joinOnBasic: false
  //   }
  // ],

  query: (query) => query ? `hdr.company_code ILIKE '%${query}%'  OR hdr.server_doc_type ILIKE '%${query}%' AND hdr.status!='DELETED'` : `hdr.status!='DELETED'`,

  table: 'bl_fi_comp_workflow_gendoc_process_template_hdr',

  queryCallbacks: {
    companyCode: companyCode => companyCode ? `UPPER(hdr.company_code) ILIKE UPPER('%${companyCode}%')` : '',
    status: status => status ? `entity.value_string ilike '${status}'` : '',
    serverDocType: serverDocType => serverDocType ? `hdr.server_doc_type ilike '%${serverDocType}%'` : '',
    updatedDate: updatedDate => {
      if (updatedDate.from || updatedDate.to) {
        // assign modifiedDate.from to itself or modifiedDate.to if null
        const from = updatedDate.from ? updatedDate.from : updatedDate.to;
        // assign creationDate.to to itself or creationDate.from if null
        const to = updatedDate.to ? updatedDate.to : updatedDate.from;
        return `hdr.updated_date >= '${from.format('YYYY-MM-DD')}' AND hdr.updated_date <= '${to.format('YYYY-MM-DD')}'`
      }
      return ''
    },
  }
};

