import { FormControl, FormGroup } from '@angular/forms';
import { SearchModel } from 'projects/shared-utilities/models/search-model';
  

export const ContraSearchModel: SearchModel = {
  label: {
      docNo: 'Doc No',
      docType: 'Document Type',
      createdDate: 'Created Date',
      transactionDate: 'Transaction Date',
  },
  dataType: {
      docNo: 'string',
      docType: 'select',
      createdDate: 'date',
      transactionDate: 'date',
  },
  form: new FormGroup({
      docNo: new FormControl(),
      docType: new FormControl(),
      createdDate: new FormGroup({
          from: new FormControl(),
          to: new FormControl()
      }),
      transactionDate: new FormGroup({
          from: new FormControl(),
          to: new FormControl()
      }),
  }),
  //basic search query
  query: (string) => {
      return string;
  },
  table: `abc`,
  queryCallbacks: {
      docNo: docNo => docNo ? docNo: '',
      docType: docType => docType ? docType: '',
      createdDate: query => {
        if (query.from || query.to) {
          // assign creationDate.from to itself or creationDate.to if null
          const from = query.from ? `hdr.date_txn >= '${query.from.format('YYYY-MM-DD')}'` : '';
          // assign creationDate.to to itself or creationDate.from if null
          const to = query.to ? `hdr.date_txn < '${query.to.format('YYYY-MM-DD')}'` : '';
          return `(${from} ${(from && to) ? 'AND' : ''} ${to})`;
        }
        return '';
      },
      transactionDate: query => {
        if (query.from || query.to) {
          // assign creationDate.from to itself or creationDate.to if null
          const from = query.from ? `hdr.date_txn >= '${query.from.format('YYYY-MM-DD')}'` : '';
          // assign creationDate.to to itself or creationDate.from if null
          const to = query.to ? `hdr.date_txn < '${query.to.format('YYYY-MM-DD')}'` : '';
          return `(${from} ${(from && to) ? 'AND' : ''} ${to})`;
        }
        return '';
      },
  }
};