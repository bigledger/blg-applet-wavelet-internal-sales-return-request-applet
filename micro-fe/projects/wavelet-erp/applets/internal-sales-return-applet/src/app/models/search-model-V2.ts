import { FormGroup } from '@angular/forms';
export interface SearchModelV2 {
  label;
  dataType;
  form: FormGroup;
}
export abstract class SearchModelV2Class implements SearchModelV2 {
  label;
  dataType;
  form: FormGroup;

  constructor(label, dataType, form) {
    this.label = label;
    this.dataType = dataType;
    this.form = form;
  }
}
