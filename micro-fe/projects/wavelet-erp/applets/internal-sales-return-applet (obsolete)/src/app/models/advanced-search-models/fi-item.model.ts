import { FormControl, FormGroup } from '@angular/forms';
import { SearchModel } from '../search-model';

export const fiItemSearchModel: SearchModel = {
  label: {
    itemCode: 'Item Code',
    itemName: 'Item Name',
    uom: 'UOM'
  },

  dataType: {
    itemCode: 'string',
    itemName: 'string',
    uom: 'string'
  },

  form: new FormGroup({
    itemCode: new FormControl(),
    itemName: new FormControl(),
    uom: new FormControl(),
  }),

  joins: [
    
  ],

  query: (query) => 
    `(hdr.code ILIKE '%${query}%' OR hdr.name ILIKE '%${query}%' OR hdr.uom ILIKE '%${query}%') 
    AND hdr.status = 'ACTIVE'`,

  table: 'bl_fi_mst_item_hdr',

  queryCallbacks: {
    itemCode: query => query ? `hdr.code ILIKE '%${query.trim()}%'` : '',
    itemName: query => query ? `hdr.name ILIKE '%${query.trim()}%'` : '',
    uom: query => query ? `hdr.uom ILIKE '%${query.trim()}%'` : ''
  },
  
  additionalCondition: ` AND hdr.status = 'ACTIVE'`
};

