import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { BranchService, GenericDocContainerModel, Pagination, InternalSalesReturnService, CustomerService, TenantUserProfileService, SubQueryService, EmployeeService } from 'blg-akaun-ts-lib';
import { forkJoin, iif, Observable, of, zip } from 'rxjs';
import { ViewColumnFacade } from '../../../facades/view-column.facade';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { salesReturnSearchModel } from '../../../models/advanced-search-models/internal-sales-return.model';
import { SalesReturnStates } from '../../../state-controllers/sales-return-controller/store/states';
import { Store } from '@ngrx/store';
import { SalesReturnActions } from '../../../state-controllers/sales-return-controller/store/actions';
import { SalesReturnSelectors } from '../../../state-controllers/sales-return-controller/store/selectors';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { DraftStates } from '../../../state-controllers/draft-controller/store/states';
import { SearchQueryModel } from 'projects/shared-utilities/models/query.model';
import { pageFiltering, pageSorting } from 'projects/shared-utilities/listing.utils';
import { PaginationComponent } from 'projects/shared-utilities/utilities/pagination/pagination.component';
import * as moment from 'moment';

interface LocalState {
  deactivateAdd: boolean;
  deactivateList: boolean;
  selectedRow: any;
}

@Component({
  selector: 'app-sales-return-listing',
  templateUrl: './sales-return-listing.component.html',
  styleUrls: ['./sales-return-listing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class SalesReturnListingComponent extends ViewColumnComponent {

  protected subs = new SubSink();

  protected compName = 'Sales Return Request Listing';
  protected readonly index = 0;
  protected localState: LocalState;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateAdd$ = this.componentStore.select(state => state.deactivateAdd);

  toggleColumn$: Observable<boolean>;
  searchModel = salesReturnSearchModel;
  gridApi;
  SQLGuids: string[] = null;
  pagination = new Pagination();

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
    { headerName: 'Doc No', field: 'bl_fi_generic_doc_hdr.server_doc_1', cellStyle: () => ({ 'text-align': 'left' }), checkboxSelection: true,
      floatingFilter: true },
    { headerName: 'Posting Status', field: 'bl_fi_generic_doc_hdr.posting_status', cellStyle: () => ({ 'text-align': 'left' }),
    valueFormatter: params => params.value? params.value : "DRAFT", floatingFilter: true },
    { headerName: 'Branch', field: 'branch_name', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true },
    { headerName: 'Customer Name', field: 'customer_name', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true },
    { headerName: 'Sales Agent', field: 'sales_agent', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true },
    { headerName: 'Created Date', field: 'bl_fi_generic_doc_hdr.created_date', type: 'rightAligned',
      valueFormatter: params => moment(params.value).format('YYYY-MM-DD'), floatingFilter: true },
    { headerName: 'Created by', field: 'created_by_name', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true }
  ];

  @ViewChild(PaginationComponent) paginationComp: PaginationComponent;

  constructor(
    private viewColFacade: ViewColumnFacade,
    private siService: InternalSalesReturnService,
    private brnchService: BranchService,
    private customerService: CustomerService,
    private profileService: TenantUserProfileService,
    private subQueryService: SubQueryService,
    private empService: EmployeeService,
    private readonly store: Store<SalesReturnStates>,
    private readonly draftStore: Store<DraftStates>,
    private readonly componentStore: ComponentStore<LocalState>) {
    super();
  }

  ngOnInit() {
    this.toggleColumn$ = this.viewColFacade.toggleColumn$;
    this.subs.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.setGridData();
  }

  setGridData() {
    const apiVisa = AppConfig.apiVisa;
    const datasource = {
      getRows: grid => {
        this.store.dispatch(SalesReturnActions.loadSalesReturnInit({ request: grid.request }));
        const filter = pageFiltering(grid.request.filterModel);
        const sortOn = pageSorting(grid.request.sortModel);
        this.pagination.offset = this.SQLGuids ? 0 : grid.request.startRow;
        this.pagination.limit = grid.request.endRow - grid.request.startRow;
        this.pagination.conditionalCriteria = [
          { columnName: 'calcTotalRecords', operator: '=', value: 'true' },
          { columnName: 'orderBy', operator: '=', value: 'updated_date' },
          { columnName: 'order', operator: '=', value: 'DESC' },
          { columnName: 'guids', operator: '=',
            value: this.SQLGuids ? this.SQLGuids.slice(grid.request.startRow, grid.request.endRow).toString() : ''
          }
        ];
        this.subs.sink = this.siService.getByCriteria(this.pagination, apiVisa).pipe(
          mergeMap(b => {
            const source: Observable<GenericDocContainerModel>[] = [];
            b.data.forEach( doc => source.push(
              zip(
                this.brnchService.getByGuid(doc.bl_fi_generic_doc_hdr.guid_branch.toString(), apiVisa).pipe(
                  catchError((err) => of(err))
                ),
                this.customerService.getByGuid(doc.bl_fi_generic_doc_hdr.doc_entity_hdr_guid.toString(), apiVisa).pipe(
                  catchError((err) => of(err))
                ),
                this.profileService.getProfileName(apiVisa, doc.bl_fi_generic_doc_hdr.created_by_subject_guid.toString()).pipe(
                  catchError((err) => of(err))
                ),
                // some sales return has sales agent info in entity hdr json and some has info in property json, depending on whether the return was created using Kamal style code or Qureshi style code
               this.empService.getByGuid(doc.bl_fi_generic_doc_hdr.property_json ? doc.bl_fi_generic_doc_hdr.property_json.salesAgent.salesAgentGuid.toString() : (<any>doc.bl_fi_generic_doc_hdr.doc_entity_hdr_json).salesAgent.toString(), apiVisa).pipe(
                  catchError((err) => of(err)))
                ).pipe(
                  map(([b_a, b_b, b_c, b_d]) => {
                    doc = Object.assign({
                      // docNo: doc.bl_fi_generic_doc_hdr.server_doc_1,
                      branch_name: b_a.error ? b_a.error.code : b_a.data.bl_fi_mst_branch.name,
                      customer_name: b_b.error ? b_b.error.code : b_b.data.bl_fi_mst_entity_hdr.name,
                      created_by_name: b_c.error? b_c.error.code: b_c.data,
                      sales_agent: b_d.error? b_d.error.code: b_d.data.bl_fi_mst_entity_hdr.name
                    }, doc);
                    return doc;
                  })
                )
              )
            );
            return iif(() => b.data.length > 0,
              forkJoin(source).pipe(map((b_inner) => {
                b.data = b_inner;
                return b
              })),
              of(b)
            );
          })
        ).subscribe(resolved => {
          this.store.dispatch(SalesReturnActions.loadSalesReturnSuccess({ totalRecords: resolved.totalRecords }));
          const data = sortOn(resolved.data).filter(entity => filter.by(entity));
          const totalRecords = filter.isFiltering ? (this.SQLGuids ? this.SQLGuids.length : resolved.totalRecords) : data.length;
          grid.success({
            rowData: data,
            rowCount: totalRecords
          });
          this.gridApi.forEachNode(a => {
            if (a.data.bl_fi_generic_doc_hdr.guid === this.localState.selectedRow) {
              a.setSelected(true);
            }
          });
        }, err => {
          this.store.dispatch(SalesReturnActions.loadSalesReturnFailed({ error: err.message }));
          grid.fail();
        });
      }
    };
    this.gridApi.setServerSideDatasource(datasource);
    this.subs.sink = this.store.select(SalesReturnSelectors.selectAgGrid).subscribe( a => {
      if (a) {
        this.gridApi.refreshServerSideStore({ purge: true });
        this.store.dispatch(SalesReturnActions.resetAgGrid());
      }
    });
  }

  onToggle(e: boolean) {
    this.viewColFacade.toggleColumn(e);
  }

  onSearch(e: SearchQueryModel) {
    if (!e.isEmpty) {
      const sql = {
        subquery: e.queryString,
        table: e.table
      };
      this.subs.sink = this.subQueryService.post(sql, AppConfig.apiVisa).subscribe({ next: resolve => {
        this.SQLGuids = resolve.data;
        this.paginationComp.firstPage();
        this.gridApi.refreshServerSideStore();
      }});
    } else {
      this.SQLGuids = null;
      this.paginationComp.firstPage();
      this.gridApi.refreshServerSideStore();
    }
  }

  onAdd() {
    this.store.dispatch(SalesReturnActions.resetDraft());
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState, deactivateAdd: true, deactivateList: true
    });
    this.viewColFacade.onNextAndReset(this.index, 1);
  }

  onRowClicked(entity: GenericDocContainerModel) {
    if (entity && !this.localState.deactivateList) {
      const genDoc = { ...entity };
      delete genDoc['branch_name'];
      delete genDoc['customer_name'];
      delete genDoc['created_by_name'];
      delete genDoc['sales_agent'];
      // this one action points to many reducer functions instead of firing many actions
      this.store.dispatch(SalesReturnActions.selectReturnForEdit({ genDoc }));  
      this.viewColFacade.updateInstance(this.index, {
        ...this.localState,
        deactivateAdd: true,
        deactivateList: false,
        selectedRow: entity.bl_fi_generic_doc_hdr.guid
      });
      this.viewColFacade.onNextAndReset(this.index, 2);  
    }
  }

  onPostToFinal(){
    let selectedRows = this.gridApi.getSelectedRows();
    let arr = [];
    const json = {posting_status: "FINAL"};
    console.log("selected rows: ", selectedRows);
    selectedRows.map((row) => {
      arr.push(row);
    })
    arr = arr.filter((x) => x.bl_fi_generic_doc_hdr.posting_status != "FINAL");
    arr.map(
      cont => {
        let temp: GenericDocContainerModel = {
          bl_fi_generic_doc_hdr: cont.bl_fi_generic_doc_hdr,
          bl_fi_generic_doc_event: cont.bl_fi_generic_doc_event,
          bl_fi_generic_doc_ext: cont.bl_fi_generic_doc_ext,
          bl_fi_generic_doc_link: cont.bl_fi_generic_doc_link,
          bl_fi_generic_doc_line: cont.bl_fi_generic_doc_line
        };
        this.store.dispatch(SalesReturnActions.updatePostingStatusInit({status: json, doc: temp}));
      }
    )
    this.gridApi.refreshServerSideStore();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}