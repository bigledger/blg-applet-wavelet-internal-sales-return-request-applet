import { FormControl, FormGroup } from '@angular/forms';
import { SearchModel } from '../search-model';
import { UtilitiesModule } from 'projects/shared-utilities/utilities/utilities.module';
import { SearchModelV2 } from 'projects/shared-utilities/models/search-model-v2';
import * as moment from "moment";

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
    { type: 'INNER JOIN', table: 'bl_fi_generic_doc_hdr', alias: 'hdr', onCondition: 'hdr.guid = line.generic_doc_hdr_guid', joinOnBasic: true },
  ],

  query: (query) =>
    `(hdr.server_doc_1 ILIKE '%${query}%' OR line.item_code ILIKE '%${query}%' OR line.item_name ILIKE '%${query}%')
    AND line.server_doc_type = 'INTERNAL_JOBSHEET' AND line.status = 'ACTIVE'`,

  table: 'bl_fi_generic_doc_line',

  queryCallbacks: {
    docNo: query => query ? `hdr.server_doc_1 ILIKE '%${query.trim()}%'` : '',
    itemCode: query => query ? `line.item_code ILIKE '%${query.trim()}%'` : '',
    itemName: query => query ? `line.item_name ILIKE '%${query.trim()}%'` : '',
  },

  additionalCondition: ` AND line.server_doc_type = 'INTERNAL_JOBSHEET' AND line.status = 'ACTIVE'`
}


export const deliveryOrderLineItemSearchModel: SearchModel = {
  label: {
    docNo: 'Delivery Order No.',
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
    { type: 'INNER JOIN', table: 'bl_fi_generic_doc_hdr', alias: 'hdr', onCondition: 'hdr.guid = line.generic_doc_hdr_guid', joinOnBasic: true },
  ],

  query: (query) =>
    `(hdr.server_doc_1 ILIKE '%${query}%' OR line.item_code ILIKE '%${query}%' OR line.item_name ILIKE '%${query}%')
    AND line.server_doc_type = 'INTERNAL_OUTBOUND_DELIVERY_ORDER' AND line.status = 'ACTIVE'`,

  table: 'bl_fi_generic_doc_line',

  queryCallbacks: {
    docNo: query => query ? `hdr.server_doc_1 ILIKE '%${query.trim()}%'` : '',
    itemCode: query => query ? `line.item_code ILIKE '%${query.trim()}%'` : '',
    itemName: query => query ? `line.item_name ILIKE '%${query.trim()}%'` : '',
  },

  additionalCondition: ` AND line.server_doc_type = 'INTERNAL_OUTBOUND_DELIVERY_ORDER' AND line.status = 'ACTIVE'`
}

export const salesLineItemSearchModel: SearchModel = {
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
    { type: 'INNER JOIN', table: 'bl_fi_generic_doc_hdr', alias: 'hdr', onCondition: 'hdr.guid = line.generic_doc_hdr_guid', joinOnBasic: true },
  ],

  query: (query) =>
    `(hdr.server_doc_1 ILIKE '%${query}%' OR line.item_code ILIKE '%${query}%' OR line.item_name ILIKE '%${query}%')
    AND line.server_doc_type = 'INTERNAL_SALES_ORDER' AND line.status = 'ACTIVE'`,

  table: 'bl_fi_generic_doc_line',

  queryCallbacks: {
    docNo: query => query ? `hdr.server_doc_1 ILIKE '%${query.trim()}%'` : '',
    itemCode: query => query ? `line.item_code ILIKE '%${query.trim()}%'` : '',
    itemName: query => query ? `line.item_name ILIKE '%${query.trim()}%'` : '',
  },

  additionalCondition: ` AND line.server_doc_type = 'INTERNAL_SALES_ORDER' AND line.status = 'ACTIVE'`
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
    orderNo: query => query ? `hdr.server_doc_1 ILIKE '%${query.trim()}%'` : '',
    itemCode: query => query ? `line.item_code ILIKE '%${query.trim()}%'` : '',
    itemName: query => query ? `line.item_name ILIKE '%${query.trim()}%'` : '',
  },

  additionalCondition: ` AND line.server_doc_type = 'INTERNAL_SALES_QUOTATION' AND line.status = 'ACTIVE'`
};

export const lineItemSearchModel: SearchModelV2 = {
  label: {
    branch: 'Branch',
    keyword: 'Item Code/Name',
    transactionDate: 'Transaction Date',
    createdDate: 'Created Date',
    updatedDate: 'Updated Date'
  },

  dataType: {
    branch: 'select-multi-branch',
    keyword: 'string',
    transactionDate: 'date',
    createdDate: 'date',
    updatedDate: 'date',
  },

  form: new FormGroup({
    branch: new FormControl(),
    keyword: new FormControl(),
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
  }),

  options: {
    branch: {'multiple': true},
    keyword: {},
    transactionDate: {'checkbox': true, checked: true},
    createdDate: {'checkbox': true},
    updatedDate: {'checkbox': true},
  }
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
    orderNo: query => query ? `hdr.server_doc_1 ILIKE '%${query.trim()}%'` : '',
    itemCode: query => query ? `line.item_code ILIKE '%${query.trim()}%'` : '',
    itemName: query => query ? `line.item_name ILIKE '%${query.trim()}%'` : '',
  },

  additionalCondition: ` AND line.server_doc_type = 'INTERNAL_BLANKET_PURCHASE_ORDER' AND line.status = 'ACTIVE'`
};

