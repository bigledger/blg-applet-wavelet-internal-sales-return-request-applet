import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { map } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from '../../../../../../facades/view-column.facade';
import { salesReturnSearchModel } from '../../../../../../models/advanced-search-models/internal-sales-return.model';
import { SalesReturnActions } from '../../../../../../state-controllers/sales-return-controller/store/actions';
import { SalesReturnSelectors } from '../../../../../../state-controllers/sales-return-controller/store/selectors';
import { SalesReturnStates } from '../../../../../../state-controllers/sales-return-controller/store/states';

interface LocalState {
  deactivateReturn: boolean;
}

@Component({
  selector: 'app-sales-return-select-shipping-address',
  templateUrl: './select-shipping-address-listing.component.html',
  styleUrls: ['./select-shipping-address-listing.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class SelectShippingAddressComponent extends ViewColumnComponent {

  protected subs = new SubSink();

  protected compName = 'Select Shipping Address';
  protected readonly index = 6;
  protected localState: LocalState;
  protected prevLocalState: any;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);

  prevIndex: number;
  gridApi;
  searchModel = salesReturnSearchModel;

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilterComponentParams: { suppressFilterButton: true },
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true
  };

  columnsDefs = [
    {
      headerName: 'Address', field: 'shipping_address', cellStyle: () => ({ 'text-align': 'left' }),
      valueGetter: (p) => `${p.data.address_line_1} ${p.data.address_line_2} ${p.data.address_line_3} ${p.data.address_line_4} ${p.data.address_line_5}`
    },
    { headerName: 'City', field: 'city', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Postal Code', field: 'postal_code' },
    { headerName: 'State', field: 'state', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Country', field: 'country', cellStyle: () => ({ 'text-align': 'left' }) },
  ];

  rowData$ = this.store.select(SalesReturnSelectors.selectEntity).pipe(
    map(a => a.bl_fi_mst_entity_hdr.addresses_json.shipping_address)
  );

  constructor(
    protected viewColFacade: ViewColumnFacade,
    protected store: Store<SalesReturnStates>,
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
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
  }

  onToggle(e: boolean) {
    // this.viewColFacade.toggleColumn(e);
  }

  onRowClicked(shipping_address) {
    this.store.dispatch(SalesReturnActions.selectShippingAddress({ shipping_address }));
  }

  onReturn() {
    this.viewColFacade.updateInstance<LocalState>(this.prevIndex, {
      ...this.prevLocalState,
      deactivateReturn: false,
      deactivateAdd: false,
      deactivateList: false,
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}