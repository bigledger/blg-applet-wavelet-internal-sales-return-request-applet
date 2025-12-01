import { FormControl, FormGroup } from '@angular/forms';
import { SearchModel } from '../search-model';

export const lineItemSearchModel: SearchModel = {
  label: {
    orderNo: 'Sales Return No.',
    itemCode: 'Item Code',
    itemName: 'Item Name',
    txnAmt: 'Txn Amt'
  },

  dataType: {
    orderNo: 'string',
    itemCode: 'string',
    itemName: 'string',
    txnAmt: 'numberRange'
  },

  form: new FormGroup({
    orderNo: new FormControl(),
    itemCode: new FormControl(),
    itemName: new FormControl(),
    txnAmt: new FormGroup({
      from: new FormControl(),
      to: new FormControl()
    }),
  }),

  joins: [
    { type: 'INNER JOIN', table: 'bl_fi_generic_doc_line', alias: 'line', onCondition: 'hdr.guid = line.generic_doc_hdr_guid', joinOnBasic: true },
  ],

  query: (query) => 
    `(hdr.server_doc_1 ILIKE '%${query}%' OR line.item_code ILIKE '%${query}%' OR line.item_name ILIKE '%${query}%') 
    AND line.server_doc_type = 'INTERNAL_SALES_RETURN_REQUEST' AND line.status = 'ACTIVE'`,

  table: 'bl_fi_generic_doc_hdr',

  queryCallbacks: {
    orderNo: query => query ? `hdr.server_doc_1 ILIKE '%${query.trim()}%'`: '',
    itemCode: query => query ? `line.item_code ILIKE '%${query.trim()}%'` : '',
    itemName: query => query ? `line.item_name ILIKE '%${query.trim()}%'` : '',
    txnAmt: query => {
      if (query.from || query.to) {
        // assign creationDate.from to itself or creationDate.to if null
        const from = query.from ? `line.amount_txn >= ${query.from}` : '';
        // assign creationDate.to to itself or creationDate.from if null
        const to = query.to ? `line.amount_txn <= ${query.to}` : '';
        return `${from} ${(from && to) ? 'AND' : ''} ${to}`;
      }
      return '';
    },
  },

  additionalCondition: ` AND line.server_doc_type = 'INTERNAL_SALES_RETURN_REQUEST' AND line.status = 'ACTIVE'`
};

export const blanketLineItemSearchModel: SearchModel = {
  label: {
    orderNo: 'Blanket Order No.',
    itemCode: 'Item Code',
    itemName: 'Item Name',
  },

  dataType: {
    orderNo: 'string',
    itemCode: 'string',
    itemName: 'string',
  },

  form: new FormGroup({
    orderNo: new FormControl(),
    itemCode: new FormControl(),
    itemName: new FormControl(),
  }),

  joins: [
    { type: 'INNER JOIN', table: 'bl_fi_generic_doc_line', alias: 'line', onCondition: 'hdr.guid = line.generic_doc_hdr_guid', joinOnBasic: true },
  ],

  query: (query) => 
    `(hdr.server_doc_1 ILIKE '%${query}%' OR line.item_code ILIKE '%${query}%' OR line.item_name ILIKE '%${query}%') 
    AND line.server_doc_type = 'INTERNAL_BLANKET_PURCHASE_ORDER' AND line.status = 'ACTIVE'`,

  table: 'bl_fi_generic_doc_hdr',

  queryCallbacks: {
    orderNo: query => query ? `hdr.server_doc_1 ILIKE '%${query.trim()}%'`: '',
    itemCode: query => query ? `line.item_code ILIKE '%${query.trim()}%'` : '',
    itemName: query => query ? `line.item_name ILIKE '%${query.trim()}%'` : '',
  },

  additionalCondition: ` AND line.server_doc_type = 'INTERNAL_BLANKET_PURCHASE_ORDER' AND line.status = 'ACTIVE'`
};

