import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { bl_fi_generic_doc_line_RowClass, DriverHdrService, JobDocHdrLinkService, JobDocLineLinkService, JobHdrService, Pagination, TripHdrService, VehicleHdrService } from 'blg-akaun-ts-lib';
import { AppConfig } from 'projects/shared-utilities/visa';
import { forkJoin, iif, Observable, of, zip } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { lineItemSearchModel } from '../../../../../models/advanced-search-models/line-item.model';
// import { lineItemSearchModel } from '../../../../../models/advanced-search-models/line-item.models';
import { LineItemSelectors } from '../../../../../state-controllers/line-item-controller/store/selectors';
import { LineItemStates } from '../../../../../state-controllers/line-item-controller/store/states';

@Component({
  selector: 'app-edit-item-details-delivery-details',
  templateUrl: './delivery-details.component.html',
  styleUrls: ['./delivery-details.component.scss']
})
export class EditLineItemDetailsDeliveryDetailsComponent implements OnInit, OnDestroy {

  protected subs = new SubSink();

  searchModel = lineItemSearchModel;
  lineItem$ = this.store.select(LineItemSelectors.selectLineItem);

  lineItemGuid: String

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilterComponentParams: { suppressFilterButton: true },
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true,
  };

  gridApi;

  columnsDefs = [
    { headerName: 'Trip No', field: 'tripNo', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Driver Name', field: 'driverName', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Vehicle No', field: 'vehicleNo', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Job Start Date', field: 'jobStartDate' },
    { headerName: 'Job End Date', field: 'jobEndDate' },
    { headerName: 'Delivery Status', field: 'deliveryStatus', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Recipient Name', field: 'recipientName', cellStyle: () => ({ 'text-align': 'left' }) },
    { headerName: 'Qty', field: 'bl_del_job_docline_link.quantity', type: 'numericColumn' },
  ];

  constructor(
    protected readonly store: Store<LineItemStates>,
    private jobDocLineLinkService: JobDocLineLinkService,
    private jobDocHdrLinkService: JobDocHdrLinkService,
    private jobHdrService: JobHdrService,
    private tripHdrService: TripHdrService,
    private driverHdrService: DriverHdrService,
    private vehicleHdrService: VehicleHdrService,
  ) {
  }

  ngOnInit() {
    this.subs.sink = this.lineItem$.subscribe(lineItem => this.lineItemGuid = lineItem.guid.toString());
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.setGridData();
  }

  setGridData(criteria?: any) {
    // const testLineGuid = "6a9863aa-7c86-4b3e-b3a0-8baa9f07803d";
    const apiVisa = AppConfig.apiVisa;
    criteria = (criteria) ? criteria : [
      { columnName: 'guid_generic_doc_line', operator: '=', value: this.lineItemGuid },
      { columnName: 'calcTotalRecords', operator: '=', value: 'true' }
    ]
    const datasource = {
      getRows: grid => {
        this.subs.sink = this.jobDocLineLinkService.getByCriteria(new Pagination(grid.request.startRow, grid.request.endRow - grid.request.startRow, criteria), apiVisa).pipe(
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
                      tripNo: c_inner.error ? c_inner.error.code : c_inner.data.bl_del_trip_hdr.code,
                      driverGuid: c_inner.error ? c_inner.error.code : c_inner.data.bl_del_trip_hdr.guid_driver_hdr,
                      vehicleGuid: c_inner.error ? c_inner.error.code : c_inner.data.bl_del_trip_hdr.guid_vehicle_hdr,
                    }, c)),
                    exhaustMap(d => this.driverHdrService.getByGuid(d.driverGuid.toString(), apiVisa).pipe(
                      catchError((err) => of(err)),
                      map(d_inner => Object.assign({
                        driverName: d_inner.error ? d_inner.error.code : d_inner.data.bl_del_driver_hdr.name,
                      }, d))
                    )),
                    exhaustMap(e => this.vehicleHdrService.getByGuid(e.vehicleGuid.toString(), apiVisa).pipe(
                      catchError((err) => of(err)),
                      map(e_inner => Object.assign({
                        vehicleNo: e_inner.error ? e_inner.error.code : e_inner.data.bl_del_vehicle_hdr.reg_plate,
                      }, e))
                    ))
                  ))
                ),
              ).pipe(
                map(([b_a, b_b]) => {
                  doc = Object.assign({
                    deliveryStatus: b_a.error ? b_a.error.code : b_a.data.bl_del_job_dochdr_link.delivery_status,
                    recipientName: b_a.error ? b_a.error.code : b_a.data.bl_del_job_dochdr_link.recipient_name,
                    jobStartDate: b_b.error ? b_b.error.code : b_b.data.bl_del_job_hdr.start_time,
                    jobEndDate: b_b.error ? b_b.error.code : b_b.data.bl_del_job_hdr.end_time,
                    tripNo: b_b.error ? b_b.error.code : b_b.tripNo,
                    driverName: b_b.error ? b_b.error.code : b_b.driverName,
                    vehicleNo: b_b.error ? b_b.error.code : b_b.vehicleNo
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
        ).subscribe(
          resolved => {
            grid.success({
              rowData: resolved.data,
              rowCount: resolved.data.length
            });
          }
        )
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
