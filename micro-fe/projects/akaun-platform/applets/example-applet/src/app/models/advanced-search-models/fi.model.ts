import { FormControl, FormGroup } from '@angular/forms';
import { SearchModel } from 'projects/shared-utilities/models/search-model';

export const FISearchModel: SearchModel = {

    label: {
        itemType: 'item Type',
        creationDate: 'Creation Date',
        modifiedDate: 'Modified Date'
    },

    dataType: {
        itemType: ['select', ['BASIC_ITEM', 'GROUP_ITEM', 'BUNDLE', 'COUPON', 'SERVICE', 'BATCH', 'WARRANTY', 'DOC_HEADER_ADJUSTMENT']],
        creationDate: 'date',
        modifiedDate: 'date'
    },

    form: new FormGroup({
        itemType: new FormControl(),
        creationDate: new FormGroup({
            from: new FormControl(),
            to: new FormControl()
        }),
        modifiedDate: new FormGroup({
            from: new FormControl(),
            to: new FormControl()
        })
    }),

    query: (query) => `(hdr.code ILIKE '%${query}%' OR hdr.name ILIKE '%${query}%') AND hdr.status = 'ACTIVE'`,

    table: 'bl_fi_mst_item_hdr',

    queryCallbacks: {
        itemType: query => {
            if (query) {
                return `hdr.txn_type ILIKE '%${query}%'`;
            }
            return '';
        },
        creationDate: creationDate => {
            if (creationDate.from || creationDate.to) {
                const from = creationDate.from ? `hdr.date_created >= '${creationDate.from.format('YYYY-MM-DD')}'` : '';
                const to = creationDate.to ? `hdr.date_created <= '${creationDate.to.format('YYYY-MM-DD')}'` : '';
                return `${from} ${(from && to) ? 'AND' : ''} ${to}`;
            }
            return '';
        },
        modifiedDate: modifiedDate => {
            if (modifiedDate.from || modifiedDate.to) {
                // assign modifiedDate.from to itself or modifiedDate.to if null
                const from = modifiedDate.from ? modifiedDate.from : modifiedDate.to;
                // assign creationDate.to to itself or creationDate.from if null
                const to = modifiedDate.to ? modifiedDate.to : modifiedDate.from;
                return `hdr.date_updated >= '${from.format('YYYY-MM-DD')}' AND hdr.date_updated <= '${to.format('YYYY-MM-DD')}'`;
            }
            return '';
        },
    }

};
