import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { bl_fi_generic_doc_line_RowClass, BranchService, GenericDocHdrService } from 'blg-akaun-ts-lib';
import * as moment from 'moment';
import { AppConfig } from 'projects/shared-utilities/visa';
import { LinkSelectors } from '../../../../../../../state-controllers/draft-controller/store/selectors';
import { DraftStates } from '../../../../../../../state-controllers/draft-controller/store/states';
import { SalesReturnSelectors } from '../../../../../../../state-controllers/sales-return-controller/store/selectors';
import { SalesReturnStates } from '../../../../../../../state-controllers/sales-return-controller/store/states';
import { combineLatest, forkJoin, iif, Observable, of } from 'rxjs';
import { exhaustMap, map, mergeMap } from 'rxjs/operators';
import { SubSink } from 'subsink2';


@Component({
  selector: 'app-item-details-related-documents-copy-from',
  templateUrl: './copy-from.component.html',
  styleUrls: ['./copy-from.component.scss']
})
export class RelatedDocumentsCopyFromComponent implements OnInit, OnDestroy {

  protected subs = new SubSink();

  readonly lineItem$ = this.store.select(SalesReturnSelectors.selectLineItem);
  readonly links$ = this.draftStore.select(LinkSelectors.selectAll);

  lineItem: bl_fi_generic_doc_line_RowClass;
  gridApi;
  relatedLinks = [];
  apiVisa = AppConfig.apiVisa
  rowData = [];

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilterComponentParams: { suppressFilterButton: true },
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true,
  };

  columnsDefs = [
    { headerName: 'Doc No', field: 'bl_fi_generic_doc_hdr.server_doc_1', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Branch', field: 'branchName', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Server Doc Type', field: 'bl_fi_generic_doc_hdr.server_doc_type', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Status', field: 'bl_fi_generic_doc_hdr.status', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Date', field: 'bl_fi_generic_doc_hdr.created_date', valueFormatter: params => moment(params.value).format('YYYY-MM-DD') },
  ];

  constructor(
    private readonly store: Store<SalesReturnStates>,
    private readonly draftStore: Store<DraftStates>,
    private genDocHdrService: GenericDocHdrService,
    private brnchService: BranchService) {
  }

  ngOnInit() {
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.setGridData();
  }

  setGridData() {
    const datasource = {
      getRows: grid => {
        this.subs.sink = combineLatest([this.lineItem$, this.links$]).pipe(
          mergeMap(([a, b]) => {
            const source: Observable<any>[] = [];
            let match = false;
            b.forEach(link => {
              if (link.guid_doc_2_line === a.guid) {
                match = true;
                source.push(
                  this.genDocHdrService.getByGuid(link.guid_doc_1_hdr.toString(), this.apiVisa).pipe(
                    map(b => b.data),
                    exhaustMap(c => this.brnchService.getByGuid(c.bl_fi_generic_doc_hdr.guid_branch.toString(), this.apiVisa).pipe(
                      map(c_inner => Object.assign({ branchName: c_inner.data.bl_fi_mst_branch.name }, c))
                    ))
                  )
                )
              }
            });
            return iif(() => match,
              forkJoin(source).pipe(map((b_inner) => {
                b = b_inner;
                return b
              })),
              of([])
            );
          })
        ).subscribe(resolved => {
          console.log("related",resolved);
          grid.success({
            rowData: resolved,
            rowCount: resolved.length
          });
        }, err => {
          console.log(err);
        })
      }
    }
    this.gridApi.setServerSideDatasource(datasource);
  }

  onRowClicked(e) {
    // this.lineItem.emit(e);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
