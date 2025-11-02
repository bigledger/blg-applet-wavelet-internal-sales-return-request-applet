import { Component, Input, OnInit, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as $ from 'jquery';
import { SearchQueryModel } from '../query.model';
import { SearchModel } from '../search-model';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdvancedSearchComponent implements OnInit {

  @Input() advSearchModel: SearchModel;
  @Input() id: string;

  @Output() search = new EventEmitter<SearchQueryModel>();
  @Output() advSearch = new EventEmitter<SearchQueryModel>();

  isAdvanced: boolean;
  inputArray: any[];
  advForm: FormGroup;
  optionArray = {};
  filter = '';
  basicSearchQuery = '';

  constructor() {
    this.isAdvanced = false;
  }

  async ngOnInit() {
    this.advForm = this.advSearchModel.form;
    this.inputArray = Object.entries(this.advSearchModel.dataType).map((e: any) => e.flatMap(f => f));
    this.extractOptions();
    $(document).mouseup((ev:any) => {
      const container = $(`#${this.id}`);
      const calendar = $('mat-calendar');
      const matOption = $('mat-option');
      const backdrop = $('.cdk-overlay-backdrop');
      if (!matOption.is(ev.target) && !calendar.is(ev.target) && !container.is(ev.target) && !backdrop.is(ev.target)
        && matOption.has(ev.target).length === 0 && container.has(ev.target).length === 0 &&
        calendar.has(ev.target).length === 0 && backdrop.has(ev.target).length === 0) {
        container.hide('fast', 'swing', () => {
          this.isAdvanced = false;
          // this.advForm.reset();
        });
      }
    });
  }

  extractOptions = (fieldName?, fieldValue?) => this.inputArray
    .filter(x => x[1] === 'select')
    .filter(x => fieldName ? x[0] === fieldName : true)
    .forEach(x => {
      const options = x[2]
        .flatMap(e => e)
        .filter(e => fieldValue ? e.toLowerCase().includes(fieldValue.toLowerCase()) : true);
      this.optionArray[x[0]] = options;
    })

  searchToggle() {
    const container = $(`#${this.id}`);
    if (!this.isAdvanced) {
      this.isAdvanced = true;
      container.show('fast', 'swing', () => this.isAdvanced = true);
    }
  }

  queryBuilder() {
    let conditions = '';
    if (this.advForm.dirty) {
      conditions = Object
        .entries(this.advSearchModel.queryCallbacks)
        .map(([prop, callbackfn]: [string, (any) => string]) => callbackfn(this.advForm.value[prop]))
        .filter(q => q !== '')
        .reduce((p, c) => `${p} AND ${c}\n`);
    }

    const query = `
      ${this.advSearchModel.query(this.basicSearchQuery)}
      ${this.basicSearchQuery ? 'AND' : ''}
      ${conditions}`;
    return {
      queryString: query,
      isEmpty: !conditions
    };
  }

  advancedSearch() {
    const container = $(`#${this.id}`);
    const query = this.queryBuilder();
    this.search.emit(query);
    container.hide('fast', 'swing', () => {
      this.isAdvanced = false;
      // this.advForm.reset();
    });
  }

  basicSearch(e: string) {
    const query = {
      queryString: `
      ${this.advSearchModel.query(e)}
      `,
      isEmpty: !e
    };
    this.search.emit(query);
  }

  optionSearchFilter(query) {
    const fieldName = query.target.parentNode.parentNode.id;
    this.extractOptions(fieldName, query.target.value);
  }

  buildQueryString(conditions) {
    const whereConditions = conditions ? `WHERE ${conditions}` : '';
    const query = {
      queryString: `
      SELECT hdr.guid as requiredGuid
      FROM ${this.advSearchModel.table} as hdr
      ${whereConditions}
      `,
      isEmpty: !conditions,
      table: this.advSearchModel.table
    };

    return query;
  }

  reset() {
    const query = this.buildQueryString('');
    this.basicSearchQuery = '';
    this.advForm.reset();
    this.search.emit(query);
  }
}
