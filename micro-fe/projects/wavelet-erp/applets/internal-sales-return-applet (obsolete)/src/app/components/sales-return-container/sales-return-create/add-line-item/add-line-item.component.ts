import { ChangeDetectionStrategy, Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { ViewColumnFacade } from '../../../../facades/view-column.facade';
import { ComponentStore } from '@ngrx/component-store';
import { AppConfig } from 'projects/shared-utilities/visa';
import { SubSink } from 'subsink2';
import { MatTabGroup } from '@angular/material/tabs';
import { LineItemDetailsComponent } from './item-details/item-details.component';
import { LineItemSerialNumberComponent } from './serial-number/serial-number.component';
import { LineItemBatchNumberComponent } from './batch-number/batch-number.component';
import { LineItemBinNumberComponent } from './bin-number/bin-number.component';
import { bl_fi_generic_doc_line_RowClass, bl_fi_generic_doc_link_RowClass, FinancialItemService } from 'blg-akaun-ts-lib';
import { UUID } from 'angular2-uuid';
import { Store } from '@ngrx/store';
import { SalesReturnStates } from '../../../../state-controllers/sales-return-controller/store/states';
import { SalesReturnSelectors } from '../../../../state-controllers/sales-return-controller/store/selectors';
import { SubItemType } from '../../../../models/constants/sub-item-type-constants';
import { map, switchMap, tap } from 'rxjs/operators';

interface LocalState {
  deactivateReturn: boolean;
  deactivateIssueLinkList: boolean;
  selectedIndex: number;
  itemSelectedIndex: number;
  serialSelectedIndex: number;
}

@Component({
  selector: 'app-add-line-item',
  templateUrl: './add-line-item.component.html',
  styleUrls: ['./add-line-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class AddLineItemComponent extends ViewColumnComponent implements OnInit, OnDestroy {

  protected subs = new SubSink();
  
  protected compName = 'Add Line Item';
  protected readonly index = 8;
  protected localState: LocalState;
  protected prevLocalState: any;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateReturn$ = this.componentStore.select(state => state.deactivateReturn);
  readonly selectedIndex$ = this.componentStore.select(state => state.selectedIndex);
  readonly itemSelectedIndex$ = this.componentStore.select(state => state.itemSelectedIndex);
  readonly serialSelectedIndex$ = this.componentStore.select(state => state.serialSelectedIndex);

  mode$ = this.store.select(SalesReturnSelectors.selectMode);
  lineItem$ = this.store.select(SalesReturnSelectors.selectLineItem).pipe(
    switchMap(item => this.fiService.getByGuid(item.item_guid.toString(), this.apiVisa)),
    map(resolve => resolve.data ? resolve.data.bl_fi_mst_item_hdr.sub_item_type : this.SUB_ITEM_TYPE.basicQuantity),
    tap(type => this.subItemType = type.toString())
  );

  prevIndex: number;
  apiVisa = AppConfig.apiVisa;
  deleteConfirmation: boolean = false;
  mode: string;
  subItemType: string;
  SUB_ITEM_TYPE = SubItemType;

  @ViewChild(MatTabGroup) matTab: MatTabGroup;
  @ViewChild(LineItemDetailsComponent) itemDetails: LineItemDetailsComponent;
  @ViewChild(LineItemSerialNumberComponent) serialNumber: LineItemSerialNumberComponent;
  @ViewChild(LineItemBatchNumberComponent) batchNumber: LineItemBatchNumberComponent;
  @ViewChild(LineItemBinNumberComponent) binNumber: LineItemBinNumberComponent;

  constructor(
    private viewColFacade: ViewColumnFacade,
    private fiService: FinancialItemService,
    private readonly componentStore: ComponentStore<LocalState>,
    protected readonly store: Store<SalesReturnStates>) {
    super();
  }

  ngOnInit() {
    this.subs.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.subs.sink = this.mode$.subscribe({ next: (resolve: string) => this.mode = resolve });
  }

  onAdd() {
    const line = new bl_fi_generic_doc_line_RowClass();
    line.guid = UUID.UUID().toLowerCase();

    line.item_guid = this.itemDetails.main.form.value.itemGuid;
    line.item_code = this.itemDetails.main.form.value.itemCode;
    line.item_name = this.itemDetails.main.form.value.itemName;
    line.quantity_base = this.itemDetails.main.form.value.qty;
    line.amount_std = this.itemDetails.main.form.value.stdAmt;
    line.amount_discount = this.itemDetails.main.form.value.discountAmt;
    line.amount_net = this.itemDetails.main.form.value.netAmt1;
    line.tax_gst_code = this.itemDetails.main.form.value.taxCode;
    line.tax_gst_rate = this.itemDetails.main.form.value.taxPercent;
    line.amount_tax_gst = this.itemDetails.main.form.value.taxAmt;
    line.tax_wht_code = this.itemDetails.main.form.value.whtCode;
    line.tax_wht_rate = this.itemDetails.main.form.value.whtPercent;
    line.amount_tax_wht = this.itemDetails.main.form.value.whtAmt;
    line.amount_txn = this.itemDetails.main.form.value.txnAmt;
    line.item_remarks = this.itemDetails.main.form.value.remarks;
    line.item_txn_type = this.itemDetails.main.form.value.itemTxnType;
    line.guid_dimension = this.itemDetails.dept.form.value.dimension;
    line.guid_profit_center = this.itemDetails.dept.form.value.profitCenter;
    line.guid_project = this.itemDetails.dept.form.value.project;
    line.guid_segment = this.itemDetails.dept.form.value.segment;
    line.item_property_json = {...this.itemDetails.main.form.value};
    line.line_property_json = <any>{ delivery_instructions: { ...this.itemDetails.delivery.form.value } };
    line.txn_type = 'PNS';
    line.quantity_signum = 0;
    line.amount_signum = 0;
    line.server_doc_type = 'INTERNAL_SALES_RETURN_REQUEST';
    line.client_doc_type = 'INTERNAL_SALES_RETURN_REQUEST';
    line.date_txn = new Date();
    line.status = 'ACTIVE';
    line.serial_no = this.subItemType === this.SUB_ITEM_TYPE.serialNumber ? <any>{ serialNumbers: this.serialNumber.serialNumbers } : null;
    line.batch_no = this.subItemType === this.SUB_ITEM_TYPE.batchNumber ? <any>{ batches: this.batchNumber.batchNumbers } : null;
    line.bin_no = this.subItemType === this.SUB_ITEM_TYPE.binNumber ? <any>{ bins: this.binNumber.binNumbers } : null;
    console.log('line', line);

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
      link.quantity_signum = 1;
      link.quantity_contra = line.quantity_base;
      link.date_txn = new Date();
      console.log('link', link);
      this.viewColFacade.addLink(link);
    }

    this.viewColFacade.addLineItem(line, this.mode);   
  }

  getLinkTxnType(itemType: string): string {
    switch (itemType) {
      case 'salesOrder':
        return 'ISO_ISI';
      case 'salesQuotation':
        return 'ISQO_ISI';
      case 'jobsheet':
        return 'IJS_ISI'
      case 'deliveryOrder':
        return 'IODO_ISI'
    }
  }

  disableAdd() {
    return this.itemDetails?.main.form.invalid;
  }

  goToBinListing() {
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState,
      deactivateReturn: true,
      // deactivateAdd: true
    });
    this.viewColFacade.onNextAndReset(this.index, 19);
  }

  goToBatchListing() {
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState,
      deactivateReturn: true,
      // deactivateAdd: true
    });
    this.viewColFacade.onNextAndReset(this.index, 20);
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

  onReturn() {
    this.viewColFacade.updateInstance<LocalState>(this.prevIndex, {
      ...this.prevLocalState,
      deactivateReturn: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }
  
  ngOnDestroy() {
    if (this.matTab) {
      this.viewColFacade.updateInstance<LocalState>(this.index, {
        ...this.localState,
        selectedIndex: this.matTab.selectedIndex,
        itemSelectedIndex: this.itemDetails.matTab.selectedIndex,
        serialSelectedIndex: this.subItemType === this.SUB_ITEM_TYPE.serialNumber ? this.serialNumber.matTab?.selectedIndex : null,
      });
    }
    this.subs.unsubscribe();  
  }

}