import { AfterViewChecked, Component, EventEmitter, Input, Output } from '@angular/core';
import { bl_fi_generic_doc_hdr_RowClass, bl_fi_generic_doc_line_RowClass } from 'blg-akaun-ts-lib';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { SubSink } from 'subsink2';
import { salesReturnSearchModel } from '../../../../models/advanced-search-models/internal-sales-return.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { DraftStates } from '../../../../state-controllers/draft-controller/store/states';
import { PaymentSelectors, PNSSelectors } from '../../../../state-controllers/draft-controller/store/selectors';
import * as moment from 'moment';

@Component({
  selector: 'app-sales-return-payment-listing',
  templateUrl: './payment-listing.component.html',
  styleUrls: ['./payment-listing.component.scss']
})
export class PaymentListingComponent extends ViewColumnComponent implements AfterViewChecked {

  @Input() localState: any;
  @Input() draft$: Observable<bl_fi_generic_doc_hdr_RowClass>;
  @Output() paymentCreate = new EventEmitter();
  @Output() paymentEdit = new EventEmitter();

  protected subs = new SubSink();
  
  pns$ = this.draftStore.select(PNSSelectors.selectAll);
  payment$ = this.draftStore.select(PaymentSelectors.selectAll);

  gridApi;
  searchModel = salesReturnSearchModel;
  pns: bl_fi_generic_doc_line_RowClass[];
  rowData: bl_fi_generic_doc_line_RowClass[];

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilterComponentParams: {suppressFilterButton: true},
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true,
  };

  columnsDefs = [
    { headerName: 'Date', field: 'date_txn', type: 'rightAligned',
      valueFormatter: (params) => moment(params.value).format('YYYY-MM-DD'), floatingFilter: true },
    { headerName: 'Amount', field: 'amount_net', type: 'numericColumn', floatingFilter: true,
      valueFormatter: (params) => typeof(params.value) === 'number' ? params.value.toFixed(2) : params.value },
    { headerName: 'Details', field: 'item_name', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true },
    { headerName: 'Remarks', field: 'item_remarks', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true },
  ];

  total = '0.00';
  outstanding = '0.00';

  constructor(
    protected readonly draftStore: Store<DraftStates>) {
    super();
  }

  ngOnInit() {
    this.subs.sink = this.pns$.subscribe({ next: resolve => {
      this.pns = resolve.filter(x => x.status ==='ACTIVE');
    }})
    this.subs.sink = this.payment$.subscribe({ next: resolve => {
      this.rowData = resolve.filter(x => x.status ==='ACTIVE');
    }})
  }

  ngAfterViewChecked() {
    this.total = this.rowData.length ? this.rowData.map(r =>
      parseFloat(r.amount_txn?.toString())).reduce((acc, c) =>
      (acc + c)).toFixed(2) : '0.00';
    if (this.total === 'NaN') {
      this.total = '0.00';
    }
    const debt = this.pns.length ? this.pns.map(r =>
      parseFloat(r.amount_txn?.toString())).reduce((acc, c) =>
      (acc + c)).toFixed(2) : '0.00';
    this.outstanding = (parseFloat(debt) - parseFloat(this.total)).toFixed(2);
    if (this.outstanding === 'NaN') {
      this.outstanding = '0.00';
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.gridApi.forEachNode(a => {
      if (a.data.guid === this.localState.selectedLine) {
        a.setSelected(true);
      }
    });
  }

  onNext() {
    this.paymentCreate.emit();
  }

  onRowClicked(payment: bl_fi_generic_doc_line_RowClass) {
    this.paymentEdit.emit(payment);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();  
  }

}