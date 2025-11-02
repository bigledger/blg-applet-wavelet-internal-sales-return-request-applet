import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import {
  bl_fi_generic_doc_line_RowClass, bl_fi_generic_doc_link_RowClass,
  FinancialItemService,
  InternalSalesOrderService,
  InternalJobsheetService,
  InternalOutboundDeliveryOrderService,
  InternalSalesQuotationService,
  EmployeeService
} from 'blg-akaun-ts-lib';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { EMPTY, iif, of, combineLatest } from 'rxjs';
import { delay, mergeMap, switchMap, tap, map } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from '../../../../facades/view-column.facade';
import { AppletConstants } from '../../../../models/constants/applet-constants';
import { LinkActions, PNSActions } from '../../../../state-controllers/draft-controller/store/actions';
import { HDRSelectors, LinkSelectors, PNSSelectors } from '../../../../state-controllers/draft-controller/store/selectors';
import { DraftStates } from '../../../../state-controllers/draft-controller/store/states';
import { InternalSalesReturnActions } from '../../../../state-controllers/internal-sales-return-controller/store/actions';
import { InternalSalesReturnSelectors } from '../../../../state-controllers/internal-sales-return-controller/store/selectors';
import { InternalSalesReturnStates } from '../../../../state-controllers/internal-sales-return-controller/store/states';
import { LineItemAddBatchNumberComponent } from '../../sales-return-create/add-line-item/batch-number/batch-number.component';
import { LineItemAddBinNumberComponent } from '../../sales-return-create/add-line-item/bin-number/bin-number.component';
import { LineItemDetailsComponent } from '../../sales-return-create/add-line-item/item-details/item-details.component';
import { LineItemAddSerialNumberComponent } from '../../sales-return-create/add-line-item/serial-number/serial-number.component';
import { AppletSettings } from "../../../../models/applet-settings.model";
import { SessionStates } from "projects/shared-utilities/modules/session/session-controller/states";
import { ClientSidePermissionStates } from "projects/shared-utilities/modules/permission/client-side-permissions-controller/states";
import { SessionSelectors } from "projects/shared-utilities/modules/session/session-controller/selectors";
import { ClientSidePermissionsSelectors } from "projects/shared-utilities/modules/permission/client-side-permissions-controller/selectors";
import { UtilItemSerialNumberComponent } from 'projects/shared-utilities/utilities/serial-number/serial-number.component';
import { ColumnViewModelStates } from '../../../../state-controllers/sales-return-view-model-controller/store/states';
import { Column4ViewSelectors } from '../../../../state-controllers/sales-return-view-model-controller/store/selectors';
import { Column4ViewModelActions } from '../../../../state-controllers/sales-return-view-model-controller/store/actions';
import { SubItemType } from '../../../../models/constants/sub-item-type-constants';
import { UUID } from 'angular2-uuid';

interface LocalState {
  deactivateReturn: boolean;
  deactivateIssueLinkList: boolean;
  selectedIndex: number;
  editItemSelectedIndex: number;
  itemSelectedIndex: number;
  serialSelectedIndex: number;
  deleteConfirmation: boolean;
}

