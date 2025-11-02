import { FormGroup } from '@angular/forms';

export interface SearchModel {
  label;
  dataType;
  form: FormGroup;
  query: (string) => string;
  table?: string;
  queryCallbacks: {[id: string]: (any) => string};
}
export class SearchModelClass implements SearchModel {
  label;
  dataType;
  form: FormGroup;
  query: (string) => string;
  table?: string;
  queryCallbacks: {[id: string]: (any) => string};

  constructor(label, dataType, form, query, table, queryCallbacks) {
    this.label = label;
    this.dataType = dataType;
    this.form = form;
    this.query = query;
    this.table = table;
    this.queryCallbacks = queryCallbacks;
  }
}
