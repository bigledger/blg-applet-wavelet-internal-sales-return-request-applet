import { FormControl, FormGroup } from '@angular/forms';
import { SearchModelV2 } from 'projects/shared-utilities/models/search-model-v2';
import { UtilitiesModule } from 'projects/shared-utilities/utilities/utilities.module';

export const ContraV2SearchModel: SearchModelV2 = {
  label: {
    docNo: 'Doc No',
    docType: 'Document Type',
    createdDate: 'Created Date',
    transactionDate: 'Transaction Date',
  },
  dataType: {
    docNo: 'string',
    docType: ['select', ['INTERNAL_PAYMENT_VOUCHER', 'INTERNAL_SALES_INVOICE']],
    createdDate: 'date',
    transactionDate: 'date',
  },
  options: {
    docNo: {},
    docType: {},
    createdDate: { 'checkbox': true },
    transactionDate: { 'checkbox': true }
  },
  form: new FormGroup({
    docNo: new FormControl(),
    docType: new FormControl(),
    createdDate: new FormGroup({
      from: new FormControl(UtilitiesModule.getTodayNoTime()),
      to: new FormControl(UtilitiesModule.getTodayNoTime())
    }),
    transactionDate: new FormGroup({
      from: new FormControl(UtilitiesModule.getTodayNoTime()),
      to: new FormControl(UtilitiesModule.getTodayNoTime())
    }),
  }),

};
