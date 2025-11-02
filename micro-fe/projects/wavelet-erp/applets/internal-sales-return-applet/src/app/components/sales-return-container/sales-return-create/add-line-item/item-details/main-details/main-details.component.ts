import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { CompanyService, FinancialItemContainerModel, FinancialItemService, Pagination, TaxCodeContainerModel } from 'blg-akaun-ts-lib';
import { AppConfig } from 'projects/shared-utilities/visa';
import { InternalSalesReturnSelectors } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/internal-sales-return-controller/store/selectors';
import { InternalSalesReturnStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/internal-sales-return-controller/store/states';
import { combineLatest, Observable, of } from "rxjs";
import { formatMoneyInForm } from 'projects/shared-utilities/format.utils';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  mergeMap,
  tap,
} from "rxjs/operators";
import { SubSink } from 'subsink2';
import { DraftStates } from '../../../../../../state-controllers/draft-controller/store/states';
import { HDRSelectors } from '../../../../../../state-controllers/draft-controller/store/selectors';
import { ClientSidePermissionStates } from 'projects/shared-utilities/modules/permission/client-side-permissions-controller/states';
import { ClientSidePermissionsSelectors } from 'projects/shared-utilities/modules/permission/client-side-permissions-controller/selectors';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';
import { AppletSettings } from '../../../../../../models/applet-settings.model';
import { Column4ViewModelActions } from '../../../../../../state-controllers/sales-return-view-model-controller/store/actions';
import { ColumnViewModelStates } from '../../../../../../state-controllers/sales-return-view-model-controller/store/states';
import { Column4ViewSelectors } from '../../../../../../state-controllers/sales-return-view-model-controller/store/selectors';
import { UtilitiesModule } from "projects/shared-utilities/utilities/utilities.module";

@Component({
  selector: 'app-item-details-main-details',
  templateUrl: './main-details.component.html',
  styleUrls: ['./main-details.component.scss']
})
export class ItemDetailsMainComponent implements OnInit, OnDestroy {

  @Input() editMode: boolean;
  @Input() subItemType: string;
  @Output() mainDetailsUnitPriceTxnEmitter = new EventEmitter<any>();

  protected subs = new SubSink();

  pricing$ = this.store.select(InternalSalesReturnSelectors.getPricingSchemeLinks);
  genDocLock$ = this.store.select(InternalSalesReturnSelectors.selectGenDocLock);

  item$: Observable<FinancialItemContainerModel>;
  apiVisa = AppConfig.apiVisa;
  public form: FormGroup;
  itemType: string;
  isInclusiveTax: boolean = true;
  clientSidePermissionSettings: any;
  hdr: any;
  genDocLock:boolean;

  customerGuid;
  ColumnViewSelectors = Column4ViewSelectors;
  ColumnViewActions = Column4ViewModelActions;


  masterSettings$ = this.sessionStore.select(
    SessionSelectors.selectMasterSettings
  );
  clientSidePermissions$ = this.permissionStore.select(
    ClientSidePermissionsSelectors.selectAll
  );
  appletSettings: AppletSettings;
  salesAgentGuid: any;
  options = [
    {
      "Code": "01",
      "Description": "Sales Tax"
    },
    {
      "Code": "02",
      "Description": "Service Tax"
    },
    {
      "Code": "03",
      "Description": "Tourism Tax"
    },
    {
      "Code": "04",
      "Description": "High-Value Goods Tax"
    },
    {
      "Code": "05",
      "Description": "Sales Tax on Low Value Goods"
    },
    {
      "Code": "06",
      "Description": "Not Applicable"
    }
  ];

  searchText = new FormControl('');
  filteredOptions: any[] = this.options;
  itemTxnType;

  constructor(
    private viewModelStore: Store<ColumnViewModelStates>,
    private readonly store: Store<InternalSalesReturnStates>,
    protected readonly sessionStore: Store<SessionStates>,
    protected readonly permissionStore: Store<ClientSidePermissionStates>,
    private companyService: CompanyService,
    private draftStore: Store<DraftStates>,
    protected fiService: FinancialItemService) {
    // super();
  }

  itemGuid;
  SHOW_UNIT_PRICE_STD_PRICING_SCHEME: boolean;
  SHOW_UNIT_PRICE_STD_INCL_TAX: boolean;
  SHOW_UNIT_PRICE_STD_EXCL_TAX: boolean;
  SHOW_UNIT_PRICE_STD_UOM_INCL_TAX: boolean;
  SHOW_UNIT_PRICE_STD_UOM_EXCL_TAX: boolean;
  SHOW_UNIT_PRICE_NET_UOM_EXCL_TAX: boolean;
  SHOW_UNIT_PRICE_NET_EXCL_TAX: boolean;
  SHOW_UNIT_DISCOUNT: boolean;
  SHOW_QTY_BASE: boolean;
  SHOW_QTY_UOM: boolean;
  SHOW_UOM_TO_BASE_RATIO: boolean;
  SHOW_UNIT_DISCOUNT_UOM_EXCL_TAX: boolean;
  SHOW_UNIT_PRICE_TXN_UOM_INCL_TAX: boolean;
  SHOW_AMOUNT_STD_EXCL_TAX: boolean;
  SHOW_DISCOUNT_AMOUNT_EXCL_TAX: boolean;
  SHOW_AMOUNT_NET_EXCL_TAX: boolean;
  SHOW_TAX_CONFIG_SELECTION: boolean;
  SHOW_WHT_CONFIG_SELECTION: boolean;
  SHOW_UNIT_PRICE_TXN: boolean;
  SHOW_AMOUNT_TXN: boolean;
  SHOW_LAST_PURCHASE_PRICE: boolean;
  SHOW_SALES_AGENT: boolean;

