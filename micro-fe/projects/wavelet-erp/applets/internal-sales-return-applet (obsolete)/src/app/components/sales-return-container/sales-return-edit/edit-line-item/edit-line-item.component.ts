import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { ViewColumnFacade } from '../../../../facades/view-column.facade';
import { ComponentStore } from '@ngrx/component-store';
import { AppConfig } from 'projects/shared-utilities/visa';
import { SubSink } from 'subsink2';
import { MatTabGroup } from '@angular/material/tabs';
import { bl_fi_generic_doc_line_RowClass, bl_fi_generic_doc_link_RowClass, FinancialItemService } from 'blg-akaun-ts-lib';
import { SalesReturnStates } from '../../../../state-controllers/sales-return-controller/store/states';
import { Store } from '@ngrx/store';
import { SalesReturnSelectors } from '../../../../state-controllers/sales-return-controller/store/selectors';
import { DraftStates } from '../../../../state-controllers/draft-controller/store/states';
import { LinkSelectors } from '../../../../state-controllers/draft-controller/store/selectors';
import { delay, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { EMPTY, iif, of } from 'rxjs';
import { LineItemDetailsComponent } from '../../sales-return-create/add-line-item/item-details/item-details.component';
import { LineItemSerialNumberComponent } from '../../sales-return-create/add-line-item/serial-number/serial-number.component';
import { LineItemBatchNumberComponent } from '../../sales-return-create/add-line-item/batch-number/batch-number.component';
import { LineItemBinNumberComponent } from '../../sales-return-create/add-line-item/bin-number/bin-number.component';
import { SubItemType } from '../../../../models/constants/sub-item-type-constants';

interface LocalState {
  deactivateReturn: boolean;
  deactivateIssueLinkList: boolean;
  selectedIndex: number;
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
  readonly selectedIndex$ = this.componentStore.select(state => state.selectedIndex);
  readonly itemSelectedIndex$ = this.componentStore.select(state => state.itemSelectedIndex);
  readonly serialSelectedIndex$ = this.componentStore.select(state => state.serialSelectedIndex);
  readonly deleteConfirmation$ = this.componentStore.select(state => state.deleteConfirmation);
  readonly order$ = this.store.select(SalesReturnSelectors.selectReturn);
  readonly lineItem$ = this.store.select(SalesReturnSelectors.selectLineItem).pipe(
    switchMap(item => this.fiService.getByGuid(item.item_guid.toString(), this.apiVisa)),
    map(resolve => resolve.data ? resolve.data.bl_fi_mst_item_hdr.sub_item_type : this.SUB_ITEM_TYPE.basicQuantity),
    tap(type => this.subItemType = type.toString())
  );
  
  prevIndex: number;
  apiVisa = AppConfig.apiVisa;
  lineItem: bl_fi_generic_doc_line_RowClass;
  deleteConfirmation: boolean = false;
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
    private readonly store: Store<SalesReturnStates>,
    private readonly draftStore: Store<DraftStates>) {
    super();
  }

  ngOnInit() {
    this.subs.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
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
  }

  onSave() {
    const line = { ...this.lineItem };
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
    line.item_property_json = { ...this.itemDetails.main.form.value };
    line.line_property_json = <any>{ delivery_instructions: { ...this.itemDetails.delivery.form.value } };
    // line.date_txn = this.lineItem.date_txn; // should be new date or keep old one?
    line.serial_no = this.subItemType === this.SUB_ITEM_TYPE.serialNumber ? <any>{ serialNumbers: this.serialNumber.serialNumbers } : null;
    line.batch_no = this.subItemType === this.SUB_ITEM_TYPE.batchNumber ? <any>{ batches: this.batchNumber.batchNumbers } : null;
    line.bin_no = this.subItemType === this.SUB_ITEM_TYPE.binNumber ? <any>{ bins: this.binNumber.binNumbers } : null;
    
    console.log('line', line);

    // Update existing hdr balance by calculating delta (line2 - line1)
    const diffLine = new bl_fi_generic_doc_line_RowClass();
    diffLine.amount_discount = <any>(parseFloat(<any>line.amount_discount) - parseFloat(<any>this.lineItem.amount_discount));
    diffLine.amount_net = <any>(parseFloat(<any>line.amount_net) - parseFloat(<any>this.lineItem.amount_net));
    diffLine.amount_std = <any>(parseFloat(<any>line.amount_std) - parseFloat(<any>this.lineItem.amount_std));
    diffLine.amount_tax_gst = <any>(parseFloat(<any>line.amount_tax_gst) - parseFloat(<any>this.lineItem.amount_tax_gst));
    diffLine.amount_tax_wht = <any>(parseFloat(<any>line.amount_tax_wht) - parseFloat(<any>this.lineItem.amount_tax_wht));
    diffLine.amount_txn = <any>(parseFloat(<any>line.amount_txn) - parseFloat(<any>this.lineItem.amount_txn));

    if (this.itemDetails.main.form.value.itemType) {
      const link = this.getLink(line.guid.toString());
      if (link) {
        link.quantity_contra = line.quantity_base;
        console.log('link', link);
        this.viewColFacade.editLink(link);
      }
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

  deleteLine() {
    let index;
    this.subs.sink = this.order$.subscribe({ next: resolve => {
      if (resolve)
        index = resolve.bl_fi_generic_doc_line.findIndex(x => x.guid === this.lineItem.guid)
    }});
    
    if (index >= 0) {
      // Change status of existing line and link to DELETED
      const line = {...this.lineItem, status: 'DELETED'};
      const diffLine = new bl_fi_generic_doc_line_RowClass();
      diffLine.amount_discount = <any>(0 - parseFloat(<any>line.amount_discount));
      diffLine.amount_net = <any>(0 - parseFloat(<any>line.amount_net));
      diffLine.amount_std = <any>(0 - parseFloat(<any>line.amount_std));
      diffLine.amount_tax_gst = <any>(0 - parseFloat(<any>line.amount_tax_gst));
      diffLine.amount_tax_wht = <any>(0 - parseFloat(<any>line.amount_tax_wht));
      diffLine.amount_txn = <any>(0 - parseFloat(<any>line.amount_txn));
      console.log('line', line);

      // Update corresponding link 
      if (this.itemDetails.main.form.value.itemType) {
        const link = this.getLink(line.guid.toString());
        if (link) {
          link.status = 'DELETED'
          this.viewColFacade.editLink(link);
        }
      }

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
      if (this.itemDetails.main.form.value.itemType) {
        const link = this.getLink(this.lineItem.guid.toString());
        if (link)
          this.viewColFacade.deleteLink(link.guid.toString());
      }

      this.viewColFacade.deleteLine(this.lineItem.guid.toString(), diffLine, this.prevIndex);
    } 
  }

  getLink(lineGuid: string): bl_fi_generic_doc_link_RowClass  {
    let link;
      this.subs.sink = this.draftStore.select(LinkSelectors.selectAll).subscribe(resolved => {
        link = resolved.find(x => x.guid_doc_2_line === lineGuid);
      })
    return link;
  }

  disableSave() {
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
      deactivateAdd: false,
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