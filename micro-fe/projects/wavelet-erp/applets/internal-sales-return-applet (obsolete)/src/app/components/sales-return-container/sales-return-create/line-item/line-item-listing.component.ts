import { AfterViewChecked, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { bl_fi_generic_doc_hdr_RowClass, bl_fi_generic_doc_line_RowClass } from 'blg-akaun-ts-lib';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink2';
import { salesReturnSearchModel } from '../../../../models/advanced-search-models/internal-sales-return.model';
import { PNSSelectors } from '../../../../state-controllers/draft-controller/store/selectors';
import { DraftStates } from '../../../../state-controllers/draft-controller/store/states';
import { SalesReturnStates } from '../../../../state-controllers/sales-return-controller/store/states';
import { SlideRendererComponent } from '../../../utilities/slide-renderer/slide-renderer.component';

@Component({
  selector: 'app-sales-return-line-item-listing',
  templateUrl: './line-item-listing.component.html',
  styleUrls: ['./line-item-listing.component.scss'],
})
export class LineItemListingComponent implements OnInit, OnDestroy, AfterViewChecked {

  @Input() localState: any;
  @Input() draft$: Observable<bl_fi_generic_doc_hdr_RowClass>;
  @Output() itemCreate = new EventEmitter();
  @Output() itemEdit = new EventEmitter();

  protected subs = new SubSink();

  pns$ = this.draftStore.select(PNSSelectors.selectAll);
  
  searchModel = salesReturnSearchModel;
  gridApi;
  rowData: bl_fi_generic_doc_line_RowClass[];
  total = '0.00';
  tax = '0.00';

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
    { headerName: 'Item Code', field: 'item_code', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true },
    { headerName: 'Item Name', field: 'item_name', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true },
    { headerName: 'UOM', field: 'item_property_json.uom', cellStyle: () => ({ 'text-align': 'left '}), floatingFilter: true },
    { headerName: 'Delivery', field: 'delivery', cellRenderer: 'slideCellRenderer',
      onCellClicked: (params) => null},
    { headerName: 'Qty', field: 'quantity_base', type: 'numericColumn', floatingFilter: true },
    { headerName: 'Unit Price', field: 'item_property_json.unitPrice', type: 'numericColumn', floatingFilter: true },
    { headerName: 'SST/VAT/GST', field: 'amount_tax_gst', type: 'numericColumn',
      valueFormatter: (params) => parseFloat(params.value).toFixed(2), floatingFilter: true },
    { headerName: 'Txn Amount', field: 'amount_txn', type: 'numericColumn',
      valueFormatter: (params) => parseFloat(params.value).toFixed(2), floatingFilter: true },
  ];

  frameworkComponents = {
    slideCellRenderer: SlideRendererComponent,
  };

  constructor(
    protected readonly draftStore: Store<DraftStates>,
    protected readonly store: Store<SalesReturnStates>) {
  }

  ngOnInit() {
    this.subs.sink = this.pns$.subscribe({ next: resolve => {
      this.rowData = resolve.filter(x => x.status === 'ACTIVE');
    }})
  }

  ngAfterViewChecked() {
    this.total = this.rowData.length ? this.rowData.map(r =>
      parseFloat(r.amount_txn?.toString())).reduce((acc, c) =>
      (acc + c)).toFixed(2) : '0.00';
    if (this.total === 'NaN') {
      this.total = '0.00';
    }
    this.tax = this.rowData.length ? this.rowData.map(r =>
      parseFloat(r.amount_tax_gst?.toString())).reduce((acc, c) =>
      (acc + c)).toFixed(2) : '0.00';
    if (this.tax === 'NaN') {
      this.tax = '0.00';
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
    this.itemCreate.emit();
  }

  onRowClicked(item: bl_fi_generic_doc_line_RowClass) {
    this.itemEdit.emit(item);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();  
  }

}