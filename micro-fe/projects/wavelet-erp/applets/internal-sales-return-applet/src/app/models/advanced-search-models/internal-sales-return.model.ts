import { FormControl, FormGroup } from '@angular/forms';
import { UtilitiesModule } from 'projects/shared-utilities/utilities/utilities.module';
import { SearchModelV2 } from 'projects/shared-utilities/models/search-model-v2';
import * as moment from "moment";


export const salesReturnSearchModel: SearchModelV2 = {
  label: {
    customer: 'Customer',
    company: 'Company',
    branch: 'Branch',
    salesAgent: 'Sales Agent',
    postingStatus: 'Posting Status',
    status: 'Status',
    transactionDate: 'Transaction Date',
    createdDate: 'Created Date',
    updatedDate: 'Updated Date',
    orderBy: 'Order By',
    glDimension: 'GL Dimension',
    segment: 'Segment',
    profitCenter: 'Profit Center',
    project: 'Project',
  },
  dataType: {
    customer: 'select-multi-entity',
    company: 'select-multi-company',
    branch: 'select-multi-branch',
    salesAgent: 'select-multi-entity',
    postingStatus: ['select', ['DRAFT', 'FINAL', 'VOID', 'DISCARDED']],
    status: ['select', ['ACTIVE', 'DELETED']],
    transactionDate: 'date',
    createdDate: 'date',
    updatedDate: 'date',
    orderBy: ['select', ['TRANSACTION DATE', 'CREATED DATE', 'UPDATED DATE']],
    glDimension: 'select-multi-gl-dimension',
    segment: 'select-multi-segment',
    profitCenter: 'select-multi-profit-center',
    project: 'select-multi-project'
  },

  form: new FormGroup({
    customer: new FormControl(),
    company: new FormControl(),
    branch: new FormControl(),
    salesAgent: new FormControl(),
    postingStatus: new FormControl(),
    status: new FormControl(),
    transactionDate: new FormGroup({
      from: new FormControl(UtilitiesModule.getDateNoTime(moment().subtract(1, 'month'))),
      to: new FormControl(UtilitiesModule.getTodayNoTime())
    }),
    createdDate: new FormGroup({
      from: new FormControl(UtilitiesModule.getDateNoTime(moment().subtract(1, 'month'))),
      to: new FormControl(UtilitiesModule.getTodayNoTime())
    }),
    updatedDate: new FormGroup({
      from: new FormControl(UtilitiesModule.getDateNoTime(moment().subtract(1, 'month'))),
      to: new FormControl(UtilitiesModule.getTodayNoTime())
    }),
    orderBy: new FormControl(),
    glDimension: new FormControl(),
    segment: new FormControl(),
    profitCenter: new FormControl(),
    project: new FormControl(),
  }),

  options: {
    customer: { 'multiple': true, 'entity': 'customer' },
    company: { 'multiple': true },
    branch: { 'multiple': true },
    salesAgent: { 'multiple': true, 'entity': 'employee' },
    postingStatus: { 'multiple': true },
    status: { 'multiple': true },
    transactionDate: { 'checkbox': true },
    createdDate: { 'checkbox': true },
    updatedDate: { 'checkbox': true },
    orderBy: {},
    glDimension: { 'multiple': true },
    segment: { 'multiple': true },
    profitCenter: { 'multiple': true },
    project: { 'multiple': true },
  },
};