export const salesQuotationLineItemSearchModel: SearchModel = {
  label: {
    orderNo: 'Sales Quotation No.',
    itemCode: 'Item Code',
    itemName: 'Item Name',
  },

  dataType: {
    orderNo: 'string',
    itemCode: 'string',
    itemName: 'string',
  },

  form: new FormGroup({
    orderNo: new FormControl(),
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
    orderNo: query => query ? `hdr.server_doc_1 ILIKE '%${query.trim()}%'`: '',
    itemCode: query => query ? `line.item_code ILIKE '%${query.trim()}%'` : '',
    itemName: query => query ? `line.item_name ILIKE '%${query.trim()}%'` : '',
  },

  additionalCondition: ` AND line.server_doc_type = 'INTERNAL_SALES_QUOTATION' AND line.status = 'ACTIVE'`
};

export const purchQuotationLineItemSearchModel: SearchModel = {
  label: {
    orderNo: 'Purchase Quotation No.',
    itemCode: 'Item Code',
    itemName: 'Item Name',
  },

  dataType: {
    orderNo: 'string',
    itemCode: 'string',
    itemName: 'string',
  },

  form: new FormGroup({
    orderNo: new FormControl(),
    itemCode: new FormControl(),
    itemName: new FormControl(),
  }),

  joins: [
    { type: 'INNER JOIN', table: 'bl_fi_generic_doc_line', alias: 'line', onCondition: 'hdr.guid = line.generic_doc_hdr_guid', joinOnBasic: true },
  ],

  query: (query) => 
    `(hdr.server_doc_1 ILIKE '%${query}%' OR line.item_code ILIKE '%${query}%' OR line.item_name ILIKE '%${query}%') 
    AND line.server_doc_type = 'INTERNAL_PURCHASE_QUOTATION' AND line.status = 'ACTIVE'`,

  table: 'bl_fi_generic_doc_hdr',

  queryCallbacks: {
    orderNo: query => query ? `hdr.server_doc_1 ILIKE '%${query.trim()}%'`: '',
    itemCode: query => query ? `line.item_code ILIKE '%${query.trim()}%'` : '',
    itemName: query => query ? `line.item_name ILIKE '%${query.trim()}%'` : '',
  },

  additionalCondition: ` AND line.server_doc_type = 'INTERNAL_PURCHASE_QUOTATION' AND line.status = 'ACTIVE'`
}

export const jobsheetLineItemSearchModel: SearchModel = {
  label: {
    orderNo: 'Jobsheet No.',
    itemCode: 'Item Code',
    itemName: 'Item Name',
  },

  dataType: {
    orderNo: 'string',
    itemCode: 'string',
    itemName: 'string',
  },

  form: new FormGroup({
    orderNo: new FormControl(),
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
    orderNo: query => query ? `hdr.server_doc_1 ILIKE '%${query.trim()}%'`: '',
    itemCode: query => query ? `line.item_code ILIKE '%${query.trim()}%'` : '',
    itemName: query => query ? `line.item_name ILIKE '%${query.trim()}%'` : '',
  },

  additionalCondition: ` AND line.server_doc_type = 'INTERNAL_JOBSHEET' AND line.status = 'ACTIVE'`
}

export const salesOrderLineItemSearchModel: SearchModel = {
  label: {
    orderNo: 'Sales Order No.',
    itemCode: 'Item Code',
    itemName: 'Item Name',
  },

  dataType: {
    orderNo: 'string',
    itemCode: 'string',
    itemName: 'string',
  },

  form: new FormGroup({
    orderNo: new FormControl(),
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
    orderNo: query => query ? `hdr.server_doc_1 ILIKE '%${query.trim()}%'`: '',
    itemCode: query => query ? `line.item_code ILIKE '%${query.trim()}%'` : '',
    itemName: query => query ? `line.item_name ILIKE '%${query.trim()}%'` : '',
  },

  additionalCondition: ` AND line.server_doc_type = 'INTERNAL_SALES_ORDER' AND line.status = 'ACTIVE'`
}

export const supplierDeliveryOrderLineItemSearchModel: SearchModel = {
  label: {
    orderNo: 'Delivery Order No.',
    itemCode: 'Item Code',
    itemName: 'Item Name',
  },

  dataType: {
    orderNo: 'string',
    itemCode: 'string',
    itemName: 'string',
  },

  form: new FormGroup({
    orderNo: new FormControl(),
    itemCode: new FormControl(),
    itemName: new FormControl(),
  }),

  joins: [
    { type: 'INNER JOIN', table: 'bl_fi_generic_doc_line', alias: 'line', onCondition: 'hdr.guid = line.generic_doc_hdr_guid', joinOnBasic: true },
  ],

  query: (query) => 
    `(hdr.server_doc_1 ILIKE '%${query}%' OR line.item_code ILIKE '%${query}%' OR line.item_name ILIKE '%${query}%') 
    AND line.server_doc_type = 'INTERNAL_OUTBOUND_DELIVERY_ORDER' AND line.status = 'ACTIVE'`,

  table: 'bl_fi_generic_doc_hdr',

  queryCallbacks: {
    orderNo: query => query ? `hdr.server_doc_1 ILIKE '%${query.trim()}%'`: '',
    itemCode: query => query ? `line.item_code ILIKE '%${query.trim()}%'` : '',
    itemName: query => query ? `line.item_name ILIKE '%${query.trim()}%'` : '',
  },

  additionalCondition: ` AND line.server_doc_type = 'INTERNAL_OUTBOUND_DELIVERY_ORDER' AND line.status = 'ACTIVE'`
}