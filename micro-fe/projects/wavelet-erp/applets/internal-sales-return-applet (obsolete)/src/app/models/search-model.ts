import { FormGroup } from '@angular/forms';
export interface SearchModel {
  label;
  dataType;
  form: FormGroup;
  query: (string) => string;
  table?: string;
  joins?;
  queryCallbacks: {[id: string]: (any) => string};
  additionalCondition: string;
}
export abstract class SearchModelClass implements SearchModel {
  label;
  dataType;
  form: FormGroup;
  query: (string) => string;
  table?: string;
  joins?;
  queryCallbacks: {[id: string]: (any) => string};
  additionalCondition: string;

  constructor(label, dataType, form, query, table, queryCallbacks, additionalCondition) {
    this.label = label;
    this.dataType = dataType;
    this.form = form;
    this.query = query;
    this.table = table;
    this.queryCallbacks = queryCallbacks;
    this.additionalCondition = additionalCondition;
  }
}
