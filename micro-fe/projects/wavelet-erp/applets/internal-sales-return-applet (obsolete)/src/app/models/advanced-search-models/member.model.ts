import { FormControl, FormGroup } from '@angular/forms';
import { SearchModel } from '../search-model';

export const memberSearchModel: SearchModel = {
    label: {
      id: 'Member ID',
      name: 'Member Name',
      number: 'Mobile Number'
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
      `(hdr.card_no ILIKE '%${query}%' OR hdr.name ILIKE '%${query}%' OR hdr.phone ILIKE '%${query}%') 
      AND hdr.status = 'ACTIVE'`,
  
    table: `bl_crm_membership_hdr`,
  
    queryCallbacks: {
      id:  query => query ? `hdr.card_no ILIKE '%${query.trim()}%'`: '',
      name: query => query ? `hdr.name ILIKE '%${query.trim()}%'` : '',
      phoneNumber: query => query ? `hdr.phone ILIKE '%${query.trim()}%'` : ''
    },
  
    additionalCondition: ` AND hdr.status = 'ACTIVE'`
  };


