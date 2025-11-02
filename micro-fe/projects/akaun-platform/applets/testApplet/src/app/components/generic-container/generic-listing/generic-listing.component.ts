import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { BranchService, CompanyService, GenericDocContainerModel, LocationService, Pagination, InternalSalesOrderService } from 'blg-akaun-ts-lib';
import { forkJoin, iif, Observable, of, zip } from 'rxjs';
import { ViewColumnFacade } from '../../../facades/view-column.facade';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { internalSalesOrderSearchModel } from '../../../models/advanced-search-models/internal-sales-order.model';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';

interface LocalState {
  deactivateAdd: boolean;
  deactivateList: boolean;
}

@Component({
  selector: 'app-generic-listing',
  templateUrl: './generic-listing.component.html',
  styleUrls: ['./generic-listing.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})

export class GenericListingComponent extends ViewColumnComponent {

  protected subs = new SubSink();

  protected compName = 'Generic Listing';
  protected readonly index = 0;
  protected localState: LocalState;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateAdd$ = this.componentStore.select(state => state.deactivateAdd);
  readonly deactivateList$ = this.componentStore.select(state => state.deactivateList);

  toggleColumn$: Observable<boolean>;
  searchModel = internalSalesOrderSearchModel;

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilterComponentParams: {suppressFilterButton: true},
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true
  };

  gridApi;

  columnsDefs = [
    {headerName: 'Doc No', field: 'bl_fi_generic_doc_hdr.server_doc_1', cellStyle: () => ({'text-align': 'left'})},
    {headerName: 'Location', field: 'bl_fi_generic_doc_hdr.guid_store', cellStyle: () => ({'text-align': 'left'})},
    {headerName: 'Customer Name', field: 'bl_fi_generic_doc_hdr.doc_entity_hdr_guid', cellStyle: () => ({'text-align': 'left'})},
    {headerName: 'Created Date', field: 'bl_fi_generic_doc_hdr.created_date'},
    {headerName: 'Created By', field: 'bl_fi_generic_doc_hdr.created_by_subject_guid', cellStyle: () => ({'text-align': 'left'})},
    {headerName: 'Status', field: 'stockBalQty', cellStyle: () => ({'text-align': 'left'})},
  ];

  constructor(
    protected viewColFacade: ViewColumnFacade,
    protected soService: InternalSalesOrderService,
    protected compService: CompanyService,
    protected brchService: BranchService,
    protected lctnService: LocationService,
    protected readonly componentStore: ComponentStore<LocalState>) {
    super();
  }

  ngOnInit() {
    this.toggleColumn$ = this.viewColFacade.toggleColumn$;
    this.subs.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
  }

  onNext() {
    this.viewColFacade.updateInstance<LocalState>(this.index, {
      ...this.localState, deactivateAdd: true, deactivateList: false});
    this.viewColFacade.onNextAndReset(this.index, 1);
  }

  onGridReady(params) {
    const apiVisa = AppConfig.apiVisa;
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    const datasource = {
      getRows: grid => {
        // this.store.dispatch(InternalPackingOrderActions.loadPackingOrdersInit({request: grid.request}));
        this.subs.sink = this.soService.getByCriteria(new Pagination(grid.request.startRow, grid.request.endRow, [
          {columnName: 'calcTotalRecords', operator: '=', value: 'true'}
        ]), apiVisa).pipe(
          mergeMap(b => {
            const source: Observable<GenericDocContainerModel>[] = [];
            b.data.forEach( doc => source.push(
              zip(
                this.compService.getByGuid(doc.bl_fi_generic_doc_hdr.guid_comp.toString(), apiVisa).pipe(
                  catchError((err) => of(err))
                ),
                this.brchService.getByGuid(doc.bl_fi_generic_doc_hdr.guid_branch.toString(), apiVisa).pipe(
                  catchError((err) => of(err))
                ),
                this.lctnService.getByGuid(doc.bl_fi_generic_doc_hdr.guid_store.toString(), apiVisa).pipe(
                  catchError((err) => of(err))
                )).pipe(
                  map(([b_a, b_b, b_c]) => {
                    doc.bl_fi_generic_doc_hdr.guid_comp = b_a.error ? b_a.error.code : b_a.data.bl_fi_mst_comp.name;
                    doc.bl_fi_generic_doc_hdr.guid_branch = b_b.error ? b_b.error.code : b_b.data.bl_fi_mst_branch.name;
                    doc.bl_fi_generic_doc_hdr.guid_store = b_c.error ? b_c.error.code : b_c.data.bl_inv_mst_location.name;
                    return doc;
                  })
                )
            ));
            return iif(() => b.data.length > 0,
              forkJoin(source).pipe(map(() => b)),
              of(b)
            );
          })
        ).subscribe( resolved => {
          // this.store.dispatch(InternalPackingOrderActions.loadPackingOrderSuccess({totalRecords: resolved.totalRecords}));
          grid.successCallback(resolved.data, resolved.totalRecords);
        }, err => {
          // this.store.dispatch(InternalPackingOrderActions.loadPackingOrderFailed({error: err.message}));
          grid.failCallback();
        });
      }
    };
    this.gridApi.setServerSideDatasource(datasource);
    // this.subs.sink = this.store.select(InternalPackingOrderSelectors.selectAgGrid).subscribe( a => {
    //   if (a) {
    //     this.gridApi.purgeServerSideCache();
    //   }
    // });
  }

  onToggle(e: boolean) {
    this.viewColFacade.toggleColumn(e);
  }

  onRowClicked(entity: GenericDocContainerModel) {
    if (entity) {
      // this.store.dispatch(InternalPackingOrderActions.selectPackingOrderEntity({entity}));
      // if (!this.localState.deactivateList) {
      //   this.viewColFacade.updateInstance<LocalState>(this.index, {
      //     ...this.localState, deactivateAdd: false, deactivateList: true});
      //   this.viewColFacade.onNextAndReset(this.index, 1);
      // }
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
