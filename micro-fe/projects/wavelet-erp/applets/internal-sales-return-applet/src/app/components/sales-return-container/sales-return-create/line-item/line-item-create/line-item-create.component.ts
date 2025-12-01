import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from '../../../../../facades/view-column.facade';
import { HDRSelectors, LinkSelectors, PNSSelectors } from '../../../../../state-controllers/draft-controller/store/selectors';
import { LinkActions, PNSActions } from '../../../../../state-controllers/draft-controller/store/actions';
import { DraftStates } from '../../../../../state-controllers/draft-controller/store/states';
import { InternalSalesReturnActions } from '../../../../../state-controllers/internal-sales-return-controller/store/actions';
import { InternalSalesReturnStates } from '../../../../../state-controllers/internal-sales-return-controller/store/states';
import { salesQuotationLineItemSearchModel, salesInvoiceLineItemSearchModel } from '../../../../../models/advanced-search-models/line-item.model';
import { jobsheetLineItemSearchModel } from '../../../../../models/advanced-search-models/line-item.model';
import { deliveryOrderLineItemSearchModel } from '../../../../../models/advanced-search-models/line-item.model';
import {
  InternalSalesQuotationService,
  InternalOutboundDeliveryOrderService,
  InternalJobsheetService,
  InternalSalesOrderService,
  SalesInvoiceService
} from 'blg-akaun-ts-lib';
import { AppletConstants } from '../../../../../models/constants/applet-constants';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';
import { SessionActions } from 'projects/shared-utilities/modules/session/session-controller/actions';
import { ServerDocTypeConstants } from 'projects/shared-utilities/models/server-doc-types.model';
import { AppletSettings } from '../../../../../models/applet-settings.model';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

interface LocalState {
  deactivateReturn: boolean;
  deactivateList: boolean;
  selectedIndex: number;
  internalSalesReturnEdit: boolean;
  selectedItem: any;
}

