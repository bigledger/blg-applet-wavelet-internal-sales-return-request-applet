import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation, HostListener, } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as $ from 'jquery';
import { SearchQueryModel } from '../../../models/query.model';
import { SearchModel } from '../../../models/search-model';
import moment from "moment";

@Component({
  selector: 'app-advanced-search-contra',
  templateUrl: './advanced-search-contra.component.html',
  styleUrls: ['./advanced-search-contra.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdvancedSearchContraComponent implements OnInit {

  @Input() advSearchModel: SearchModel;
  @Input() id: string;

  @Output() search = new EventEmitter<SearchQueryModel>();

  isAdvanced: boolean;
  inputArray: any[];
  advForm: FormGroup;
  optionArray = {};
  filter = '';
  basicSearchQuery = '';

  constructor() {
    this.isAdvanced = false;
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscPressed(event: KeyboardEvent): void {
    this.isAdvanced = false;
  }

  ngOnInit() {
    this.advForm = this.advSearchModel.form;
    this.inputArray = Object.entries(this.advSearchModel.dataType).map((e: any) => e.flatMap(f => f));
    this.extractOptions();
    $(document).mouseup(ev => {
      const container = $(`#${this.id}`);
      const calendar = $('mat-calendar');
      const matOption = $('mat-option');
      const backdrop = $('.cdk-overlay-backdrop');
      if (!matOption.is(ev.target) && !calendar.is(ev.target) && !container.is(ev.target) && !backdrop.is(ev.target)
        && matOption.has(ev.target).length === 0
        && container.has(ev.target).length === 0
        && calendar.has(ev.target).length === 0
        && backdrop.has(ev.target).length === 0) {
        container.hide('fast', 'swing', c => {
          this.isAdvanced = false;
          // this.advForm.reset();
        });
      }
    });
  }

  extractOptions = (fieldName?, fieldValue?) => this.inputArray
    .filter(x => x[1] === 'select' || x[1] === 'selectEntity')
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
      container.show('fast', 'swing', c => this.isAdvanced = true);
    }
  }

  reset() {
    // this.buildQueryString('');
    // this.basicSearchQuery = '';
    this.advForm.reset();
    // this.search.emit(query);
  }

  optionSearchFilter(query) {
    const fieldName = query.target.parentNode.parentNode.id;
    this.extractOptions(fieldName, query.target.value);
  }

  /**
   * joins = [{type of join, table name, alias name of table, on condition}]
   *
   * @param specify any where conditions
   * @param specify any joins
   * @returns the full sql query
   */
  buildQueryString(conditions: string, joins?) {
    let queryStr =
      `SELECT DISTINCT(hdr.guid) as requiredGuid
    FROM ${this.advSearchModel.table} as hdr`;

    // conditions for join
    if (joins) {
      joins.forEach(join => queryStr = join ? queryStr + `
      ${join.type} ${join.table} as ${join.alias} on ${join.onCondition}` : '');
    }

    const whereConditions = conditions ? `WHERE ${conditions}` : '';
    const query = {
      queryString: `
      ${queryStr}
      ${whereConditions}
      `,
      isEmpty: !conditions,
      table: this.advSearchModel.table
    };

    return query;
  }

  queryBuilder() {
    let query;

    if(this.advForm){

      console.log(this.advForm);
      query = {
          searchQuery: {
            docNo: this.advForm.value.docNo,
            docType: this.advForm.value.docType,
            created_date_from: this.advForm.value.createdDate.from? moment(this.advForm.value.createdDate.from).format('YYYY-MM-DDT00:00:00.SSS[Z]'): null,
            created_date_to: this.advForm.value.createdDate.to? moment(this.advForm.value.createdDate.to).format('YYYY-MM-DDT23:59:59.SSS[Z]'): null,
            txn_date_to: this.advForm.value.transactionDate.to? moment(this.advForm.value.transactionDate.to).format('YYYY-MM-DDT23:59:59.SSS[Z]'): null,
            txn_date_from: this.advForm.value.transactionDate.from? moment(this.advForm.value.transactionDate.from).format('YYYY-MM-DDT00:00:00.SSS[Z]'): null,
          },
          isEmpty: false,
          table: this.advSearchModel.table
      };}
      
      return query;

  }

  basicSearch(e: string) {
    const query = {
      searchQuery: {
        keyword: e
      },
      isEmpty: false,
      table: this.advSearchModel.table
    };
    this.search.emit(query);
  }

  advancedSearch() {
    const container = $(`#${this.id}`);
    const query = this.queryBuilder();
    this.search.emit(query);
    container.hide('fast', 'swing', c => {
      this.isAdvanced = false;
      // this.advForm.reset();
    });
  }
}
