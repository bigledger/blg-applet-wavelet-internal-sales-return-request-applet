import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { UUID } from 'angular2-uuid';
import { bl_fi_generic_doc_hdr_RowClass, bl_fi_generic_doc_line_RowClass, bl_fi_generic_doc_link_RowClass, EmployeeService, FinancialItemService } from 'blg-akaun-ts-lib';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from '../../../../facades/view-column.facade';
import { DraftStates } from '../../../../state-controllers/draft-controller/store/states';
import { InternalSalesReturnActions } from '../../../../state-controllers/internal-sales-return-controller/store/actions';
import { InternalSalesReturnSelectors } from '../../../../state-controllers/internal-sales-return-controller/store/selectors';
import { InternalSalesReturnStates } from '../../../../state-controllers/internal-sales-return-controller/store/states';
import { LineItemAddBatchNumberComponent } from './batch-number/batch-number.component';
import { LineItemAddBinNumberComponent } from './bin-number/bin-number.component';
import { LineItemDetailsComponent } from './item-details/item-details.component';
import { LineItemAddSerialNumberComponent } from './serial-number/serial-number.component';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';
import { ClientSidePermissionsSelectors } from 'projects/shared-utilities/modules/permission/client-side-permissions-controller/selectors';
import { ClientSidePermissionStates } from 'projects/shared-utilities/modules/permission/client-side-permissions-controller/states';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { AppletSettings } from '../../../../models/applet-settings.model';
import { HDRSelectors } from '../../../../state-controllers/draft-controller/store/selectors';
import { ColumnViewModelStates } from '../../../../state-controllers/sales-return-view-model-controller/store/states';
import { AppletConstants } from '../../../../models/constants/applet-constants';
import { UtilItemSerialNumberComponent } from 'projects/shared-utilities/utilities/serial-number/serial-number.component';
import { Column4ViewSelectors } from '../../../../state-controllers/sales-return-view-model-controller/store/selectors';
import { Column4ViewModelActions } from '../../../../state-controllers/sales-return-view-model-controller/store/actions';
import { SubItemType } from '../../../../models/constants/sub-item-type-constants';
interface LocalState {
  deactivateReturn: boolean;
  deactivateIssueLinkList: boolean;
  selectedIndex: number;
  addItemSelectedIndex: number;
  itemSelectedIndex: number;
  serialSelectedIndex: number;
}
@Component({
  selector: 'app-add-line-item',
  templateUrl: './add-line-item.component.html',
  styleUrls: ['./add-line-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class AddLineItemComponent extends ViewColumnComponent {

  protected subs = new SubSink();

  protected compName = 'Add Line Item';
  protected readonly index = 8;
  protected localState: LocalState;
  protected prevLocalState: any;
  hideSalesAgent: boolean;

  masterSettings$ = this.sessionStore.select(SessionSelectors.selectMasterSettings);
  clientSidePermissions$ = this.permissionStore.select(ClientSidePermissionsSelectors.selectAll)

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateReturn$ = this.componentStore.select(state => state.deactivateReturn);
  readonly selectedIndex$ = this.componentStore.select(state => state.addItemSelectedIndex);
  readonly itemSelectedIndex$ = this.componentStore.select(state => state.itemSelectedIndex);
  readonly serialSelectedIndex$ = this.componentStore.select(state => state.serialSelectedIndex);

  mode$ = this.store.select(InternalSalesReturnSelectors.selectMode);
  lineItem$ = this.store.select(InternalSalesReturnSelectors.selectLineItem);
  hdr$ = this.draftStore.select(HDRSelectors.selectHdr);

  appletSettings$ = combineLatest([
    this.sessionStore.select(SessionSelectors.selectMasterSettings),
    this.sessionStore.select(SessionSelectors.selectPersonalSettings)
  ]).pipe(map(([a, b]) => ({...a, ...b})));

  prevIndex: number;
  apiVisa = AppConfig.apiVisa;
  deleteConfirmation: boolean = false;
  mode: string;
  subItemType;
  showCostingDetails;
  itemData: any;
  binNumberTabInvalid: boolean = false;
  total: number = 0;

  @ViewChild(MatTabGroup) matTab: MatTabGroup;
  @ViewChild(LineItemDetailsComponent) itemDetails: LineItemDetailsComponent;
  @ViewChild(UtilItemSerialNumberComponent) serialNumber: UtilItemSerialNumberComponent;
  @ViewChild(LineItemAddBatchNumberComponent) batchNumber: LineItemAddBatchNumberComponent;
  @ViewChild(LineItemAddBinNumberComponent) binNumber: LineItemAddBinNumberComponent;
  hdrData: bl_fi_generic_doc_hdr_RowClass = new bl_fi_generic_doc_hdr_RowClass();
  postingStatus;
  ColumnViewSelectors = Column4ViewSelectors;
  ColumnViewActions = Column4ViewModelActions;
  serialNumberListing$ = this.viewModelStore.select(Column4ViewSelectors.selectSerialNumberTab_ScanTab_SerialNumbersListing);
  fiItemData$ = this.viewModelStore.select(Column4ViewSelectors.selectFIItem);
  serverDocType = AppletConstants.docType;
  SUB_ITEM_TYPE = SubItemType;
  readonly draft$ = this.draftStore.select(HDRSelectors.selectHdr);
  readonly invItem$ = this.store.select(InternalSalesReturnSelectors.selectInvItem);
  serialNumberTabColor$ = this.viewModelStore.select(Column4ViewSelectors.selectSerialNumberTab_Color);
  appletSettings: AppletSettings;
  orientation: boolean = false;

  constructor(
    private employeeService: EmployeeService,
    private viewModelStore: Store<ColumnViewModelStates>,
    private viewColFacade: ViewColumnFacade,
    private readonly componentStore: ComponentStore<LocalState>,
    protected readonly permissionStore: Store<ClientSidePermissionStates>,
    protected readonly sessionStore: Store<SessionStates>,
    private readonly store: Store<InternalSalesReturnStates>,
    private readonly draftStore: Store<DraftStates>,
    private fiService: FinancialItemService,
  ) {
    super();
  }

  ngOnInit() {
    this.subs.sink = this.masterSettings$.subscribe({ next: (resolve: AppletSettings) => {
      this.appletSettings = resolve } });

      this.subs.sink = this.clientSidePermissions$.subscribe({
        next: (resolve) => {
          resolve.forEach(permission => {
            if (permission.perm_code === "SHOW_COSTING_DETAILS") {
              this.showCostingDetails = true;
              console.log(this.showCostingDetails);
            }
        })
        }
      });

    this.subs.sink = this.appletSettings$.subscribe({ next: (resolve: AppletSettings) => {
      this.appletSettings = resolve } });

    this.subs.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.subs.sink = this.mode$.subscribe({ next: (resolve: string) => this.mode = resolve });
    this.subs.sink = this.lineItem$.pipe(
      switchMap(item => this.fiService.getByGuid(item.item_guid.toString(), this.apiVisa))
    ).subscribe(
      {
        next: (resolve: any) => {
          if (resolve.data) {
            this.subItemType = resolve.data.bl_fi_mst_item_hdr.sub_item_type;
          }
        }
      }
    );

    this.subs.sink = this.hdr$.subscribe(data=>{
      if(data){
        this.hdrData = data
      }
    })

    this.subs.sink = this.fiItemData$.subscribe(
      (itemData) => this.itemData = itemData
    );
  }

  async onAdd() {
    const line = new bl_fi_generic_doc_line_RowClass();
    line.guid = UUID.UUID().toLowerCase();
    line.einvoice_taxable_type_code = this.itemDetails.main.form.value?.einvoiceTaxTypeCode;
    line.item_guid = this.itemDetails.main.form.value.itemGuid;
    line.item_code = this.itemDetails.main.form.value.itemCode;
    line.sales_entity_hdr_guid = this.itemDetails.main.form.value?.salesAgent;
    line.item_name = this.itemDetails.main.form.value.itemName;

    if (this.itemData?.bl_fi_mst_item_hdr?.txn_type?.toString() === "GL_CODE") {
      line.guid_glcode = this.itemData.bl_fi_mst_item_hdr.glcode_guid;
    }
    line.einvoice_item_classification_code = this.itemData?.bl_fi_mst_item_hdr?.einvoice_item_classification_code || '';
    line.einvoice_item_classification_desc = this.itemData?.bl_fi_mst_item_hdr?.einvoice_item_classification_desc || '';

    if (line?.sales_entity_hdr_guid) {
      try {
        const response = await this.employeeService.getByGuid(line.sales_entity_hdr_guid.toString(), AppConfig.apiVisa).toPromise();
        line.sales_entity_hdr_name = response.data.bl_fi_mst_entity_hdr.name;
        line.sales_entity_hdr_code = response.data.bl_fi_mst_entity_hdr.employee_code;
      } catch (error) {
        console.error('Error fetching employee information:', error);
        // Handle the error as needed
      }
    }
    line.quantity_base = this.itemDetails.main.form.value.qty;
    line.amount_std = this.itemDetails.main.form.value.stdAmt;
    line.amount_discount = this.itemDetails.main.form.value.discountAmt;
    line.amount_net = this.itemDetails.main.form.value.netAmt;
    line.tax_gst_code = this.itemDetails.main.form.value.taxCode;
    line.tax_gst_rate = this.itemDetails.main.form.value.taxPercent;
    line.tax_gst_type = this.itemDetails.main.form.value.taxGSTtype;
    line.amount_tax_gst = this.itemDetails.main.form.value.taxAmt;
    line.tax_wht_code = this.itemDetails.main.form.value.whtCode;
    line.tax_wht_rate = this.itemDetails.main.form.value.whtPercent;
    line.amount_tax_wht = this.itemDetails.main.form.value.whtAmt;
    line.amount_txn = this.itemDetails.main.form.value.txnAmt;
    line.item_remarks = this.itemDetails.main.form.value.remarks;
    line.item_txn_type = this.itemDetails.main.form.value.item_txn_type
    line.item_sub_type = this.itemDetails.main.form.value.item_sub_type;
    line.guid_dimension = this.itemDetails.dept.form.value.dimension;
    line.guid_profit_center = this.itemDetails.dept.form.value.profitCenter;
    line.guid_project = this.itemDetails.dept.form.value.project;
    line.guid_segment = this.itemDetails.dept.form.value.segment;
    line.item_property_json = { ...this.itemDetails.main.form.value };
    if (this.itemDetails.delivery) {
      line.line_property_json = <any>{ delivery_instructions: { ...this.itemDetails.delivery.form.value } };
    }
    line.unit_price_std = this.itemDetails.main.form.value.unitPriceStdWithoutTax;
    line.unit_price_txn = this.itemDetails.main.form.value.unitPriceTxn;
    line.unit_price_std_by_uom = this.itemDetails.main.form.value.unitPriceStdUom;
    line.unit_price_txn_by_uom = this.itemDetails.main.form.value.unitPriceTxnUom;
    line.unit_disc_by_uom = this.itemDetails.main.form.value.unitDiscountUom;
    line.uom = this.itemDetails.main.form.value.uom;
    line.uom_to_base_ratio = this.itemDetails.main.form.value.uomBaseRatio;
    line.qty_by_uom = parseFloat(this.itemDetails.main.form.value.qtyUom);
    line.txn_type = 'PNS';
    line.quantity_signum = 0;
    line.amount_signum = 0;
    line.server_doc_type = 'INTERNAL_SALES_RETURN_REQUEST';
    line.client_doc_type = 'INTERNAL_SALES_RETURN_REQUEST';
    line.date_txn = new Date();
    line.status = 'ACTIVE';
    line.serial_no = this.subItemType === this.SUB_ITEM_TYPE.serialNumber ? <any>this.serialNumber.serialNumbers  : null;
    line.batch_no = this.subItemType === 'BATCH_NUMBER' ? <any>{ batches: this.batchNumber.batchNumbers } : null;
    line.bin_no = this.subItemType === 'BIN_NUMBER' ? <any>{ bins: this.binNumber.binNumbers } : null;
    line.unit_price_net = this.itemDetails.main.form.value.unitPriceNet;
    line.tax_tariff_code = this.itemDetails.main.form.value.tariffCode;
    line.einvoice_taxable_type_code = this.itemDetails.main.form.value?.einvoiceTaxTypeCode;
    line.einvoice_taxable_type_desc = this.itemDetails.main.form.value?.einvoiceTaxTypeDesc;
    line.einvoice_uom = this.itemDetails.main.form.value?.einvoice_uom;
    console.log('line', line);

     if(this.itemData?.bl_fi_mst_item_hdr?.txn_type==='GROUPED_ITEM'){
      this.subs.sink = this.store.select(InternalSalesReturnSelectors.selectChildItems).subscribe(data => {
        const filteredChild = data.filter(c=> c.enteredQty && Number(c.enteredQty)>0);
        const lineList = filteredChild.map((item) => {
          const price = item.unitPrice?item.unitPrice:0;
          const qty = item.enteredQty && item.enteredQty>0?item.enteredQty:0;
          return {
            guid: UUID.UUID().toLocaleLowerCase(),
            item_code: item.code,
            item_name: item.name,
            item_guid: item.item_hdr_guid,
            amount_std: <any>price*qty,
            amount_discount: <any>0,
            amount_txn: <any>price*qty,
            amount_net: <any>price*qty,
            unit_price_std: <any>price,
            unit_discount: <any>0,
            unit_price_txn: <any>price,
            unit_price_net: <any>price,
            quantity_base: item.enteredQty,
          };
        });
        line.item_child_json = <any>{
          childItems: lineList
        }
        const totalAmount = lineList.reduce((acc, item) => acc + item.amount_std, 0);

        line.amount_std = <any> totalAmount;
        line.amount_txn = <any> totalAmount;
        line.amount_net = <any> totalAmount;

      })
    }

    // Delivery Required form
    console.log("main:: ", this.itemDetails);
    if(this.itemDetails.linedelivery){
      line.cfg_delivery = this.itemDetails.linedelivery.form.value.requireDelivery;
      line.del_region_hdr_guid = this.itemDetails.linedelivery.form.value.regionGuid;
      line.del_region_hdr_reg_code = this.itemDetails.linedelivery.form.value.regionCode;
      line.del_region_hdr_state = this.itemDetails.linedelivery.form.value.regionState;
      line.track_delivery_time_planned = this.itemDetails.linedelivery.form.value.planDeliveryDate;
      line.track_delivery_time_estimated = this.itemDetails.linedelivery.form.value.estimateDeliveryDate;
      line.track_delivery_time_actual = this.itemDetails.linedelivery.form.value.actualDeliveryDate;
      line.track_delivery_date_requested =  this.itemDetails.linedelivery.form.value.requestedDeliveryDate;
      line.track_delivery_logic = this.itemDetails.linedelivery.form.value.deliveryLogic;
      line.track_delivery_id = this.itemDetails.linedelivery.form.value.deliveryId;
      line.track_delivery_pic_name = this.itemDetails.linedelivery.form.value.picName;
      line.track_delivery_pic_contact = this.itemDetails.linedelivery.form.value.picContact;
      line.track_delivery_status = this.itemDetails.linedelivery.form.value.deliveryStatus;
      line.track_delivery_remarks = this.itemDetails.linedelivery.form.value.remarks;

      line.delivery_branch_guid = this.hdrData.delivery_branch_guid ? this.hdrData.delivery_branch_guid : this.itemDetails.linedelivery.form.value.deliveryBranch;
      line.delivery_branch_code = this.hdrData.delivery_branch_code ? this.hdrData.delivery_branch_code : this.itemDetails.linedelivery.form.value.deliveryBranchCode;
      line.delivery_location_guid = this.hdrData.delivery_location_guid ? this.hdrData.delivery_location_guid : this.itemDetails.linedelivery.form.value.deliveryLocation;
      line.delivery_location_code = this.hdrData.delivery_location_code ? this.hdrData.delivery_location_code : this.itemDetails.linedelivery.form.value.deliveryLocationCode;
    }
    // Add gen_doc_link here - item type means it is off an existing order
    if (this.itemDetails.main.form.value.itemType) {
      const link = new bl_fi_generic_doc_link_RowClass();
      link.guid_doc_2_line = line.guid;
      link.guid_doc_1_hdr = this.itemDetails.main.form.value.hdrGuid;
      link.guid_doc_1_line = this.itemDetails.main.form.value.lineGuid;
      link.server_doc_type_doc_1_hdr = this.itemDetails.main.form.value.serverDocTypeHdr;
      link.server_doc_type_doc_1_line = this.itemDetails.main.form.value.serverDocTypeLine;
      link.server_doc_type_doc_2_hdr = 'INTERNAL_SALES_RETURN_REQUEST';
      link.server_doc_type_doc_2_line = 'INTERNAL_SALES_RETURN_REQUEST';
      link.txn_type = this.getLinkTxnType(this.itemDetails.main.form.value.itemType);
      link.quantity_signum = 0;
      link.quantity_contra = line.quantity_base;
      link.date_txn = new Date();
      console.log('link', link);
      this.viewColFacade.addLink(link);
    }
    if (line.item_txn_type === 'NSTI') {
      line.quantity_signum = 0;
      line.amount_signum = 0;
      line.server_doc_type = 'INTERNAL_PURCHASE_TRADE_IN';
      line.client_doc_type = 'INTERNAL_PURCHASE_TRADE_IN';

      const arrSN: any[] = [];
      if (this.itemDetails?.main?.form.value.tradeInSerial) {
        arrSN.push(this.itemDetails.main.form.value.tradeInSerial)
      }
      line.serial_no = <any>{ serialNumbers: arrSN };
    }

    this.viewColFacade.addLineItem(line, this.mode);
    console.log("lineData",line);
  }

  getLinkTxnType(itemType: string): string {
    switch (itemType) {
      case 'sales':
        return 'ISO_ISSalesReturn';
      case 'purchQuotation':
        return 'IPQO_ISSalesReturn'
      case 'purchRequisition':
        return 'IPRO_ISSalesReturn'
      case 'jobsheet':
        return 'IJS_ISSalesReturn'
      case 'purchOrder':
        return 'IPO_ISSalesReturn'
      case 'deliveryOrder':
        return 'IODO_ISSalesReturn'
      case 'purchaseInvoice':
        return 'IPI_ISSalesReturn'
    }
  }

  disableAdd() {
    if(this.subItemType === this.SUB_ITEM_TYPE.binNumber && this.appletSettings?.MANDATORY_BIN_NUMBER) {
      return this.itemDetails?.main.form.invalid || this.binNumberTabInvalid;
    }
    return this.itemDetails?.main.form.invalid;
  }

  updateBinNumberTabState() {
    if (this.appletSettings?.MANDATORY_BIN_NUMBER) {
      this.binNumberTabInvalid = this.total === 0;
    } else {
      this.binNumberTabInvalid = false;
    }
  }

  updateBinTotal(total: number) {
    this.total = total;
    this.updateBinNumberTabState();
  }

  goToEditIssueLink() {
    if (!this.localState.deactivateIssueLinkList) {
      this.viewColFacade.updateInstance(this.index, {
        ...this.localState,
        deactivateReturn: true,
        deactivateIssueLinkList: true
      });
      this.viewColFacade.onNextAndReset(this.index, 12);
    }
  }

  onPricingDetailsEdit(pricingScheme: any) {
    this.store.dispatch(InternalSalesReturnActions.selectPricingScheme({ pricingScheme }));
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState,
      deactivateReturn: true,
      deactivateList: true
    });
    this.viewColFacade.onNextAndReset(this.index, 19);
  }

  onReturn() {
    this.viewColFacade.updateInstance<LocalState>(this.prevIndex, {
      ...this.prevLocalState,
      deactivateReturn: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  showPanels(): boolean {
    if(this.appletSettings?.VERTICAL_ORIENTATION){
      if(this.appletSettings?.DEFAULT_ORIENTATION === 'HORIZONTAL'){
        this.orientation = false;
      } else {
        this.orientation = true;
      }
    } else {
      if(this.appletSettings?.DEFAULT_ORIENTATION === 'VERTICAL'){
        this.orientation = true;
      } else {
        this.orientation = false;
      }
    }
    return this.orientation;
  }

  ngOnDestroy() {
    if (this.matTab) {
      this.viewColFacade.updateInstance<LocalState>(this.index, {
        ...this.localState,
        // selectedIndex: this.matTab.selectedIndex,
        addItemSelectedIndex: this.matTab.selectedIndex,
        itemSelectedIndex: this.itemDetails.matTab.selectedIndex,
        serialSelectedIndex: this.subItemType === 'SERIAL_NUMBER' ? this.serialNumber.matTab?.selectedIndex : null
      });
    }
    this.subs.unsubscribe();
  }

}
