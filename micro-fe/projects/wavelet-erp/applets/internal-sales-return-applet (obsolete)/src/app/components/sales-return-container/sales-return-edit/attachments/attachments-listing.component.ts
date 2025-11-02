import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { bl_fi_generic_doc_ext_RowClass } from 'blg-akaun-ts-lib';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { SalesReturnSelectors } from '../../../../state-controllers/sales-return-controller/store/selectors';
import { SalesReturnStates } from '../../../../state-controllers/sales-return-controller/store/states';

@Component({
  selector: 'app-sales-return-attachments-listing',
  templateUrl: './attachments-listing.component.html',
  styleUrls: ['./attachments-listing.component.scss']
})
export class AttachmentsListingComponent implements OnInit, OnDestroy {

  @Input() localState: any;
  @Output() addAttachment = new EventEmitter();
  // @Output() extItem = new EventEmitter<bl_fi_generic_doc_ext_RowClass>();

  protected subs = new SubSink();

  attachments$ = this.store.select(SalesReturnSelectors.selectReturn).pipe(
    map(a => a.bl_fi_generic_doc_ext.filter(x => x.param_code === 'GEN_DOC_FILE'))
  );

  gridApi;
  rowData = [];
  depositUsed = new FormControl();
  usedCreditMemo = new FormControl();

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilterComponentParams: {suppressFilterButton: true},
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true,
    onCellClicked: (params) => this.onRowClicked(params.data)
  };

  columnsDefs = [
    { headerName: 'File Name', field: 'property_json.fileName', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Size', field: 'property_json.size', type: 'rightAligned' },
    { headerName: 'Uploaded Date', field: 'created_date', type: 'rightAligned', 
      valueFormatter: (params) => moment(params.value).format('YYYY-MM-DD') },
    // { headerName: 'Uploaded By', field: 'created_by_subject_guid', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Uploaded By', field: '', cellStyle: () => ({ 'text-align': 'left' }) },
  ];

  constructor(protected readonly store: Store<SalesReturnStates>) { }
 
  ngOnInit() {
    this.subs.sink = this.attachments$.subscribe({ next: resolve => {
      this.rowData = resolve;
    }})
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
  }

  onNext() {
    this.addAttachment.emit();
  }

  onRowClicked(e: bl_fi_generic_doc_ext_RowClass) {
    // this.extItem.emit(e);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}