@Component({
  selector: 'app-internal-sales-return-line-item-create',
  templateUrl: './line-item-create.component.html',
  styleUrls: ['./line-item-create.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class LineItemCreateComponent extends ViewColumnComponent {

  protected subs = new SubSink();

  protected compName = 'Line Item Create';
  protected readonly index = 7;
  protected localState: LocalState;
  protected prevLocalState: any;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateReturn$ = this.componentStore.select(state => state.deactivateReturn);
  readonly selectedIndex$ = this.componentStore.select(state => (state.selectedIndex));

  draft$ = this.draftStore.select(HDRSelectors.selectHdr);
  LinkSelectors = LinkSelectors;
  LinkActions = LinkActions;
  PNSSelectors = PNSSelectors;
  PNSEditSelectors = PNSSelectors;
  PNSEditActions = PNSActions;
  PNSActions = PNSActions;

  salesLineItemSearchModel;
  salesQuotationLineItemSearchModel = salesQuotationLineItemSearchModel;
  jobsheetLineItemSearchModel = jobsheetLineItemSearchModel;
  deliveryOrderLineItemSearchModel = deliveryOrderLineItemSearchModel;
  salesInvoiceLineItemSearchModel = salesInvoiceLineItemSearchModel;

  AppletConstants = AppletConstants;

  prevIndex: number;
  apiVisa = AppConfig.apiVisa;

  @ViewChild(MatTabGroup) matTab: MatTabGroup;
  compGuid: any;
  koSO = false;
  koJS = false;
  // koSQ = false;
  koDO = false;
  koSI = false;

  orientation: boolean = false;
  appletSettings: any;
  appletSettings$ = combineLatest([
    this.sessionStore.select(SessionSelectors.selectMasterSettings),
    this.sessionStore.select(SessionSelectors.selectPersonalSettings)
  ]).pipe(map(([a, b]) => ({ ...a, ...b })));

  constructor(
    private viewColFacade: ViewColumnFacade,
    private InternalSalesOrderService: InternalSalesOrderService,
    private InternalJobsheetService: InternalJobsheetService,
    private InternalOutboundDeliveryOrderService: InternalOutboundDeliveryOrderService,
    private InternalSalesInvoiceService: SalesInvoiceService,
    public InternalSalesQuotationService: InternalSalesQuotationService,
    protected readonly store: Store<InternalSalesReturnStates>,
    private readonly draftStore: Store<DraftStates>,
    public sessionStore: Store<SessionStates>,
    protected readonly componentStore: ComponentStore<LocalState>) {
    super();
  }

  ngOnInit() {
    this.subs.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    // if (this.prevIndex === 2) {
    //   console.log('here')
    //   this.componentStore.patchState({ purchaseOrderEdit: true });
    //   console.log(this.localState);
    // }
    // else
    //   this.componentStore.patchState({ purchaseOrderEdit: false });
    this.subs.sink = this.store.select(HDRSelectors.selectHdr).subscribe(data=>{
      this.compGuid = data.guid_comp;
      console.log(this.compGuid);
    })

    this.subs.sink = this.appletSettings$.subscribe(resolve => this.appletSettings = resolve);

    this.sessionStore.dispatch(SessionActions.getKOSettingsInit({compGuid:this.compGuid, serverDoc2: ServerDocTypeConstants.INTERNAL_SALES_RETURN_REQUEST }))
    this.subs.sink = this.sessionStore.select(SessionSelectors.selectKOSettings).subscribe(response=>{
      console.log(response);
      if(response!==null){
        response.forEach(setting=>{

          if(setting.bl_fi_comp_gendoc_flow_config.server_doc_type_1 === ServerDocTypeConstants.INTERNAL_SALES_ORDER && setting.bl_fi_comp_gendoc_flow_config.flow_type=="LINE"){
            this.koSO = setting.bl_fi_comp_gendoc_flow_config.is_enabled;
          }

          if(setting.bl_fi_comp_gendoc_flow_config.server_doc_type_1 === ServerDocTypeConstants.INTERNAL_JOBSHEET && setting.bl_fi_comp_gendoc_flow_config.flow_type=="LINE"){
            this.koJS = setting.bl_fi_comp_gendoc_flow_config.is_enabled;
          }

          // if(setting.bl_fi_comp_gendoc_flow_config.server_doc_type_1 === ServerDocTypeConstants.INTERNAL_SALES_QUOTATION && setting.bl_fi_comp_gendoc_flow_config.flow_type=="LINE"){
          //   this.koSQ = setting.bl_fi_comp_gendoc_flow_config.is_enabled;
          // }

          if(setting.bl_fi_comp_gendoc_flow_config.server_doc_type_1 === ServerDocTypeConstants.INTERNAL_OUTBOUND_DELIVERY_ORDER && setting.bl_fi_comp_gendoc_flow_config.flow_type=="LINE"){
            this.koDO = setting.bl_fi_comp_gendoc_flow_config.is_enabled;
          }

          if(setting.bl_fi_comp_gendoc_flow_config.server_doc_type_1 === ServerDocTypeConstants.INTERNAL_SALES_INVOICE && setting.bl_fi_comp_gendoc_flow_config.flow_type=="LINE"){
            this.koSI = setting.bl_fi_comp_gendoc_flow_config.is_enabled;
          }

        })
      }
    })
  }

  onSubmit() {

  }

  // saveSerialNumber(serial: string) {
  //   this.store.dispatch(ItemActions.selectSerial({ serial }));
  // }

  goToAddLineItem(lineItem: any) {
    this.store.dispatch(InternalSalesReturnActions.selectLineItem({ lineItem }));
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState,
      deactivateList: false,
      deactivateReturn: true,
      selectedItem: lineItem.item_guid
    });
    this.viewColFacade.onNextAndReset(this.index, 8);
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
        ...this.localState, selectedIndex: this.matTab.selectedIndex
      });
    }
    this.subs.unsubscribe();
  }

}
