import { FormControl, FormGroup } from '@angular/forms';
import { SearchModel } from './search-model';


export const contraListingSearchModel: SearchModel = {
    label: {
        docType: 'Document Type',
        createdDate: 'Created Date',
        amountContra: 'Amount Contra'
    },
    dataType: {
        docType: 'select',
        createdDate: 'date',
        amountContra: 'numberRange'
    },
    form: new FormGroup({
        docType: new FormControl(),
        createdDate: new FormGroup({
            from: new FormControl(),
            to: new FormControl()
        }),
        amountContra: new FormGroup({
            from: new FormControl(),
            to: new FormControl()
        }),
    }),
    //basic search query
    query: (query) => query.trim() ? `hdr.server_doc_type_doc_2 ILIKE '%${query.trim()}%' ` : null,
    table: `bl_fi_generic_doc_arap_contra`,
    joins: [],
    queryCallbacks: {
        docType: docType => docType ? `hdr.server_doc_type_doc_2 ILIKE '%${docType.trim()}%'` : '',
        createdDate: createdDate => {
            if (createdDate.from || createdDate.to) {
                var from = createdDate.from ? createdDate.from : createdDate.to;
                var to = createdDate.to ? createdDate.to : createdDate.from;
                return `hdr.created_date >= '${from.format('YYYY-MM-DD HH:mm:ss')}' AND hdr.created_date <= '${to.format('YYYY-MM-DD HH:mm:ss')}'`;
            }
            return '';
        },
        amountContra: amountContra => {
            if (amountContra.from || amountContra.to) {
                const min = amountContra.from ? `hdr.amount_contra >= ${amountContra.from}` : '';
                const max = amountContra.to ? `hdr.amount_contra <= ${amountContra.to}` : '';
                return `${min} ${(min && max) ? 'AND' : ''} ${max}`;
            }
            return '';
        },
    },
    additionalCondition: ` AND hdr.status = 'ACTIVE'`
};