  ngOnInit() {
    this.subs.sink = this.genDocLock$.subscribe(lock=>{
      this.genDocLock = lock;
    })
    this.subs.sink = this.store.select(InternalSalesReturnSelectors.selectLineItem).subscribe(selectedLine=>{
      this.itemTxnType = selectedLine?.item_txn_type;
      this.subItemType = selectedLine?.item_sub_type;
    })

    this.subs.sink = this.masterSettings$.subscribe({
      next: (resolve: AppletSettings) => {
        this.appletSettings = resolve;
      },
    });

    this.subs.sink = this.clientSidePermissions$.subscribe({
      next: (resolve) => {
        this.clientSidePermissionSettings = resolve;
        resolve.forEach(permission => {
          if (permission.perm_code === "SHOW_SALES_AGENT") {
            this.SHOW_SALES_AGENT = true;
          }
          if (permission.perm_code === "SHOW_UNIT_PRICE_STD_PRICING_SCHEME") {
            this.SHOW_UNIT_PRICE_STD_PRICING_SCHEME = true;
          }
          if (permission.perm_code === "SHOW_UNIT_PRICE_STD_INCL_TAX") {
            this.SHOW_UNIT_PRICE_STD_INCL_TAX = true;
          }
          if (permission.perm_code === "SHOW_UNIT_PRICE_STD_EXCL_TAX") {
            this.SHOW_UNIT_PRICE_STD_EXCL_TAX = true;
          }
          if (permission.perm_code === "SHOW_UNIT_PRICE_STD_UOM_INCL_TAX") {
            this.SHOW_UNIT_PRICE_STD_UOM_INCL_TAX = true;
          }
          if (permission.perm_code === "SHOW_UNIT_PRICE_STD_UOM_EXCL_TAX") {
            this.SHOW_UNIT_PRICE_STD_UOM_EXCL_TAX = true;
          }
          if (permission.perm_code === "SHOW_UNIT_PRICE_NET_UOM_EXCL_TAX") {
            this.SHOW_UNIT_PRICE_NET_UOM_EXCL_TAX = true;
          }
          if (permission.perm_code === "SHOW_UNIT_PRICE_NET_EXCL_TAX") {
            this.SHOW_UNIT_PRICE_NET_EXCL_TAX = true;
          }
          if (permission.perm_code === "SHOW_UNIT_DISCOUNT") {
            this.SHOW_UNIT_DISCOUNT = true;
          }
          if (permission.perm_code === "SHOW_QTY_BASE") {
            this.SHOW_QTY_BASE = true;
          }
          if (permission.perm_code === "SHOW_QTY_UOM") {
            this.SHOW_QTY_UOM = true;
          }
          if (permission.perm_code === "SHOW_UOM_TO_BASE_RATIO") {
            this.SHOW_UOM_TO_BASE_RATIO = true;
          }
          if (permission.perm_code === "SHOW_UNIT_DISCOUNT_UOM_EXCL_TAX") {
            this.SHOW_UNIT_DISCOUNT_UOM_EXCL_TAX = true;
          }
          if (permission.perm_code === "SHOW_UNIT_PRICE_TXN_UOM_INCL_TAX") {
            this.SHOW_UNIT_PRICE_TXN_UOM_INCL_TAX = true;
          }
          if (permission.perm_code === "SHOW_AMOUNT_STD_EXCL_TAX") {
            this.SHOW_AMOUNT_STD_EXCL_TAX = true;
          }
          if (permission.perm_code === "SHOW_DISCOUNT_AMOUNT_EXCL_TAX") {
            this.SHOW_DISCOUNT_AMOUNT_EXCL_TAX = true;
          }
          if (permission.perm_code === "SHOW_AMOUNT_NET_EXCL_TAX") {
            this.SHOW_AMOUNT_NET_EXCL_TAX = true;
          }
          if (permission.perm_code === "SHOW_TAX_CONFIG_SELECTION") {
            this.SHOW_TAX_CONFIG_SELECTION = true;
          }
          if (permission.perm_code === "SHOW_WHT_CONFIG_SELECTION") {
            this.SHOW_WHT_CONFIG_SELECTION = true;
          }
          if (permission.perm_code === "SHOW_UNIT_PRICE_TXN") {
            this.SHOW_UNIT_PRICE_TXN = true;
          }
          if (permission.perm_code === "SHOW_AMOUNT_TXN") {
            this.SHOW_AMOUNT_TXN = true;
          }
          if (permission.perm_code === "SHOW_LAST_PURCHASE_PRICE") {
            this.SHOW_LAST_PURCHASE_PRICE = true;
          }

        })
      }
    });

    this.form = new FormGroup({
      // For gen doc link
      hdrGuid: new FormControl(),
      serverDocTypeHdr: new FormControl(),
      lineGuid: new FormControl(),
      serverDocTypeLine: new FormControl(),
      orderNo: new FormControl(),
      orderQty: new FormControl(),
      itemType: new FormControl(),
      itemGuid: new FormControl(),
      itemCode: new FormControl(),
      itemName: new FormControl(
        '',
        (this.appletSettings?.ENABLE_ITEM_NAME_MAX_LIMIT && (this.appletSettings?.ITEM_NAME_MAX_LIMIT > 0))
          ? [Validators.required, Validators.maxLength(this.appletSettings.ITEM_NAME_MAX_LIMIT)]
          : [Validators.required]
      ),
      salesAgent: new FormControl(),
      tariffCode: new FormControl(),
      uom: new FormControl(),
      // uomValue : new FormControl(),
      uomGuid: new FormControl(),
      pricingScheme: new FormControl(),

      qty: new FormControl(1, Validators.compose([Validators.required, Validators.min(1)])),
      qtyUom: new FormControl(),
      isBaseUom: new FormControl(),
      uomBaseRatio: new FormControl(),
      unitPriceStdUom: new FormControl('0.00', this.getValidatorsForItemType()),
      unitPriceTxnUom: new FormControl('0.00', this.getValidatorsForItemType()),
      unitDiscountUom: new FormControl('0.00'),

      unitPriceStd: new FormControl('0.00', this.getValidatorsForItemType()),
      unitPriceTxn: new FormControl('0.00', this.getValidatorsForItemType()),
      unitPriceStdWithTax: new FormControl('0.00', this.getValidatorsForItemType()),
      unitPriceStdWithoutTax: new FormControl('0.00', this.getValidatorsForItemType()),
      unitPriceStdUomWithTax: new FormControl('0.00', this.getValidatorsForItemType()),
      unitPriceNetUom: new FormControl('0.00', this.getValidatorsForItemType()),
      unitPriceNet: new FormControl('0.00', this.getValidatorsForItemType()),

      unitDiscount: new FormControl('0.00'),
      unitDiscountWithTax: new FormControl('0.00', Validators.compose([Validators.min(0)])),
      discountAmt: new FormControl('0.00'),
      stdAmt: new FormControl('0.00', this.getValidatorsForItemType()),
      netAmt: new FormControl('0.00', this.getValidatorsRequiredForItemType()),

      taxCode: new FormControl(''),
      taxPercent: new FormControl('0.00', Validators.compose([Validators.min(0)])),
      taxGSTtype: new FormControl(''),

      taxAmt: new FormControl('0.00', this.getValidatorsForItemType()),
      netAmtWithTax: new FormControl('0.00', this.getValidatorsRequiredForItemType()),

      whtCode: new FormControl(''),
      whtPercent: new FormControl('0.00', Validators.compose([Validators.min(0)])),

      whtAmt: new FormControl('0.00', this.getValidatorsForItemType()),
      txnAmt: new FormControl('0.00', this.getValidatorsRequiredForItemType()),
      remarks: new FormControl(),
      item_txn_type: new FormControl(),
      item_sub_type: new FormControl(),
      einvoiceTaxTypeCode: new FormControl(),
      einvoiceTaxTypeDesc: new FormControl(),
      einvoice_uom: new FormControl(),
      tradeInSerial: new FormControl(),
    });

    this.draftStore.select(HDRSelectors.selectHdr).subscribe(data => {
      this.salesAgentGuid = data?.sales_entity_hdr_guid ? data.sales_entity_hdr_guid.toString() : null;
      this.customerGuid = data?.doc_entity_hdr_guid ? data.doc_entity_hdr_guid.toString() : null;
      console.log("salesAgentGuid",this.salesAgentGuid)
      this.form.patchValue({
        salesAgent: this.salesAgentGuid,
      })
      console.log("Header Data", data);
      this.hdr = data;
      const apiVisa = AppConfig.apiVisa;
      const pagination = new Pagination();

      pagination.conditionalCriteria = [
        { columnName: 'calcTotalRecords', operator: '=', value: 'true' },
        // { columnName: 'orderBy', operator: '=', value: 'updated_date' },
        // { columnName: 'order', operator: '=', value: 'DESC' },
        // { columnName: 'guid', operator: '=', value: data.guid_comp.toString() }

      ];

      this.subs.sink = this.companyService.getByGuid(data?.guid_comp ? data.guid_comp.toString() : null, apiVisa).subscribe(companyData => {
        console.log("Company Data", companyData.data.bl_fi_mst_comp_ext);

        companyData.data.bl_fi_mst_comp_ext.forEach(extEach => {
          // console.log("Param Code", extEach.param_code);
          if (extEach.param_code == "INCLUSIVE_TAX" && extEach.param_type == "STRING") {
            console.log("Ext Main", extEach);
            if (extEach.value_string == "TRUE") {
              this.isInclusiveTax = true;
              console.log("INCLUSIVE TAX TRUE");
            } else if (extEach.value_string == "FALSE") {
              this.isInclusiveTax = false;
              console.log("INCLUSIVE TAX FALSE");

            }
          }
        })

      })

    })

    if (this.editMode) {
      this.popLineItem();
    }
    else {
      this.popNewItem();
    }
    this.viewModelStore.dispatch(
      Column4ViewModelActions.processUpdateBaseQuantity({ baseQuantity: 1 })
    );

    this.item$ = this.store.select(InternalSalesReturnSelectors.selectLineItem).pipe(
      mergeMap((resolve: any) =>
        this.fiService.getByGuid(resolve.item_guid, this.apiVisa).pipe(
          map(a => a.data))
      )
    );

    this.subs.sink = this.store.select(InternalSalesReturnSelectors.selectInternalSalesReturns).subscribe({
      next: (invoice) => {
        if (invoice) {
          if (invoice.bl_fi_generic_doc_hdr?.posting_status === 'FINAL' || (invoice.bl_fi_generic_doc_hdr?.status !== 'ACTIVE' && invoice.bl_fi_generic_doc_hdr?.status !== 'TEMP' && invoice.bl_fi_generic_doc_hdr?.status !== null) || this.genDocLock) {
            this.form.disable();
            this.form.controls['itemName'].enable();
            this.form.controls['remarks'].enable();
          }
          else {
            this.form.enable();
          }
        }
      }
    }
    );
    combineLatest([
      this.viewModelStore.pipe(
        select(Column4ViewSelectors.selectSerialNumberTab_ScanTab_SerialNumbersListing)
      ),
      this.store.pipe(select(InternalSalesReturnSelectors.selectLineItem))
    ])
      .pipe(
        debounceTime(100),  // Delay emissions by 100ms
        distinctUntilChanged(),  // Only emit when the current value is different from the last
        map(([serialNumbers, lineItem]) => {
          const serialNumberCount = serialNumbers?.length || 0;
          const quantityBase = lineItem?.quantity_base;

          if (serialNumberCount === 0 && (quantityBase !== null && quantityBase !== undefined)) {
            // Case 1: No serial numbers but quantity_base is defined
            this.form.patchValue({ qty: quantityBase });
          } else if (serialNumberCount > 0 && quantityBase !== serialNumberCount) {
            // Case 2: Serial numbers exist and quantity_base differs from the count of serial numbers
            console.log("Serial Length", serialNumberCount, quantityBase);
            this.form.patchValue({ qty: serialNumberCount });
            this.onCalculate();
          } else if (serialNumberCount > 0 && quantityBase === serialNumberCount) {
            // Case 3: Serial numbers exist and quantity_base is the same as the count of serial numbers
            console.log("Serial Number Count equals Quantity Base", serialNumberCount);
            // No need to patch or calculate in this case
          } else {
            // Default case: Set quantity to 1
            this.form.patchValue({ qty: 1 });
            this.onCalculate();
          }
        })
      )
      .subscribe();

    this.searchText.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      // Trigger filtering when the search text changes
      this.filterFunction();
    });

    if(this.subItemType==="BIN_NUMBER"){
      this.subs.sink = this.store.select(InternalSalesReturnSelectors.selectTotalBin).subscribe(total=>{
        this.form.patchValue({ qty:total })
        this.onCalculate();
      })}
  }

  filterFunction() {
    this.filteredOptions = this.options
    const filterValue = this.searchText.value.toLowerCase();
    // Filter options based on the search text
    this.filteredOptions = this.options.filter(option =>
      option.Code.toLowerCase().includes(filterValue) || option.Description.toLowerCase().includes(filterValue)
    );
  }

  popNewItem() {
    this.subs.sink = this.store.select(InternalSalesReturnSelectors.selectLineItem).subscribe({
      next: resolve => {
        if (resolve) {
          console.log("Resolve ", resolve);
          this.viewModelStore.dispatch(Column4ViewModelActions.setItemDetailsTab_itemType_Value({itemType:resolve?.item_sub_type?.toString()}));
          this.form.patchValue({
            // Fields which tell us if item belonging to existing order
            hdrGuid: resolve?.hdr_guid,
            serverDocTypeHdr: resolve?.server_doc_type_hdr,
            lineGuid: resolve?.line_guid,
            serverDocTypeLine: resolve?.server_doc_type_line,
            orderNo: resolve?.doc_number,
            orderQty: resolve?.order_qty,
            itemType: resolve?.item_type,
            tariffCode: resolve?.tax_tariff_code,
            // mandatory to have values when this page is loaded
            itemGuid: resolve?.item_guid,
            itemCode: resolve?.item_code,
            itemName: resolve?.item_name,
            item_txn_type: resolve?.item_txn_type,
            item_sub_type: resolve?.item_sub_type,

            uomGuid: resolve.uomGuid,
            uom: resolve.uom,
            einvoiceTaxTypeCode: resolve.einvoice_taxable_type_code,
            einvoiceTaxTypeDesc: resolve.einvoice_taxable_type_desc,
            einvoice_uom: resolve.einvoice_uom,
          });
          this.itemType = resolve?.item_type;
          // values to be copied from other gen doc type
          if (this.itemType) {
            this.form.patchValue({
              uomGuid: resolve?.uomGuid,
              uom: resolve?.uom,
              unitPriceTxn: resolve.unit_price_txn ? this.roundToTwo(parseFloat(resolve.unit_price_txn)).toFixed(2) : "0.00",
              unitPriceTxnUom: resolve.unit_price_txn_by_uom ? this.roundToTwo(parseFloat(resolve.unit_price_txn_by_uom)).toFixed(2) : "0.00",
              taxCode: resolve?.tax_gst_code,
              taxPercent: resolve.tax_gst_rate ? this.roundToTwo(parseFloat(resolve.tax_gst_rate)).toFixed(2) : "0.00",
              taxAmt: resolve.amount_tax_gst ? this.roundToTwo(parseFloat(resolve.amount_tax_gst)).toFixed(2) : "0.00",
              whtCode: resolve?.tax_wht_code,
              whtPercent: resolve.tax_wht_rate ? this.roundToTwo(parseFloat(resolve.tax_wht_rate)).toFixed(2) : "0.00",
              whtAmt: resolve.amount_tax_wht ? this.roundToTwo(parseFloat(resolve.amount_tax_wht)).toFixed(2) : "0.00",
            });
          }
        }
      }
    });
    // this.onCalculate();

    this.item$ = this.fiService.getByGuid(this.form.value.itemGuid, this.apiVisa).pipe(
      map(a => a.data)
    )
  }

  popLineItem() {
    console.log("Pop Line Item");
    this.subs.sink = this.store.select(InternalSalesReturnSelectors.selectLineItem).subscribe({
      next: (resolve: any) => {
        console.log("Resolve ", resolve);
        console.log("Resolve Item", resolve.item_name);
        if (resolve.item_sub_type){
          this.viewModelStore.dispatch(Column4ViewModelActions.setItemDetailsTab_itemType_Value({itemType:resolve?.item_sub_type.toString()}));
        }
        if (resolve!==null) {
          this.form.patchValue({
            tradeInSerial : (resolve.item_txn_type==='NSTI' && resolve.serial_no?.serialNumbers && resolve.serial_no?.serialNumbers.length > 0)? resolve.serial_no.serialNumbers[0] :"",
            hdrGuid: resolve.item_property_json?.hdrGuid,
            serverDocTypeHdr: resolve.item_property_json?.serverDocTypeHdr,
            lineGuid: resolve.item_property_json?.lineGuid,
            serverDocTypeLine: resolve.item_property_json?.serverDocTypeLine,
            orderNo: resolve.item_property_json?.orderNo,
            orderQty: resolve.item_property_json?.orderQty,
            itemGuid: resolve?.item_guid,
            itemCode: resolve?.item_code,
            itemName: resolve?.item_name,
            itemType: resolve.item_property_json?.itemType,
            salesAgent: resolve?.sales_entity_hdr_guid,
            tariffCode: resolve?.tax_tariff_code,
            // Pricing
            qty: resolve?.quantity_base,
            unitPriceStdWithoutTax: resolve.unit_price_std ? this.roundToTwo(parseFloat(resolve.unit_price_std)).toFixed(2) : "0.00",
            unitPriceStdWithTax: resolve.unit_price_std_with_tax ? this.roundToTwo(resolve.unit_price_std_with_tax !== 0 ? parseFloat(resolve.unit_price_std_with_tax)
                  : parseFloat(resolve.unit_price_std)
              ).toFixed(2)
            : resolve.unit_price_std
            ? this.roundToTwo(parseFloat(resolve.unit_price_std)).toFixed(2)
            : "0.00",
            // unitPriceStdWithTax: resolve.item_property_json.pricingScheme.price_amount_incl_tax,
            unitPriceTxn: resolve.unit_price_txn ? this.roundToTwo(parseFloat(resolve.unit_price_txn)).toFixed(2) : "0.00",
            unitDiscount: resolve.amount_discount ? this.roundToTwo(parseFloat((resolve.amount_discount / resolve.quantity_base).toString())).toFixed(2) : "0.00",
            discountAmt: resolve.amount_discount ? this.roundToTwo(parseFloat(resolve.amount_discount)).toFixed(2) : "0.00",
            stdAmt: resolve.amount_std ? this.roundToTwo(parseFloat(resolve.amount_std)).toFixed(2) : "0.00",
            netAmt: resolve.amount_net ? this.roundToTwo(parseFloat(resolve.amount_net)).toFixed(2) : "0.00",
            taxCode: resolve.tax_gst_code,
            taxPercent: resolve.tax_gst_rate >= 0 ? this.roundToTwo(parseFloat(resolve.tax_gst_rate)).toFixed(2) : "0.00",
            taxAmt: resolve.amount_tax_gst >= 0 ? this.roundToTwo(parseFloat(resolve.amount_tax_gst)).toFixed(2) : "0.00",
            netAmt2: resolve.amount_net ? this.roundToTwo(parseFloat(resolve.amount_net + resolve.amount_tax_gst)).toFixed(2) : "0.00",
            whtCode: resolve.tax_wht_code,
            whtPercent: resolve.tax_wht_rate >= 0 ? this.roundToTwo(parseFloat(resolve.tax_wht_rate)).toFixed(2) : "0.00",
            whtAmt: resolve.amount_tax_wht >= 0 ? this.roundToTwo(parseFloat(resolve.amount_tax_wht)).toFixed(2) : "0.00",
            txnAmt: resolve.amount_txn ? this.roundToTwo(parseFloat(resolve.amount_txn)).toFixed(2) : "0.00",
            remarks: resolve.item_remarks,
            item_txn_type: resolve.item_txn_type,
            item_sub_type: resolve?.item_sub_type,
            unitPriceNet: resolve.unit_price_net ? resolve.unit_price_net.toFixed(2) : "0.00",

            // UOM
            uomGuid: resolve.item_property_json.uomGuid,
            uom: resolve.uom,
            qtyUom: resolve.qty_by_uom,
            unitPriceNetUom: resolve.item_property_json?.unitPriceNetUom != null
              ? parseFloat(resolve.item_property_json.unitPriceNetUom).toFixed(2)
              : "0.00",
            uomBaseRatio: resolve.uom_to_base_ratio,
            unitPriceStdUom: resolve.unit_price_std_by_uom ? this.roundToTwo(parseFloat(resolve.unit_price_std_by_uom)).toFixed(2) : "0.00",
            unitPriceTxnUom: resolve.unit_price_txn_by_uom ? this.roundToTwo(parseFloat(resolve.unit_price_txn_by_uom)).toFixed(2) : "0.00",
            unitDiscountUom: resolve.unit_disc_by_uom ? this.roundToTwo(parseFloat(resolve.unit_disc_by_uom)).toFixed(2) : "0.00",
            pricingScheme: resolve.item_property_json?.pricingScheme,
            einvoiceTaxTypeCode: resolve.einvoice_taxable_type_code,
            einvoiceTaxTypeDesc: resolve?.einvoice_taxable_type_desc,
            einvoice_uom: resolve.einvoice_uom,
          });
        }
      }
    });
    this.item$ = this.fiService.getByGuid(this.form.value.itemGuid, this.apiVisa).pipe(
      map(a => a.data)
    )
  }

  onCalculate() {
    // Use safe parsing with NaN checks and fallback values
    const quantity = !isNaN(this.form.controls['qty'].value) ? 
      (parseFloat(this.form.controls['qty'].value) % 1 !== 0 ? 
        parseFloat(this.form.controls['qty'].value) : 
        parseInt(this.form.controls['qty'].value, 10)) : 0;
    const unitPriceTxn = this.safeParseFloat(this.form.controls['unitPriceTxn'].value);
    const unitDiscount = this.safeParseFloat(this.form.controls['unitDiscount'].value);
    const taxPercent = this.safeParseFloat(this.form.controls['taxPercent'].value);
    const whtPercent = this.safeParseFloat(this.form.controls['whtPercent'].value);
    const uomBaseRatio = this.safeParseInt(this.form.controls['uomBaseRatio'].value) || 1;
    //const isBaseUom = this.form.controls['isBaseUom'].value;

    let unitPriceStdWithTax, unitPriceStdWithoutTax;

    if (this.isInclusiveTax) {
      unitPriceStdWithTax = this.safeParseFloat(this.form.controls['unitPriceStdWithTax'].value);
      unitPriceStdWithoutTax = this.roundToTwo(unitPriceStdWithTax / (1 + taxPercent - whtPercent));
      this.form.controls['unitPriceStdWithoutTax'].setValue(this.roundToTwo(unitPriceStdWithoutTax));
    }
    else {
      unitPriceStdWithoutTax = this.safeParseFloat(this.form.controls['unitPriceStdWithoutTax'].value);
      unitPriceStdWithTax = this.roundToTwo(unitPriceStdWithoutTax * (1 + taxPercent - whtPercent));
      this.form.controls['unitPriceStdWithTax'].setValue(this.roundToTwo(unitPriceStdWithTax));
    }

    const stdAmount = unitPriceStdWithoutTax * quantity;
    const discountAmount = quantity * unitDiscount;
    const txnAmount = unitPriceTxn * quantity;
    const netAmount = this.roundToTwo(txnAmount / (1 + taxPercent - whtPercent));
    const taxAmount = netAmount * taxPercent;
    const whtAmount = netAmount * whtPercent;
    const unitPriceNet = unitPriceStdWithoutTax - unitDiscount;

    // const netAmountWithTax = this.roundToTwo((txnAmount + (txnAmount * taxPercent)) / (1 + taxPercent - whtPercent));

    if (uomBaseRatio) {
      const qtyByUom = this.roundToTwo(quantity / uomBaseRatio);
      this.form.controls['qtyUom'].setValue(qtyByUom.toFixed(2));

      const unitPriceStdUom = this.roundToTwo(unitPriceStdWithoutTax * uomBaseRatio);
      this.form.controls['unitPriceStdUom'].setValue(unitPriceStdUom);

      const unitPriceStdUomWithTax = this.roundToTwo(unitPriceStdWithTax * uomBaseRatio);
      this.form.controls['unitPriceStdUomWithTax'].setValue(unitPriceStdUomWithTax);

      const unitPriceNetUom = this.roundToTwo(unitPriceNet * uomBaseRatio);
      this.form.controls['unitPriceNetUom'].setValue(unitPriceNetUom);

      const unitDiscountUom = this.roundToTwo(unitDiscount * uomBaseRatio);
      this.form.controls['unitDiscountUom'].setValue(unitDiscountUom);

      const unitPriceTxnUom = this.roundToTwo(unitPriceTxn * uomBaseRatio);
      this.form.controls['unitPriceTxnUom'].setValue(unitPriceTxnUom);


    }

    this.form.controls['unitPriceNet'].setValue(this.roundToTwo(unitPriceNet));
    this.form.controls['discountAmt'].setValue(this.roundToTwo(discountAmount));
    this.form.controls['stdAmt'].setValue(this.roundToTwo(stdAmount));
    this.form.controls['netAmt'].setValue(this.roundToTwo(netAmount));
    this.form.controls['taxAmt'].setValue(this.roundToTwo(taxAmount));
    // this.form.controls['netAmtWithTax'].setValue(this.roundToTwo(netAmountWithTax));
    this.form.controls['whtAmt'].setValue(this.roundToTwo(whtAmount));
    this.form.controls['txnAmt'].setValue(this.roundToTwo(txnAmount));
    this.form.controls['unitPriceTxn'].setValue(this.roundToTwo(unitPriceTxn));


    this.onCalculateFromAmountDisc();
    this.passUnitPriceTxn();
  }

  passUnitPriceTxn() {
    const unitPriceStdWithoutTax = parseFloat(this.form.controls["unitPriceStdWithoutTax"].value); 
    const unitPriceTxn = parseFloat(this.form.controls["unitPriceTxn"].value); 
    this.mainDetailsUnitPriceTxnEmitter.emit({unitPriceTxn:unitPriceTxn,unitPriceStdWithoutTax:unitPriceStdWithoutTax});
  }
  
  calculatePriceFromWithTax(event) {
    if(this.appletSettings.ENABLE_EDITING_UNIT_PRICE_STD){
      console.log("calculatePriceFromWithTax",event);
      const quantity = !isNaN(this.form.controls['qty'].value) ? 
        (parseFloat(this.form.controls['qty'].value) % 1 !== 0 ? 
          parseFloat(this.form.controls['qty'].value) : 
          parseInt(this.form.controls['qty'].value, 10)) : 0;
      const unitPriceTxn = this.safeParseFloat(this.form.controls['unitPriceTxn'].value);
      const unitDiscount = this.safeParseFloat(this.form.controls['unitDiscount'].value);
      const taxPercent = this.safeParseFloat(this.form.controls['taxPercent'].value);
      const whtPercent = this.safeParseFloat(this.form.controls['whtPercent'].value);
      const uomBaseRatio = this.safeParseInt(this.form.controls['uomBaseRatio'].value) || 1;

      let unitPriceStdWithTax = event;
      let unitPriceStdWithoutTax = this.roundToTwo(unitPriceStdWithTax / (1 + taxPercent - whtPercent));
      this.form.controls['unitPriceStdWithoutTax'].setValue(this.roundToTwo(unitPriceStdWithoutTax));

      const stdAmount = unitPriceStdWithoutTax * quantity;
      const discountAmount = quantity * unitDiscount;
      const txnAmount = unitPriceTxn * quantity;
      const netAmount = this.roundToTwo(txnAmount / (1 + taxPercent - whtPercent));
      const taxAmount = netAmount * taxPercent;
      const whtAmount = netAmount * whtPercent;
      const unitPriceNet = unitPriceStdWithoutTax - unitDiscount;

      // const netAmountWithTax = this.roundToTwo((txnAmount + (txnAmount * taxPercent)) / (1 + taxPercent - whtPercent));

      if (uomBaseRatio) {
        const qtyByUom = this.roundToTwo(quantity / uomBaseRatio);
        this.form.controls['qtyUom'].setValue(qtyByUom);

        const unitPriceStdUom = this.roundToTwo(unitPriceStdWithoutTax * uomBaseRatio);
        this.form.controls['unitPriceStdUom'].setValue(unitPriceStdUom);

        const unitPriceStdUomWithTax = this.roundToTwo(unitPriceStdWithTax * uomBaseRatio);
        this.form.controls['unitPriceStdUomWithTax'].setValue(unitPriceStdUomWithTax);

        const unitPriceNetUom = this.roundToTwo(unitPriceNet * uomBaseRatio);
        this.form.controls['unitPriceNetUom'].setValue(unitPriceNetUom);

        const unitDiscountUom = this.roundToTwo(unitDiscount * uomBaseRatio);
        this.form.controls['unitDiscountUom'].setValue(unitDiscountUom);

        const unitPriceTxnUom = this.roundToTwo(unitPriceTxn * uomBaseRatio);
        this.form.controls['unitPriceTxnUom'].setValue(unitPriceTxnUom);


      }

      this.form.controls['unitPriceNet'].setValue(this.roundToTwo(unitPriceNet));
      this.form.controls['discountAmt'].setValue(this.roundToTwo(discountAmount));
      this.form.controls['stdAmt'].setValue(this.roundToTwo(stdAmount));
      this.form.controls['netAmt'].setValue(this.roundToTwo(netAmount));
      this.form.controls['taxAmt'].setValue(this.roundToTwo(taxAmount));
      // this.form.controls['netAmtWithTax'].setValue(this.roundToTwo(netAmountWithTax));
      this.form.controls['whtAmt'].setValue(this.roundToTwo(whtAmount));
      this.form.controls['txnAmt'].setValue(this.roundToTwo(txnAmount));
      this.form.controls['unitPriceTxn'].setValue(this.roundToTwo(unitPriceTxn));

      this.onCalculateFromAmountDisc();
    }

  }

  onCalculateFromUnitPriceTxn() {
    const quantity = !isNaN(this.form.controls['qty'].value) ? 
      (parseFloat(this.form.controls['qty'].value) % 1 !== 0 ? 
        parseFloat(this.form.controls['qty'].value) : 
        parseInt(this.form.controls['qty'].value, 10)) : 0;
    const unitPriceTxn = this.safeParseFloat(this.form.controls['unitPriceTxn'].value);
    const taxPercent = this.safeParseFloat(this.form.controls['taxPercent'].value);
    const whtPercent = this.safeParseFloat(this.form.controls['whtPercent'].value);
    const uomBaseRatio = this.safeParseInt(this.form.controls['uomBaseRatio'].value) || 1;
    const unitPriceStdWithTax = this.safeParseFloat(this.form.controls['unitPriceStdWithTax'].value);
    const unitPriceStdWithoutTax = this.safeParseFloat(this.form.controls['unitPriceStdWithoutTax'].value);

    const txnAmt = unitPriceTxn * quantity;
    const taxAmount = taxPercent * txnAmt / (1 + taxPercent - whtPercent);
    const whtAmount = whtPercent * txnAmt / (1 + taxPercent - whtPercent);
    const stdAmount = unitPriceStdWithoutTax * quantity;
    const netAmount = unitPriceTxn * quantity - taxAmount + whtAmount;
    // var unitPriceStdWithoutTax: number = this.roundToTwo(unitPriceStdWithTax / (1 + taxPercent - whtPercent));
    const discountAmount = stdAmount - netAmount;
    const unitDiscount = discountAmount / quantity;
    const unitPriceStdUom = unitPriceStdWithoutTax * uomBaseRatio;
    const unitDiscountUom = (stdAmount - netAmount) / quantity * uomBaseRatio;
    const unitPriceNetUom = unitPriceStdUom - unitDiscountUom;
    // const unitPriceTxnUom =  txnAmt / quantity * uomBaseRatio;
    const qtyUom = quantity / uomBaseRatio;
    const unitPriceNet = netAmount / quantity;
    // const netAmountWithTax = this.roundToTwo((txnAmt + (txnAmt * taxPercent)) / (1 + taxPercent - whtPercent));
    const unitPriceTxnUom = txnAmt / quantity * uomBaseRatio;


    // const stdAmount = netAmount + discountAmount;
    // const unitPriceStd = this.roundToTwo(stdAmount / quantity);
    // const isBaseUom = this.form.controls['isBaseUom'].value;
    // if (uomBaseRatio) {
    //   const unitPriceTxnUom = txnAmt / quantity * uomBaseRatio;
    //   this.form.controls['unitPriceTxnUom'].setValue(this.roundToTwo(unitPriceTxnUom));
    //   const unitPriceStdUom = unitPriceStdWithoutTax * uomBaseRatio;
    //   this.form.controls['unitPriceStdUom'].setValue(this.roundToTwo(unitPriceStdUom));
    // }

    this.form.controls['unitDiscount'].setValue(this.roundToTwo(unitDiscount));
    this.form.controls['unitDiscountUom'].setValue(this.roundToTwo(unitDiscountUom));
    this.form.controls['unitPriceNetUom'].setValue(this.roundToTwo(unitPriceNetUom));
    this.form.controls['unitPriceNet'].setValue(this.roundToTwo(unitPriceNet));
    this.form.controls['qtyUom'].setValue(this.roundToTwo(qtyUom).toFixed(2));
    this.form.controls['discountAmt'].setValue(this.roundToTwo(discountAmount));
    this.form.controls['stdAmt'].setValue(this.roundToTwo(stdAmount));
    this.form.controls['netAmt'].setValue(this.roundToTwo(netAmount));
    this.form.controls['taxAmt'].setValue(this.roundToTwo(taxAmount));
    // this.form.controls['netAmtWithTax'].setValue(this.roundToTwo(netAmountWithTax));
    this.form.controls['whtAmt'].setValue(this.roundToTwo(whtAmount));
    this.form.controls['txnAmt'].setValue(this.roundToTwo(txnAmt));
    // this.form.controls['unitPriceStdWithoutTax'].setValue(this.roundToTwo(unitPriceStd));
    this.form.controls['unitPriceTxnUom'].setValue(this.roundToTwo(unitPriceTxnUom));
    this.form.controls['unitPriceStdUom'].setValue(this.roundToTwo(unitPriceStdUom));
  }

  onCalculateFromUnitDisc() {
    const quantity = !isNaN(this.form.controls['qty'].value) ? 
      (parseFloat(this.form.controls['qty'].value) % 1 !== 0 ? 
        parseFloat(this.form.controls['qty'].value) : 
        parseInt(this.form.controls['qty'].value, 10)) : 0;
    const unitPriceStdWithTax = this.safeParseFloat(this.form.controls['unitPriceStdWithTax'].value);
    const unitPriceStdWithoutTaxUom = this.safeParseFloat(this.form.controls['unitPriceStdUom'].value);
    const unitDiscount = this.safeParseFloat(this.form.controls['unitDiscount'].value);
    const taxPercent = this.safeParseFloat(this.form.controls['taxPercent'].value);
    const whtPercent = this.safeParseFloat(this.form.controls['whtPercent'].value);
    const uomBaseRatio = this.safeParseInt(this.form.controls['uomBaseRatio'].value) || 1;
    // const isBaseUom = this.form.controls['isBaseUom'].value;
    const unitPriceStdWithoutTax: number = this.roundToTwo(unitPriceStdWithTax / (1 + taxPercent - whtPercent));

    const discountAmount = quantity * unitDiscount;
    const stdAmount = quantity * unitPriceStdWithoutTax;
    const netAmount = stdAmount - discountAmount;
    const taxAmount = netAmount * taxPercent;
    // const netAmountWithTax = netAmount + taxAmount;
    const whtAmount = netAmount * whtPercent;
    const txnAmount = netAmount + taxAmount - whtAmount;
    const unitPriceTxn = this.roundToTwo(txnAmount / quantity);
    const unitPriceNet = unitPriceStdWithoutTax - unitDiscount;
    const qtyUom = quantity / uomBaseRatio;
    const unitPriceTxnUom = txnAmount / quantity * uomBaseRatio;
    const unitDiscountUom = unitDiscount * uomBaseRatio;
    const unitPriceNetUom = unitPriceStdWithoutTaxUom - unitDiscountUom;
    const unitPriceStdUom = unitPriceStdWithoutTax * uomBaseRatio;

    this.form.controls['unitPriceStdWithoutTax'].setValue(this.roundToTwo(unitPriceStdWithoutTax));
    this.form.controls['discountAmt'].setValue(this.roundToTwo(discountAmount));
    this.form.controls['stdAmt'].setValue(this.roundToTwo(stdAmount));
    this.form.controls['netAmt'].setValue(this.roundToTwo(netAmount));
    this.form.controls['taxAmt'].setValue(this.roundToTwo(taxAmount));
    // this.form.controls['netAmtWithTax'].setValue(this.roundToTwo(netAmountWithTax));
    this.form.controls['whtAmt'].setValue(this.roundToTwo(whtAmount));
    this.form.controls['txnAmt'].setValue(this.roundToTwo(txnAmount));
    this.form.controls['unitPriceTxn'].setValue(this.roundToTwo(unitPriceTxn));
    // this.form.controls['unitPriceStdWithTax'].setValue(this.roundToTwo(unitPriceStdWithTax));
    this.form.controls['unitPriceNet'].setValue(this.roundToTwo(unitPriceNet));
    this.form.controls['qtyUom'].setValue(this.roundToTwo(qtyUom).toFixed(2));
    this.form.controls['unitPriceTxnUom'].setValue(this.roundToTwo(unitPriceTxnUom));
    this.form.controls['unitDiscountUom'].setValue(this.roundToTwo(unitDiscountUom));
    this.form.controls['unitPriceNetUom'].setValue(this.roundToTwo(unitPriceNetUom));
    this.form.controls['unitPriceStdUom'].setValue(this.roundToTwo(unitPriceStdUom));


    // if (uomBaseRatio) {
    //   const unitDiscountUom = unitDiscount * uomBaseRatio;
    //   const unitPriceNetUom = unitPriceStdWithoutTaxUom - unitDiscountUom;
    //   const unitPriceTxnUom = unitPriceTxn * uomBaseRatio;

    //   this.form.controls['unitPriceNetUom'].setValue(this.roundToTwo(unitPriceNetUom));
    //   this.form.controls['unitPriceTxnUom'].setValue(this.roundToTwo(unitPriceTxnUom));
    //   this.form.controls['unitDiscountUom'].setValue(this.roundToTwo(unitDiscountUom));
    // }
  }

  onCalculateFromAmountDisc() {
    const quantity = !isNaN(this.form.controls['qty'].value) ? 
      (parseFloat(this.form.controls['qty'].value) % 1 !== 0 ? 
        parseFloat(this.form.controls['qty'].value) : 
        parseInt(this.form.controls['qty'].value, 10)) : 0;
    const unitPriceStd = this.safeParseFloat(this.form.controls['unitPriceStd'].value);
    const taxPercent = this.safeParseFloat(this.form.controls['taxPercent'].value);
    const whtPercent = this.safeParseFloat(this.form.controls['whtPercent'].value);
    const discountAmount = this.safeParseFloat(this.form.controls['discountAmt'].value);
    const uomBaseRatio = this.safeParseInt(this.form.controls['uomBaseRatio'].value) || 1;
    // const unitDiscount = parseInt(this.form.controls['unitDiscount'].value, 10);
    const unitPriceStdWithoutTax = this.safeParseFloat(this.form.controls['unitPriceStdWithoutTax'].value);


    const stdAmount = unitPriceStdWithoutTax * quantity;
    const netAmount = stdAmount - discountAmount;
    const unitDiscount = discountAmount / quantity;
    const unitPriceStdUom = unitPriceStdWithoutTax * uomBaseRatio;
    const unitDiscountUom = (stdAmount - netAmount) / quantity * uomBaseRatio;
    const unitPriceNetUom = unitPriceStdUom - unitDiscountUom;
    const taxAmount = netAmount * taxPercent;
    const whtAmount = netAmount * whtPercent;
    const txnAmount = netAmount + taxAmount - whtAmount;

    const unitPriceTxnUom = txnAmount / quantity * uomBaseRatio;
    const qtyUom = quantity / uomBaseRatio;
    const unitPriceNet = (unitPriceStdWithoutTax * quantity - discountAmount) / quantity;
    const unitPriceTxn = (netAmount + taxAmount - whtAmount) / quantity;

    // const isBaseUom = this.form.controls['isBaseUom'].value;
    if (uomBaseRatio) {
      this.form.controls['unitDiscountUom'].setValue(this.roundToTwo(unitDiscountUom));
    }

    const netAmountWithTax = netAmount + taxAmount;

    this.form.controls['unitDiscount'].setValue(this.roundToTwo(unitDiscount));
    this.form.controls['unitPriceStdUom'].setValue(this.roundToTwo(unitPriceStdUom));
    this.form.controls['unitPriceNetUom'].setValue(this.roundToTwo(unitPriceNetUom));
    this.form.controls['unitPriceTxnUom'].setValue(this.roundToTwo(unitPriceTxnUom));
    this.form.controls['qtyUom'].setValue(this.roundToTwo(qtyUom).toFixed(2));
    this.form.controls['unitPriceNet'].setValue(this.roundToTwo(unitPriceNet));
    this.form.controls['unitPriceTxn'].setValue(this.roundToTwo(unitPriceTxn));
    this.form.controls['txnAmt'].setValue(this.roundToTwo(txnAmount));
    this.form.controls['stdAmt'].setValue(this.roundToTwo(stdAmount));
    this.form.controls['netAmt'].setValue(this.roundToTwo(netAmount));
    this.form.controls['taxAmt'].setValue(this.roundToTwo(taxAmount));
    this.form.controls['netAmtWithTax'].setValue(this.roundToTwo(netAmountWithTax));
    this.form.controls['whtAmt'].setValue(this.roundToTwo(whtAmount));
  }

  onCalculateFromAmountStd() {
    const quantity = !isNaN(this.form.controls['qty'].value) ? 
      (parseFloat(this.form.controls['qty'].value) % 1 !== 0 ? 
        parseFloat(this.form.controls['qty'].value) : 
        parseInt(this.form.controls['qty'].value, 10)) : 0;
    const unitDiscount = this.safeParseFloat(this.form.controls['unitDiscount'].value);
    const taxPercent = this.safeParseFloat(this.form.controls['taxPercent'].value);
    const whtPercent = this.safeParseFloat(this.form.controls['whtPercent'].value);
    const stdAmount = this.safeParseFloat(this.form.controls['stdAmt'].value);
    const uomBaseRatio = this.safeParseInt(this.form.controls['uomBaseRatio'].value) || 1;

    const unitPriceStd = this.roundToTwo(stdAmount / quantity);
    const discountAmount = quantity * unitDiscount;
    const netAmount = stdAmount - discountAmount
    const taxAmount = this.roundToTwo(netAmount * taxPercent);
    const netAmountWithTax = netAmount + taxAmount;
    const whtAmount = this.roundToTwo(netAmount * whtPercent);
    const txnAmount = netAmountWithTax - whtAmount;
    const unitPriceTxn = this.roundToTwo(txnAmount / quantity);

    if (uomBaseRatio) {
      const unitPriceTxnUom = this.roundToTwo(unitPriceTxn * uomBaseRatio)
      this.form.controls['unitPriceTxnUom'].setValue(this.roundToTwo(unitPriceTxnUom));

      const unitPriceStdUom = this.roundToTwo(unitPriceStd * uomBaseRatio)
      this.form.controls['unitPriceStdUom'].setValue(this.roundToTwo(unitPriceStdUom));
    }

    this.form.controls['unitPriceStd'].setValue(this.roundToTwo(unitPriceStd));
    this.form.controls['discountAmt'].setValue(this.roundToTwo(discountAmount));
    this.form.controls['netAmt'].setValue(this.roundToTwo(netAmount));
    this.form.controls['taxAmt'].setValue(this.roundToTwo(taxAmount));
    this.form.controls['netAmtWithTax'].setValue(this.roundToTwo(netAmountWithTax));
    this.form.controls['whtAmt'].setValue(this.roundToTwo(whtAmount));
    this.form.controls['txnAmt'].setValue(this.roundToTwo(txnAmount));
    this.form.controls['unitPriceTxn'].setValue(this.roundToTwo(unitPriceTxn));
  }

  onCalculateFromAmountNet() {
    const quantity = parseInt(this.form.controls['qty'].value, 10);
    const unitPriceStdWithoutTax = parseFloat(this.form.controls['unitPriceStdWithoutTax'].value);
    const taxPercent = parseFloat(this.form.controls['taxPercent'].value);
    const whtPercent = parseFloat(this.form.controls['whtPercent'].value);
    const netAmount = parseFloat(this.form.controls['netAmt'].value); // user input
    const uomBaseRatio = parseInt(this.form.controls['uomBaseRatio'].value, 10);

    const qtyByUom = quantity * uomBaseRatio;
    const unitPriceNet = this.roundToTwo(netAmount / quantity);
    const stdAmount = quantity * unitPriceStdWithoutTax;
    const discountAmount = stdAmount - netAmount;
    const unitDiscount = this.roundToTwo(discountAmount / quantity);
    const taxAmount = netAmount * taxPercent;
    const whtAmount = netAmount * whtPercent;
    const txnAmount = netAmount + taxAmount - whtAmount;
    const unitPriceTxn = this.roundToTwo(txnAmount / quantity);
    const unitPriceTxnUom = txnAmount / quantity * uomBaseRatio;
    const unitDiscountUom = this.roundToTwo((stdAmount - netAmount) / quantity * uomBaseRatio);
    const unitPriceStdUom = unitPriceStdWithoutTax * uomBaseRatio;
    const unitPriceNetUom = unitPriceStdUom - unitDiscountUom;

    // if (uomBaseRatio) {
    //   const unitDiscountUom = this.roundToTwo((unitPriceStdWithoutTax * uomBaseRatio) - ((netAmount * uomBaseRatio) / quantity));
    //   this.form.controls['unitDiscountUom'].setValue(this.roundToTwo(unitDiscountUom));

    //   const unitPriceNetUom = unitPriceNet * uomBaseRatio;
    //   this.form.controls['unitPriceNetUom'].setValue(this.roundToTwo(unitPriceNetUom));

    //   const unitPriceTxnUom = unitPriceTxn * uomBaseRatio;
    //   this.form.controls['unitPriceTxnUom'].setValue(this.roundToTwo(unitPriceTxnUom));
    // }

    this.form.controls['unitPriceNet'].setValue(this.roundToTwo(unitPriceNet));
    this.form.controls['unitDiscount'].setValue(this.roundToTwo(unitDiscount));
    this.form.controls['discountAmt'].setValue(this.roundToTwo(discountAmount));
    this.form.controls['stdAmt'].setValue(this.roundToTwo(stdAmount));
    this.form.controls['taxAmt'].setValue(this.roundToTwo(taxAmount));
    // this.form.controls['netAmtWithTax'].setValue(this.roundToTwo(netAmountWithTax));
    this.form.controls['whtAmt'].setValue(this.roundToTwo(whtAmount));
    this.form.controls['txnAmt'].setValue(this.roundToTwo(txnAmount));
    this.form.controls['unitPriceTxn'].setValue(this.roundToTwo(unitPriceTxn));
    this.form.controls['qtyUom'].setValue(this.roundToTwo(qtyByUom).toFixed(2));
    this.form.controls['unitPriceTxnUom'].setValue(this.roundToTwo(unitPriceTxnUom));
    this.form.controls['unitPriceStdUom'].setValue(this.roundToTwo(unitPriceStdUom));
    this.form.controls['unitDiscountUom'].setValue(this.roundToTwo(unitDiscountUom));
    this.form.controls['unitPriceNetUom'].setValue(this.roundToTwo(unitPriceNetUom));
  }

  onCalculateFromAmountTxn() {
    const quantity = !isNaN(this.form.controls['qty'].value) ? 
      (parseFloat(this.form.controls['qty'].value) % 1 !== 0 ? 
        parseFloat(this.form.controls['qty'].value) : 
        parseInt(this.form.controls['qty'].value, 10)) : 0;
    const unitPriceStdWithoutTax = this.safeParseFloat(this.form.controls['unitPriceStdWithoutTax'].value);
    const taxPercent = this.safeParseFloat(this.form.controls['taxPercent'].value);
    const whtPercent = this.safeParseFloat(this.form.controls['whtPercent'].value);
    // const stdAmount = parseFloat(this.form.controls['stdAmt'].value); // user input

    const uomBaseRatio = this.safeParseInt(this.form.controls['uomBaseRatio'].value) || 1;
    const txnAmount = this.safeParseFloat(this.form.controls['txnAmt'].value);
    // const isBaseUom = this.form.controls['isBaseUom'].value;
    const unitPriceStdUom = unitPriceStdWithoutTax * uomBaseRatio;
    const qtyByUom = quantity * uomBaseRatio;
    const unitPriceTxnUom = txnAmount / qtyByUom;
    const taxAmount = this.roundToTwo((txnAmount / (1 + taxPercent - whtPercent)) * taxPercent);
    // netAmountWithTax = this.roundToTwo((txnAmount + (txnAmount * taxPercent)) / (1 + taxPercent - whtPercent));
    const whtAmount = this.roundToTwo((txnAmount / (1 + taxPercent - whtPercent)) * whtPercent);
    const netAmount = txnAmount - taxAmount + whtAmount;
    const unitPriceNet = this.roundToTwo(netAmount / quantity);
    const stdAmount = unitPriceStdWithoutTax * quantity;
    const discountAmount = stdAmount - netAmount
    const unitDiscount = this.roundToTwo(discountAmount / quantity);
    const unitPriceTxn = this.roundToTwo(txnAmount / quantity);
    const unitDiscountUom = (stdAmount - netAmount) / quantity * uomBaseRatio;
    const unitPriceNetUom = unitPriceStdUom - unitDiscountUom;

    // should use proper equation for this?
    // if (uomBaseRatio) {
    //   const unitDiscountUom = unitDiscount * uomBaseRatio;
    //   this.form.controls['unitDiscountUom'].setValue(this.roundToTwo(unitDiscountUom));

    //   const unitPriceTxnUom = unitPriceTxn * uomBaseRatio;
    //   this.form.controls['unitPriceTxnUom'].setValue(this.roundToTwo(unitPriceTxnUom));

    //   const unitPriceNetUom = unitPriceStdUom - unitDiscountUom;
    //   this.form.controls['unitPriceNetUom'].setValue(this.roundToTwo(unitPriceNetUom));
    // }

    this.form.controls['discountAmt'].setValue(this.roundToTwo(discountAmount));
    this.form.controls['unitDiscount'].setValue(this.roundToTwo(unitDiscount));
    this.form.controls['stdAmt'].setValue(this.roundToTwo(stdAmount));
    this.form.controls['netAmt'].setValue(this.roundToTwo(netAmount));
    this.form.controls['unitPriceNet'].setValue(this.roundToTwo(unitPriceNet));
    this.form.controls['taxAmt'].setValue(this.roundToTwo(taxAmount));
    this.form.controls['qtyUom'].setValue(this.roundToTwo(qtyByUom ?? 1).toFixed(2));
    // this.form.controls['netAmtWithTax'].setValue(this.roundToTwo(netAmountWithTax));
    this.form.controls['unitPriceTxnUom'].setValue(this.roundToTwo(unitPriceTxnUom));
    this.form.controls['whtAmt'].setValue(this.roundToTwo(whtAmount));
    this.form.controls['unitPriceTxn'].setValue(this.roundToTwo(unitPriceTxn));
    this.form.controls['unitDiscountUom'].setValue(this.roundToTwo(unitDiscountUom));
    this.form.controls['unitPriceNetUom'].setValue(this.roundToTwo(unitPriceNetUom));
    this.form.controls['unitPriceStdUom'].setValue(this.roundToTwo(unitPriceStdUom));
  }

  onCalculateFromQtyByUom() {
    const uomBaseRatio = this.safeParseInt(this.form.controls['uomBaseRatio'].value);
    const qtyByUom = this.safeParseFloat(this.form.controls['qtyUom'].value);
    if (uomBaseRatio && uomBaseRatio > 0) {
      const qty = Math.round(qtyByUom * uomBaseRatio)
      this.form.controls['qty'].setValue(qty);
      this.onCalculate();
    }
  }

  // onCalculateFromUomBaseRatio() {
  //   const quantity = parseInt(this.form.controls['qty'].value, 10);
  //   const unitPriceStd = parseFloat(this.form.controls['unitPriceStd'].value);
  //   const unitDiscount = parseFloat(this.form.controls['unitDiscount'].value);
  //   const taxPercent = parseFloat(this.form.controls['taxPercent'].value);
  //   const whtPercent = parseFloat(this.form.controls['whtPercent'].value);
  //   const uomBaseRatio = parseInt(this.form.controls['uomBaseRatio'].value, 10); // user input

  //   if (uomBaseRatio) {
  //     const discountAmount = quantity * unitDiscount;
  //     const stdAmount = quantity * unitPriceStd;
  //     const netAmount1 = stdAmount - discountAmount
  //     const taxAmount = this.roundToTwo(netAmount1 * taxPercent);
  //     const netAmount2 = netAmount1 + taxAmount;
  //     const whtAmount = this.roundToTwo(netAmount1 * whtPercent);
  //     const txnAmount = netAmount2 - whtAmount;
  //     const unitPriceTxn = this.roundToTwo(txnAmount / quantity);

  //     const qtyByUom = this.roundToTwo(quantity / uomBaseRatio);
  //     const unitDiscountUom = this.roundToTwo(unitDiscount * uomBaseRatio);
  //     const unitPriceStdUom = this.roundToTwo(unitPriceStd * uomBaseRatio);
  //     const unitPriceTxnUom = this.roundToTwo(unitPriceTxn * uomBaseRatio);
  //     this.form.controls['qtyUom'].setValue(qtyByUom);
  //     this.form.controls['unitDiscountUom'].setValue(this.roundToTwo(unitDiscountUom));
  //     this.form.controls['unitPriceStdUom'].setValue(this.roundToTwo(unitPriceStdUom));
  //     this.form.controls['unitPriceTxnUom'].setValue(this.roundToTwo(unitPriceTxnUom));


  //     this.form.controls['discountAmt'].setValue(this.roundToTwo(discountAmount));
  //     this.form.controls['stdAmt'].setValue(this.roundToTwo(stdAmount));
  //     this.form.controls['netAmt1'].setValue(this.roundToTwo(netAmount1));
  //     this.form.controls['taxAmt'].setValue(this.roundToTwo(taxAmount));
  //     this.form.controls['netAmt2'].setValue(this.roundToTwo(netAmount2));
  //     this.form.controls['whtAmt'].setValue(this.roundToTwo(whtAmount));
  //     this.form.controls['txnAmt'].setValue(this.roundToTwo(txnAmount));
  //     this.form.controls['unitPriceTxn'].setValue(this.roundToTwo(unitPriceTxn));
  //   }
  // }

  onCalculateFromUnitPriceTxnUom() {
    const uomBaseRatio = this.safeParseInt(this.form.controls['uomBaseRatio'].value) || 1;
    const unitPriceTxnUom = this.safeParseFloat(this.form.controls['unitPriceTxnUom'].value);
    const taxPercent = this.safeParseFloat(this.form.controls['taxPercent'].value);
    const whtPercent = this.safeParseFloat(this.form.controls['whtPercent'].value);
    const unitDiscountUom = this.safeParseFloat(this.form.controls['unitDiscountUom'].value);
    const quantity = this.safeParseFloat(this.form.controls['qty'].value);
    // const isBaseUom = this.form.controls['isBaseUom'].value;

    const unitPriceNetUom = this.roundToTwo(unitPriceTxnUom / (1 + taxPercent - whtPercent));
    const unitPriceStdUom = this.roundToTwo(unitDiscountUom + unitPriceNetUom);

    this.form.controls['unitPriceNetUom'].setValue(this.roundToTwo(unitPriceNetUom));
    this.form.controls['unitPriceStdUom'].setValue(this.roundToTwo(unitPriceStdUom));

    if (uomBaseRatio) {
      const unitPriceNet = this.roundToTwo((unitPriceStdUom - unitDiscountUom) / uomBaseRatio);
      const unitPriceStdWithoutTax = this.roundToTwo(unitPriceStdUom / uomBaseRatio);
      const stdAmount = unitPriceStdWithoutTax * quantity;
      const discountAmount = this.roundToTwo((unitPriceStdWithoutTax - unitPriceNet) * quantity);
      const unitDiscount = this.roundToTwo(unitDiscountUom / uomBaseRatio);
      const netAmount = stdAmount - discountAmount;
      const taxAmount = netAmount * taxPercent;
      const whtAmount = netAmount * whtPercent;
      const unitPriceTxn = this.roundToTwo((netAmount + taxAmount - whtAmount) / quantity)
      const txnAmount = netAmount + taxAmount - whtAmount;
      const unitPriceStdWithTax = this.roundToTwo(unitPriceStdWithoutTax * (1 + taxPercent - whtPercent));

      this.form.controls['unitPriceStdWithoutTax'].setValue(this.roundToTwo(unitPriceStdWithoutTax));
      this.form.controls['unitPriceStdWithTax'].setValue(this.roundToTwo(unitPriceStdWithTax));
      this.form.controls['unitPriceNet'].setValue(this.roundToTwo(unitPriceNet));
      this.form.controls['stdAmt'].setValue(this.roundToTwo(stdAmount));
      this.form.controls['discountAmt'].setValue(this.roundToTwo(discountAmount));
      this.form.controls['unitDiscount'].setValue(this.roundToTwo(unitDiscount));
      this.form.controls['netAmt'].setValue(this.roundToTwo(netAmount));
      this.form.controls['unitPriceTxn'].setValue(this.roundToTwo(unitPriceTxn));
      this.form.controls['txnAmt'].setValue(this.roundToTwo(txnAmount));
      this.form.controls['taxAmt'].setValue(this.roundToTwo(taxAmount));
      this.form.controls['whtAmt'].setValue(this.roundToTwo(whtAmount))

      // const unitPriceTxn = this.roundToTwo(unitPriceTxnUom / uomBaseRatio);
      // const txnAmount = this.roundToTwo(unitPriceTxn * quantity);
      // const taxAmount = this.roundToTwo(txnAmount * taxPercent / (1 + taxPercent - whtPercent));
      // const whtAmount = this.roundToTwo(txnAmount * whtPercent / (1 + taxPercent - whtPercent));
      // const netAmount = txnAmount - taxAmount + whtAmount;
      // const unitPriceNet = this.roundToTwo(netAmount / quantity);
      // const unitPriceNetUom = unitPriceNet * uomBaseRatio;
      // const unitPriceStdWithoutTax = this.roundToTwo(unitPriceStdUom / uomBaseRatio);
      // const stdAmount = this.roundToTwo(unitPriceStdWithoutTax * quantity);
      // const discountAmount = this.roundToTwo((unitPriceStdWithoutTax - unitPriceNet) / quantity);
      // this.onCalculate();
    }
  }

  onCalculateFromUnitDiscountUom() {
    const quantity = !isNaN(this.form.controls['qty'].value) ? 
      (parseFloat(this.form.controls['qty'].value) % 1 !== 0 ? 
        parseFloat(this.form.controls['qty'].value) : 
        parseInt(this.form.controls['qty'].value, 10)) : 0;
    const uomBaseRatio = this.safeParseInt(this.form.controls['uomBaseRatio'].value) || 1;
    const unitDiscountUom = this.safeParseFloat(this.form.controls['unitDiscountUom'].value);
    const unitPriceStdWithoutTax = this.safeParseFloat(this.form.controls['unitPriceStdWithoutTax'].value);
    const taxPercent = this.safeParseFloat(this.form.controls['taxPercent'].value);
    const whtPercent = this.safeParseFloat(this.form.controls['whtPercent'].value);

    const unitPriceStdWithTax = this.roundToTwo(unitPriceStdWithoutTax * (1 + taxPercent - whtPercent));
    const unitPriceStdUom = this.roundToTwo(unitPriceStdWithoutTax * uomBaseRatio);
    const unitPriceNetUom = unitPriceStdUom - unitDiscountUom;
    const qtyUom = quantity / uomBaseRatio;
    const unitPriceNet = this.roundToTwo((unitPriceStdUom - unitDiscountUom) / uomBaseRatio);
    const unitDiscount = unitPriceStdWithoutTax - unitPriceNet;
    const stdAmount = unitPriceStdWithoutTax * quantity;
    const discountAmt = (unitPriceStdWithoutTax - unitPriceNet) * quantity;
    const netAmt = stdAmount - discountAmt;
    const taxAmt = netAmt * taxPercent;
    const whtAmt = netAmt * whtPercent;
    const unitPriceTxn = (netAmt + taxAmt - whtAmt) / quantity;
    const txnAmt = netAmt + taxAmt - whtAmt;
    const unitPriceTxnUom = txnAmt / quantity * uomBaseRatio;

    // const isBaseUom = this.form.controls['isBaseUom'].value;
    if (uomBaseRatio) {
      const unitDiscount = this.roundToTwo(unitPriceStdWithoutTax - unitPriceNet);
      this.form.controls['unitDiscount'].setValue(this.roundToTwo(unitDiscount));
      this.onCalculate();

      this.form.controls['unitPriceStdUom'].setValue(this.roundToTwo(unitPriceStdUom));
    }

    this.form.controls['unitPriceNetUom'].setValue(this.roundToTwo(unitPriceNetUom));
    this.form.controls['qtyUom'].setValue(this.roundToTwo(qtyUom).toFixed(2));
    this.form.controls['unitPriceNet'].setValue(this.roundToTwo(unitPriceNet));
    this.form.controls['stdAmt'].setValue(this.roundToTwo(stdAmount));
    this.form.controls['stdAmt'].setValue(this.roundToTwo(stdAmount));
    this.form.controls['discountAmt'].setValue(this.roundToTwo(discountAmt));
    this.form.controls['netAmt'].setValue(this.roundToTwo(netAmt));
    this.form.controls['taxAmt'].setValue(this.roundToTwo(taxAmt));
    this.form.controls['whtAmt'].setValue(this.roundToTwo(whtAmt));
    this.form.controls['unitPriceTxn'].setValue(this.roundToTwo(unitPriceTxn));
    this.form.controls['txnAmt'].setValue(this.roundToTwo(txnAmt));
    this.form.controls['unitPriceTxnUom'].setValue(this.roundToTwo(unitPriceTxnUom));
    this.form.controls['unitPriceStdWithTax'].setValue(this.roundToTwo(unitPriceStdWithTax));
    this.form.controls['unitDiscount'].setValue(this.roundToTwo(unitDiscount));

  }

  nullHandler(controlName: string, value: string) {
    if (controlName === 'qty' || controlName === 'uomBaseRatio' || controlName === 'qtyUom')
      value ? this.form.controls[controlName].setValue(value) : this.form.controls[controlName].setValue(1);
    else
      value ? this.form.controls[controlName].setValue(this.roundToTwo(parseFloat(value))) : this.form.controls[controlName].setValue('0.00');
  }

  onSST(e: TaxCodeContainerModel) {
    this.form.controls['taxPercent'].setValue(
      (this.roundToTwo(parseFloat(e.bl_fi_cfg_tax_code.tax_rate_txn.toString())))
    );
    this.form.controls['taxGSTtype'].setValue(e.bl_fi_cfg_tax_code.tax_gst_type);
    this.onCalculate();
  }

  onWHT(e: TaxCodeContainerModel) {
    this.form.controls['whtPercent'].setValue(
      (this.roundToTwo(parseFloat(e.bl_fi_cfg_tax_code.tax_rate_txn.toString())))
    );
    this.onCalculate();
  }

  onCalculateFromUnitPriceNet() {
    // values
    const unitPriceNet = this.safeParseFloat(this.form.controls['unitPriceNet'].value);
    const unitPriceStdWithoutTax = this.safeParseFloat(this.form.controls['unitPriceStdWithoutTax'].value);
    const quantity = !isNaN(this.form.controls['qty'].value) ? 
      (parseFloat(this.form.controls['qty'].value) % 1 !== 0 ? 
        parseFloat(this.form.controls['qty'].value) : 
        parseInt(this.form.controls['qty'].value, 10)) : 0;
    const uomBaseRatio = this.safeParseInt(this.form.controls['uomBaseRatio'].value) || 1;
    const taxPercent = this.safeParseFloat(this.form.controls['taxPercent'].value);
    const whtPercent = this.safeParseFloat(this.form.controls['whtPercent'].value);

    // formula
    const unitPriceStdUom = unitPriceStdWithoutTax * uomBaseRatio;
    const stdAmt = unitPriceStdWithoutTax * quantity;
    const unitDiscount = this.roundToTwo(unitPriceStdWithoutTax - unitPriceNet);
    const qtyUom = quantity / uomBaseRatio;
    const discountAmt = (unitPriceStdWithoutTax - unitPriceNet) * quantity;
    const netAmt = stdAmt - discountAmt;
    const taxAmt = netAmt * taxPercent;
    const whtAmt = netAmt * whtPercent;
    const txnAmt = netAmt + taxAmt - whtAmt;
    const unitPriceTxn = (netAmt + taxAmt - whtAmt) / quantity;
    const unitPriceTxnUom = txnAmt / quantity * uomBaseRatio;
    const unitDiscountUom = (stdAmt - netAmt) / quantity * uomBaseRatio;
    const unitPriceNetUom = unitPriceStdUom - unitDiscountUom;

    // patching
    this.form.controls['unitPriceStdUom'].setValue(this.roundToTwo(unitPriceStdUom));
    this.form.controls['stdAmt'].setValue(this.roundToTwo(stdAmt));
    this.form.controls['unitDiscount'].setValue(this.roundToTwo(unitDiscount));
    this.form.controls['qtyUom'].setValue(this.roundToTwo(qtyUom));
    this.form.controls['discountAmt'].setValue(this.roundToTwo(discountAmt));
    this.form.controls['discountAmt'].setValue(this.roundToTwo(discountAmt));
    this.form.controls['netAmt'].setValue(this.roundToTwo(netAmt));
    this.form.controls['taxAmt'].setValue(this.roundToTwo(taxAmt));
    this.form.controls['whtAmt'].setValue(this.roundToTwo(whtAmt));
    this.form.controls['txnAmt'].setValue(this.roundToTwo(txnAmt));
    this.form.controls['unitPriceTxn'].setValue(this.roundToTwo(unitPriceTxn));
    this.form.controls['unitPriceTxnUom'].setValue(this.roundToTwo(unitPriceTxnUom));
    this.form.controls['unitDiscountUom'].setValue(this.roundToTwo(unitDiscountUom));
    this.form.controls['unitPriceNetUom'].setValue(this.roundToTwo(unitPriceNetUom));

  }

  onUOMSelected(e: any) {
    this.form.controls['uomBaseRatio'].patchValue(e.quantity);
    this.form.controls['uom'].patchValue(e.uom);
  }

  onPriceSelected(e: any) {
    //Upon Select Pricing Scheme - should populate unit_price_std, unit_price_std_with_tax



    this.form.controls['isBaseUom'].patchValue(e.isBaseUom);
    this.form.controls['pricingScheme'].patchValue(e);

    const quantity = !isNaN(this.form.controls['qty'].value) ? 
      (parseFloat(this.form.controls['qty'].value) % 1 !== 0 ? 
        parseFloat(this.form.controls['qty'].value) : 
        parseInt(this.form.controls['qty'].value, 10)) : 0;
    const unitDiscount = this.safeParseFloat(this.form.controls['unitDiscount'].value);
    const taxPercent = this.safeParseFloat(this.form.controls['taxPercent'].value);
    const whtPercent = this.safeParseFloat(this.form.controls['whtPercent'].value);
    const uomBaseRatio = this.safeParseInt(this.form.controls['uomBaseRatio'].value) || 1;
    const unitDiscountUom = this.safeParseFloat(this.form.controls['unitDiscountUom'].value);
    const qtyByUom = this.roundToTwo(quantity / uomBaseRatio);

    if (this.isInclusiveTax) {
      var isBaseUom = this.form.controls['isBaseUom'].value;
      this.form.controls['unitPriceStdWithTax'].patchValue(this.roundToTwo(Number(e.price_amount_incl_tax)));
      var unitPriceStdWithTax: number = parseFloat(this.form.controls['unitPriceStdWithTax'].value);
      var unitPriceStdWithoutTax: number = this.roundToTwo(unitPriceStdWithTax / (1 + taxPercent - whtPercent));

      if (uomBaseRatio) {
        var unitPriceStdUom: number = this.roundToTwo(unitPriceStdWithoutTax * uomBaseRatio);
        this.form.controls['unitPriceStdUom'].setValue(this.roundToTwo(unitPriceStdUom));
        // this.form.controls['unitPriceStdUomWithTax'].setValue(this.roundToTwo(unitPriceStdUom));
      }
      var unitPriceNetUom = unitPriceStdUom - unitDiscountUom;
      var qtyUom = quantity / uomBaseRatio;
      var unitPriceNet = unitPriceStdWithoutTax - unitDiscount;
      var stdAmt = unitPriceStdWithoutTax * quantity;
      var discountAmt = unitDiscount * quantity;
      var netAmt = stdAmt - discountAmt;
      var taxAmt = netAmt * taxPercent;
      var whtAmt = netAmt * whtPercent;
      var unitPriceTxn = this.roundToTwo((netAmt + taxAmt - whtAmt) / quantity);
      var txnAmt = netAmt + taxAmt - whtAmt;
      var unitPriceTxnUom = this.roundToTwo(txnAmt / quantity * uomBaseRatio);

      this.form.controls['qtyUom'].setValue(qtyByUom);
      // this.form.controls['unitPriceStdUom'].setValue(this.roundToTwo(unitPriceStdUom));
      this.form.controls['unitPriceTxnUom'].setValue(this.roundToTwo(unitPriceTxnUom));
      this.form.controls['discountAmt'].setValue(this.roundToTwo(discountAmt));
      this.form.controls['unitPriceNet'].setValue(this.roundToTwo(unitPriceNet));
      this.form.controls['unitPriceNetUom'].setValue(this.roundToTwo(unitPriceNetUom));
      this.form.controls['stdAmt'].setValue(this.roundToTwo(stdAmt));
      this.form.controls['netAmt'].setValue(this.roundToTwo(netAmt));
      this.form.controls['taxAmt'].setValue(this.roundToTwo(taxAmt));
      this.form.controls['whtAmt'].setValue(this.roundToTwo(whtAmt));
      this.form.controls['txnAmt'].setValue(this.roundToTwo(txnAmt));
      this.form.controls['unitPriceTxn'].setValue(this.roundToTwo(unitPriceTxn));
      this.form.controls['unitPriceStdWithTax'].setValue(this.roundToTwo(unitPriceStdWithTax));
    }
    // Exclusive tax have to work here
    else if (!this.isInclusiveTax) {
      var isBaseUom = this.form.controls['isBaseUom'].value;
      this.form.controls['unitPriceStdWithoutTax'].patchValue(this.roundToTwo(Number(e.price_amount_excl_tax)));
      var unitPriceStdWithoutTax: number = parseFloat(this.form.controls['unitPriceStdWithoutTax'].value);
      var unitPriceStdWithTax: number = this.roundToTwo(unitPriceStdWithoutTax * (1 + taxPercent - whtPercent));

      console.log("unitPriceStdWithTax", unitPriceStdWithTax)

      if (uomBaseRatio) {
        var unitPriceStdUom: number = this.roundToTwo(unitPriceStdWithoutTax * uomBaseRatio);
        this.form.controls['unitPriceStdUom'].setValue(this.roundToTwo(unitPriceStdUom));
        // this.form.controls['unitPriceStdUomWithTax'].setValue(this.roundToTwo(unitPriceStdUom));
      }
      var unitPriceNetUom = unitPriceStdUom - unitDiscountUom;
      var qtyUom = quantity / uomBaseRatio;
      var unitPriceNet = unitPriceStdWithoutTax - unitDiscount;
      var stdAmt = unitPriceStdWithoutTax * quantity;
      var discountAmt = unitDiscount * quantity;
      var netAmt = stdAmt - discountAmt;
      var taxAmt = netAmt * taxPercent;
      var whtAmt = netAmt * whtPercent;
      var unitPriceTxn = this.roundToTwo((netAmt + taxAmt - whtAmt) / quantity);
      var txnAmt = netAmt + taxAmt - whtAmt;
      var unitPriceTxnUom = this.roundToTwo(txnAmt / quantity * uomBaseRatio);

      this.form.controls['qtyUom'].setValue(qtyByUom);
      // this.form.controls['unitPriceStdUom'].setValue(this.roundToTwo(unitPriceStdUom));
      this.form.controls['unitPriceTxnUom'].setValue(this.roundToTwo(unitPriceTxnUom));
      this.form.controls['discountAmt'].setValue(this.roundToTwo(discountAmt));
      this.form.controls['unitPriceNet'].setValue(this.roundToTwo(unitPriceNet));
      this.form.controls['unitPriceNetUom'].setValue(this.roundToTwo(unitPriceNetUom));
      this.form.controls['stdAmt'].setValue(this.roundToTwo(stdAmt));
      this.form.controls['netAmt'].setValue(this.roundToTwo(netAmt));
      this.form.controls['taxAmt'].setValue(this.roundToTwo(taxAmt));
      this.form.controls['whtAmt'].setValue(this.roundToTwo(whtAmt));
      this.form.controls['txnAmt'].setValue(this.roundToTwo(txnAmt));
      this.form.controls['unitPriceTxn'].setValue(this.roundToTwo(unitPriceTxn));
      this.form.controls['unitPriceStdWithTax'].setValue(this.roundToTwo(unitPriceStdWithTax));
      this.form.controls['unitPriceStdWithoutTax'].setValue(this.roundToTwo(unitPriceStdWithoutTax));
    }

    this.onCalculate();
  }


  roundToTwo(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100
  }

  isForex(){
    return (this.hdr.base_doc_ccy && this.hdr.base_doc_ccy !== this.hdr.doc_ccy);
  }

  onSelectedEinvoiceUomModel(e: any) {
    console.log("einvoice_uom model",e);
    this.form.controls['einvoice_uom'].patchValue(e.uom);
  }

  updateEInvoiceTaxTypeDescription(event){
    let selectedCode = this.filteredOptions.filter(data => {
      return data.Code == event.value;
    })
    this.form.patchValue({
      einvoiceTaxTypeDesc: selectedCode[0].Description
    })

  }

  getForexAmt(formName) {
    let amt = 0;
    if (this.hdr.base_doc_xrate && this.hdr.base_doc_xrate !== 0) {
      amt = this.form.controls[formName].value / this.hdr.base_doc_xrate;
    }
    if (isNaN(amt)) amt = 0;
    return this.hdr.base_doc_ccy + ' ' + UtilitiesModule.currencyFormatter(amt);
  }

  getValidatorsForItemType() {
    return this.itemTxnType === 'GL_CODE'
      ? []
      : [Validators.min(0)];
  }
  getValidatorsRequiredForItemType() {
    return this.itemTxnType === 'GL_CODE'
      ? []
      : [Validators.required, Validators.min(0)];
  }

  isQtyBaseReadOnly(): boolean {
    if(this.appletSettings?.MANDATORY_BIN_NUMBER){
    return this.subItemType === 'BIN_NUMBER';
  } else {
    return  false;
  }}

  onSelectedUomModel(e: any) {
    console.log("Uom model",e);
    this.form.controls['uomBaseRatio'].patchValue(e.uomBaseRatio);
    this.form.controls['uom'].patchValue(e.uom);
  }

  safeParseFloat(val: any): number {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  }

  safeParseInt(val: any): number {
    const num = parseInt(val, 10);
    return isNaN(num) ? 0 : num;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
