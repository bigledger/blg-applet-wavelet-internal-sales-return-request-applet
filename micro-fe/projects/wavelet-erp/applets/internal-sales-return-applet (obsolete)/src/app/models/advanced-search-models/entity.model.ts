import { FormControl, FormGroup } from '@angular/forms';
import { ENTITY, ENTITY_TYPE } from '../customer-constants';
import { SearchModel } from '../search-model';

export const entitySearchModel: SearchModel = {
  label: {
    code: 'Code',
    entity: 'Entity',
    type: 'Entity Type',
    name: 'Name',
    phoneNumber: 'Phone Number',
  },

  dataType: {
    code: 'string',
    entity: ['selectEntity', ENTITY],
    type: ['select', ENTITY_TYPE],
    name: 'string',
    phoneNumber: 'string'
  },

  form: new FormGroup({
    code: new FormControl(),
    entity: new FormControl(),
    type: new FormControl(),
    name: new FormControl(),
    phoneNumber: new FormControl(),
  }),

  query: (query) => 
    `(hdr.customer_code ILIKE '%${query}%' OR hdr.txn_type ILIKE '%${query}%' OR hdr.name ILIKE '%${query}%' OR hdr.phone ILIKE '%${query}%') 
    AND hdr.status = 'ACTIVE' AND hdr.is_customer = true`,

  table: `bl_fi_mst_entity_hdr`,

  queryCallbacks: {
    code: query => query ? `hdr.supplier_code ILIKE '%${query}%' OR hdr.customer_code ILIKE '%${query}%'
      hdr.employee_code ILIKE '%${query}%' OR hdr.merchant_code ILIKE '%${query}%'`  : '',
    entity: query => {
      let q = [];
      if (query.includes(ENTITY[0]))
        q.push(`hdr.is_customer = true`)
      if (query.includes(ENTITY[1]))
        q.push(`hdr.is_supplier = true`)
      if (query.includes(ENTITY[2]))
        q.push(`hdr.is_employee = true`)
      if (query.includes(ENTITY[3]))
        q.push(`hdr.is_merchant = true`)
      
      if (q.length > 0)
        return `(` + q.reduce((p, c) => `${p} OR ${c}\n`) + `)`;
      else return '';
    },
    type: query => query ? `hdr.txn_type ILIKE '%${query.trim()}%'` : '',
    name: query => query ? `hdr.name ILIKE '%${query.trim()}%'` : '',
    phoneNumber: query => query ? `hdr.phone ILIKE '%${query.trim()}%'` : '',
  },

  additionalCondition: ` AND hdr.status = 'ACTIVE'`
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