import { FormControl, FormGroup } from '@angular/forms';
import { SearchModel } from '../search-model';

export const memberSearchModel: SearchModel = {
  label: {
    // type: 'Entity Type',
    cardNo: 'Card No.',
    memberName: 'Member Name',
    phoneNo: 'Phone No.',
    modifiedDate: 'Modified Date',
    status: 'Status',
  },
  dataType: {
    cardNo: 'string',
    memberName: 'string',
    phoneNo: 'string',
    // type: ['select', ['CORPORATE', 'INDIVIDUAL']],
    modifiedDate: 'date',
    // status: ['select', ['ACTIVE', 'INACTIVE']],
  },
  form: new FormGroup({
    cardNo: new FormControl(),
    memberName: new FormControl(),
    phoneNo: new FormControl(),
    type: new FormControl(),
    modifiedDate: new FormGroup({
      from: new FormControl(),
      to: new FormControl()
    }),
    status: new FormControl()
  }),

  query: (query) => `hdr.card_no ILIKE '%${query.trim()}%' OR hdr.name ILIKE '%${query.trim()}%' OR  hdr.phone ILIKE '%${query.trim()}%'`,
  table: `bl_crm_membership_hdr`,
  queryCallbacks: {
    cardNo: cardNo => cardNo ? `hdr.card_no ILIKE '%${cardNo.trim()}%'` : '',
    memberName: memberName => memberName ? `hdr.name ILIKE '%${memberName.trim()}%'` : '',
    phoneNo: phoneNo => phoneNo ? `hdr.phone ILIKE '%${phoneNo.trim()}%'` : '',
    // type: type => type ? ` hdr.txn_type = '${type}'` : '',
    // status: status => status ? ` hdr.status = '${status}'` : '',
    modifiedDate: modifiedDate => {
      if (modifiedDate.from || modifiedDate.to) {
        // const from = modifiedDate.from ? modifiedDate.from : '';
        // const to = modifiedDate.to ? modifiedDate.to : '';
        const from = modifiedDate.from ? `hdr.updated_date >= '${modifiedDate.from.format('YYYY-MM-DD')}'` : '';
        const to = modifiedDate.to ? `hdr.updated_date <= '${modifiedDate.to.format('YYYY-MM-DD')}'` : '';
        return `${from} ${(from && to) ? 'AND' : ''} ${to}`;
      }
      return '';
    },
  },
  additionalCondition: ``
};

