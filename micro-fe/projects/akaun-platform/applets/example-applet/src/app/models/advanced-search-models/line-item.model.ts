import { FormControl, FormGroup } from '@angular/forms';
import { SearchModel } from './search-model';

export const jobSheetLineItemSearchModel: SearchModel = {
  label: {
    docNo: 'Sales Order No.',
    itemCode: 'Item Code',
    itemName: 'Item Name',
  },

  dataType: {
    docNo: 'string',
    itemCode: 'string',
    itemName: 'string',
  },

  form: new FormGroup({
    docNo: new FormControl(),
    itemCode: new FormControl(),
    itemName: new FormControl(),
  }),

  joins: [
    { type: 'INNER JOIN', table: 'bl_fi_generic_doc_line', alias: 'line', onCondition: 'hdr.guid = line.generic_doc_hdr_guid', joinOnBasic: true },
  ],

  query: (query) =>
    `(hdr.server_doc_1 ILIKE '%${query}%' OR line.item_code ILIKE '%${query}%' OR line.item_name ILIKE '%${query}%')
    AND line.server_doc_type = 'INTERNAL_SALES_ORDER' AND line.status = 'ACTIVE'`,

  table: 'bl_fi_generic_doc_hdr',

  queryCallbacks: {
    docNo: query => query ? `hdr.server_doc_1 ILIKE '%${query.trim()}%'` : '',
    itemCode: query => query ? `line.item_code ILIKE '%${query.trim()}%'` : '',
    itemName: query => query ? `line.item_name ILIKE '%${query.trim()}%'` : '',
  },

  additionalCondition: ` AND line.server_doc_type = 'INTERNAL_SALES_ORDER' AND line.status = 'ACTIVE'`
};

export const quotationLineItemSearchModel: SearchModel = {
    label: {
      docNo: 'Quotation No.',
      itemCode: 'Item Code',
      itemName: 'Item Name',
    },

    dataType: {
      docNo: 'string',
      itemCode: 'string',
      itemName: 'string',
    },

    form: new FormGroup({
      docNo: new FormControl(),
      itemCode: new FormControl(),
      itemName: new FormControl(),
    }),

    joins: [
      { type: 'INNER JOIN', table: 'bl_fi_generic_doc_line', alias: 'line', onCondition: 'hdr.guid = line.generic_doc_hdr_guid', joinOnBasic: true },
    ],

    query: (query) =>
      `(hdr.server_doc_1 ILIKE '%${query}%' OR line.item_code ILIKE '%${query}%' OR line.item_name ILIKE '%${query}%')
      AND line.server_doc_type = 'INTERNAL_SALES_QUOTATION' AND line.status = 'ACTIVE'`,

    table: 'bl_fi_generic_doc_hdr',

    queryCallbacks: {
      docNo: query => query ? `hdr.server_doc_1 ILIKE '%${query.trim()}%'`: '',
      itemCode: query => query ? `line.item_code ILIKE '%${query.trim()}%'` : '',
      itemName: query => query ? `line.item_name ILIKE '%${query.trim()}%'` : '',
    },

    additionalCondition: ` AND line.server_doc_type = 'INTERNAL_SALES_QUOTATION' AND line.status = 'ACTIVE'`
  }


export const jobsheetLineItemSearchModel: SearchModel = {
    label: {
      docNo: 'Jobsheet No.',
      itemCode: 'Item Code',
      itemName: 'Item Name',
    },

    dataType: {
      docNo: 'string',
      itemCode: 'string',
      itemName: 'string',
    },

    form: new FormGroup({
      docNo: new FormControl(),
      itemCode: new FormControl(),
      itemName: new FormControl(),
    }),

    joins: [
      { type: 'INNER JOIN', table: 'bl_fi_generic_doc_line', alias: 'line', onCondition: 'hdr.guid = line.generic_doc_hdr_guid', joinOnBasic: true },
    ],

    query: (query) =>
      `(hdr.server_doc_1 ILIKE '%${query}%' OR line.item_code ILIKE '%${query}%' OR line.item_name ILIKE '%${query}%')
      AND line.server_doc_type = 'INTERNAL_JOBSHEET' AND line.status = 'ACTIVE'`,

    table: 'bl_fi_generic_doc_hdr',

    queryCallbacks: {
      docNo: query => query ? `hdr.server_doc_1 ILIKE '%${query.trim()}%'`: '',
      itemCode: query => query ? `line.item_code ILIKE '%${query.trim()}%'` : '',
      itemName: query => query ? `line.item_name ILIKE '%${query.trim()}%'` : '',
    },

    additionalCondition: ` AND line.server_doc_type = 'INTERNAL_JOBSHEET' AND line.status = 'ACTIVE'`
  }
