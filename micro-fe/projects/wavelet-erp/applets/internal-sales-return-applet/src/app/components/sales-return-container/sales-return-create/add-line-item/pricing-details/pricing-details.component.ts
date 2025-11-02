import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { bl_fi_generic_doc_ext_RowClass, Pagination, PricingSchemeService } from 'blg-akaun-ts-lib';
import * as moment from 'moment';
import { AppConfig } from 'projects/shared-utilities/visa';
import { SubSink } from 'subsink2';
import { InternalSalesReturnStates } from '../../../../../state-controllers/internal-sales-return-controller/store/states';

@Component({
  selector: 'app-line-item-pricing-details',
  templateUrl: './pricing-details.component.html',
  styleUrls: ['./pricing-details.component.css']
})
export class LineItemPricingDetailsComponent implements OnInit, OnDestroy {
  protected subs = new SubSink();

  gridApi;
  public uom = new FormControl()
  public pricingScheme = new FormControl()

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilterComponentParams: { suppressFilterButton: true },
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true,
    onCellClicked: (params) => this.onRowClicked(params.data)
  };

  columnsDefs = [
    { headerName: 'Pricing Scheme Code', field: 'bl_fi_mst_pricing_scheme_hdr.code', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Pricing Scheme Name', field: 'bl_fi_mst_pricing_scheme_hdr.name', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Unit Price', field: 'bl_fi_mst_pricing_scheme_hdr.purchase_unit_price', type: 'numericColumn', editable: true },
    {
      headerName: 'Modified Date', field: 'bl_fi_mst_pricing_scheme_hdr.date_updated', type: 'rightAligned',
      valueFormatter: (params) => moment(params.value).format('YYYY-MM-DD')
    },
  ];

  constructor(
    private psService: PricingSchemeService,
    private readonly store: Store<InternalSalesReturnStates>
  ) {
  }

  ngOnInit() {
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.setGridData();
  }

  setGridData(criteria?: any) {
    const apiVisa = AppConfig.apiVisa;
    criteria = (criteria) ? criteria : [
      { columnName: 'calcTotalRecords', operator: '=', value: 'true' },
    ];
    const datasource = {
      getRows: grid => {
        this.subs.sink = this.psService.getByCriteria(new Pagination(grid.request.startRow, grid.request.endRow, criteria), apiVisa)
          .subscribe(resolved => {
            console.log('price_scheme', resolved);
            grid.success({
              rowData: resolved.data,
              rowCount: resolved.totalRecords
            });
          }), err => {
            console.log(err);
          }
      }
    };
    this.gridApi.setServerSideDatasource(datasource);
  }

  onNext() {
    // this.next.emit();
  }

  onRowClicked(e: bl_fi_generic_doc_ext_RowClass) {
    // this.extItem.emit(e);
  }

  onUOMSelected() {
    console.log('test')
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
