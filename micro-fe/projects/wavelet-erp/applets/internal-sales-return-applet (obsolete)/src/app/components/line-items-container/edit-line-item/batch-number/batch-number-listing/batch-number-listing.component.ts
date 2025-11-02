import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ComponentStore } from '@ngrx/component-store';
import { withLatestFrom } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import * as moment from 'moment';
import { BatchHdrService, Pagination, BatchHdrModel } from 'blg-akaun-ts-lib';
import { ViewColumnFacade } from '../../../../../facades/view-column.facade';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { PaginationComponent } from 'projects/shared-utilities/utilities/pagination/pagination.component';
import { pageFiltering, pageSorting } from 'projects/shared-utilities/listing.utils';
import { LineItemActions } from '../../../../../state-controllers/line-item-controller/store/actions';
import { LineItemSelectors } from '../../../../../state-controllers/line-item-controller/store/selectors';
import { LineItemStates } from '../../../../../state-controllers/line-item-controller/store/states';

interface LocalState {
  deactivateReturn: boolean;
}

@Component({
  selector: 'app-edit-line-item-batch-number-listing',
  templateUrl: './batch-number-listing.component.html',
  styleUrls: ['./batch-number-listing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class EditLineItemBatchNumberListingComponent extends ViewColumnComponent {
  
  protected subs = new SubSink();
  
  protected compName = 'Batch Number Listing';
  protected readonly index = 5;
  protected localState: LocalState;
  protected prevLocalState: any;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly invItem$ = this.store.select(LineItemSelectors.selectInvItem);
  readonly return$ = this.store.select(LineItemSelectors.selectOrder);

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
    { headerName: 'Batch No', field: 'bl_inv_batch_hdr.batch_no', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true },
    { headerName: 'Batch Code', field: 'bl_inv_batch_hdr.code', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true },
    { headerName: 'Batch Name', field: 'bl_inv_batch_hdr.name', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true },
    { headerName: 'Issue Date', field: 'bl_inv_batch_hdr.issue_date', cellStyle: () => ({ 'text-align': 'left' }), type: 'rightAligned',
      valueFormatter: params => moment(params.value).format('YYYY-MM-DD'), floatingFilter: true },
    { headerName: 'Expiry Date', field: 'bl_inv_batch_hdr.expiry_date', cellStyle: () => ({ 'text-align': 'left' }), type: 'rightAligned',
      valueFormatter: params => moment(params.value).format('YYYY-MM-DD'), floatingFilter: true },
    { headerName: 'Qty Balance', field: 'bl_inv_batch_hdr.qty_balance', type: 'numericColumn', floatingFilter: true },
  ];

  constructor(
    private viewColFacade: ViewColumnFacade,
    private batchService: BatchHdrService,
    private readonly store: Store<LineItemStates>,
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
      withLatestFrom(this.return$)
    ).subscribe(([inv, sales_return]) => {
      if (inv) {
        this.invItemGuid = inv;
        this.locationGuid = sales_return.bl_fi_generic_doc_hdr.guid_store.toString();
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
        this.subs.sink = this.batchService.getByCriteria(page, AppConfig.apiVisa).subscribe(
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

  onRowClicked(batch: BatchHdrModel) {
    this.store.dispatch(LineItemActions.selectBatch({ batch: batch.bl_inv_batch_hdr }));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}