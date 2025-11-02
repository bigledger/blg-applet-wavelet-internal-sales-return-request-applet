import { AfterViewChecked, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { bl_fi_generic_doc_hdr_RowClass, bl_fi_generic_doc_line_RowClass, bl_fi_generic_doc_link_RowClass, FinancialItemService, Pagination, StockAvailabilityService } from 'blg-akaun-ts-lib';
import { ClientSidePermissionsSelectors } from 'projects/shared-utilities/modules/permission/client-side-permissions-controller/selectors';
import { ClientSideViewModel } from 'projects/shared-utilities/modules/permission/client-side-permissions-controller/states/client-side-permission.states';
import { PermissionStates } from 'projects/shared-utilities/modules/permission/permission-controller';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { ClientSidePermissionChecker } from 'projects/shared-utilities/utilities/client-side-permission-checker';
import { Observable, combineLatest } from 'rxjs';
import { map, mergeMap, toArray, switchMap } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { lineItemSearchModel } from '../../../../models/advanced-search-models/line-item.model';
import { SearchModel } from '../../../../models/advanced-search-models/search-model-new';
import { PNSSelectors, LinkSelectors } from '../../../../state-controllers/draft-controller/store/selectors';
import { DraftStates } from '../../../../state-controllers/draft-controller/store/states';
import { InternalSalesReturnActions } from '../../../../state-controllers/internal-sales-return-controller/store/actions';
import { InternalSalesReturnStates } from '../../../../state-controllers/internal-sales-return-controller/store/states';
import { InternalSalesReturnSelectors } from '../../../../state-controllers/internal-sales-return-controller/store/selectors';
import { SlideRendererComponent } from '../../../utilities/slide-renderer/slide-renderer.component';
import { ViewColumnFacade } from '../../../../facades/view-column.facade';
import { ButtonDeleteRendererComponent } from '../../../button-del-renderer/button-del-renderer.component';
import { UtilitiesModule } from 'projects/shared-utilities/utilities/utilities.module';
import { AppletSettings } from '../../../../models/applet-settings.model';
import { formatMoneyInList } from 'projects/shared-utilities/format.utils';
import { FormGroup, FormControl } from '@angular/forms';
import { AppConfig } from 'projects/shared-utilities/visa';
import { ColumnViewModelStates } from "projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/sales-return-view-model-controller/store/states";
import { Column4ViewModelActions } from "projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/sales-return-view-model-controller/store/actions";
import { isNullOrEmpty } from 'projects/shared-utilities/utilities/misc/misc.utils';
import { HDRSelectors } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/draft-controller/store/selectors';

@Component({
  selector: 'app-internal-sales-return-line-item-listing',
  templateUrl: './line-item-listing.component.html',
  styleUrls: ['./line-item-listing.component.scss']
})
export class LineItemListingComponent implements OnInit, OnDestroy {

  @Input() localState: any;
  @Input() draft$: Observable<bl_fi_generic_doc_hdr_RowClass>;
  @Output() itemCreate = new EventEmitter();
  @Output() itemEdit = new EventEmitter();

  protected subs = new SubSink();

  pns$ = this.draftStore.select(PNSSelectors.selectAll);
  readonly clientSidePermissions$ = this.permissionStore.select(ClientSidePermissionsSelectors.selectAll);
  readonly appletLoginSubjectLink$ = this.sessionStore.select(SessionSelectors.selectAppletLoginSubjectLink);
  readonly salesReturn$ = this.store.select(InternalSalesReturnSelectors.selectSalesReturn);
  masterSettings$ = this.sessionStore.select(SessionSelectors.selectMasterSettings);
  genDocLock$ = this.store.select(InternalSalesReturnSelectors.selectGenDocLock);

  searchModel = lineItemSearchModel;
  gridApi;
  rowData: bl_fi_generic_doc_line_RowClass[];
  total = '0.00';
  tax = '0.00';
  hidePriceFlag: boolean;
  postingStatus;
  status;
  totalExpense;
  amountSignum = -1;
  prevIndex: number;
  hdr: any;
  genDocLock:boolean;
  form: FormGroup;
  guidStore;
  discount = '0.00';
  showGroupDiscount = true;
  groupDiscount$ = this.store.select(InternalSalesReturnSelectors.selectGroupDiscountItem);
  appletSettings: AppletSettings;

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilterComponentParams: { suppressFilterButton: true },
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true,
    onCellClicked: (params) => this.onRowClicked(params.data),
    enableCellTextSelection: true,
    suppressCopyRowsToClipboard: true,
    suppressClipboardPaste: true,
  };

  frameworkComponents = {
    slideCellRenderer: SlideRendererComponent,
    buttonRenderer: ButtonDeleteRendererComponent
  };
  gridOptions = {
    getRowStyle: this.getRowStylePNS
  };
  hideSalesAgent: boolean;
  constructor(
    protected fiService: FinancialItemService,
    private stockAvailabilityService: StockAvailabilityService,
    protected readonly draftStore: Store<DraftStates>,
    private readonly permissionStore: Store<PermissionStates>,
    private readonly sessionStore: Store<SessionStates>,
    protected readonly store: Store<InternalSalesReturnStates>,
    public readonly viewModelStore: Store<ColumnViewModelStates>,
    private readonly viewColFacade: ViewColumnFacade) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      scanned_code: new FormControl('', []),
      discPercentage: new FormControl(),
      discAmount: new FormControl(),
    });

    this.checkGroupDiscount();

    this.subs.sink = this.genDocLock$.subscribe(lock => {
      this.genDocLock = lock;
    });
    this.subs.sink = this.masterSettings$.subscribe({
      next: (resolve: AppletSettings) => {
        this.appletSettings = resolve;
        this.hideSalesAgent = resolve.HIDE_SALES_AGENT;
      }
    });

    this.subs.sink = this.draftStore.select(HDRSelectors.selectLocation).subscribe({
      next: (guidStore) => {
        this.guidStore = guidStore;
      },
    });

    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);

    let userPermissions: ClientSideViewModel[];
    this.subs.sink = this.clientSidePermissions$.subscribe(permissions => userPermissions = permissions);

    let userRank: string;
    this.subs.sink = this.appletLoginSubjectLink$.subscribe(appletLoginSubjectLink => userRank = appletLoginSubjectLink?.rank?.toString());

    const permissionChecker = new ClientSidePermissionChecker(userPermissions, userRank);
    this.hidePriceFlag = !permissionChecker.checkPermission("SALES_RETURN_DISPLAY_PRICING");

    // Enhanced: combine pns$ and draft$ to ensure rowData is ready before using in draft$
    this.subs.sink = combineLatest([this.pns$, this.draft$]).subscribe(([pns, draft]) => {
      this.rowData = pns.filter(x => x.status === 'ACTIVE' || x.status === 'DRAFT');
      console.log('total rowData ==> ', this.rowData);
      this.hdr = draft;
      this.postingStatus = draft.posting_status;
      this.status = draft.status;
      this.total = this.rowData.length > 0
        ? this.rowData
            .reduce<number>((acc, r) => {
              const amt = parseFloat(r.amount_txn?.toString() ?? '0');
              const sign = parseInt(r.amount_signum?.toString() ?? '1', 10);
              return acc + amt * sign;
            }, 0)
            .toFixed(2)
        : '0.00';
      this.total = (Number(this.total) * Number(this.hdr.amount_signum)).toFixed(2);


      console.log('total init ==> ', this.total);

      this.totalExpense = Number(this.total) * this.amountSignum;
      this.store.dispatch(InternalSalesReturnActions.selectTotalExpense({ totalExpense: this.totalExpense }));

      if (this.total === 'NaN') {
        this.total = '0.00';
        this.totalExpense = '0.00';
        this.store.dispatch(InternalSalesReturnActions.selectTotalExpense({ totalExpense: this.totalExpense }));
      }
      this.tax = this.rowData.length > 0
        ? this.rowData
            .reduce<number>((acc, r) => {
              const amt = parseFloat(r.amount_tax_gst?.toString() ?? '0');
              const sign = parseInt(r.amount_signum?.toString() ?? '1', 10);
              return acc + amt * sign;
            }, 0)
            .toFixed(2)
        : '0.00';
      this.tax = (Number(this.tax) * Number(this.hdr.amount_signum)).toFixed(2);
      if (this.tax === 'NaN') {
        this.tax = '0.00';
      }
    });
  }

  getRowStylePNS(params) {
    let hasInvalidSerial = false;
    if (params.data.item_sub_type === 'SERIAL_NUMBER'
    ) {
      hasInvalidSerial = UtilitiesModule.checkSerialValid(<any>params.data.serial_no);
    }
    if (hasInvalidSerial) {
      return {
        'color': 'red',
      }
    }
  };

  posting() {
    if(this.genDocLock){
      return false;
    }

    if (this.status === "TEMP") {
      return true;
    }
    return !((this.postingStatus === "FINAL" || this.postingStatus === "VOID" || this.postingStatus === "DISCARDED") || (this.status !== 'ACTIVE' && this.status !== null));
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.gridApi.forEachNode(a => {
      if (a.data.guid === this.localState.selectedLine) {
        a.setSelected(true);
      }
    });
    this.gridApi.setColumnDefs(
      [
        { headerName: 'Item Code', field: 'item_code', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true },
        { headerName: 'Item Name', field: 'item_name', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true },
        { headerName: 'Sales Agent', field: 'sales_entity_hdr_name', hide: this.hideSalesAgent, minWidth: 100, cellStyle: () => ({ 'text-align': 'left' }) },
        { headerName: 'UOM', field: 'uom', cellStyle: () => ({ 'text-align': 'left ' }), floatingFilter: true },
        { headerName: 'Qty', field: 'quantity_base', type: 'numericColumn', floatingFilter: true },
        {
          headerName: 'Unit Price (Inclusive of Tax)', field: 'unit_price_txn', type: 'numericColumn',
          valueFormatter: (params) => params.value ? formatMoneyInList(params.value) : null, floatingFilter: true, hide: this.hidePriceFlag, suppressColumnsToolPanel: this.hidePriceFlag, suppressFiltersToolPanel: this.hidePriceFlag
        },
        {
          headerName: 'SST/VAT/GST', field: 'amount_tax_gst', type: 'numericColumn',
          valueFormatter: (params) => params.value ? formatMoneyInList(params.value) : null, floatingFilter: true, hide: this.hidePriceFlag, suppressColumnsToolPanel: this.hidePriceFlag, suppressFiltersToolPanel: this.hidePriceFlag
        },
        {
          headerName: 'Txn Amount', field: 'amount_txn', type: 'numericColumn',
          valueFormatter: (params) => params.value ? formatMoneyInList(params.value) : null, floatingFilter: true, hide: this.hidePriceFlag, suppressColumnsToolPanel: this.hidePriceFlag, suppressFiltersToolPanel: this.hidePriceFlag
        },
        {
          headerName: 'Action', field: 'action', minWidth: 180,
          valueGetter: params => params.data.guid,
          hide: !this.deleteCondition(),
          cellRenderer: !this.deleteCondition() ? null : 'buttonRenderer',
          cellRendererParams: { onClick: this.onButtonClick.bind(this) }
        }
      ]
    )
  }

  deleteCondition() {
    if (this.postingStatus === "FINAL") {
      return false;
    }
    else {
      return true;
    }
  }

  onButtonClick(e) {
    this.deleteLine(e.rowData);
  }

  deleteLine(lineItem) {
    let index;
    this.subs.sink = this.salesReturn$.subscribe({
      next: resolve => {
        if (resolve)
          index = resolve.bl_fi_generic_doc_line.findIndex(x => x.guid === lineItem.guid)
      }
    });
    if (this.deleteCondition()) {
      if (index >= 0) {
        const line = { ...lineItem, status: 'DELETED' };
        const diffLine = new bl_fi_generic_doc_line_RowClass();
        diffLine.amount_discount = <any>(0 - parseFloat(<any>line.amount_discount));
        diffLine.amount_net = <any>(0 - parseFloat(<any>line.amount_net));
        diffLine.amount_std = <any>(0 - parseFloat(<any>line.amount_std));
        diffLine.amount_tax_gst = <any>(0 - parseFloat(<any>line.amount_tax_gst));
        diffLine.amount_tax_wht = <any>(0 - parseFloat(<any>line.amount_tax_wht));
        diffLine.amount_txn = <any>(0 - parseFloat(<any>line.amount_txn));

        const link = this.getLink(line.guid.toString());
        if (link) {
          link.status = 'DELETED'
          this.viewColFacade.editLink(link);
        }

        this.viewColFacade.deleteExistingLine(line, diffLine);
      } else {
        const diffLine = new bl_fi_generic_doc_line_RowClass();
        diffLine.amount_discount = <any>(0 - parseFloat(<any>lineItem.amount_discount));
        diffLine.amount_net = <any>(0 - parseFloat(<any>lineItem.amount_net));
        diffLine.amount_std = <any>(0 - parseFloat(<any>lineItem.amount_std));
        diffLine.amount_tax_gst = <any>(0 - parseFloat(<any>lineItem.amount_tax_gst));
        diffLine.amount_tax_wht = <any>(0 - parseFloat(<any>lineItem.amount_tax_wht));
        diffLine.amount_txn = <any>(0 - parseFloat(<any>lineItem.amount_txn));

        const link = this.getLink(lineItem.guid.toString());
        if (link)
          this.viewColFacade.deleteLink(link.guid.toString());

        this.viewColFacade.deleteLine(lineItem.guid.toString(), diffLine, this.prevIndex);
      }
    }
  }

  getLink(lineGuid: string): bl_fi_generic_doc_link_RowClass {
    let link;
    this.subs.sink = this.draftStore.select(LinkSelectors.selectAll).subscribe(resolved => {
      link = resolved.find(x => x.guid_doc_2_line === lineGuid);
    })
    return link;
  }

  onNext() {
    this.itemCreate.emit();
  }

  onRowClicked(item: bl_fi_generic_doc_line_RowClass) {
    this.store.dispatch(InternalSalesReturnActions.selectPricingSchemeLink({ item }));
      this.store.dispatch(InternalSalesReturnActions.selectChildAttributeLink({ link: [] }));
    this.viewModelStore.dispatch(Column4ViewModelActions.setItemDetailsTab_itemType_Value({itemType:item.item_sub_type?.toString()}));
    this.viewModelStore.dispatch(Column4ViewModelActions.setFIItemHdrGuid({ fiItemHdrGuid: item.item_guid }));
    this.subs.sink = this.fiService.getByGuid(item.item_guid?.toString(), AppConfig.apiVisa).subscribe(response=>{
      if(response?.data){
        if(item.item_txn_type==='GROUPED_ITEM'){
          this.store.dispatch(InternalSalesReturnActions.selectChildItem({ child: response.data.bl_fi_mst_item_lines }));
          this.store.dispatch(InternalSalesReturnActions.selectChildItemPricingLink({ child: response.data.bl_fi_mst_item_lines }));
        }
        this.viewModelStore.dispatch(Column4ViewModelActions.setFIItem({fiItem:response.data}))
      }
    })
    this.itemEdit.emit(item);
  }

  isForex(){
    return (this.hdr.base_doc_ccy && this.hdr.base_doc_ccy !== this.hdr.doc_ccy);
  }

  getForex(amt) {
    if (this.isForex()) {
      if (this.hdr.base_doc_xrate && this.hdr.base_doc_xrate !== 0) {
        amt = parseFloat(amt) / this.hdr.base_doc_xrate;
      }
      else {
        amt = 0;
      }
      if (isNaN(amt)) amt = 0;
      return '(' + this.hdr.base_doc_ccy + ' ' + UtilitiesModule.currencyFormatter(amt) + ')';
    }
    return '';
  }
  getTotal() {
    return UtilitiesModule.currencyFormatter(this.total);
  }

  getTax() {
    return UtilitiesModule.currencyFormatter(this.tax);
  }

  onSearch(e: any) {
    console.log('search', this.form.value.scanned_code);
    const apiVisa = AppConfig.apiVisa;
    const scanItem = new Pagination(0, 10, [
      { columnName: 'code', operator: '=', value: this.form.value.scanned_code },
    ], null)
    this.subs.sink = this.fiService.getByCriteria(scanItem, apiVisa).pipe(
      switchMap(a => {
        const b = <any>a;
        const source: any[] = [];
        const invItemHdrGuids = b.data?.filter(c => !isNullOrEmpty(c.bl_fi_mst_item_hdr.inv_item_hdr_guid)).map(c => c.bl_fi_mst_item_hdr.inv_item_hdr_guid);

        const stockAvailabilityInputModel = {
          inventory_item_guids: invItemHdrGuids,
          location_guids: [this.guidStore]
        } as any;

        return this.stockAvailabilityService.getStockAvailability(stockAvailabilityInputModel, apiVisa).pipe(
          map(stockResp => {
            const stockAvailabilityMap = new Map(
              stockResp.data.map(stock => [stock.inventory_item_guid, stock])
            );

            const updatedItems = b.data.map(c => {
              let hdr = c.bl_fi_mst_item_hdr;
              let value = null;
              if (hdr.price_json && hdr.price_json.item_base_uom_pricing) {
                value = hdr.price_json.item_base_uom_pricing[0].price_amount;
              }
              return {
                "item_guid": hdr.guid,
                "item_code": hdr.code,
                "item_name": hdr.name,
                "uom": hdr.uom,
                "unit_price": value,
                "item_type": null,
                "item_txn_type": hdr.txn_type,
                "item_sub_type": hdr.sub_item_type,
                "uomGuid": hdr.guid,
                "einvoice_taxable_type_code": hdr.einvoice_taxable_type_code,
                "einvoice_taxable_type_desc": hdr.einvoice_taxable_type_desc,
                "einvoice_uom": hdr.einvoice_uom,
                "stock_bal": !isNullOrEmpty(hdr.inv_item_hdr_guid) ? stockAvailabilityMap.get(hdr.inv_item_hdr_guid) : ""
              };
            });
            b.data = updatedItems;
            return b;
          })
        )
      })
    ).subscribe(item => {
      if(item.data.length > 0) {
        item = item.data[0];
        this.store.dispatch(InternalSalesReturnActions.selectPricingSchemeLink({ item }));
        this.store.dispatch(InternalSalesReturnActions.selectLineItem({ lineItem: item as bl_fi_generic_doc_line_RowClass }));
        this.viewColFacade.updateInstance(7, {
          ...this.localState,
          deactivateList: false,
          deactivateReturn: true,
          selectedItem: item.item_guid
        });
        this.viewColFacade.onNextAndReset(7, 8);
        this.store.dispatch(InternalSalesReturnActions.selectPricingSchemeLink({ item }));
        this.viewModelStore.dispatch(
          Column4ViewModelActions.setPricingSchemeAccessKey({
            pricingSchemeAccessKey: null,
          })
        );
        this.viewModelStore.dispatch(
          Column4ViewModelActions.setFIItemHdrGuid({
            fiItemHdrGuid: item.item_guid,
          })
        );
        this.viewModelStore.dispatch(
          Column4ViewModelActions.setFIItem({ fiItem: item.c })
        );
      } else {
        this.onNext();
      }
    })
  }

  checkGroupDiscount() {
    this.subs.sink = combineLatest([this.groupDiscount$, this.draft$])
      .pipe(
        map(([groupDiscountValue, draftValue]) => {
          this.showGroupDiscount = (groupDiscountValue?true:false) && (!draftValue.posting_status  || draftValue.posting_status === "DRAFT");
        })
      )
      .subscribe();
  }

  ngAfterViewChecked(){
    this.discount = this.rowData.length > 0
      ? this.rowData
          .reduce<number>((acc, r) => {
            const amt = parseFloat(r.amount_discount?.toString() ?? '0');
            const sign = parseInt(r.amount_signum?.toString() ?? '1', 10);
            return acc + amt * sign;
          }, 0)
          .toFixed(2)
      : '0.00';
    this.discount = (Number(this.discount) * Number(this.hdr.amount_signum)).toFixed(2);
    if (this.discount === 'NaN') {
      this.discount = '0.00';
    }
  }

  onGroupDiscAmt() {
    const enteredValue = this.form.controls['discAmount'].value;
    console.log('onGroupDiscAmt',enteredValue)
    //if(Number(enteredValue)>0){
      this.form.controls.discPercentage.setValue(null);
      this.store.dispatch(InternalSalesReturnActions.addGroupDiscount({ discAmount: enteredValue, discPercentage: null }));
    //}
  }

  onGroupDiscPercent(){
    const enteredValue = this.form.controls['discPercentage'].value;
    console.log('onGroupDiscPercent',enteredValue)
    //if(Number(enteredValue)>0){
      this.form.controls.discAmt.setValue(null);
      this.store.dispatch(InternalSalesReturnActions.addGroupDiscount({ discAmount: null , discPercentage: enteredValue}));
   // }
  }


  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
