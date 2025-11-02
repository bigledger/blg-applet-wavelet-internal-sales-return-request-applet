import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { salesReturnSearchModel } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/models/advanced-search-models/internal-sales-return.model';
import { InternalSalesReturnActions } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/internal-sales-return-controller/store/actions';
import { InternalSalesReturnSelectors } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/internal-sales-return-controller/store/selectors';
import { InternalSalesReturnStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/internal-sales-return-controller/store/states';
// import { salesReturnSearchModel } from 'projects/wavelet-erp/applets/internal-sales-credit-note-applet/src/app/models/advanced-search-models/internal-sales-credit-note.model';
// import { InternalSalesReturnActions } from 'projects/wavelet-erp/applets/internal-sales-credit-note-applet/src/app/state-controllers/internal-sales-credit-note-controller/store/actions';
// import { InternalSalesReturnSelectors } from 'projects/wavelet-erp/applets/internal-sales-credit-note-applet/src/app/state-controllers/internal-sales-credit-note-controller/store/selectors';
// import { InternalSalesReturnStates } from 'projects/wavelet-erp/applets/internal-sales-credit-note-applet/src/app/state-controllers/internal-sales-credit-note-controller/store/states';
import { map } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from '../../../../../../facades/view-column.facade';
import { CustomerService } from 'blg-akaun-ts-lib';
import { AppConfig } from 'projects/shared-utilities/visa';

interface LocalState {
  deactivateReturn: boolean;
}

@Component({
  selector: 'app-internal-sales-credit-note-select-billing-address',
  templateUrl: './select-billing-address.component.html',
  styleUrls: ['./select-billing-address.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class SelectBillingAddressComponent extends ViewColumnComponent {

  protected subs = new SubSink();

  protected compName = 'Select Billing Address';
  protected readonly index = 5;
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
      headerName: 'Address', field: 'billing_address', cellStyle: () => ({ 'text-align': 'left' }),
      valueGetter: (p) => `${p.data.address_line_1} ${p.data.address_line_2} ${p.data.address_line_3} ${p.data.address_line_4} ${p.data.address_line_5}`
    },
    { headerName: 'City', field: 'city', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Postal Code', field: 'postal_code' },
    { headerName: 'State', field: 'state', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Country', field: 'country', cellStyle: () => ({ 'text-align': 'left' }) },
  ];

  rowData$ = this.store.select(InternalSalesReturnSelectors.selectEntity).pipe(
    map(a => a.bl_fi_mst_entity_hdr.addresses_json.billing_address)
  );
  customerGuid: any;

  constructor(
    protected viewColFacade: ViewColumnFacade,
    protected store: Store<InternalSalesReturnStates>,
    protected customerService: CustomerService,
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
    this.subs.sink = this.store.select(InternalSalesReturnSelectors.selectEntity).subscribe(data => {
      this.customerGuid = data.bl_fi_mst_entity_hdr.guid
    })
  }

  onNext() {
    this.viewColFacade.gotoFourOhFour();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    const datasource = {
      getRows: grid => {
        this.subs.sink = this.customerService.getByGuid(
          this.customerGuid, AppConfig.apiVisa).subscribe(a => {
            grid.success({
              rowData: a.data.bl_fi_mst_entity_hdr.addresses_json.billing_address,
              rowCount: a.data.bl_fi_mst_entity_hdr.addresses_json.billing_address.length,
            });
          }, err => {
            grid.fail();
          });
      }
    };
    this.gridApi.setServerSideDatasource(datasource);
  }

  onToggle(e: boolean) {
    // this.viewColFacade.toggleColumn(e);
  }

  onRowClicked(billing_address) {
    this.store.dispatch(InternalSalesReturnActions.selectBillingAddress({ billing_address }));
    this.onReturn();
  }

  onReturn() {
    this.viewColFacade.updateInstance<LocalState>(this.prevIndex, {
      ...this.prevLocalState,
      deactivateReturn: false,
      deactivateAdd: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}