@Component({
  selector: 'app-edit-line-item',
  templateUrl: './edit-line-item.component.html',
  styleUrls: ['./edit-line-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class EditLineItemComponent extends ViewColumnComponent {

  protected subs = new SubSink();

  protected compName = 'Edit Line Item';
  protected readonly index = 9;
  protected localState: LocalState;
  protected prevLocalState: any;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateReturn$ = this.componentStore.select(state => state.deactivateReturn);
  readonly selectedIndex$ = this.componentStore.select(state => state.editItemSelectedIndex);
  readonly itemSelectedIndex$ = this.componentStore.select(state => state.itemSelectedIndex);
  readonly serialSelectedIndex$ = this.componentStore.select(state => state.serialSelectedIndex);
  readonly deleteConfirmation$ = this.componentStore.select(state => state.deleteConfirmation);
  readonly lineItem$ = this.store.select(InternalSalesReturnSelectors.selectLineItem);
  readonly salesReturn$ = this.store.select(InternalSalesReturnSelectors.selectSalesReturn);

  draft$ = this.draftStore.select(HDRSelectors.selectHdr);
  links$ = this.draftStore.select(LinkSelectors.selectAll);
  GenDocActions = InternalSalesReturnActions;
  LinkSelectors = LinkSelectors;
  LinkActions = LinkActions;
  PNSSelectors = PNSSelectors;
  PNSActions = PNSActions;
  AppletConstants = AppletConstants;

  prevIndex: number;
  apiVisa = AppConfig.apiVisa;
  lineItem: bl_fi_generic_doc_line_RowClass;
  deleteConfirmation: boolean = false;
  subItemType;
  postingStatus;
  status;
  appletSettings: AppletSettings;
  masterSettings$ = this.sessionStore.select(SessionSelectors.selectMasterSettings);
  clientSidePermissions$ = this.permissionStore.select(ClientSidePermissionsSelectors.selectAll);
  orientation: boolean = false;
  genDocLock$ = this.store.select(InternalSalesReturnSelectors.selectGenDocLock);

  appletSettings$ = combineLatest([
    this.sessionStore.select(SessionSelectors.selectMasterSettings),
    this.sessionStore.select(SessionSelectors.selectPersonalSettings)
  ]).pipe(map(([a, b]) => ({...a, ...b})));

  @ViewChild(MatTabGroup) matTab: MatTabGroup;
  @ViewChild(LineItemDetailsComponent) itemDetails: LineItemDetailsComponent;
  @ViewChild(UtilItemSerialNumberComponent) serialNumber: UtilItemSerialNumberComponent;
  @ViewChild(LineItemAddBatchNumberComponent) batchNumber: LineItemAddBatchNumberComponent;
  @ViewChild(LineItemAddBinNumberComponent) binNumber: LineItemAddBinNumberComponent;
  showCostingDetails;
  ColumnViewSelectors = Column4ViewSelectors;
  ColumnViewActions = Column4ViewModelActions;
  serialNumberListing$ = this.viewModelStore.select(Column4ViewSelectors.selectSerialNumberTab_ScanTab_SerialNumbersListing);
  serverDocType = AppletConstants.docType;
  SUB_ITEM_TYPE = SubItemType;
  serialNumberTabColor$=this.viewModelStore.select(Column4ViewSelectors.selectSerialNumberTab_Color)
  genDocLock:boolean;
  itemData;
  constructor(
    private employeeService: EmployeeService,
    private readonly viewModelStore: Store<ColumnViewModelStates>,
    private viewColFacade: ViewColumnFacade,
    private fiService: FinancialItemService,
    public InternalSalesOrderService: InternalSalesOrderService,
    public InternalJobsheetService: InternalJobsheetService,
    public InternalOutboundDeliveryOrderService: InternalOutboundDeliveryOrderService,
    public InternalSalesQuotationService: InternalSalesQuotationService,
    private readonly componentStore: ComponentStore<LocalState>,
    private readonly sessionStore: Store<SessionStates>,
    protected readonly permissionStore: Store<ClientSidePermissionStates>,
    public readonly store: Store<InternalSalesReturnStates>,
    public readonly draftStore: Store<DraftStates>) {
    super();
  }

  ngOnInit() {
    this.subs.sink = this.genDocLock$.subscribe(lock=>{
      this.genDocLock = lock;
    })
    this.subs.sink = this.clientSidePermissions$.subscribe({
      next: (resolve) => {
        console.log("Resolve in main",resolve)
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
    this.subs.sink = this.lineItem$.subscribe(resolve => this.lineItem = resolve);
    this.subs.sink = this.lineItem$.pipe(
      tap(resolve => { this.lineItem = resolve }),
      switchMap(resolve =>
        // this.lineItem = resolve;
        this.fiService.getByGuid(resolve.item_guid.toString(), this.apiVisa)
      )
    ).subscribe(
      {
        next: (resolve: any) => {
          if (resolve.data) {
            this.itemData = resolve.data;
            this.subItemType = resolve.data.bl_fi_mst_item_hdr.sub_item_type;
          }
        }
      }
    );
    this.subs.sink = this.deleteConfirmation$.pipe(
      mergeMap(a => {
        return iif(() => a, of(a).pipe(delay(3000)), of(EMPTY));
      })
    ).subscribe(resolve => {
      if (resolve === true) {
        this.componentStore.patchState({ deleteConfirmation: false });
        this.deleteConfirmation = false;
      }
    });
    this.subs.sink = this.salesReturn$.subscribe(resolve =>
      {
        if(resolve){
          this.postingStatus = resolve.bl_fi_generic_doc_hdr?.posting_status;
          this.status = resolve.bl_fi_generic_doc_hdr?.status
          }
      }
      );
  }

  async onSave() {
    const line = { ...this.lineItem };
    this.itemDetails.main.form.enable();
    line.einvoice_taxable_type_code = this.itemDetails.main.form.value?.einvoiceTaxTypeCode;
    line.item_guid = this.itemDetails.main.form.value.itemGuid;
    line.item_code = this.itemDetails.main.form.value.itemCode;
    line.item_name = this.itemDetails.main.form.value.itemName;
    line.sales_entity_hdr_guid = this.itemDetails.main.form.value?.salesAgent;
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
    line.guid_dimension = this.itemDetails.dept.form.value.dimension;
    line.guid_profit_center = this.itemDetails.dept.form.value.profitCenter;
    line.guid_project = this.itemDetails.dept.form.value.project;
    line.guid_segment = this.itemDetails.dept.form.value.segment;
    line.item_property_json = { ...this.itemDetails.main.form.value };
    line.unit_price_std = this.itemDetails.main.form.value.unitPriceStdWithoutTax;
    line.unit_price_txn = this.itemDetails.main.form.value.unitPriceTxn;
    line.unit_price_std_by_uom = this.itemDetails.main.form.value.unitPriceStdUom;
    line.unit_price_txn_by_uom = this.itemDetails.main.form.value.unitPriceTxnUom;
    line.unit_disc_by_uom = this.itemDetails.main.form.value.unitDiscountUom;
    line.uom = this.itemDetails.main.form.value.uom;
    line.uom_to_base_ratio = this.itemDetails.main.form.value.uomBaseRatio;
    line.qty_by_uom = parseFloat(this.itemDetails.main.form.value.qtyUom);
    line.unit_price_net = this.itemDetails.main.form.value.unitPriceNet;
    line.einvoice_taxable_type_code = this.itemDetails.main.form.value?.einvoiceTaxTypeCode;
    line.einvoice_taxable_type_desc = this.itemDetails.main.form.value?.einvoiceTaxTypeDesc;
    line.einvoice_uom = this.itemDetails.main.form.value?.einvoice_uom;
    if (this.itemDetails.delivery) {
      line.line_property_json = <any>{ delivery_instructions: { ...this.itemDetails.delivery.form.value } };
    }
    // line.date_txn = this.lineItem.date_txn; // should be new date or keep old one?
    line.serial_no =
      this.subItemType === this.SUB_ITEM_TYPE.serialNumber
        ? <any> this.serialNumber.serialNumbers
        : null;
    line.batch_no = this.subItemType === 'BATCH_NUMBER' ? <any>{ batches: this.batchNumber.batchNumbers } : null;
    line.bin_no = this.subItemType === 'BIN_NUMBER' ? <any>{ bins: this.binNumber.binNumbers } : null;
    line.tax_tariff_code = this.itemDetails.main.form.value.tariffCode;
    console.log('line', line);

       if(this.itemData?.bl_fi_mst_item_hdr?.txn_type==='GROUPED_ITEM'){
        this.subs.sink = this.store.select(InternalSalesReturnSelectors.selectChildItems).subscribe(data => {
          console.log('selectChildItems ',data)
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

    line.delivery_branch_guid = this.itemDetails.linedelivery.form.value.deliveryBranch;
    line.delivery_branch_code = this.itemDetails.linedelivery.form.value.deliveryBranchCode;
    line.delivery_location_guid = this.itemDetails.linedelivery.form.value.deliveryLocation;
    line.delivery_location_code = this.itemDetails.linedelivery.form.value.deliveryLocationCode;

    // if (this.itemDetails.multiLevelDiscount) {
    //   line.multi_level_disc_json = <any>{
    //     discount: this.itemDetails.multiLevelDiscount.rowData
    //   };
    // }

    // Update existing hdr balance by calculating delta (line2 - line1)
    const diffLine = new bl_fi_generic_doc_line_RowClass();
    diffLine.amount_discount = <any>(parseFloat(<any>line.amount_discount) - parseFloat(<any>this.lineItem.amount_discount));
    diffLine.amount_net = <any>(parseFloat(<any>line.amount_net) - parseFloat(<any>this.lineItem.amount_net));
    diffLine.amount_std = <any>(parseFloat(<any>line.amount_std) - parseFloat(<any>this.lineItem.amount_std));
    diffLine.amount_tax_gst = <any>(parseFloat(<any>line.amount_tax_gst) - parseFloat(<any>this.lineItem.amount_tax_gst));
    diffLine.amount_tax_wht = <any>(parseFloat(<any>line.amount_tax_wht) - parseFloat(<any>this.lineItem.amount_tax_wht));
    diffLine.amount_txn = <any>(parseFloat(<any>line.amount_txn) - parseFloat(<any>this.lineItem.amount_txn));

    // if (this.itemDetails.main.form.value.itemType) {
      const link = this.getLink(line.guid.toString());
      if (link) {
        link.quantity_contra = line.quantity_base;
        console.log('link', link);
        this.viewColFacade.editLink(link);
      }
    // }
    if (line.item_txn_type === 'NSTI') {
      line.quantity_signum = 1;
      line.amount_signum = -1;
      line.server_doc_type = 'INTERNAL_PURCHASE_TRADE_IN';
      line.client_doc_type = 'INTERNAL_PURCHASE_TRADE_IN';

      const arrSN: any[] = [];
      if (this.itemDetails?.main?.form.value.tradeInSerial) {
        arrSN.push(this.itemDetails.main.form.value.tradeInSerial)
      }
      line.serial_no = <any>{ serialNumbers: arrSN };
    }
    this.viewColFacade.editLineItem(line, diffLine, this.prevIndex);
  }

  onDelete() {
    if (this.deleteConfirmation) {
      this.deleteLine();
      this.deleteConfirmation = false;
      this.componentStore.patchState({ deleteConfirmation: false });
    } else {
      this.deleteConfirmation = true;
      this.componentStore.patchState({ deleteConfirmation: true });
    }
  }
  deleteCondition() {
    if (this.postingStatus === "FINAL" || (this.status !== "ACTIVE" && this.status !== null && this.status !== undefined) || this.genDocLock) {
      return false;
    }
    else {
      return true;
    }
  }

  deleteLine() {
    let index;
    this.subs.sink = this.salesReturn$.subscribe({
      next: resolve => {
        if (resolve)
          index = resolve.bl_fi_generic_doc_line.findIndex(x => x.guid === this.lineItem.guid)
      }
    });

    if (index >= 0) {
      // Change status of existing line and link to DELETED
      const line = { ...this.lineItem, status: 'DELETED' };
      const diffLine = new bl_fi_generic_doc_line_RowClass();
      diffLine.amount_discount = <any>(0 - parseFloat(<any>line.amount_discount));
      diffLine.amount_net = <any>(0 - parseFloat(<any>line.amount_net));
      diffLine.amount_std = <any>(0 - parseFloat(<any>line.amount_std));
      diffLine.amount_tax_gst = <any>(0 - parseFloat(<any>line.amount_tax_gst));
      diffLine.amount_tax_wht = <any>(0 - parseFloat(<any>line.amount_tax_wht));
      diffLine.amount_txn = <any>(0 - parseFloat(<any>line.amount_txn));
      console.log('line', line);

      // Update corresponding link
      // if (this.itemDetails.main.form.value.itemType) {
        const link = this.getLink(line.guid.toString());
        if (link) {
          link.status = 'DELETED'
          this.viewColFacade.editLink(link);
        }
      // }

      this.viewColFacade.deleteExistingLine(line, diffLine);
    } else {
      // Remove the line and link entirely from the draft
      const diffLine = new bl_fi_generic_doc_line_RowClass();
      diffLine.amount_discount = <any>(0 - parseFloat(<any>this.lineItem.amount_discount));
      diffLine.amount_net = <any>(0 - parseFloat(<any>this.lineItem.amount_net));
      diffLine.amount_std = <any>(0 - parseFloat(<any>this.lineItem.amount_std));
      diffLine.amount_tax_gst = <any>(0 - parseFloat(<any>this.lineItem.amount_tax_gst));
      diffLine.amount_tax_wht = <any>(0 - parseFloat(<any>this.lineItem.amount_tax_wht));
      diffLine.amount_txn = <any>(0 - parseFloat(<any>this.lineItem.amount_txn));

      // Remove corresponding link entirely from array
      // if (this.itemDetails.main.form.value.itemType) {
        const link = this.getLink(this.lineItem.guid.toString());
        if (link)
          this.viewColFacade.deleteLink(link.guid.toString());
      // }

      this.viewColFacade.deleteLine(this.lineItem.guid.toString(), diffLine, this.prevIndex);
    }
  }

  getLink(lineGuid: string): bl_fi_generic_doc_link_RowClass {
    let link;
    this.subs.sink = this.draftStore.select(LinkSelectors.selectAll).subscribe(resolved => {
      link = resolved.find(x => x.guid_doc_2_line === lineGuid);
    })
    return link;
  }

  disableSave() {
    return this.itemDetails?.main.form.invalid;
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
    // this.store.dispatch(InternalSalesReturnSelectors.selectPricingScheme({ pricingScheme }));
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState,
      deactivateReturn: true,
      deactivateList: true
    });
    this.viewColFacade.onNextAndReset(this.index, 19);
  }

  onKnockoffAdd(event) {
    console.log(event);
    this.store.dispatch(InternalSalesReturnActions.updateKnockoffListingConfig({ settings: event }));
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState,
      deactivateReturn: true,
      deactivateIssueLink: true,
      deactivateAdd: true
    });
    this.viewColFacade.onNextAndReset(this.index, 19);
  }

  onKnockoffEdit(event) {
    console.log(event);
    this.store.dispatch(InternalSalesReturnActions.updateKnockoffListingConfig({ settings: event }));
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState,
      deactivateReturn: true,
      deactivateIssueLink: true,
      deactivateAdd: true
    });
    this.viewColFacade.onNextAndReset(this.index, 20);
  }

  onReturn() {
    this.viewColFacade.updateInstance<LocalState>(this.prevIndex, {
      ...this.prevLocalState,
      deactivateAdd: false,
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
        editItemSelectedIndex: this.matTab.selectedIndex,
        itemSelectedIndex: this.itemDetails.matTab.selectedIndex,
        serialSelectedIndex: this.subItemType === 'SERIAL_NUMBER' ? this.serialNumber.matTab?.selectedIndex : null,
      });
    }
    this.subs.unsubscribe();
  }
}
