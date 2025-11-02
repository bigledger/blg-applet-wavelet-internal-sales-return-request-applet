import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { bl_fi_generic_doc_line_RowClass, JobDocLineLinkService, JobDocHdrLinkService, JobHdrService, TripHdrService, DriverHdrService, VehicleHdrService, Pagination } from 'blg-akaun-ts-lib';
import { pageFiltering, pageSorting } from 'projects/shared-utilities/listing.utils';
import { PaginationComponent } from 'projects/shared-utilities/utilities/pagination/pagination.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { forkJoin, iif, Observable, of, zip } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { LineItemSelectors } from '../../../../../state-controllers/line-item-controller/store/selectors';
import { LineItemStates } from '../../../../../state-controllers/line-item-controller/store/states';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-item-details-delivery-details',
  templateUrl: './delivery-details.component.html',
  styleUrls: ['./delivery-details.component.scss']
})
export class EditLineItemDetailsDeliveryDetailsComponent implements OnInit, OnDestroy {

  protected subs = new SubSink();
  
  lineItem$ = this.store.select(LineItemSelectors.selectLineItem);
  
  gridApi;
  lineGuid;
  rowData = [];
  pagination = new Pagination();

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
    { headerName: 'Delivery Status', field: 'delivery_status', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Recipient Name', field: 'recipient_name', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Qty', field: 'bl_del_job_docline_link.quantity', type: 'numericColumn' },
  ];

  @ViewChild(PaginationComponent) paginationComp: PaginationComponent;

  constructor(
    private readonly store: Store<LineItemStates>,
    private jobDocLineLinkService: JobDocLineLinkService,
    private jobDocHdrLinkService: JobDocHdrLinkService,
    private jobHdrService: JobHdrService,
    private tripHdrService: TripHdrService,
    private driverHdrService: DriverHdrService,
    private vehicleHdrService: VehicleHdrService) { 
  }

  ngOnInit() {
    this.subs.sink = this.lineItem$.subscribe({ next: resolve => this.lineGuid = resolve.guid.toString()});
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.setGridData()
  }

  setGridData() {
    // this.lineGuid = "6a9863aa-7c86-4b3e-b3a0-8baa9f07803d";
    const apiVisa = AppConfig.apiVisa;   
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
          { columnName: 'guid_generic_doc_line', operator: '=', value: this.lineGuid },
        ];
        this.subs.sink = this.jobDocLineLinkService.getByCriteria(this.pagination, apiVisa).pipe(
          mergeMap(b => {
            const source: Observable<any>[] = [];
            b.data.forEach(doc => source.push(
              zip(
                this.jobDocHdrLinkService.getByGuid(doc.bl_del_job_docline_link.guid_dochdr_link.toString(), apiVisa).pipe(
                  catchError((err) => of(err))
                ),
                this.jobHdrService.getByGuid(doc.bl_del_job_docline_link.guid_job_hdr.toString(), apiVisa).pipe(
                  catchError((err) => of(err)),
                  exhaustMap(c => this.tripHdrService.getByGuid(c.data.bl_del_job_hdr.guid_trip_hdr.toString(), apiVisa).pipe(
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
              ).pipe(
                map(([b_a, b_b]) => {
                  doc = Object.assign({
                    delivery_status: b_a.error ? b_a.error.code : b_a.data.bl_del_job_dochdr_link.delivery_status,
                    recipient_name: b_a.error ? b_a.error.code : b_a.data.bl_del_job_dochdr_link.recipient_name,
                    job_start_date: b_b.error ? b_b.error.code : b_b.data.bl_del_job_hdr.start_time,
                    job_end_date: b_b.error ? b_b.error.code : b_b.data.bl_del_job_hdr.end_time,
                    trip_no: b_b.error ? b_b.error.code : b_b.trip_no,
                    driver_name: b_b.error ? b_b.error.code : b_b.driver_name,
                    vehicle_no: b_b.error ? b_b.error.code : b_b.vehicle_no
                  }, doc);
                  return doc;
                })
              )
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