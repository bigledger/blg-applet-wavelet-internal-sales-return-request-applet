import { Action, createReducer, on } from '@ngrx/store';
import { bl_fi_generic_doc_hdr_RowClass } from 'blg-akaun-ts-lib';
import { InternalSalesReturnActions } from '../../../internal-sales-return-controller/store/actions';
import { HDRActions, PNSActions, SettlementActions } from '../actions';
import { initState } from '../states/hdr.states';

export const hdrReducers = createReducer(
    initState,
    on(HDRActions.updateMain, (state, action) => {
        // TODO: get confirmation on data storage
        state.guid_comp = action.form.company ? action.form.company : state.guid_comp;
        state.guid_branch = action.form.branch ? action.form.branch : state.guid_branch;
        state.guid_store = action.form.location ? action.form.location : state.guid_store;
        state.doc_reference = action.form.reference ? action.form.reference : state.doc_reference;
        state.date_txn = action.form.transactionDate ? action.form.transactionDate : state.date_txn;
        state.base_doc_ccy = action.form.baseCurrency? action.form.baseCurrency : 'MYR';
        state.base_doc_xrate = action.form.currencyRate? <any>action.form.currencyRate : <any>state.base_doc_xrate;
        state.doc_ccy = action.form.currency;
        state.foreign_ccy = state.doc_ccy !== state.base_doc_ccy;
        // state.amount_discount = action.form.groupDiscountAmount;
        state.doc_remarks = action.form.remarks ? action.form.remarks : state.doc_remarks;


        state.wf_process_hdr_guid = action.form.processGuid ? action.form.processGuid : state.wf_process_hdr_guid;
        state.wf_process_status_guid = action.form.processStatusGuid ? action.form.processStatusGuid : state.wf_process_status_guid;
        state.wf_resolution_guid = action.form.resolutionGuid ? action.form.resolutionGuid : state.wf_resolution_guid;
        // state.contact_key_guid = action.form.crmContact;
        state.sales_entity_hdr_guid = action.form.salesAgent ? action.form.salesAgent : state.sales_entity_hdr_guid;
        state.doc_entity_hdr_json = action.form.creditTerms ? <any>{
            ...state.doc_entity_hdr_json,
            // salesAgent: action.form.salesAgent,
            // groupDiscount: action.form.groupDiscount,
            // salesLead: action.form.salesLead,
            // shipVia: action.form.shipVia,
            trackingID: action.form.trackingID,
            creditTerms: action.form.creditTerms ? action.form.creditTerms : (<any>state.doc_entity_hdr_json)?.creditTerms ? (<any>state.doc_entity_hdr_json)?.creditTerms : null,
            creditLimit: action.form.creditLimit ? action.form.creditLimit : (<any>state.doc_entity_hdr_json)?.creditLimit ? (<any>state.doc_entity_hdr_json)?.creditLimit : null,
            permitNo: action.form.permitNo
        } : state.doc_entity_hdr_json;
        state.doc_entity_hdr_json = action.form.reasonOfRepair ? <any>{
            ...state.doc_entity_hdr_json,
            reasonOfRepair: action.form.reasonOfRepair
        } : state.doc_entity_hdr_json;
        state.tracking_id = action.form.trackingID ? action.form.trackingID : state.tracking_id;
        state.due_date = action.form.dueDate ? action.form.dueDate : state.due_date;
        state.delivery_branch_guid = action.form.deliveryBranch ? action.form.deliveryBranch : state.delivery_branch_guid;
        state.delivery_location_guid = action.form.deliveryLocation ? action.form.deliveryLocation : state.delivery_location_guid;
        state.delivery_branch_code = action.form.deliveryBranchCode ? action.form.deliveryBranchCode : state.delivery_branch_code;
        state.delivery_location_code = action.form.deliveryLocationCode ? action.form.deliveryLocationCode : state.delivery_location_code;
        state.forex_source_hdr_guid = action.form.forexSourceHdrGuid ? action.form.forexSourceHdrGuid : state.forex_source_hdr_guid;
        state.forex_source_history_guid = action.form.forexSourceHistoryGuid ? action.form.forexSourceHistoryGuid: state.forex_source_history_guid;
        return state;
    }),
    on(HDRActions.updateMainOnKOImport, (state, action) => {
        // TODO: get confirmation on data storage
        state.guid_comp = action.genDocHdr.bl_fi_generic_doc_hdr.guid_comp;
        state.guid_branch = action.genDocHdr.bl_fi_generic_doc_hdr.guid_branch;
        state.guid_store = action.genDocHdr.bl_fi_generic_doc_hdr.guid_store;
        state.doc_reference = action.genDocHdr.bl_fi_generic_doc_hdr.doc_reference;
        // state.date_txn = action.genDocHdr.bl_fi_generic_doc_hdr.date_txn;
        state.doc_ccy = action.genDocHdr.bl_fi_generic_doc_hdr.doc_ccy;
        // state.amount_discount = action.form.groupDiscountAmount;
        state.doc_remarks = action.genDocHdr.bl_fi_generic_doc_hdr.doc_remarks;
        state.contact_key_guid = action.genDocHdr.bl_fi_generic_doc_hdr.contact_key_guid;
        // state.member_guid = action.form.memberCard;
        state.doc_entity_hdr_guid = action.genDocHdr.bl_fi_generic_doc_hdr.doc_entity_hdr_guid;
        state.doc_entity_hdr_json = action.genDocHdr.bl_fi_generic_doc_hdr.doc_entity_hdr_json;
        state.billing_json = action.genDocHdr.bl_fi_generic_doc_hdr.billing_json;
        state.delivery_entity_json = action.genDocHdr.bl_fi_generic_doc_hdr.delivery_entity_json;
        state.tracking_id = action.genDocHdr.bl_fi_generic_doc_hdr.tracking_id;
        state.property_json = action.genDocHdr.bl_fi_generic_doc_hdr.property_json;
        state.sales_entity_hdr_guid = action.genDocHdr.bl_fi_generic_doc_hdr.sales_entity_hdr_guid;
        state.due_date = action.genDocHdr.bl_fi_generic_doc_hdr.due_date ? action.genDocHdr.bl_fi_generic_doc_hdr.due_date : state.due_date;
        state.delivery_branch_guid = action.genDocHdr.bl_fi_generic_doc_hdr.delivery_branch_guid;
        state.delivery_location_guid = action.genDocHdr.bl_fi_generic_doc_hdr.delivery_location_guid;
        state.delivery_branch_code = action.genDocHdr.bl_fi_generic_doc_hdr.delivery_branch_code;
        state.delivery_location_code = action.genDocHdr.bl_fi_generic_doc_hdr.delivery_location_code;
        state.guid_profit_center = action.genDocHdr.bl_fi_generic_doc_hdr.guid_profit_center;
    state.guid_segment = action.genDocHdr.bl_fi_generic_doc_hdr.guid_segment;
    state.guid_project = action.genDocHdr.bl_fi_generic_doc_hdr.guid_project;
    state.guid_dimension = action.genDocHdr.bl_fi_generic_doc_hdr.guid_dimension;
        //e-invoice
    state.einvoice_submission_type = action.genDocHdr.bl_fi_generic_doc_hdr.einvoice_submission_type;
    state.original_einvoice_ref_no = action.genDocHdr.bl_fi_generic_doc_hdr.einvoice_number;
    state.einvoice_buyer_entity_hdr_json = action.genDocHdr.bl_fi_generic_doc_hdr.einvoice_buyer_entity_hdr_json;
    state.einvoice_main_document_ref_to_irb_lhdn_document_guid = action.genDocHdr.bl_fi_generic_doc_hdr.einvoice_to_irb_lhdn_document_guid;
    state.einvoice_main_document_ref_irb_guid = action.genDocHdr.bl_fi_generic_doc_hdr.einvoice_to_irb_hdr_guid;
        return state;
    }),
    on(InternalSalesReturnActions.selectMember, (state, action) =>
    ({
        ...state,
        member_guid: action.member.bl_crm_membership_hdr.guid,
        property_json: <any>{
            ...state.property_json,
            memberCardNo: action.member.bl_crm_membership_hdr.card_no
        },

    })),
    on(HDRActions.updateDepartment, (state, action) => {
        state.guid_segment = action.form.segment;
        state.guid_dimension = action.form.dimension;
        state.guid_profit_center = action.form.profitCenter;
        state.guid_project = action.form.project;
        return state;
    }),
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
                stateCode: action.form.stateCode,
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
                stateCode: action.form.stateCode,
                postal_code: action.form.postcode
            }
        };
        return state;
    }),
    on(InternalSalesReturnActions.selectEntity, (state, action) => {
        const entityCcyDoc = action.entity.entity.bl_fi_mst_entity_hdr.ccy_code
        ? action.entity.entity.bl_fi_mst_entity_hdr.ccy_code
        : (
            action.entity.entity.bl_fi_mst_entity_ext.find(x => x.param_code === 'CURRENCY')?.value_json?.currency || ''
          );

        const isCurrencyMatched =
          (entityCcyDoc === null || entityCcyDoc.trim() === '' || entityCcyDoc === state.base_doc_ccy) ||
          (state.doc_ccy === entityCcyDoc) || (state.posting_status === 'FINAL') || (state.forex_source_hdr_guid);
    return {
        ...state,
        doc_ccy: isCurrencyMatched ? state.doc_ccy : entityCcyDoc,
        base_doc_xrate: isCurrencyMatched ? state.base_doc_xrate : 0,
        doc_entity_hdr_guid: action.entity.entity.bl_fi_mst_entity_hdr.guid,
        doc_entity_hdr_json: <any>{
            ...state.doc_entity_hdr_json,
            entityId: action.entity.entity.bl_fi_mst_entity_hdr.customer_code,
            entityName: `${action.entity.entity.bl_fi_mst_entity_hdr.name} ${action.entity.contact ? `: ${action.entity.contact.name}` : ''}`,
            status: action.entity.entity.bl_fi_mst_entity_hdr.status,
            email: action.entity.entity.bl_fi_mst_entity_hdr.email,
            phoneNumber: action.entity.entity.bl_fi_mst_entity_hdr.phone,
            glCode: action.entity.entity.bl_fi_mst_entity_ext.find(x => x.param_code === 'GLCODE_INFO')?.value_string,
            idNumber: action.entity.entity.bl_fi_mst_entity_hdr.id_no ?? action.entity.entity.bl_fi_mst_entity_ext.find(x => x.param_code === 'ID_NO')?.value_string,
            entityType: action.entity.entity.bl_fi_mst_entity_hdr.txn_type,
            identityType: action.entity.entity.bl_fi_mst_entity_hdr.id_type,
            description: action.entity.entity.bl_fi_mst_entity_hdr.descr,
            currency: entityCcyDoc,
            einvoiceTaxIdNo: action.entity.entity.bl_fi_mst_entity_hdr.einvoice_tax_id_no,
            sstNumber: action.entity.entity.bl_fi_mst_entity_hdr.sst_number
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
    }}),
    on(InternalSalesReturnActions.selectShippingAddress, (state, action) =>
    ({
        ...state, delivery_entity_json: {
            ...state.delivery_entity_json,
            shippingAddress: { ...action.shipping_address }
        }
    })),
    on(InternalSalesReturnActions.selectBillingAddress, (state, action) =>
    ({
        ...state, billing_json: {
            ...state.billing_json,
            billingAddress: { ...action.billing_address }
        }
    })),
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
    on(SettlementActions.addSettlementSuccess, (state, action) => ({
        ...state,
        amount_open_balance:
            <any>((parseFloat(<any>state.amount_open_balance)) - parseFloat(<any>(action.settlement.amount_txn))).toFixed(2)
    })),
    on(SettlementActions.editSettlementSuccess, (state, action) => ({
        ...state,
        amount_open_balance:
            <any>((parseFloat(<any>state.amount_open_balance)) - action.diffAmt).toFixed(2)
    })),
    on(SettlementActions.deleteSettlement, (state, action) => ({
        ...state,
        amount_open_balance:
            <any>((parseFloat(<any>state.amount_open_balance)) - action.diffAmt).toFixed(2)
    })),

    on(HDRActions.resetHDR, (state, action) => {
        return Object.assign(new bl_fi_generic_doc_hdr_RowClass(), {
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
            guid_store_2: null,
            tracking_id: null,
            client_value: null,
            pic_entity_01: null,
            pic_entity_02: null,
            pic_entity_03: null,
            arap_pns_amount: null,
            arap_bal: null,
            arap_contra: null,
            arap_doc_open: null,
            arap_stlm_amount: null,
            posting_cashbook: null,
            posting_inventory: null,
            posting_journal: null,
            posting_tax_gst: null,
            posting_tax_wht: null,
            posting_membership: null,
            posting_running_no: null,
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
            track_delivery_date_requested: null,
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
            track_delivery_status: null,
            reseller_entity_hdr_guid: null,
            reseller_member_hdr_guid: null,
            sales_entity_hdr_guid: null,
            sales_member_hdr_guid: null,
            far_hdr_guid: null,
            device_guid: null,
            due_date: null,
            server_doc_location: null,
            pickup_branch_guid: null,
            valid_days: null,
            end_datetime: null,
            delivery_branch_guid: null,
            delivery_branch_code: null,
            delivery_location_guid: null,
            delivery_location_code: null,
            doc_internal_remarks: null,
            landed_cost_amount: null,
            apportion_type: null,
            custom_status: null,
            marketplace_status: null,
            wf_process_hdr_guid: null,
            wf_process_status_guid: null,
            wf_resolution_guid: null,
            sales_entity_hdr_name: null,
            sales_entity_hdr_code: null,
            pic_entity_01_name: null,
            pic_entity_02_name: null,
            pic_entity_03_name: null,
            notification_email: null,
            notification_phone: null,
            client_salesman_code: null,
            entity_branch_hdr_guid: null,
            intercompany_hdr_guid: null,
            intercompany_line_guid: null,
            mkt_payment_status: null,
            bill_to: null,
            mkt_order_no: null,
            doc_external_remarks: null,
            marketplace_shipping_fee: null,
            intercompany_execute: null,
            intercompany_target_doc_type: null,
            src_intercompany_hdr_guid: null,
            print_count: null,
            print_status: null,
            delivery_required: null,
            forex_source_hdr_guid: null,
            forex_source_history_guid: null

        });
    }),

    on(InternalSalesReturnActions.resetDraft, (state, action) => {
        return Object.assign(new bl_fi_generic_doc_hdr_RowClass(), {
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
            guid_store_2: null,
            tracking_id: null,
            client_value: null,
            pic_entity_01: null,
            pic_entity_02: null,
            pic_entity_03: null,
            arap_pns_amount: null,
            arap_bal: null,
            arap_contra: null,
            arap_doc_open: null,
            arap_stlm_amount: null,
            posting_cashbook: null,
            posting_inventory: null,
            posting_journal: null,
            posting_tax_gst: null,
            posting_tax_wht: null,
            posting_membership: null,
            posting_running_no: null,
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
            track_delivery_date_requested: null,
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
            track_delivery_status: null,
            reseller_entity_hdr_guid: null,
            reseller_member_hdr_guid: null,
            sales_entity_hdr_guid: null,
            sales_member_hdr_guid: null,
            far_hdr_guid: null,
            device_guid: null,
            due_date: null,
            server_doc_location: null,
            pickup_branch_guid: null,
            valid_days: null,
            end_datetime: null,
            delivery_branch_guid: null,
            delivery_branch_code: null,
            delivery_location_guid: null,
            delivery_location_code: null,
            doc_internal_remarks: null,
            landed_cost_amount: null,
            apportion_type: null,
            custom_status: null,
            marketplace_status: null,
            wf_process_hdr_guid: null,
            wf_process_status_guid: null,
            wf_resolution_guid: null,
            sales_entity_hdr_name: null,
            sales_entity_hdr_code: null,
            pic_entity_01_name: null,
            pic_entity_02_name: null,
            pic_entity_03_name: null,
            notification_email: null,
            notification_phone: null,
            client_salesman_code: null,
            entity_branch_hdr_guid: null,
            intercompany_hdr_guid: null,
            intercompany_line_guid: null,
            mkt_payment_status: null,
            bill_to: null,
            mkt_order_no: null,
            doc_external_remarks: null,
            marketplace_shipping_fee: null,
            intercompany_execute: null,
            intercompany_target_doc_type: null,
            src_intercompany_hdr_guid: null,
            print_count: null,
            print_status: null,
            delivery_required: null,
            forex_source_hdr_guid: null,
            forex_source_history_guid: null
        });
    }),

    on(InternalSalesReturnActions.selectSalesReturnForEdit, (state, action) => ({
        ...state,
        ...action.genDoc.bl_fi_generic_doc_hdr
    })),
    on(InternalSalesReturnActions.updateAfterContra, (state, action) => {
        state = action.genDoc.bl_fi_generic_doc_hdr
        // state.arap_contra = action.genDoc.bl_fi_generic_doc_hdr.arap_contra;
        // state.revision = action.genDoc.bl_fi_generic_doc_hdr.revision;
        // state.updated_by_subject_guid = action.genDoc.bl_fi_generic_doc_hdr.updated_by_subject_guid;
        // state.updated_date = action.genDoc.bl_fi_generic_doc_hdr.updated_date;
        return state;
    }),
    on(HDRActions.updateDeliveryType, (state, action) => {
        state.track_delivery_logic = action.deliveryType;
        return state;
    }),
    on(HDRActions.updateSalesAgent, (state, action) => {
        state.sales_entity_hdr_guid = action.salesAgent ? action.salesAgent : state.sales_entity_hdr_guid;
        return state;
    }),
    on(HDRActions.setEntityBranchHdr, (state, action) => ({
        ...state, entity_branch_hdr_guid: action.guid
      })),
    on(HDRActions.setBranchIntercompanySettingGuids, (state, action) => ({
        ...state, intercompany_settings_json: action.setting
      })),
    //   e-invoice
    on(InternalSalesReturnActions.updateEInvoiceDetails, (state, action) =>
        ({
            ...state,
            einvoice_submission_type: action.form.submissionType,
            // einvoice_buyer_entity_hdr_guid: action.form.guid,
            einvoice_buyer_entity_hdr_json: <any>{
                ...state.einvoice_buyer_entity_hdr_json,
                entityId: action.form.buyerEntityId,
                entityName: action.form.buyerName,
                // status: action.form.status,
                email: action.form.buyerEmail,
                phoneNumber: action.form.buyerContactNo,
                buyerSalesServiceTaxId: action.form.buyerSalesServiceTaxId,
                idNumber: action.form.buyerIdNo,
                // entityType: action.form.txn_type,
                // identityType: action.form.id_type,
                // description: action.form.descr,
                // currency: action.form.ccy_code,
                einvoiceTaxIdNo: action.form.buyerTaxId,
                buyerIdType: action.form.buyerIdType,

                einvoiceAddress: {
                    buyerAddressName: action.form.buyerAddressName,
                    buyerAddressLine1: action.form.buyerAddressLine1,
                    buyerAddressLine2: action.form.buyerAddressLine2,
                    buyerAddressLine3: action.form.buyerAddressLine3,
                    buyerAddressLine4: action.form.buyerAddressLine4,
                    buyerAddressLine5: action.form.buyerAddressLine5,
                    buyerCountry: action.form.buyerCountry,
                    buyerState: action.form.buyerState,
                    buyerStateCode: action.form.buyerStateCode,
                    buyerCity: action.form.buyerCity,
                    buyerPostcode: action.form.buyerPostcode?.toString(),
                }
            },
            // billing_json: <any>{
            //     billingInfo: {
            //         name: action.form.name,
            //         email: action.form.email,
            //         phoneNo: action.form.phone
            //     }
            // },
            // delivery_entity_json: <any>{
            //     ...state.delivery_entity_json,
            //     shippingInfo: {
            //         name: action.form.name,
            //         email: action.form.email,
            //         phoneNo: action.form.phone
            //     }
            // }
        })),

        on(InternalSalesReturnActions.updateSingleGeneralDetails, (state, action) =>
            ({
                ...state,
                einvoice_submission_type: action.form.submissionType,
                skip_einvoice: action.form.skipEInvoice,
                einvoice_entity_hdr_guid: action.form.einvoiceEntityHdrGuid,
                einvoice_entity_hdr_json: <any>{
                    ...state.einvoice_entity_hdr_json,
                    email: action.form.buyerEmail,
                    entityId: action.form.buyerEntityId,
                    idNumber: action.form.buyerIdNo,
                    entityName: action.form.buyerName,
                    entityIdType: action.form.buyerIdType,
                    phoneNumber: action.form.buyerContactNo,
                    einvoiceTaxIdNo: action.form.buyerTaxId,
                    entitySalesServiceTaxId: action.form.buyerSalesServiceTaxId,
                    einvoiceAddress: {
                        entityAddressName: action.form.buyerAddressName,
                        entityAddressLine1: action.form.buyerAddressLine1,
                        entityAddressLine2: action.form.buyerAddressLine2,
                        entityAddressLine3: action.form.buyerAddressLine3,
                        entityAddressLine4: action.form.buyerAddressLine4,
                        entityAddressLine5: action.form.buyerAddressLine5,
                        entityCountry: action.form.buyerCountry,
                        entityState: action.form.buyerState,
                        entityStateCode: action.form.buyerStateCode,
                        entityCity: action.form.buyerCity,
                        entityPostcode: action.form.buyerPostcode?.toString(),
                    }
                },
          })),

    on(InternalSalesReturnActions.setEinvoiceSubmissionAnotherCustomerDetails, (state, action) =>
        ({
            ...state,
            einvoice_submission_type: "INDIVIDUAL",
            einvoice_buyer_entity_hdr_guid: action.einvoiceSubmissionAnotherCustomerDetails.bl_fi_mst_entity_hdr.guid,
            einvoice_buyer_entity_hdr_json: <any>{
                ...state.einvoice_buyer_entity_hdr_json,
                entityId: action.einvoiceSubmissionAnotherCustomerDetails.bl_fi_mst_entity_hdr.customer_code,
                entityName: action.einvoiceSubmissionAnotherCustomerDetails.bl_fi_mst_entity_hdr.name,
                // status: action.einvoiceSubmissionAnotherCustomerDetails.bl_fi_mst_entity_hdr.status,
                email: action.einvoiceSubmissionAnotherCustomerDetails.bl_fi_mst_entity_hdr.email,
                phoneNumber: action.einvoiceSubmissionAnotherCustomerDetails.bl_fi_mst_entity_hdr.phone,
                idNumber: action.einvoiceSubmissionAnotherCustomerDetails.bl_fi_mst_entity_hdr.id_no,
                // entityType: action.einvoiceSubmissionAnotherCustomerDetails.bl_fi_mst_entity_hdr.txn_type,
                // identityType: action.einvoiceSubmissionAnotherCustomerDetails.bl_fi_mst_entity_hdr.id_type,
                // description: action.einvoiceSubmissionAnotherCustomerDetails.bl_fi_mst_entity_hdr.descr,
                // currency: action.einvoiceSubmissionAnotherCustomerDetails.bl_fi_mst_entity_hdr.ccy_code,
                einvoiceTaxIdNo: action.einvoiceSubmissionAnotherCustomerDetails.bl_fi_mst_entity_hdr.einvoice_tax_id_no,
                buyerIdType: action.einvoiceSubmissionAnotherCustomerDetails.bl_fi_mst_entity_hdr.id_type,
                einvoiceAddress: {
                    buyerAddressName: action.einvoiceSubmissionAnotherCustomerDetails.bl_fi_mst_entity_hdr.addresses_json?.billing_address?.find(address => address.default_einvoice_address)?.name,
                    buyerAddressLine1: action.einvoiceSubmissionAnotherCustomerDetails.bl_fi_mst_entity_hdr.addresses_json?.billing_address?.find(address => address.default_einvoice_address)?.address_line_1,
                    buyerAddressLine2: action.einvoiceSubmissionAnotherCustomerDetails.bl_fi_mst_entity_hdr.addresses_json?.billing_address?.find(address => address.default_einvoice_address)?.address_line_2,
                    buyerAddressLine3: action.einvoiceSubmissionAnotherCustomerDetails.bl_fi_mst_entity_hdr.addresses_json?.billing_address?.find(address => address.default_einvoice_address)?.address_line_3,
                    buyerAddressLine4: action.einvoiceSubmissionAnotherCustomerDetails.bl_fi_mst_entity_hdr.addresses_json?.billing_address?.find(address => address.default_einvoice_address)?.address_line_4,
                    buyerAddressLine5: action.einvoiceSubmissionAnotherCustomerDetails.bl_fi_mst_entity_hdr.addresses_json?.billing_address?.find(address => address.default_einvoice_address)?.address_line_5,
                    buyerCountry: action.einvoiceSubmissionAnotherCustomerDetails.bl_fi_mst_entity_hdr.addresses_json?.billing_address?.find(address => address.default_einvoice_address)?.country,
                    buyerState: action.einvoiceSubmissionAnotherCustomerDetails.bl_fi_mst_entity_hdr.addresses_json?.billing_address?.find(address => address.default_einvoice_address)?.state,
                    buyerStateCode: action.einvoiceSubmissionAnotherCustomerDetails.bl_fi_mst_entity_hdr.addresses_json?.billing_address?.find(address => address.default_einvoice_address)?.stateCode,
                    buyerCity: action.einvoiceSubmissionAnotherCustomerDetails.bl_fi_mst_entity_hdr.addresses_json?.billing_address?.find(address => address.default_einvoice_address)?.city,
                    buyerPostcode: action.einvoiceSubmissionAnotherCustomerDetails.bl_fi_mst_entity_hdr.addresses_json?.billing_address?.find(address => address.default_einvoice_address)?.postal_code?.toString(),
                }
            },
            // billing_json: <any>{
            //     billingInfo: {
            //         name: action.form.name,
            //         email: action.form.email,
            //         phoneNo: action.form.phone
            //     }
            // },
            // delivery_entity_json: <any>{
            //     ...state.delivery_entity_json,
            //     shippingInfo: {
            //         name: action.form.name,
            //         email: action.form.email,
            //         phoneNo: action.form.phone
            //     }
            // }
        })),

        on(InternalSalesReturnActions.selectEInvoiceMainDocRef, (state, action) =>
        ({
          ...state,
          einvoice_main_document_ref_irb_guid: action.toIrb.bl_fi_my_einvoice_to_irb_hdr.guid,
          einvoice_main_document_ref_to_irb_lhdn_document_guid: action.toIrb.bl_fi_my_einvoice_to_irb_hdr.lhdn_document_guid,
          original_einvoice_ref_no: action.toIrb.bl_fi_my_einvoice_to_irb_hdr.running_no
        })),
);

export function reducers(state: bl_fi_generic_doc_hdr_RowClass | undefined, action: Action) {
    return hdrReducers(state, action);
}
