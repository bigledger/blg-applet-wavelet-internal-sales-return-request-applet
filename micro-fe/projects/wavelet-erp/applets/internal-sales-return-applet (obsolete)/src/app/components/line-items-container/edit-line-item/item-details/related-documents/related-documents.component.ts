import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { bl_fi_generic_doc_line_RowClass, BranchService, GenericDocContainerModel, GenericDocHdrService } from 'blg-akaun-ts-lib';
import { AppConfig } from 'projects/shared-utilities/visa';
import { combineLatest, forkJoin, Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { LineItemSelectors } from '../../../../../state-controllers/line-item-controller/store/selectors';
import { LineItemStates } from '../../../../../state-controllers/line-item-controller/store/states';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-item-details-related-documents',
  templateUrl: './related-documents.component.html',
  styleUrls: ['./related-documents.component.scss']
})
export class EditLineItemDetailsRelatedDocumentsComponent implements OnInit, OnDestroy {

  protected subs = new SubSink();

  lineItem$ = this.store.select(LineItemSelectors.selectLineItem);
  order$ = this.store.select(LineItemSelectors.selectOrder);
  
  lineItem: bl_fi_generic_doc_line_RowClass;
  order: GenericDocContainerModel;
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
    { headerName: 'Date', field: 'bl_fi_generic_doc_hdr.created_date', type: 'rightAligned',
      valueFormatter: params => moment(params.value).format('YYYY-MM-DD') }
  ];

  constructor(
    protected readonly store: Store<LineItemStates>,
    private genDocHdrService: GenericDocHdrService,
    private brnchService: BranchService) { }

  ngOnInit() {
    this.subs.sink = this.lineItem$.subscribe({ next: resolve => this.lineItem =  resolve });
    this.subs.sink = this.order$.subscribe({ next: resolve => this.order = resolve });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.setGridData();
  }

  // setGridData() {
  //   const datasource = {
  //     getRows: grid => {
  //       this.subs.sink = combineLatest([this.lineItem$, this.order$]).pipe(
  //         mergeMap(([a, b]) => {
  //           const source: Observable<any>[] = []
  //           let match = false;
  //           b.bl_fi_generic_doc_link.forEach(link => {
  //             if (link.guid_doc_2_line === a.guid) {
  //               match = true;
  //               source.push(
  //                 this.genDocHdrService.getByGuid(link.guid_doc_1_hdr.toString(), this.apiVisa).pipe(
  //                   map(b => b.data),
  //                   exhaustMap(c => this.brnchService.getByGuid(c.bl_fi_generic_doc_hdr.guid_branch.toString(), this.apiVisa).pipe(
  //                     map(c_inner => Object.assign({ branchName: c_inner.data.bl_fi_mst_branch.name }, c))
  //                   ))
  //                 )
  //               )
  //             }
  //           });
  //           return iif(() => match,
  //             forkJoin(source).pipe(map((b_inner) => {
  //               const some = b_inner
  //               return some;
  //             })),
  //             of([])
  //           );
  //         })
  //       ).subscribe(resolved => {
  //         console.log(resolved);
  //         grid.success({
  //           rowData: resolved,
  //           rowCount: resolved.length
  //         });
  //       }, err => {
  //         grid.fail();
  //         console.log(err);
  //       });
  //     }
  //   }
  //   this.gridApi.setServerSideDatasource(datasource);
    
  // }

  setGridData() {
    const datasource = {
      getRows: grid => {
        const source: Observable<any>[] = []
        let match = false;
        this.order.bl_fi_generic_doc_link.forEach(link => {
          match = true;
          if (link.guid_doc_2_line === this.lineItem.guid) {
            source.push(
              this.genDocHdrService.getByGuid(link.guid_doc_1_hdr.toString(), this.apiVisa).pipe(
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
    this.subs.sink = combineLatest([this.lineItem$, this.order$]).subscribe(([a, b]) => {
      if (a || b) {
        this.gridApi.refreshServerSideStore({ purge: true });
      }
    })
  }

  onRowClicked(e: bl_fi_generic_doc_line_RowClass) {
    // this.lineItem.emit(e);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}