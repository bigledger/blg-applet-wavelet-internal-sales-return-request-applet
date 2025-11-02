import { FormControl, FormGroup } from '@angular/forms';
import { SearchModel } from 'projects/shared-utilities/models/search-model';

export const internalSalesOrderSearchModel: SearchModel = {
  label: {
    salesOrderNo: 'Sales Order No',
    creationDate: 'Creation Date',
    branch: 'Branch',
    location: 'Location',
    customerName: 'Customer Name',
    status: 'Sub Type'
  },
  dataType: {
    salesOrderNo: 'string',
    creationDate: 'date',
    branch: 'string',
    location: 'string',
    customerName: 'string',
    status: 'string'
  },
  form: new FormGroup({
    salesOrderNo: new FormControl(),
    creationDate: new FormGroup({
      from: new FormControl(),
      to: new FormControl()
    }),
    branch: new FormControl(),
    location: new FormControl(),
    customerName: new FormControl(),
    status: new FormControl()
  }),
  query: () => '',
  queryCallbacks: {}
};

