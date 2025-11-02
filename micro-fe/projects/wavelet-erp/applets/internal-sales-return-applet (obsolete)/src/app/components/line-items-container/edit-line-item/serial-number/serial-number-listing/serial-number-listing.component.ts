import { Component, EventEmitter, OnDestroy, OnInit, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { bl_fi_generic_doc_hdr_RowClass, InvSerialNumberService, Pagination } from 'blg-akaun-ts-lib';
import { AppConfig } from 'projects/shared-utilities/visa';
import { PaginationComponent } from 'projects/shared-utilities/utilities/pagination/pagination.component';
import { pageFiltering, pageSorting } from 'projects/shared-utilities/listing.utils';

@Component({
  selector: 'app-edit-serial-number-listing',
  templateUrl: './serial-number-listing.component.html',
  styleUrls: ['./serial-number-listing.component.scss'],
  providers: [ComponentStore]
})
export class EditLineItemSerialNumberListingComponent implements OnInit, OnDestroy {

  @Input() return$: Observable<bl_fi_generic_doc_hdr_RowClass>;
  @Input() invItem$: Observable<any>;
  @Input() serialNumbers: string[];
  @Output() serialNumberList = new EventEmitter<string>();

  private subs = new SubSink();

  gridApi;
  rowData = [];
  // existingNumbers: string[];
  invItemGuid: string;
  locationGuid: string;
  existingSerialNumbers: string[];
  @ViewChild(PaginationComponent) paginationComp: PaginationComponent;

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
    { headerName: 'SN Type', field: 'sn_type', cellStyle: () => ({ 'text-align': 'left' }), checkboxSelection: true, floatingFilter: true },
    { headerName: 'SN ID', field: 'sn_id', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true },
    { headerName: 'SN Description', field: 'sn_description', cellStyle: () => ({ 'text-align': 'left' }), floatingFilter: true },
  ];

  constructor(
    private snService: InvSerialNumberService) {
  }

  ngOnInit() {}

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.invItem$.pipe(
      withLatestFrom(this.return$)
    ).subscribe(([inv, hdr]) => {
      if (inv && hdr.guid_store) {
        this.invItemGuid = inv;
        this.locationGuid = hdr.guid_store.toString();
        this.setGridData();
      }
    });
  }

  setGridData() {
    const apiVisa = AppConfig.apiVisa;
    const datasource = {
      getRows: grid => {
        const filter = pageFiltering(grid.request.filterModel);
        const sortOn = pageSorting(grid.request.sortModel);
        let page = new Pagination();
        page.conditionalCriteria = [
          { columnName: 'hdr_item_guid', operator: '=', value: this.invItemGuid },
          { columnName: 'location_guid', operator: '=', value: this.locationGuid },
        ];
        this.snService.getByCriteria(page, apiVisa).subscribe(
          {next: (resolve: any) => {
            this.existingSerialNumbers = resolve.data.map(a => a.bl_inv_serial_number_hdr.sn_id);
            const data = sortOn(resolve.data).map(serial => serial.bl_inv_serial_number_hdr).filter(sn => !this.serialNumbers.includes(sn.sn_id)).filter(o => filter.by(o));
            const totalRecords = data.length;
            grid.success({
              rowData: data,
              rowCount: totalRecords
            });
          }}
        )
      }
    };
    this.gridApi.deselectAll();
    this.gridApi.setServerSideDatasource(datasource);
  }

  onAdd() {
    const selected = this.gridApi.getSelectedNodes();
    selected
      .map(row => row.data)
      .forEach(serial => {
        this.serialNumberList.emit(serial.sn_id);
      });
    this.setGridData();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}