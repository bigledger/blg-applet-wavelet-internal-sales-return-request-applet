import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
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
import { 
  InternalSalesOrderService,
  InternalJobsheetService,
  InternalOutboundDeliveryOrderService,
  InternalSalesQuotationService
} from 'blg-akaun-ts-lib';

interface LocalState {
  deactivateReturn: boolean;
}

@Component({
  selector: 'app-knockoff-add',
  templateUrl: './knockoff-add.component.html',
  styleUrls: ['./knockoff-add.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class KnockoffAddComponent extends ViewColumnComponent {

  service;
  advSearchModel;
  itemType;

  protected subs = new SubSink();

  protected compName = 'Add Knockoff';
  protected readonly index = 19;
  protected localState: LocalState;
  protected prevLocalState: any;

  prevIndex: number;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateReturn$ = this.componentStore.select(state => state.deactivateReturn);
  readonly listingConfig$ = this.store.select(InternalSalesReturnSelectors.selectKnockoffListingConfig);

  draft$ = this.draftStore.select(HDRSelectors.selectHdr);  
  LinkSelectors = LinkSelectors;
  LinkActions = LinkActions;
  PNSSelectors = PNSSelectors;
  PNSActions = PNSActions;

  AppletConstants = AppletConstants;

  constructor(
    private viewColFacade: ViewColumnFacade,
    private readonly componentStore: ComponentStore<LocalState>,
    public readonly draftStore: Store<DraftStates>,
    protected readonly store: Store<InternalSalesReturnStates>,
    public InternalSalesOrderService: InternalSalesOrderService,
    public InternalJobsheetService: InternalJobsheetService,
    public InternalOutboundDeliveryOrderService: InternalOutboundDeliveryOrderService,
    public InternalSalesQuotationService: InternalSalesQuotationService,
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

  onReturn() {
    this.viewColFacade.updateInstance<LocalState>(this.prevIndex, {
      ...this.prevLocalState,
      deactivateReturn: false,
      deactivateAdd: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

}
