import { FormControl, FormGroup } from '@angular/forms';
import { SearchModelV2 } from 'projects/shared-utilities/models/search-model-v2';

export const toIRBSearchModel: SearchModelV2 = {
  label: {
    docNo: 'Document No',
    runningNo: 'Einvoice No./Running No.',
  },
  dataType: {
    docNo: 'string',
    runningNo: 'string',
  },
  form: new FormGroup({
    docNo: new FormControl(),
    runningNo: new FormControl(),
  }),
};

