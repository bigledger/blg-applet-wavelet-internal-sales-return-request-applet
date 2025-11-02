import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from '../../../../../facades/view-column.facade';
import { salesReturnSearchModel } from '../../../../../models/advanced-search-models/internal-sales-return.model';
import { formatMoneyInList } from 'projects/shared-utilities/format.utils';
import { Pagination, BranchService, GenericDocContainerModel, GenericDocAllService, bl_fi_generic_doc_hdr_RowClass } from 'blg-akaun-ts-lib';
import * as moment from 'moment';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { forkJoin, iif, Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppConfig } from 'projects/shared-utilities/visa';
import { DraftStates } from '../../../../../state-controllers/draft-controller/store/states';
import { HDRSelectors } from '../../../../../state-controllers/draft-controller/store/selectors';
import { SalesReturnStates } from '../../../../../state-controllers/sales-return-controller/store/states';
import { SalesReturnActions } from '../../../../../state-controllers/sales-return-controller/store/actions';

interface LocalState {
  deactivateReturn: boolean;
  deactivateList: boolean;
}

@Component({
  selector: 'app-sales-return-contra-select-document',
  templateUrl: './contra-select-document.component.html',
  styleUrls: ['./contra-select-document.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class ContraSelectDocumentComponent extends ViewColumnComponent {

  protected subs = new SubSink();

  protected compName = 'Select Contra';
  protected readonly index = 14;
  protected localState: LocalState;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateReturn$ = this.componentStore.select(state => state.deactivateReturn);
  readonly deactivateList$ = this.componentStore.select(state => state.deactivateList);

  prevIndex: number;
  protected prevLocalState: any;

  searchModel = salesReturnSearchModel;

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
    {headerName: 'Branch', field: 'bl_fi_generic_doc_hdr.code_branch', cellStyle: () => ({'text-align': 'left'})},
    {headerName: 'Server Doc Type', field: 'bl_fi_generic_doc_hdr.server_doc_type', cellStyle: () => ({'text-align': 'left'})},
    {headerName: 'Status', field: 'bl_fi_generic_doc_hdr.status', cellStyle: () => ({'text-align': 'left'})},
    {headerName: 'AR AP Bal', field: 'bl_fi_generic_doc_hdr.arap_bal', type: 'numericColumn',
    valueFormatter: params => formatMoneyInList(params.value)},
    {headerName: 'Date', field: 'bl_fi_generic_doc_hdr.date_created', type: 'rightAligned',
    valueFormatter: params => moment(params.value).format('YYYY-MM-DD')},
  ];

  hdr: bl_fi_generic_doc_hdr_RowClass;

  constructor(
    private viewColFacade: ViewColumnFacade,
    private genDocAllService: GenericDocAllService,
    private brnchService: BranchService,
    private readonly store: Store<SalesReturnStates>,
    private readonly draftStore: Store<DraftStates>,
    protected readonly componentStore: ComponentStore<LocalState>) {
    super();
  }

  ngOnInit() {
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.subs.sink = this.localState$.subscribe( a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
    this.subs.sink = this.draftStore.select(HDRSelectors.selectHdr).subscribe({next: resolve => this.hdr = resolve})
  }

  onGridReady(params) {
    const apiVisa = AppConfig.apiVisa;
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    const datasource = {
      getRows: grid => {
        this.subs.sink = this.genDocAllService.getByCriteria(new Pagination(
          grid.request.startRow, grid.request.endRow - grid.request.startRow, [
          {columnName: 'calcTotalRecords', operator: '=', value: 'true'},
          {columnName: 'status', operator: '=', value: 'ACTIVE'},
          {columnName: 'doc_entity_hdr_guid', operator: '=',   value: this.hdr.doc_entity_hdr_guid.toString()},
        ]), apiVisa).pipe(
          mergeMap(b => {
            const source: Observable<GenericDocContainerModel>[] = [];
            b.data.forEach( doc => source.push(
              forkJoin([
                this.brnchService.getByGuid(doc.bl_fi_generic_doc_hdr.guid_branch.toString(), apiVisa).pipe(
                  catchError((err) => of(err))
                )]).pipe(
                  map(([b_a]) => {
                    doc.bl_fi_generic_doc_hdr.code_branch = b_a.error ? b_a.error.code : b_a.data.bl_fi_mst_branch.code;
                    return doc;
                  })
                )
            ));
            return iif(() => b.data.length > 0,
              forkJoin(source).pipe(map((b_inner) => {
                b.data = b_inner;
                return b;
              })),
              of(b)
            );
          })
        ).subscribe( resolved => {
          grid.success({
            rowData: resolved.data,
            rowCount: resolved.totalRecords
          });
        }, err => {
          grid.fail();
        });
      }
    };
    this.gridApi.setServerSideDatasource(datasource);
  }

  onToggle(e: boolean) {
    this.viewColFacade.toggleColumn(e);
  }

  onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateReturn: false,
      deactivateAddContra: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  onRowClicked(contraDoc: GenericDocContainerModel) {
    if (contraDoc) {
      this.store.dispatch(SalesReturnActions.selectContraDoc({ contraDoc }));
      if (!this.localState.deactivateList) {
        this.viewColFacade.updateInstance<LocalState>(this.index, {
          ...this.localState, deactivateList: true, deactivateReturn: true
        });
        this.viewColFacade.onNextAndReset(this.index, 16);
      }
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}