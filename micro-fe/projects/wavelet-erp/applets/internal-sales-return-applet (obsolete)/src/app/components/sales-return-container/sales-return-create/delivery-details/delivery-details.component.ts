import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { bl_fi_generic_doc_hdr_RowClass, bl_fi_generic_doc_line_RowClass, DriverHdrService, JobDocHdrLinkService, JobDocLineLinkService, JobHdrService, Pagination, TripHdrService, VehicleHdrService } from 'blg-akaun-ts-lib';
import { pageFiltering, pageSorting } from 'projects/shared-utilities/listing.utils';
import { PaginationComponent } from 'projects/shared-utilities/utilities/pagination/pagination.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { forkJoin, iif, Observable, of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { salesReturnSearchModel } from '../../../../models/advanced-search-models/internal-sales-return.model';
import { SalesReturnStates } from '../../../../state-controllers/sales-return-controller/store/states';
import * as moment from 'moment';

@Component({
  selector: 'app-sales-return-delivery-details',
  templateUrl: './delivery-details.component.html',
  styleUrls: ['./delivery-details.component.scss'],
})
export class DeliveryDetailsComponent implements OnInit, OnDestroy {

  @Input() draft$: Observable<bl_fi_generic_doc_hdr_RowClass>;
  
  protected subs = new SubSink();

  searchModel = salesReturnSearchModel;
  gridApi;
  rowData = [];
  pagination = new Pagination();
  hdrGuid;
  
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
    { headerName: 'Trip No', field: 'trip_no', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Driver Name', field: 'driver_name', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Vehicle No', field: 'vehicle_no', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Job Start Date', field: 'job_start_date', type: 'rightAligned',
      valueFormatter: params => moment(params.value).format('YYYY-MM-DD HH:mm:ss') },
    { headerName: 'Job End Date', field: 'job_end_date', type: 'rightAligned',
      valueFormatter: params => moment(params.value).format('YYYY-MM-DD HH:mm:ss') },
    { headerName: 'Delivery Status', field: 'bl_del_job_dochdr_link.delivery_status', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Recipient Name', field: 'bl_del_job_dochdr_link.recipient_name', cellStyle: () => ({ 'text-align': 'left' }) },
    // { headerName: 'Qty', field: 'bl_del_job_docline_link.quantity', type: 'numericColumn' },
  ];
  
  @ViewChild(PaginationComponent) paginationComp: PaginationComponent;
  
  constructor(
    private readonly store: Store<SalesReturnStates>,
    private jobDocLineLinkService: JobDocLineLinkService,
    private jobDocHdrLinkService: JobDocHdrLinkService,
    private jobHdrService: JobHdrService,
    private tripHdrService: TripHdrService,
    private driverHdrService: DriverHdrService,
    private vehicleHdrService: VehicleHdrService) { 
  }

  ngOnInit() {
    this.subs.sink = this.draft$.subscribe({ next: resolve => this.hdrGuid = resolve.guid });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    if (this.hdrGuid) {
      this.setGridData();
    }
  }

  setGridData() {
    const apiVisa = AppConfig.apiVisa;   
    // this.hdrGuid = 'd9ff854d-c638-4c3b-95fe-3cfaa2706812';
    const datasource = {
      getRows: grid => {
        const filter = pageFiltering(grid.request.filterModel);
        const sortOn = pageSorting(grid.request.sortModel);
        this.pagination.offset = grid.request.startRow;
        this.pagination.limit = grid.request.endRow - grid.request.startRow;
        this.pagination.conditionalCriteria = [
          { columnName: 'calcTotalRecords', operator: '=', value: 'true' },
          // { columnName: 'orderBy', operator: '=', value: 'date_updated' },
          // { columnName: 'order', operator: '=', value: 'DESC' },
          { columnName: 'guid_doc_hdr', operator: '=', value: this.hdrGuid },
        ];
        // need to supply list of generic doc line guid's
        this.subs.sink = this.jobDocHdrLinkService.getByCriteria(this.pagination, apiVisa).pipe(
          mergeMap(b => {
            const source: Observable<any>[] = [];
            b.data.forEach(doc => source.push(
              this.jobHdrService.getByGuid(doc.bl_del_job_dochdr_link.hdr_guid.toString(), apiVisa).pipe(
                catchError((err) => of(err)),
                map(b => Object.assign({
                  guid_trip_hdr: b.error ? b.error.code : b.data.bl_del_job_hdr.guid_trip_hdr,
                  job_start_date: b.error ? b.error.code : b.data.bl_del_job_hdr.start_time,
                  job_end_date: b.error ? b.error.code : b.data.bl_del_job_hdr.end_time
                }, doc)),
                exhaustMap(c => this.tripHdrService.getByGuid(c.guid_trip_hdr.toString(), apiVisa).pipe(
                  catchError((err) => of(err)),
                  map(c_inner => Object.assign({
                    trip_no: c_inner.error ? c_inner.error.code : c_inner.data.bl_del_trip_hdr.code,
                    driver_guid: c_inner.error ? c_inner.error.code : c_inner.data.bl_del_trip_hdr.guid_driver_hdr,
                    vehicle_guid: c_inner.error ? c_inner.error.code : c_inner.data.bl_del_trip_hdr.guid_vehicle_hdr,
                  }, c)),
                  exhaustMap(d => this.driverHdrService.getByGuid(d.driver_guid.toString(), apiVisa).pipe(
                    catchError((err) => of(err)),
                    map(d_inner => Object.assign({
                      driver_name: d_inner.error ? d_inner.error.code : d_inner.data.bl_del_driver_hdr.name,
                    }, d))
                  )),
                  exhaustMap(e => this.vehicleHdrService.getByGuid(e.vehicle_guid.toString(), apiVisa).pipe(
                    catchError((err) => of(err)),
                    map(e_inner => Object.assign({
                      vehicle_no: e_inner.error ? e_inner.error.code : e_inner.data.bl_del_vehicle_hdr.reg_plate,
                    }, e))
                  ))
                ))
              ),   
            ));
            return iif(() => b.data.length > 0,
              forkJoin(source).pipe(map((b_inner) => {
                b.data = b_inner;
                return b
              })),
              of(b)
            );
          })
        ).subscribe(resolved => {
          const data = sortOn(resolved.data).filter(entity => filter.by(entity));
          const totalRecords = filter.isFiltering ? resolved.totalRecords : data.length;
          grid.success({
            rowData: data,
            rowCount: totalRecords
          });
        })
      }
    };
    this.gridApi.setServerSideDatasource(datasource);
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