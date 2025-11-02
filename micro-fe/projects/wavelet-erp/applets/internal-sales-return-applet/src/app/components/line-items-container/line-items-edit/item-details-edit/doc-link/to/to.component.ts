import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { bl_fi_generic_doc_line_RowClass, BranchService, GenericDocContainerModel, GenericDocHdrService } from 'blg-akaun-ts-lib';
import * as moment from 'moment';
import { AppConfig } from 'projects/shared-utilities/visa';
import { LineItemSelectors } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/line-item-controller/store/selectors';
import { LineItemStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/line-item-controller/store/states';
import { combineLatest, forkJoin, Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { SubSink } from 'subsink2';


@Component({
  selector: 'app-edit-item-details-doc-link-to',
  templateUrl: './to.component.html',
  styleUrls: ['./to.component.scss']
})
export class EditLineItemDetailsDocLinkToComponent implements OnInit, OnDestroy {

  protected subs = new SubSink();

  readonly lineItem$ = this.store.select(LineItemSelectors.selectLineItem);
  readonly SalesReturn$ = this.store.select(LineItemSelectors.selectSalesReturn);

  lineItem: bl_fi_generic_doc_line_RowClass;
  SalesReturn: GenericDocContainerModel;
  gridApi;
  apiVisa = AppConfig.apiVisa;
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
    private readonly store: Store<LineItemStates>,
    private genDocHdrService: GenericDocHdrService,
    private brnchService: BranchService,
  ) { }

  ngOnInit() {
    this.subs.sink = this.lineItem$.subscribe({ next: resolve => this.lineItem = resolve });
    this.subs.sink = this.SalesReturn$.subscribe({ next: resolve => this.SalesReturn = resolve });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.setGridData();
  }

  setGridData() {
    const datasource = {
      getRows: grid => {
        const source: Observable<any>[] = []
        let match = false;
        this.SalesReturn.bl_fi_generic_doc_link.forEach(link => {
          match = true;
          if (link.guid_doc_1_line === this.lineItem.guid) {
            source.push(
              this.genDocHdrService.getByGuid(link.guid_doc_2_hdr.toString(), this.apiVisa).pipe(
                mergeMap(a =>
                  forkJoin([this.brnchService.getByGuid(a.data.bl_fi_generic_doc_hdr.guid_branch.toString(), this.apiVisa).pipe(
                    catchError((err) => of(err))
                  )]).pipe(
                    map(([c]) => Object.assign({ branchName: c.data.bl_fi_mst_branch.name }, a.data))
                  )
                )
              )
            )
          }
        })
        if (match) {
          this.subs.sink = forkJoin(source).subscribe(resolved => {
            grid.success({
              rowData: resolved,
              rowCount: resolved.length
            });
          })
        } else {
          grid.success({
            rowData: [],
            rowCount: 0
          });
        }
      }
    }
    this.gridApi.setServerSideDatasource(datasource);
    this.subs.sink = combineLatest([this.lineItem$, this.SalesReturn$]).subscribe(([a, b]) => {
      if (a || b) {
        this.gridApi.refreshServerSideStore({ purge: true });
      }
    })
  }

  onNext() {
    // this.next.emit();
  }

  onRowClicked(e: bl_fi_generic_doc_line_RowClass) {
    // this.lineItem.emit(e);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
