import { FormGroup, FormControl } from "@angular/forms";
import { UtilitiesModule } from 'projects/shared-utilities/utilities/utilities.module';
import { SearchModelV2 } from 'projects/shared-utilities/models/search-model-v2';
import * as moment from "moment";

export const salesInvoiceSearchModel: SearchModelV2 = {
  label: {
    branch: 'Branch',
    transactionDate: 'Transaction Date',
    createdDate: 'Created Date',
  },
  dataType: {
    branch: 'select-multi-branch',
    transactionDate: 'date',
    createdDate: 'date',
  },

  form: new FormGroup({
    branch: new FormControl(),
    transactionDate: new FormGroup({
      from: new FormControl(UtilitiesModule.getDateNoTime(moment().subtract(1, 'month'))),
      to: new FormControl(UtilitiesModule.getTodayNoTime())
    }),
    createdDate: new FormGroup({
      from: new FormControl(UtilitiesModule.getDateNoTime(moment().subtract(1, 'month'))),
      to: new FormControl(UtilitiesModule.getTodayNoTime())
    }),
  }),

  options: {
    branch: { 'multiple': true },
    transactionDate: { 'checkbox': true },
    createdDate: { 'checkbox': true },
  }
};