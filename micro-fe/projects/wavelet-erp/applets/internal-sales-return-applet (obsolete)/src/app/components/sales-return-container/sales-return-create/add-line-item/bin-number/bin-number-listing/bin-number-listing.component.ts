import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ComponentStore } from '@ngrx/component-store';
import { withLatestFrom } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { BinHdrService, BinModel, Pagination } from 'blg-akaun-ts-lib';
import { ViewColumnFacade } from '../../../../../../facades/view-column.facade';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { PaginationComponent } from 'projects/shared-utilities/utilities/pagination/pagination.component';
import { pageFiltering, pageSorting } from 'projects/shared-utilities/listing.utils';
import { DraftStates } from '../../../../../../state-controllers/draft-controller/store/states';
import { HDRSelectors } from '../../../../../../state-controllers/draft-controller/store/selectors';
import { ItemSelectors } from '../../../../../../state-controllers/sales-return-controller/store/selectors';
import { ItemActions } from '../../../../../../state-controllers/sales-return-controller/store/actions';
import { SalesReturnStates } from '../../../../../../state-controllers/sales-return-controller/store/states';

interface LocalState {
  deactivateReturn: boolean;
}

@Component({
  selector: 'app-line-item-bin-number-listing',
  templateUrl: './bin-number-listing.component.html',
  styleUrls: ['./bin-number-listing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class LineItemBinNumberListingComponent extends ViewColumnComponent {
  
  protected subs = new SubSink();
  
  protected compName = 'Bin Number Listing';
  protected readonly index = 19;
  protected localState: LocalState;
  protected prevLocalState: any;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly invItem$ = this.store.select(ItemSelectors.selectInvItem);
  readonly draft$ = this.draftStore.select(HDRSelectors.selectHdr);

  prevIndex: number;
  invItemGuid: string;
  locationGuid: string;
  gridApi;
  apiVisa = AppConfig.apiVisa;
  @ViewChild(PaginationComponent) paginationComp: PaginationComponent;

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilterComponentParams: {suppressFilterButton: true},
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true
  };

  columnsDefs = [
    { headerName: 'Bin Code', field: 'bl_inv_bin_hdr.code', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true },
    { headerName: 'Bin Name', field: 'bl_inv_bin_hdr.name', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true },
    { headerName: 'Bin Type', field: 'bl_inv_bin_hdr.bin_type', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true },
    { headerName: 'Description', field: 'bl_inv_bin_hdr.description', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true },
    { headerName: 'Status', field: 'bl_inv_bin_hdr.status', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true },
    // { headerName: 'Branch', field: 'branch', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true },
    // { headerName: 'Location', field: 'location', cellStyle: () => ({ 'text-align': 'left'}), floatingFilter: true },
    { headerName: 'Qty Balance', field: 'bl_inv_bin_hdr.qty_balance', type: 'numericColumn', floatingFilter: true },
  ];

  constructor(
    private viewColFacade: ViewColumnFacade,
    private binService: BinHdrService,
    private readonly store: Store<SalesReturnStates>,
    protected readonly draftStore: Store<DraftStates>,
    private readonly componentStore: ComponentStore<LocalState>) {
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
    this.invItem$.pipe(
      withLatestFrom(this.draft$)
    ).subscribe(([inv, draft]) => {
      if (inv && draft.guid_store) {
        this.invItemGuid = inv;
        this.locationGuid = draft.guid_store.toString();
        this.setGridData();
      }
    });
  }

  setGridData() {
    const apiVisa = AppConfig.apiVisa;
    const datasource = {
      getRows: grid => {
        const filter = pageFiltering(grid.request.filterModel);
        const sortOn = pageSorting(grid.request.sortModel);
        let page = new Pagination();
        page.conditionalCriteria = [
          { columnName: 'item_guid', operator: '=', value: this.invItemGuid },
          { columnName: 'guid_location', operator: '=', value: this.locationGuid }
        ];
        this.subs.sink = this.binService.get(apiVisa).subscribe(
          { next: (resolve: any) => {
            const data = sortOn(resolve.data).filter(o => filter.by(o));
            const totalRecords = data.length;
            grid.success({
              rowData: data,
              rowCount: totalRecords
            });
          }}
        );
      }
    };
    this.gridApi.setServerSideDatasource(datasource);
  }

  onReturn() {
    this.viewColFacade.updateInstance<LocalState>(this.prevIndex, {
      ...this.prevLocalState,
      deactivateReturn: false,
      deactivateAdd: false,
      // deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  onRowClicked(bin: BinModel) {
    this.store.dispatch(ItemActions.selectBin({ bin: bin.bl_inv_bin_hdr }));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}