import { FormControl, FormGroup } from '@angular/forms';
import { SearchModel } from '../search-model';

export const importLineSearchModel: SearchModel = {
    label: {
      docNo: 'Doc No',
      docType: 'Doc Type'
    },
    dataType: {
      docNo: 'string',
      docType: 'select'
    },
  
    form: new FormGroup({
      docNo: new FormControl(),
      docType: new FormControl()
    }),
  
    joins: [
      { type: 'INNER JOIN', table: 'bl_fi_generic_doc_line', alias: 'lines', onCondition: 'lines.generic_doc_hdr_guid = hdr.guid', joinOnBasic: true },
    ],
  
    query: (query) => 
      `hdr.status = 'ACTIVE' AND lines.status = 'ACTIVE' AND lines.txn_type = 'PNS' AND (hdr.server_doc_1 ILIKE '%${query}%' OR hdr.server_doc_type ILIKE '%${query}%' )`,
  
    table: 'bl_fi_generic_doc_hdr',
  
    queryCallbacks: {
      docNo: query => query ? `hdr.server_doc_1 ILIKE '%${query.trim()}%'` : '',
      docType: query => query ? `hdr.server_doc_type ILIKE '%${query.trim()}%'` : '',
    },
  
    additionalCondition: ` AND hdr.status ='ACTIVE' AND lines.status = 'ACTIVE' `
  };

  export const importKOSearchModel: SearchModel = {
    label: {
      docNo: 'Doc No',
      refNo: 'Ref No',
      // branch: 'Branch',
      // location: 'Location',
      // supplier: 'Supplier',
      creationDate: 'Txn Date',
    },
    dataType: {
      docNo: 'string',
      refNo: 'string',
      // branch: 'string',
      // location: 'string',
      // supplier: 'string',
      creationDate: 'date',
    },
    form: new FormGroup({
      docNo: new FormControl(),
      refNo: new FormControl(),
      // branch: new FormControl(),
      // location: new FormControl(),
      // supplier: new FormControl(),
      creationDate: new FormGroup({
        from: new FormControl(),
        to: new FormControl()
      }),
    }),
  
    joins: [
      // { type: 'INNER JOIN', table: 'bl_fi_mst_branch', alias: 'branch', onCondition: 'hdr.guid_branch = branch.guid', joinOnBasic: true },
      // { type: 'INNER JOIN', table: 'bl_fi_mst_entity_hdr', alias: 'supplier', onCondition: 'hdr.doc_entity_hdr_guid = supplier.guid', joinOnBasic: true },
      { type: 'INNER JOIN', table: 'bl_fi_generic_doc_line_open_queue', alias: 'queue', onCondition: 'hdr.guid = queue.guid_doc_1_hdr', joinOnBasic: true },
      // { type: 'INNER JOIN', table: 'bl_inv_mst_location', alias: 'location', onCondition: 'hdr.guid_store = location.guid', joinOnBasic: true },
    ],
  
    query: (query) => 
      `hdr.status = 'ACTIVE' AND (hdr.server_doc_1 ILIKE '%${query}%')`,
  
    table: 'bl_fi_generic_doc_hdr',
  
    queryCallbacks: {
      docNo: query => query ? `hdr.server_doc_1 ILIKE '%${query.trim()}%'` : '',
      refNo: query => query ? `hdr.doc_reference ILIKE '%${query.trim()}%'` : '',
      // branch: query => query ? `branch.name ILIKE '%${query.trim()}%'` : '',
      // location: query => query ? `location.name ILIKE '%${query.trim()}%'` : '',
      // supplier: query => query ? `supplier.name ILIKE '%${query.trim()}%' AND supplier.is_supplier = true` : '',
      creationDate: query => {
        if (query.from || query.to) {
          // assign creationDate.from to itself or creationDate.to if null
          const from = query.from ? `hdr.date_txn >= '${query.from.format('YYYY-MM-DD')}'` : '';
          // assign creationDate.to to itself or creationDate.from if null
          const to = query.to ? `hdr.date_txn < '${query.to.format('YYYY-MM-DD')}'` : '';
          return `(${from} ${(from && to) ? 'AND' : ''} ${to})`;
        }
        return '';
      },
      // docType: query => query ? `hdr.server_doc_type ILIKE '%${query.trim()}%'` : '',
    },

    additionalCondition: ` AND hdr.status ='ACTIVE'`
  };