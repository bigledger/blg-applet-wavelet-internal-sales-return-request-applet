import { FormControl, FormGroup } from '@angular/forms';
import { ENTITY, ENTITY_TYPE } from '../constants/customer-constants';
import { SearchModel } from '../search-model';
import { SearchModelV2 } from 'projects/shared-utilities/models/search-model-v2';
import { UtilitiesModule } from 'projects/shared-utilities/utilities/utilities.module';

export const entitySearchModel: SearchModelV2  = {
  label: {
    code: 'Code',
    name: 'Name',
    phoneNo: 'Phone Number',
    type: 'Entity Type',
    modifiedDate: 'Modified Date'
  },
  dataType: {
    code: 'string',
    name: 'string',
    phoneNo: 'string',
    type: ['select', ENTITY_TYPE],
    modifiedDate: 'date'
  },
  form: new FormGroup({
    code: new FormControl(),
    name: new FormControl(),
    phoneNo: new FormControl(),
    type: new FormControl(),
    modifiedDate: new FormGroup({
      from: new FormControl(UtilitiesModule.getTodayNoTime()),
      to: new FormControl(UtilitiesModule.getTodayNoTime())
    }),
  }),

  options: {
    code: {},
    name: {},
    phoneNo: {},
    type: {},
    modifiedDate: {'checkbox': true},
  }  
};

export const salesAgentSearchModel: SearchModel = {
  label: {
    id: 'Employee ID',
    name: 'Employee Name',
    number: 'Employee Number'
  },

  dataType: {
    id: 'string',
    name: 'string',
    number: 'string'
  },

  form: new FormGroup({
    id: new FormControl(),
    name: new FormControl(),
    number: new FormControl(),
  }),

  query: (query) =>
    `(hdr.employee_code ILIKE '%${query}%' OR hdr.name ILIKE '%${query}%' OR hdr.phone ILIKE '%${query}%')
    AND hdr.status = 'ACTIVE' AND hdr.is_employee = true`,

  table: `bl_fi_mst_entity_hdr`,

  queryCallbacks: {
    id:  query => query ? `hdr.employee_code ILIKE '%${query.trim()}%'`: '',
    name: query => query ? `hdr.name ILIKE '%${query.trim()}%'` : '',
    phoneNumber: query => query ? `hdr.phone ILIKE '%${query.trim()}%'` : ''
  },

  additionalCondition: ` AND hdr.status = 'ACTIVE'`
};
