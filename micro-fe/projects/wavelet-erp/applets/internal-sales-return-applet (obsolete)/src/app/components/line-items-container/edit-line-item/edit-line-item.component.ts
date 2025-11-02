import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { ViewColumnFacade } from '../../../facades/view-column.facade';
import { ComponentStore } from '@ngrx/component-store';
import { AppConfig } from 'projects/shared-utilities/visa';
import { SubSink } from 'subsink2';
import { MatTabGroup } from '@angular/material/tabs';
import { bl_fi_generic_doc_ext_RowClass, bl_fi_generic_doc_line_RowClass, Pagination, GenericDocContainerModel, FinancialItemService } from 'blg-akaun-ts-lib';
import { Store } from '@ngrx/store';
import { LineItemSelectors } from '../../../state-controllers/line-item-controller/store/selectors';
import { LineItemStates } from '../../../state-controllers/line-item-controller/store/states';
import { delay, mergeMap, tap, switchMap, map } from 'rxjs/operators';
import { EMPTY, iif, of } from 'rxjs';
import { EditLineItemDetailsComponent } from './item-details/item-details.component';
import { EditLineItemSerialNumberComponent } from './serial-number/serial-number.component';
import { EditLineItemBatchNumberComponent } from './batch-number/batch-number.component';
import { EditLineItemBinNumberComponent } from './bin-number/bin-number.component';
import { SubItemType } from '../../../models/constants/sub-item-type-constants';

interface LocalState {
  deactivateReturn: boolean;
  deactivateIssueLinkList: boolean;
  selectedIndex: number;
  itemSelectedIndex: number;
  serialSelectedIndex: number;
  deleteConfirmation: boolean;
}

