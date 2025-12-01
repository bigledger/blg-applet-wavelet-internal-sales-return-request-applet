import { Action, createReducer, on } from '@ngrx/store';
import { bl_fi_generic_doc_hdr_RowClass } from 'blg-akaun-ts-lib';
import { SalesReturnActions } from '../../../sales-return-controller/store/actions';
import { HDRActions, PaymentActions, PNSActions } from '../actions';
import { initState } from '../states/hdr.states';

export const hdrReducers = createReducer(
  initState,
  on(HDRActions.updateMain, (state, action) => {
    // TODO: get confirmation on data storage
    state.guid_branch = action.form.branch;
    state.guid_store = action.form.location;
    state.doc_reference = action.form.reference;
    state.date_txn = action.form.transactionDate;
    state.doc_ccy = action.form.currency;
    // state.amount_discount = action.form.groupDiscountAmount;
    state.doc_remarks = action.form.remarks;
    state.contact_key_guid = action.form.crmContact;
    // state.member_guid = action.form.memberCard;
    state.doc_entity_hdr_json = <any>{
      ...state.doc_entity_hdr_json,
      creditTerms: action.form.creditTerms,
      // creditLimit: action.form.creditLimit,
      permitNo: action.form.permitNo,
      salesLead: action.form.salesLead
    };
    state.tracking_id = action.form.trackingID;
    return state;
  }),
  on(HDRActions.updateDepartment, (state, action) => {
    state.guid_segment = action.form.segment;
    state.guid_dimension = action.form.dimension;
    state.guid_profit_center = action.form.profitCenter;
    state.guid_project = action.form.project;
    return state;
  }),
  on(HDRActions.updatePosting, (state, action) => {
    state.posting_journal = action.form.journalStatus;
    state.posting_inventory = action.form.inventoryStatus;
    state.posting_membership = action.form.membershipStatus;
    state.posting_cashbook = action.form.cashbookStatus;
    state.posting_tax_gst = action.form.taxStatus;
    return state;
  }),
  on(HDRActions.updateBillingInfo, (state, action) => {
    state.billing_json = <any>{
      ...state.billing_json,
      billingInfo: { ...action.form }
    };
    return state;
  }),
  on(HDRActions.updateShippingInfo, (state, action) => {
    state.delivery_entity_json = <any>{
      ...state.delivery_entity_json,
      shippingInfo: { ...action.form }
    };
    return state;
  }),
  on(SalesReturnActions.selectEntity, (state, action) =>
  ({
    ...state,
    doc_entity_hdr_guid: action.entity.entity.bl_fi_mst_entity_hdr.guid,
    doc_entity_hdr_json: <any>{
      ...state.doc_entity_hdr_json,
      entityId: action.entity.entity.bl_fi_mst_entity_hdr.customer_code,
      entityName: `${action.entity.entity.bl_fi_mst_entity_hdr.name} ${action.entity.contact ? `: ${action.entity.contact.name}` : ''}`,
      status: action.entity.entity.bl_fi_mst_entity_hdr.status,
      email: action.entity.entity.bl_fi_mst_entity_hdr.email,
      phoneNumber: action.entity.entity.bl_fi_mst_entity_hdr.phone,
      glCode: action.entity.entity.bl_fi_mst_entity_ext.find(x => x.param_code === 'GLCODE_INFO')?.value_string,
      idNumber: action.entity.entity.bl_fi_mst_entity_ext.find(x => x.param_code === 'ID_NO')?.value_string,
      entityType: action.entity.entity.bl_fi_mst_entity_hdr.txn_type,
      identityType: action.entity.entity.bl_fi_mst_entity_hdr.id_type,
      description: action.entity.entity.bl_fi_mst_entity_hdr.descr,
      currency: action.entity.entity.bl_fi_mst_entity_ext.find(x => x.param_code === 'CURRENCY')?.value_json.currency,
      creditTerms: null,
      //   creditLimit: null
    },
    billing_json: <any>{
      billingInfo: {
        name: action.entity.entity.bl_fi_mst_entity_hdr.name,
        email: action.entity.entity.bl_fi_mst_entity_hdr.email,
        phoneNo: action.entity.entity.bl_fi_mst_entity_hdr.phone
      }
    },
    delivery_entity_json: <any>{
      shippingInfo: {
        name: action.entity.entity.bl_fi_mst_entity_hdr.name,
        email: action.entity.entity.bl_fi_mst_entity_hdr.email,
        phoneNo: action.entity.entity.bl_fi_mst_entity_hdr.phone
      }
    }
  })),
  on(SalesReturnActions.selectSalesAgent, (state, action) =>
  ({
    ...state,
    property_json: <any>{
      ...state.property_json,
      salesAgent: {
        salesAgentGuid: action.guid,
        salesAgentName: action.name
      }
    },
    pic_entity_01: action.guid
  })),
  on(SalesReturnActions.selectMember, (state, action) =>
  ({
    ...state,
    member_guid: action.guid,
    property_json: <any>{
      ...state.property_json,
      member: {
        memberCardNo: action.cardNo,
        memberName: action.name
      }
    }
  })),

  on(HDRActions.updateBillingInfo, (state, action) => {
    state.billing_json = <any>{
      ...state.billing_json,
      billingInfo: { ...action.form }
    };
    return state;
  }),
  on(HDRActions.updateBillingAddress, (state, action) => {
    state.billing_json = <any>{
      ...state.billing_json,
      billingAddress: {
        name: action.form.billingAddress,
        address_line_1: action.form.addressLine1,
        address_line_2: action.form.addressLine2,
        address_line_3: action.form.addressLine3,
        address_line_4: action.form.addressLine4,
        address_line_5: action.form.addressLine5,
        country: action.form.country,
        city: action.form.city,
        state: action.form.state,
        postal_code: action.form.postcode
      }
    };
    return state;
  }),
  on(HDRActions.updateShippingInfo, (state, action) => {
    state.delivery_entity_json = <any>{
      ...state.delivery_entity_json,
      shippingInfo: { ...action.form }
    };
    return state;
  }),
  on(HDRActions.updateShippingAddress, (state, action) => {
    state.delivery_entity_json = <any>{
      ...state.delivery_entity_json,
      shippingAddress: {
        name: action.form.shippingAddress,
        address_line_1: action.form.addressLine1,
        address_line_2: action.form.addressLine2,
        address_line_3: action.form.addressLine3,
        address_line_4: action.form.addressLine4,
        address_line_5: action.form.addressLine5,
        country: action.form.country,
        city: action.form.city,
        state: action.form.state,
        postal_code: action.form.postcode
      }
    };
    return state;
  }),
  on(PNSActions.addPNS, (state, action) => ({
    ...state,
    amount_discount: <any>((parseFloat(<any>state.amount_discount)) + parseFloat(<any>(action.pns.amount_discount))).toFixed(2),
    amount_net: <any>((parseFloat(<any>state.amount_net)) + parseFloat(<any>(action.pns.amount_net))).toFixed(2),
    amount_std: <any>((parseFloat(<any>state.amount_std)) + parseFloat(<any>(action.pns.amount_std))).toFixed(2),
    amount_tax_gst: <any>((parseFloat(<any>state.amount_tax_gst)) + parseFloat(<any>(action.pns.amount_tax_gst))).toFixed(2),
    amount_tax_wht: <any>((parseFloat(<any>state.amount_tax_wht)) + parseFloat(<any>(action.pns.amount_tax_wht))).toFixed(2),
    amount_txn: <any>((parseFloat(<any>state.amount_txn)) + parseFloat(<any>(action.pns.amount_txn))).toFixed(2),
    amount_open_balance: <any>((parseFloat(<any>state.amount_open_balance)) + parseFloat(<any>(action.pns.amount_txn))).toFixed(2)
  })),
  on(HDRActions.updateBalance, (state, action) => ({
    ...state,
    amount_discount: <any>((parseFloat(<any>state.amount_discount)) + parseFloat(<any>(action.pns.amount_discount))).toFixed(2),
    amount_net: <any>((parseFloat(<any>state.amount_net)) + parseFloat(<any>(action.pns.amount_net))).toFixed(2),
    amount_std: <any>((parseFloat(<any>state.amount_std)) + parseFloat(<any>(action.pns.amount_std))).toFixed(2),
    amount_tax_gst: <any>((parseFloat(<any>state.amount_tax_gst)) + parseFloat(<any>(action.pns.amount_tax_gst))).toFixed(2),
    amount_tax_wht: <any>((parseFloat(<any>state.amount_tax_wht)) + parseFloat(<any>(action.pns.amount_tax_wht))).toFixed(2),
    amount_txn: <any>((parseFloat(<any>state.amount_txn)) + parseFloat(<any>(action.pns.amount_txn))).toFixed(2),
    amount_open_balance: <any>((parseFloat(<any>state.amount_open_balance)) + parseFloat(<any>(action.pns.amount_txn))).toFixed(2)
  })),
  on(PaymentActions.addPaymentSuccess, (state, action) => ({
    ...state,
    amount_open_balance:
      <any>((parseFloat(<any>state.amount_open_balance)) - parseFloat(<any>(action.payment.amount_txn))).toFixed(2)
  })),
  on(PaymentActions.editPaymentSuccess, (state, action) => ({
    ...state,
    amount_open_balance:
      <any>((parseFloat(<any>state.amount_open_balance)) - action.diffAmt).toFixed(2)
  })),
  on(PaymentActions.deletePayment, (state, action) => ({
    ...state,
    amount_open_balance:
      <any>((parseFloat(<any>state.amount_open_balance)) - action.diffAmt).toFixed(2)
  })),

  on(HDRActions.resetHDR, (state, action) => {
    return {
      guid: null,
      doc_source_type: 'INTERNAL',
      server_doc_type: 'INTERNAL_SALES_RETURN_REQUEST',
      server_doc_1: null,
      server_doc_2: null,
      server_doc_3: null,
      server_doc_4: null,
      server_doc_5: null,
      client_guid: null,
      client_doc_type: 'INTERNAL_SALES_RETURN_REQUEST',
      client_doc_1: null,
      client_doc_2: null,
      client_doc_3: null,
      client_doc_4: null,
      client_doc_5: null,
      guid_comp: null,
      guid_branch: null,
      guid_store: null,
      guid_profit_center: null,
      guid_segment: null,
      guid_project: null,
      guid_dimension: null,
      foreign_ccy: null,
      base_doc_guid: null,
      base_doc_ccy: null,
      base_doc_xrate: null,
      doc_ccy: 'MYR',
      amount_cogs: null,
      amount_std: <any>'0.00',
      amount_net: <any>'0.00',
      amount_discount: <any>'0.00',
      amount_tax_gst: <any>'0.00',
      amount_tax_wht: <any>'0.00',
      amount_txn: <any>'0.00',
      amount_json: null,
      amount_open_balance: <any>'0.00',
      amount_gst_balance: null,
      amount_wht_balance: null,
      amount_signum: 0,
      doc_reference: null,
      doc_desc: null,
      doc_remarks: null,
      doc_reference_tax_num: null,
      doc_reference_tax_date: null,
      doc_entity_hdr_guid: null,
      doc_entity_hdr_json: null,
      doc_entity_line_guid: null,
      doc_entity_line_json: null,
      gst_entity_hdr_guid: null,
      gst_entity_hdr_json: null,
      gst_entity_tax_num: null,
      gst_entity_type: null,
      gst_entity_contact_json: null,
      display_entity_json: null,
      delivery_entity_json: null,
      foreign_references_json: null,
      label_json: null,
      status_json: null,
      property_json: null,
      status_client: null,
      status_server: null,
      billing_json: null,
      credit_terms_json: null,
      log_json: null,
      date_txn: new Date(),
      process: null,
      status: null,
      doc_level: null,
      revision: null,
      vrsn: null,
      created_by_subject_guid: null,
      updated_by_subject_guid: null,
      created_date: null,
      updated_date: null,
      module_guid: null,
      applet_guid: null,
      acl_config: null,
      acl_policy: null,
      code_company: null,
      code_branch: null,
      code_location: null,
      contact_hdr_guid: null,
      contact_key_guid: null,
      posting_inventory: null,
      posting_journal: null,
      posting_tax_gst: null,
      posting_tax_wht: null,
      posting_membership: null,
      posting_running_no: null,
      member_guid: null,
      client_doc_status_01: null,
      client_doc_status_02: null,
      client_doc_status_03: null,
      client_doc_status_04: null,
      client_doc_status_05: null,
      client_entity_code: null,
      client_doc_date_01: null,
      client_doc_date_02: null,
      client_doc_date_03: null,
      client_doc_date_04: null,
      client_doc_date_05: null,
      client_value: null,
      pic_entity_01: null,
      pic_entity_02: null,
      pic_entity_03: null,
      guid_store_2: null,
      arap_pns_amount: null,
      arap_stlm_amount: null,
      arap_doc_open: null,
      arap_contra: null,
      arap_bal: null,
      tracking_id: null,
      posting_cashbook: null,
      posting_status: null,
      client_key: null,
      cfg_production: null,
      cfg_delivery: null,
      del_region_hdr_guid: null,
      del_region_hdr_reg_code: null,
      del_region_hdr_state: null,
      track_production_logic: null,
      track_production_table: null,
      track_production_guid: null,
      track_production_id: null,
      track_production_time_estimated: null,
      track_production_time_actual: null,
      track_production_time_planned: null,
      track_production_pic_name: null,
      track_production_pic_contact: null,
      track_production_remarks: null,
      track_production_status: null,
      track_delivery_logic: null,
      track_delivery_table: null,
      track_delivery_guid: null,
      track_delivery_id: null,
      track_delivery_time_estimated: null,
      track_delivery_time_actual: null,
      track_delivery_time_planned: null,
      track_delivery_pic_name: null,
      track_delivery_pic_contact: null,
      track_delivery_remarks: null,
      track_delivery_status: null
    };
  }),

  on(SalesReturnActions.resetDraft, (state, action) => {
    return {
      guid: null,
      doc_source_type: 'INTERNAL',
      server_doc_type: 'INTERNAL_SALES_RETURN_REQUEST',
      server_doc_1: null,
      server_doc_2: null,
      server_doc_3: null,
      server_doc_4: null,
      server_doc_5: null,
      client_guid: null,
      client_doc_type: 'INTERNAL_SALES_RETURN_REQUEST',
      client_doc_1: null,
      client_doc_2: null,
      client_doc_3: null,
      client_doc_4: null,
      client_doc_5: null,
      guid_comp: null,
      guid_branch: null,
      guid_store: null,
      guid_profit_center: null,
      guid_segment: null,
      guid_project: null,
      guid_dimension: null,
      foreign_ccy: null,
      base_doc_guid: null,
      base_doc_ccy: null,
      base_doc_xrate: null,
      doc_ccy: 'MYR',
      amount_cogs: null,
      amount_std: <any>'0.00',
      amount_net: <any>'0.00',
      amount_discount: <any>'0.00',
      amount_tax_gst: <any>'0.00',
      amount_tax_wht: <any>'0.00',
      amount_txn: <any>'0.00',
      amount_json: null,
      amount_open_balance: <any>'0.00',
      amount_gst_balance: null,
      amount_wht_balance: null,
      amount_signum: 0,
      doc_reference: null,
      doc_desc: null,
      doc_remarks: null,
      doc_reference_tax_num: null,
      doc_reference_tax_date: null,
      doc_entity_hdr_guid: null,
      doc_entity_hdr_json: null,
      doc_entity_line_guid: null,
      doc_entity_line_json: null,
      gst_entity_hdr_guid: null,
      gst_entity_hdr_json: null,
      gst_entity_tax_num: null,
      gst_entity_type: null,
      gst_entity_contact_json: null,
      display_entity_json: null,
      delivery_entity_json: null,
      foreign_references_json: null,
      label_json: null,
      status_json: null,
      property_json: null,
      status_client: null,
      status_server: null,
      billing_json: null,
      credit_terms_json: null,
      log_json: null,
      date_txn: new Date(),
      process: null,
      status: null,
      doc_level: null,
      revision: null,
      vrsn: null,
      created_by_subject_guid: null,
      updated_by_subject_guid: null,
      created_date: null,
      updated_date: null,
      module_guid: null,
      applet_guid: null,
      acl_config: null,
      acl_policy: null,
      code_company: null,
      code_branch: null,
      code_location: null,
      contact_hdr_guid: null,
      contact_key_guid: null,
      posting_inventory: null,
      posting_journal: null,
      posting_tax_gst: null,
      posting_tax_wht: null,
      posting_membership: null,
      posting_running_no: null,
      member_guid: null,
      client_doc_status_01: null,
      client_doc_status_02: null,
      client_doc_status_03: null,
      client_doc_status_04: null,
      client_doc_status_05: null,
      client_entity_code: null,
      client_doc_date_01: null,
      client_doc_date_02: null,
      client_doc_date_03: null,
      client_doc_date_04: null,
      client_doc_date_05: null,
      client_value: null,
      pic_entity_01: null,
      pic_entity_02: null,
      pic_entity_03: null,
      guid_store_2: null,
      arap_pns_amount: null,
      arap_stlm_amount: null,
      arap_doc_open: null,
      arap_contra: null,
      arap_bal: null,
      tracking_id: null,
      posting_cashbook: null,
      posting_status: null,
      client_key: null,
      cfg_production: null,
      cfg_delivery: null,
      del_region_hdr_guid: null,
      del_region_hdr_reg_code: null,
      del_region_hdr_state: null,
      track_production_logic: null,
      track_production_table: null,
      track_production_guid: null,
      track_production_id: null,
      track_production_time_estimated: null,
      track_production_time_actual: null,
      track_production_time_planned: null,
      track_production_pic_name: null,
      track_production_pic_contact: null,
      track_production_remarks: null,
      track_production_status: null,
      track_delivery_logic: null,
      track_delivery_table: null,
      track_delivery_guid: null,
      track_delivery_id: null,
      track_delivery_time_estimated: null,
      track_delivery_time_actual: null,
      track_delivery_time_planned: null,
      track_delivery_pic_name: null,
      track_delivery_pic_contact: null,
      track_delivery_remarks: null,
      track_delivery_status: null
    };
  }),

  on(SalesReturnActions.selectReturnForEdit, (state, action) => ({
    ...state,
    ...action.genDoc.bl_fi_generic_doc_hdr
  })),
  on(SalesReturnActions.selectShippingAddress, (state, action) =>
  ({
    ...state, delivery_entity_json: {
      ...state.delivery_entity_json,
      shippingAddress: { ...action.shipping_address }
    }
  })),
  on(SalesReturnActions.selectBillingAddress, (state, action) =>
  ({
    ...state, billing_json: {
      ...state.billing_json,
      billingAddress: { ...action.billing_address }
    }
  })),
);

export function reducers(state: bl_fi_generic_doc_hdr_RowClass | undefined, action: Action) {
  return hdrReducers(state, action);
}
