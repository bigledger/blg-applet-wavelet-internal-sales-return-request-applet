import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from '../../../../../facades/view-column.facade';
import { AppletConstants } from '../../../../../models/constants/applet-constants';
import { LinkActions, PNSActions } from '../../../../../state-controllers/draft-controller/store/actions';
import { LinkSelectors, PNSSelectors, HDRSelectors } from '../../../../../state-controllers/draft-controller/store/selectors';
import { DraftStates } from '../../../../../state-controllers/draft-controller/store/states';
import { InternalSalesReturnSelectors } from '../../../../../state-controllers/internal-sales-return-controller/store/selectors';
import { InternalSalesReturnStates } from '../../../../../state-controllers/internal-sales-return-controller/store/states';
import { bl_fi_generic_doc_link_RowClass,  Pagination } from 'blg-akaun-ts-lib';
import { AppConfig } from 'projects/shared-utilities/visa';
import { InternalSalesReturnActions } from '../../../../../state-controllers/internal-sales-return-controller/store/actions';

interface LocalState {
  deactivateReturn: boolean;
  deleteConfirmation: boolean;
}

@Component({
  selector: 'app-knockoff-edit',
  templateUrl: './knockoff-edit.component.html',
  styleUrls: ['./knockoff-edit.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class KnockoffEditComponent extends ViewColumnComponent {

  service;
  serverDocTypeDoc1;
  itemGuid;
  maxQty;
  valueBefore;
  link;

  protected subs = new SubSink();

  protected compName = 'Edit Knockoff';
  protected readonly index = 20;
  protected localState: LocalState;
  protected prevLocalState: any;

  prevIndex: number;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateReturn$ = this.componentStore.select(state => state.deactivateReturn);
  readonly deleteConfirmation$ = this.componentStore.select(state => state.deleteConfirmation);
  readonly listingConfig$ = this.store.select(InternalSalesReturnSelectors.selectKnockoffListingConfig);

  deleteConfirmation: boolean = false;

  draft$ = this.draftStore.select(HDRSelectors.selectHdr);
  pns$ = this.draftStore.select(PNSSelectors.selectAll);
  LinkSelectors = LinkSelectors;
  LinkActions = LinkActions;
  PNSSelectors = PNSSelectors;
  PNSActions = PNSActions;

  draftLinks; draftPNS;
  draftLinksIds = []; draftPNSIds = [];

  AppletConstants = AppletConstants;
  apiVisa = AppConfig.apiVisa;

  form: FormGroup;

  constructor(
    private viewColFacade: ViewColumnFacade,
    private readonly componentStore: ComponentStore<LocalState>,
    public readonly draftStore: Store<DraftStates>,
    protected readonly store: Store<InternalSalesReturnStates>
  ) {
    super();
  }

  ngOnInit(): void {
    this.subs.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);

    this.subs.sink = this.draftStore.select(LinkSelectors.selectLinkState).subscribe(
      resolve => {
        // console.log("links draft: ", resolve.entities);
        this.draftLinks = resolve.entities;
        this.draftLinksIds = resolve.ids;
      }
    );
    this.subs.sink = this.draftStore.select(PNSSelectors.selectPNSState).subscribe(
      resolve => {
        this.draftPNS = resolve.entities;
        this.draftPNSIds = resolve.ids;
      }
    );

    this.form = new FormGroup({
      guid: new FormControl(),
      doc_number: new FormControl(),
      date_txn: new FormControl(),
      uom: new FormControl(),
      unit_price_txn: new FormControl('0.00'),
      ko_qty: new FormControl(1),
      open_qty: new FormControl(),
    })

    this.subs.sink = this.listingConfig$.subscribe(resolve => {
      this.link = resolve.item.link;
      this.service = resolve.service;
      this.itemGuid = resolve.item.item_guid;
      this.serverDocTypeDoc1 = resolve.serverDocTypeDoc1;
      this.valueBefore = resolve.item.link.quantity_contra;

      this.form.patchValue({
        guid: resolve.item.guid,
        doc_number: resolve.item.doc_number,
        date_txn: new Date(resolve.item.date_txn).toISOString().split('T')[0],      
        uom: resolve.item.uom,
        unit_price_txn: resolve.item.unit_price_txn,
        ko_qty: resolve.item.ko_qty
      })
    });

    this.subs.sink = this.draft$.subscribe(resolve => {
      this.getBalanceQty(this.service, this.itemGuid, resolve.guid_comp, resolve.doc_entity_hdr_guid)
    });
  }

  getType(serverDocType) {
    switch(serverDocType){
      case 'INTERNAL_SALES_ORDER':
        return 'Sales Order Item';
      case 'INTERNAL_JOBSHEET':
        return 'Jobsheet Item';
      case 'INTERNAL_OUTBOUND_DELIVERY_ORDER':
        return 'Delivery Order Item';
      default:
        return '';
    }
  }
  
  getBalanceQty(service, item_guid, comp_guid, entity_guid) {
    const pagination = new Pagination();
    pagination.sortCriteria.push(
      { columnName: 'doc_entity_hdr_guid', value: entity_guid? entity_guid:'' },
      { columnName: 'guid_comp', value: comp_guid? comp_guid:'' },
      { columnName: 'item_guid', value: item_guid? item_guid:'' }
    );
    this.subs.sink = service.getGenericDocHdrLineLinkByCriteria(pagination, this.apiVisa).subscribe(response=>  {
      let data = response.data.filter(a => a.bl_fi_generic_doc_line.item_guid === item_guid)[0];
      let aggContra = 0;

      data.bl_fi_generic_doc_links?.forEach(link => {
        if(
          // link.server_doc_type_doc_2_line === "INTERNAL_PURCHASE_INVOICE" &&
          link.server_doc_type_doc_1_line === this.serverDocTypeDoc1 &&
          link.guid_doc_1_line === data.bl_fi_generic_doc_line.guid &&
          link.guid_doc_1_hdr === data.bl_fi_generic_doc_hdr.guid
        ) {
          let contra = Number(link.quantity_signum) * Number(link.quantity_contra);
          aggContra += contra;
        }
      })

      // Get sum from the draft
      this.draftLinksIds.forEach(draftLinkId => {
        if(
          // link.server_doc_type_doc_2_line === "INTERNAL_PURCHASE_INVOICE" &&
          this.draftLinks[draftLinkId].status !== "ACTIVE" &&
          this.draftLinks[draftLinkId].server_doc_type_doc_1_line === this.serverDocTypeDoc1 &&
          this.draftLinks[draftLinkId].guid_doc_1_line === data.bl_fi_generic_doc_line.guid &&
          this.draftLinks[draftLinkId].guid_doc_1_hdr === data.bl_fi_generic_doc_hdr.guid
        ) {
          // in case the line item is deleted in draft, we need to add back open_qty temporarily
          if(this.draftLinks[draftLinkId].status === "DELETED") {
            let contra = Number(this.draftLinks[draftLinkId].quantity_signum) * Number(this.draftLinks[draftLinkId].quantity_contra);
            aggContra -= contra;
          } else {
            let contra = Number(this.draftLinks[draftLinkId].quantity_signum) * Number(this.draftLinks[draftLinkId].quantity_contra);
            aggContra += contra;
          }
        }
      })
      this.maxQty = Number(data.bl_fi_generic_doc_line.quantity_base) + aggContra;
      this.form.patchValue({
        open_qty: Number(data.bl_fi_generic_doc_line.quantity_base) + aggContra
      })
      this.form.get('ko_qty').validator = <any>Validators.compose([Validators.required, Validators.min(1), Validators.max(this.maxQty)]);
      this.form.get('ko_qty').updateValueAndValidity();
    });
  }

  disableSave() {
    return this.form.invalid;
  }

  onSave() {
    let valueAfter: number = Number(this.form.get('ko_qty').value);
    // Calculate difference
    let diff: number = valueAfter - this.valueBefore;
    // console.log("Value after: ", valueAfter);
    // console.log("Diff: ",diff);
    // console.log("Link: ", this.link);

    // Edit link's quantity_contra
    // search if any 'DRAFT_TEMP' link, set quantity_contra
    // this.link.quantity_contra = Number(this.link.quantity_contra) + diff;
    // this.draftStore.dispatch(LinkActions.editLink({ link: this.link }));    

    // this.draftLinksIds.forEach(draftLinkId => {        
    //   if(
    //     this.draftLinks[draftLinkId].status === "DRAFT_TEMP" &&
    //     this.draftLinks[draftLinkId].server_doc_type_doc_1_line === this.serverDocTypeDoc1 &&
    //     this.draftLinks[draftLinkId].guid_doc_1_line === this.link.guid_doc_1_line &&
    //     this.draftLinks[draftLinkId].guid_doc_1_hdr === this.link.guid_doc_1_hdr
    //   ) {
    //     this.draftLinks[draftLinkId].quantity_contra = Number(this.draftLinks[draftLinkId].quantity_contra) + diff;
    //     this.draftStore.dispatch(LinkActions.editLink({ link: this.draftLinks[draftLinkId] }));
    //   }
    // })

    // BUG: balance qty not updated
    // check if any 'DRAFT_TEMP' link
    let isExist = false;
    let guid_doc_2_line;
    let lineGuid;
    this.draftLinksIds.forEach(id => {
      if(
        this.draftLinks[id].status !== "DRAFT_TEMP" &&
        this.draftLinks[id].server_doc_type_doc_1_line === this.serverDocTypeDoc1 &&
        this.draftLinks[id].guid_doc_1_line === this.link.guid_doc_1_line &&
        this.draftLinks[id].guid_doc_1_hdr === this.link.guid_doc_1_hdr
      ) {
        // update quantity_contra (on existing doc link in draft)
        this.draftLinks[id].quantity_contra += diff;
        this.draftStore.dispatch(this.LinkActions.editLink({ link: this.draftLinks[id] }));
        lineGuid = this.draftLinks[id].guid_doc_2_line;

        if(this.draftLinks[id].status === "ACTIVE") {
          this.draftLinksIds.forEach(id_2 => {
            if(
              this.draftLinks[id_2].status === "DRAFT_TEMP" &&
              this.draftLinks[id_2].server_doc_type_doc_1_line === this.serverDocTypeDoc1 &&
              this.draftLinks[id_2].guid_doc_1_line === this.link.guid_doc_1_line &&
              this.draftLinks[id_2].guid_doc_1_hdr === this.link.guid_doc_1_hdr
            ) {
              // console.log("DRAFT_TEMP found");
              // update quantity_contra (if DRAFT_TEMP is exist)
              this.draftLinks[id_2].quantity_contra += diff;
              this.draftStore.dispatch(this.LinkActions.editLink({ link: this.draftLinks[id_2] }));
              isExist = true;
              guid_doc_2_line = this.draftLinks[id].guid_doc_2_line;
            }
          })          
        }
      }
    })

    if(!isExist) {
      // console.log("Create DRAFT_TEMP link");
      // create new temporary link (also need to composite DRAFT_TEMP)
      const link = new bl_fi_generic_doc_link_RowClass();
      link.guid_doc_2_line = lineGuid;
      link.guid_doc_1_hdr = this.link.guid_doc_1_hdr;
      link.guid_doc_1_line = this.link.guid_doc_1_line;
      link.server_doc_type_doc_1_hdr = this.link.server_doc_type_doc_1_hdr;
      link.server_doc_type_doc_1_line = this.link.server_doc_type_doc_1_line;
      link.server_doc_type_doc_2_hdr = this.AppletConstants.docType;
      link.server_doc_type_doc_2_line = this.AppletConstants.docType;
      link.txn_type = 'KO';
      link.quantity_signum = -1;
      link.quantity_contra = diff;
      link.date_txn = new Date();
      link.status = 'DRAFT_TEMP'; // Temporary draft, will not upsert to database

      this.draftStore.dispatch(this.LinkActions.addLink({ link }));
    }

    // Update pns and line item
    this.draftPNSIds.forEach(id => {
      if(
        this.draftPNS[id].guid === this.link.guid_doc_2_line
      ) {
        this.draftPNS[id].quantity_base = Number(this.draftPNS[id].quantity_base) + diff;

        this.draftStore.dispatch(this.PNSActions.editPNS({ pns: this.draftPNS[id] }));
        this.store.dispatch(InternalSalesReturnActions.selectLineItem({ lineItem: this.draftPNS[id] }));
      }
    })

    this.onReturn();
  }

  onDelete() {
    if (this.deleteConfirmation) {
      // this.deleteLink();
      this.deleteConfirmation = false;
      this.componentStore.patchState({ deleteConfirmation: false });
    } else {
      this.deleteConfirmation = true;
      this.componentStore.patchState({ deleteConfirmation: true });
    }
  }

  deleteLink() {
    this.link.status = 'DELETED'
    this.draftStore.dispatch(LinkActions.editLink({ link: this.link }));

    // TODO: Update line's quantity. If line's quantity is 0, delete the line?

    this.draftLinksIds.forEach(draftLinkId => {        
      if(
        this.draftLinks[draftLinkId].status === "DRAFT_TEMP" &&
        this.draftLinks[draftLinkId].server_doc_type_doc_1_line === this.serverDocTypeDoc1 &&
        this.draftLinks[draftLinkId].guid_doc_1_line === this.link.guid_doc_1_line &&
        this.draftLinks[draftLinkId].guid_doc_1_hdr === this.link.guid_doc_1_hdr
      ) {
        this.draftStore.dispatch(LinkActions.deleteLink({ guid: this.draftLinks[draftLinkId].guid }));
      }
    })

    this.onReturn();
  }

  onReturn() {
    this.viewColFacade.updateInstance<LocalState>(this.prevIndex, {
      ...this.prevLocalState,
      deactivateReturn: false,
      deactivateAdd: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