@Component({
  selector: 'app-edit-line-items',
  templateUrl: './edit-line-item.component.html',
  styleUrls: ['./edit-line-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class EditLineItemsComponent extends ViewColumnComponent {

  protected subs = new SubSink();
  
  protected compName = 'Edit Line Items';
  protected readonly index = 1;
  protected localState: LocalState;
  protected prevLocalState: any;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateReturn$ = this.componentStore.select(state => state.deactivateReturn);
  readonly selectedIndex$ = this.componentStore.select(state => state.selectedIndex);
  readonly itemSelectedIndex$ = this.componentStore.select(state => state.itemSelectedIndex);
  readonly serialSelectedIndex$ = this.componentStore.select(state => state.serialSelectedIndex);
  readonly deleteConfirmation$ = this.componentStore.select(state => state.deleteConfirmation);

  order$ = this.store.select(LineItemSelectors.selectOrder);
  lineItem$ = this.store.select(LineItemSelectors.selectLineItem).pipe(
    switchMap(item => this.fiService.getByGuid(item.item_guid.toString(), this.apiVisa)),
    map(resolve => resolve.data ? resolve.data.bl_fi_mst_item_hdr.sub_item_type : this.SUB_ITEM_TYPE.basicQuantity),
    tap(type => this.subItemType = type.toString())
  );

  order: GenericDocContainerModel;
  genDoc: GenericDocContainerModel;
  lineItem: bl_fi_generic_doc_line_RowClass;
  prevIndex: number;
  apiVisa = AppConfig.apiVisa;
  deleteConfirmation: boolean;
  subItemType: string;
  SUB_ITEM_TYPE = SubItemType;

  @ViewChild(MatTabGroup) matTab: MatTabGroup;
  @ViewChild(EditLineItemDetailsComponent) itemDetails: EditLineItemDetailsComponent; 
  @ViewChild(EditLineItemSerialNumberComponent) serialNumber: EditLineItemSerialNumberComponent;
  @ViewChild(EditLineItemBatchNumberComponent) batchNumber: EditLineItemBatchNumberComponent;
  @ViewChild(EditLineItemBinNumberComponent) binNumber: EditLineItemBinNumberComponent;

  constructor(
    private viewColFacade: ViewColumnFacade,
    private fiService: FinancialItemService,
    private readonly componentStore: ComponentStore<LocalState>,
    protected readonly store: Store<LineItemStates>) {
    super();
  }

  ngOnInit() {
    this.subs.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.subs.sink = this.store.select(LineItemSelectors.selectLineItem).subscribe(resolved => {
      this.lineItem = resolved;
    })
    this.subs.sink = this.order$.subscribe(resolved => {
      this.order = resolved;
    })
    this.subs.sink = this.deleteConfirmation$.pipe(
      mergeMap(a => {
        return iif(() => a, of(a).pipe(delay(3000)), of(EMPTY));
      })
    ).subscribe(resolve => {
      if (resolve === true) {
        this.componentStore.patchState({deleteConfirmation: false});
        this.deleteConfirmation = false;
      }
    });
  }

  onSave() {
    this.genDoc = JSON.parse(JSON.stringify(this.order)); // hard copy 
    const line = { ...this.lineItem };
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
    line.item_property_json = { ...this.itemDetails.main.form.value };
    line.line_property_json = <any>{ delivery_instructions: {...this.itemDetails.delivery.form.value} };
    // line.date_txn = this.lineItem.date_txn; // should be new date or keep old one?
    line.serial_no = this.subItemType === this.SUB_ITEM_TYPE.serialNumber ? <any>{ serialNumbers: this.serialNumber.serialNumbers } : null;
    line.batch_no = this.subItemType === this.SUB_ITEM_TYPE.batchNumber ? <any>{ batches: this.batchNumber.batchNumbers } : null;
    line.bin_no = this.subItemType === this.SUB_ITEM_TYPE.binNumber ? <any>{ bins: this.binNumber.binNumbers } : null;
    
    console.log('line', line);

    const lineIndex = this.genDoc.bl_fi_generic_doc_line.findIndex(x => x.guid === line.guid);
    if (lineIndex >= 0)
      this.genDoc.bl_fi_generic_doc_line[lineIndex] = line;

    // Update existing hdr balance by calculating delta (line2 - line1)
    const amtDiscountDiff = parseFloat(<any>line.amount_discount) - parseFloat(<any>this.lineItem.amount_discount);
    const amtNetDiff = parseFloat(<any>line.amount_net) - parseFloat(<any>this.lineItem.amount_net);
    const amtStdDiff = parseFloat(<any>line.amount_std) - parseFloat(<any>this.lineItem.amount_std);
    const amtTaxGstDiff = parseFloat(<any>line.amount_tax_gst) - parseFloat(<any>this.lineItem.amount_tax_gst);
    const amtTaxWhtDiff = parseFloat(<any>line.amount_tax_wht) - parseFloat(<any>this.lineItem.amount_tax_wht);
    const amtTxnDiff = parseFloat(<any>line.amount_txn) - parseFloat(<any>this.lineItem.amount_txn)

    this.genDoc.bl_fi_generic_doc_hdr.amount_discount = <any>(parseFloat(<any>this.genDoc.bl_fi_generic_doc_hdr.amount_discount) + amtDiscountDiff).toFixed(2);
    this.genDoc.bl_fi_generic_doc_hdr.amount_net = <any>(parseFloat(<any>this.genDoc.bl_fi_generic_doc_hdr.amount_net) + amtNetDiff).toFixed(2);
    this.genDoc.bl_fi_generic_doc_hdr.amount_std = <any>(parseFloat(<any>this.genDoc.bl_fi_generic_doc_hdr.amount_std) + amtStdDiff).toFixed(2);
    this.genDoc.bl_fi_generic_doc_hdr.amount_tax_gst = <any>(parseFloat(<any>this.genDoc.bl_fi_generic_doc_hdr.amount_tax_gst) + amtTaxGstDiff).toFixed(2);
    this.genDoc.bl_fi_generic_doc_hdr.amount_tax_wht = <any>(parseFloat(<any>this.genDoc.bl_fi_generic_doc_hdr.amount_tax_wht) + amtTaxWhtDiff).toFixed(2);
    this.genDoc.bl_fi_generic_doc_hdr.amount_txn = <any>(parseFloat(<any>this.genDoc.bl_fi_generic_doc_hdr.amount_txn) + amtTxnDiff).toFixed(2);
    this.genDoc.bl_fi_generic_doc_hdr.amount_open_balance = <any>(parseFloat(<any>this.genDoc.bl_fi_generic_doc_hdr.amount_open_balance) + amtTxnDiff).toFixed(2);

    this.fillExt(line); 

    if (this.itemDetails.main.form.value.itemType) {
      const linkIndex = this.genDoc.bl_fi_generic_doc_link.findIndex(x => x.guid_doc_2_line === line.guid);
      if (linkIndex >= 0)
        this.genDoc.bl_fi_generic_doc_link[linkIndex].quantity_contra = line.quantity_base
    }

    this.viewColFacade.editGenDocLine(this.genDoc);
  }

  fillExt(line: any) {
    // I don't think this if condition matters
    if (line.line_property_json && line.line_property_json.delivery_instructions) {
      const extIndex = this.genDoc.bl_fi_generic_doc_ext.findIndex(x => x.param_code === 'REQUESTED_DELIVERY_DATE' && x.guid_doc_line === line.guid);
      if (extIndex >= 0) {
        this.genDoc.bl_fi_generic_doc_ext[extIndex].value_datetime = line.line_property_json.delivery_instructions.deliveryDate
        this.genDoc.bl_fi_generic_doc_ext[extIndex].value_json = line.line_property_json.delivery_instructions;
      } else {
        const ext = new bl_fi_generic_doc_ext_RowClass();
        ext.guid_doc_hdr = line.generic_doc_hdr_guid.toString();
        ext.guid_doc_line = line.guid;
        ext.param_code = 'REQUESTED_DELIVERY_DATE';
        ext.param_name = 'REQUESTED_DELIVERY_DATE';
        ext.param_type = 'DATE';
        ext.value_datetime = line.line_property_json.delivery_instructions.deliveryDate;
        ext.value_json = line.line_property_json.delivery_instructions;
        this.genDoc.bl_fi_generic_doc_ext.push(ext);
      }
    } 
  }

  disableSave() {
    return this.itemDetails?.main.form.invalid;
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

  deleteLine() {
    this.genDoc = JSON.parse(JSON.stringify(this.order));
    const lineIndex = this.genDoc.bl_fi_generic_doc_line.findIndex(x => x.guid === this.lineItem.guid);
    if (lineIndex >= 0)
      this.genDoc.bl_fi_generic_doc_line[lineIndex].status = 'DELETED'

    const amtDiscountDiff = 0 - parseFloat(<any>this.lineItem.amount_discount);
    const amtNetDiff = 0 - parseFloat(<any>this.lineItem.amount_net);
    const amtStdDiff = 0 - parseFloat(<any>this.lineItem.amount_std);
    const amtTaxGstDiff = 0 - parseFloat(<any>this.lineItem.amount_tax_gst);
    const amtTaxWhtDiff = 0 - parseFloat(<any>this.lineItem.amount_tax_wht);
    const amtTxnDiff = 0 - parseFloat(<any>this.lineItem.amount_txn)

    this.genDoc.bl_fi_generic_doc_hdr.amount_discount = <any>(parseFloat(<any>this.genDoc.bl_fi_generic_doc_hdr.amount_discount) + amtDiscountDiff).toFixed(2);
    this.genDoc.bl_fi_generic_doc_hdr.amount_net = <any>(parseFloat(<any>this.genDoc.bl_fi_generic_doc_hdr.amount_net) + amtNetDiff).toFixed(2);
    this.genDoc.bl_fi_generic_doc_hdr.amount_std = <any>(parseFloat(<any>this.genDoc.bl_fi_generic_doc_hdr.amount_std) + amtStdDiff).toFixed(2);
    this.genDoc.bl_fi_generic_doc_hdr.amount_tax_gst = <any>(parseFloat(<any>this.genDoc.bl_fi_generic_doc_hdr.amount_tax_gst) + amtTaxGstDiff).toFixed(2);
    this.genDoc.bl_fi_generic_doc_hdr.amount_tax_wht = <any>(parseFloat(<any>this.genDoc.bl_fi_generic_doc_hdr.amount_tax_wht) + amtTaxWhtDiff).toFixed(2);
    this.genDoc.bl_fi_generic_doc_hdr.amount_txn = <any>(parseFloat(<any>this.genDoc.bl_fi_generic_doc_hdr.amount_txn) + amtTxnDiff).toFixed(2);
    this.genDoc.bl_fi_generic_doc_hdr.amount_open_balance = <any>(parseFloat(<any>this.genDoc.bl_fi_generic_doc_hdr.amount_open_balance) + amtTxnDiff).toFixed(2);

    this.delExt(this.lineItem);
    
    if (this.itemDetails.main.form.value.itemType) {
      const linkIndex = this.genDoc.bl_fi_generic_doc_link.findIndex(x => x.guid_doc_2_line === this.lineItem.guid);
      if(linkIndex >= 0)
        this.genDoc.bl_fi_generic_doc_link[linkIndex].status = 'DELETED'
    }

    this.viewColFacade.editGenDocLine(this.genDoc);
  }

  delExt(line: any) {
    if (line.line_property_json && line.line_property_json.delivery_instructions) {
      const extIndex = this.genDoc.bl_fi_generic_doc_ext.findIndex(
        x => x.param_code === 'REQUESTED_DELIVERY_DATE' && x.guid_doc_line === this.lineItem.guid);
      if (extIndex >= 0) {
        this.genDoc.bl_fi_generic_doc_ext[extIndex].status = 'DELETED'
      }
    }
  }

  goToBinListing() {
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState,
      deactivateReturn: true,
      // deactivateAdd: true
    });
    this.viewColFacade.onNextAndReset(this.index, 4);
  }

  goToBatchListing() {
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState,
      deactivateReturn: true,
      // deactivateAdd: true
    });
    this.viewColFacade.onNextAndReset(this.index, 5);
  }

  goToEditIssueLink() {
    if (!this.localState.deactivateIssueLinkList) {
      this.viewColFacade.updateInstance(this.index, {
        ...this.localState,
        deactivateReturn: true,
        deactivateIssueLinkList: true
      });
      this.viewColFacade.onNextAndReset(this.index, 2);
    }
  }

  onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState, deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  ngOnDestroy() {
    if (this.matTab) {
      this.viewColFacade.updateInstance<LocalState>(this.index, {
        ...this.localState,
        selectedIndex: this.matTab.selectedIndex,
        itemSelectedIndex: this.itemDetails.matTab.selectedIndex,
        serialSelectedIndex: this.subItemType === this.SUB_ITEM_TYPE.serialNumber ? this.serialNumber.matTab?.selectedIndex : null
      });
    }
    this.subs.unsubscribe();  
  }

}