export const purchReturnLineItemSearchModel: SearchModel = {
  label: {
    orderNo: 'Purchase Return No.',
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
    AND line.server_doc_type = 'INTERNAL_PURCHASE_GOODS_RECEIVED_NOTE' AND line.status = 'ACTIVE'`,

  table: 'bl_fi_generic_doc_hdr',

  queryCallbacks: {
    orderNo: query => query ? `hdr.server_doc_1 ILIKE '%${query.trim()}%'` : '',
    itemCode: query => query ? `line.item_code ILIKE '%${query.trim()}%'` : '',
    itemName: query => query ? `line.item_name ILIKE '%${query.trim()}%'` : '',
  },

  additionalCondition: ` AND line.server_doc_type = 'INTERNAL_PURCHASE_GOODS_RECEIVED_NOTE' AND line.status = 'ACTIVE'`
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
    orderNo: query => query ? `hdr.server_doc_1 ILIKE '%${query.trim()}%'` : '',
    itemCode: query => query ? `line.item_code ILIKE '%${query.trim()}%'` : '',
    itemName: query => query ? `line.item_name ILIKE '%${query.trim()}%'` : '',
  },

  additionalCondition: ` AND line.server_doc_type = 'INTERNAL_PURCHASE_QUOTATION' AND line.status = 'ACTIVE'`
}

export const purchRequisitionLineItemSearchModel: SearchModel = {
  label: {
    orderNo: 'Purchase Requisition No.',
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
    AND line.server_doc_type = 'INTERNAL_PURCHASE_REQUISITION' AND line.status = 'ACTIVE'`,

  table: 'bl_fi_generic_doc_hdr',

  queryCallbacks: {
    orderNo: query => query ? `hdr.server_doc_1 ILIKE '%${query.trim()}%'` : '',
    itemCode: query => query ? `line.item_code ILIKE '%${query.trim()}%'` : '',
    itemName: query => query ? `line.item_name ILIKE '%${query.trim()}%'` : '',
  },

  additionalCondition: ` AND line.server_doc_type = 'INTERNAL_PURCHASE_REQUISITION' AND line.status = 'ACTIVE'`
}

export const purchOrderLineItemSearchModel: SearchModel = {
  label: {
    orderNo: 'Purchase Order No.',
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
    AND line.server_doc_type = 'INTERNAL_PURCHASE_ORDER' AND line.status = 'ACTIVE'`,

  table: 'bl_fi_generic_doc_hdr',

  queryCallbacks: {
    orderNo: query => query ? `hdr.server_doc_1 ILIKE '%${query.trim()}%'` : '',
    itemCode: query => query ? `line.item_code ILIKE '%${query.trim()}%'` : '',
    itemName: query => query ? `line.item_name ILIKE '%${query.trim()}%'` : '',
  },

  additionalCondition: ` AND line.server_doc_type = 'INTERNAL_PURCHASE_ORDER' AND line.status = 'ACTIVE'`
}

export const supplierDeliveryOrderLineItemSearchModel: SearchModel = {
  label: {
    orderNo: 'Supplier Delivery Order No.',
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
    orderNo: query => query ? `hdr.server_doc_1 ILIKE '%${query.trim()}%'` : '',
    itemCode: query => query ? `line.item_code ILIKE '%${query.trim()}%'` : '',
    itemName: query => query ? `line.item_name ILIKE '%${query.trim()}%'` : '',
  },

  additionalCondition: ` AND line.server_doc_type = 'INTERNAL_OUTBOUND_DELIVERY_ORDER' AND line.status = 'ACTIVE'`
}

export const salesInvoiceLineItemSearchModel: SearchModel = {
  label: {
    docNo: 'Sales Invoice No.',
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
    { type: 'INNER JOIN', table: 'bl_fi_generic_doc_hdr', alias: 'hdr', onCondition: 'hdr.guid = line.generic_doc_hdr_guid', joinOnBasic: true },
  ],

  query: (query) =>
    `(hdr.server_doc_1 ILIKE '%${query}%' OR line.item_code ILIKE '%${query}%' OR line.item_name ILIKE '%${query}%')
    AND line.server_doc_type = 'INTERNAL_SALES_INVOICE' AND line.status = 'ACTIVE'`,

  table: 'bl_fi_generic_doc_line',

  queryCallbacks: {
    docNo: query => query ? `hdr.server_doc_1 ILIKE '%${query.trim()}%'` : '',
    itemCode: query => query ? `line.item_code ILIKE '%${query.trim()}%'` : '',
    itemName: query => query ? `line.item_name ILIKE '%${query.trim()}%'` : '',
  },

  additionalCondition: ` AND line.server_doc_type = 'INTERNAL_SALES_INVOICE' AND line.status = 'ACTIVE'`
};
