import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { bl_fi_mst_entity_ext_RowClass, bl_fi_mst_entity_line_RowClass, bl_fi_mst_entity_payment_method_RowClass, CountryService, EntityContainerModel, EntityPaymentMethodService, FinancialItemService, Pagination } from 'blg-akaun-ts-lib';
import { pageFiltering, pageSorting } from 'projects/shared-utilities/listing.utils';
import { AppConfig } from 'projects/shared-utilities/visa';
import { forkJoin, iif, Observable, of, zip } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { ViewColumnFacade } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/facades/view-column.facade';
import { CustomerConstants, SettlementTypeOptions } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/models/customer-constants';
import { CustomerActions } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/actions';
import { CustomerSelectors } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/selectors';
import { CustomerStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/states';
// app-customer-payment-config
@Component({
  selector: 'app-customer-payment-config',
  templateUrl: './customer-payment-config.component.html',
  styleUrls: ['./customer-payment-config.component.css']
})
export class CustomerPaymentConfigComponent implements OnInit {

  @Input() customerExt$: Observable<any>;
  deactivateAdd$;
  @Input() localState: any;

  @Output() lineItem = new EventEmitter<bl_fi_mst_entity_line_RowClass>();

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilterComponentParams: { suppressFilterButton: true },
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true,
    cellStyle: { textAlign: "left" },
  };

  gridApi;


  protected readonly index = 2;
  protected subs = new SubSink();
  apiVisa = AppConfig.apiVisa;
  columnsDefs;
  rowData: any[] = [];
  settlementIdentifierCodeList = SettlementTypeOptions.values;
  selectedCustomerGuid$: Observable<string> = this.store.select(CustomerSelectors.selectGuid);
  customerGuid: string;
  constructor(
    private readonly store: Store<CustomerStates>,
    private viewColFacade: ViewColumnFacade,
    private paymentConfigService: EntityPaymentMethodService,
    private fiService: FinancialItemService,
    private countryService: CountryService
  ) {
    const customComparator = (valueA, valueB) => {
      if (valueA != null && '' !== valueA && valueB != null && '' !== valueB) {
        return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
      }
    };
    this.columnsDefs = [

      { headerName: 'Country', field: 'country', comparator: customComparator, suppressSizeToFit: true },
      { headerName: 'Payee Resident Status', field: 'residential_status', comparator: customComparator, suppressSizeToFit: true },
      { headerName: 'Payment Type', field: 'config_name', suppressSizeToFit: true, sort: 'desc', comparator: customComparator, },
      { headerName: 'Bank', field: 'bank_name', comparator: customComparator, suppressSizeToFit: true },
      { headerName: 'Bank Identifier Code', field: 'settlementIdentifier', comparator: customComparator, suppressSizeToFit: true },
      { headerName: 'Bank Acc. No.', field: 'account_number', suppressSizeToFit: true },
      { headerName: 'Bank Acc. Holder Name', field: 'account_name', suppressSizeToFit: true },
      { headerName: 'IBN No.', field: 'ibn_number', suppressSizeToFit: true },
    ];
  }

  ngOnInit() {

  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    // this.setGridData();
    this.subs.sink = this.selectedCustomerGuid$.subscribe(data => {
      console.log("SELECTED CUSTOMER CHANGED")
      this.customerGuid = data;
      this.setGridData();
    })
  }

  setGridData() {
    const datasource = {
      getRows: grid => {
        console.log("CUSTOMER GUID FROM PAYMENT", this.customerGuid)
        const filter = pageFiltering(grid.request.filterModel);
        const sortOn = pageSorting(grid.request.sortModel);
        const paymentConfigPagination = new Pagination();
        const countryPagination = new Pagination();
        // paymentConfigPagination.offset = this.SQLGuids ? 0 : grid.request.startRow;
        paymentConfigPagination.limit = grid.request.endRow - grid.request.startRow;
        paymentConfigPagination.conditionalCriteria = [
          {
            columnName: 'calcTotalRecords', operator: '=', value: 'true'
          },
          {
            columnName: 'hdr_guid', operator: '=',
            value: this.customerGuid.toString()
          }
        ];
        countryPagination.limit = grid.request.endRow - grid.request.startRow;

        this.subs.sink = this.paymentConfigService.getByCriteria(paymentConfigPagination, this.apiVisa).pipe(
          mergeMap((response) => {
            console.log("NEW PAYMENT CONFIG LISTING", response.data);
            const data: Observable<any>[] = [];
            response.data.forEach(r => {
              countryPagination.conditionalCriteria = [
                {
                  columnName: 'calcTotalRecords', operator: '=', value: 'true'
                },
                {
                  columnName: 'alpha3_code', operator: '=',
                  value: r.bl_fi_mst_entity_payment_method.country_code.toString()
                }
              ];
              data.push(
                zip(
                  this.fiService.getByGuid(r.bl_fi_mst_entity_payment_method.item_guid.toString(), this.apiVisa).pipe(
                    catchError((err) => of(err))
                  ),
                  this.countryService.getByCriteria(countryPagination, this.apiVisa).pipe(
                    catchError((err) => of(err))
                  )
                ).pipe(
                  map(([fi, country]) => {
                    console.log("COUNTRY", country)
                    let object = {
                      guid: r.bl_fi_mst_entity_payment_method.guid,
                      item_guid: r.bl_fi_mst_entity_payment_method.item_guid,
                      config_name: fi.data.bl_fi_mst_item_hdr.name,
                      country: country.data[0].bl_fi_country_hdr.country_name,
                      country_code: r.bl_fi_mst_entity_payment_method.country_code,
                      account_name: r.bl_fi_mst_entity_payment_method.account_name,
                      account_number: r.bl_fi_mst_entity_payment_method.account_number,
                      payment_provider_code: r.bl_fi_mst_entity_payment_method.payment_provider_code,
                      account_expiry: r.bl_fi_mst_entity_payment_method.account_expiry,
                      created_date: r.bl_fi_mst_entity_payment_method.created_date,
                      updated_date: r.bl_fi_mst_entity_payment_method.updated_date,
                      created_by_subject_guid: r.bl_fi_mst_entity_payment_method.created_by_subject_guid,
                      updated_by_subject_guid: r.bl_fi_mst_entity_payment_method.updated_by_subject_guid,
                      revision: r.bl_fi_mst_entity_payment_method.revision,
                      status: r.bl_fi_mst_entity_payment_method.status,
                      residential_status: r.bl_fi_mst_entity_payment_method.residential_status,
                      ibn_number: r.bl_fi_mst_entity_payment_method.ibn_number,
                      bank_name: r.bl_fi_mst_entity_payment_method.bank_name,
                      settlementIdentifier: this.settlementIdentifierCodeList.filter((option) => { return option.value === r.bl_fi_mst_entity_payment_method.payment_provider_code })[0].viewValue
                    }

                    return object;
                  })
                )
              )
            }
            );
            return iif(() => response.data.length > 0,
              forkJoin(data).pipe(map((data) => {
                response.data = data
                return response;
              })),
              of(response)
            );
          })
        ).subscribe(resolved => {
          console.log(resolved);
          const data = sortOn(resolved.data.filter(o => filter.by(o)));
          const totalRecords = filter.isFiltering ? resolved.totalRecords : data.length;
          grid.success({
            rowData: data,
            rowCount: totalRecords
          });
        }, err => {
          console.log(err);
          grid.fail();
        });
      }
    }
    this.gridApi.setServerSideDatasource(datasource);
    this.subs.sink = this.store.select(CustomerSelectors.selectAgGrid).subscribe(a => {
      if (a) {
        this.gridApi.refreshServerSideStore({ purge: true });
        this.store.dispatch(CustomerActions.updateAgGridDone({ status: false }));
      }
    });


  }

  // onRowClicked(event: bl_fi_mst_entity_line_RowClass) {
  //   this.lineItem.emit(event);
  // }

  onRowClicked(entity: bl_fi_mst_entity_payment_method_RowClass) {
    console.log("ROW CLICK ENTITY", entity)
    this.store.dispatch(CustomerActions.selectEditPaymentConfig({ paymentConfig: entity }))
    this.store.dispatch(CustomerActions.selectCustomerEditExt({ ext: entity }));
    if (!this.localState.deactivateList) {
      this.viewColFacade.updateInstance(this.index, { ...this.localState, deactivateList: true });
      this.viewColFacade.onNextAndReset(this.index, 28);
    }
  }
  searchValue;
  quickSearch() {
    this.gridApi.setQuickFilter(this.searchValue);
  }

  onNext() {
    // this.viewColFacade.startDraft();
    this.viewColFacade.updateInstance(this.index, { ...this.localState, deactivateAdd: true });
    this.viewColFacade.onNextAndReset(this.index, 27);
  }
  createNewCustomerExt(
    param_code: string,
    param_name: string,
    param_type: string,
    param_value: any,
  ) {
    const obj = new bl_fi_mst_entity_ext_RowClass();
    obj.param_name = param_name;
    obj.param_code = param_code;
    obj.status = 'ACTIVE';
    obj.param_type = param_type;
    if (param_type.toUpperCase() === 'STRING') {
      obj.value_string = param_value;
    } else if (param_type.toUpperCase() === 'DATE') {
      obj.value_datetime = param_value;
    } else if (param_type.toUpperCase() === 'NUMERIC') {
      obj.value_numeric = param_value;
    } else if (param_type.toUpperCase() === 'JSON') {
      obj.value_json = param_value;
    } else {
      obj.value_file = param_value;
    }
    return obj;
  }

}
