import {ChangeDetectionStrategy, Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';
import {OrganisationConstants} from '../../../models/organisation-constants';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {filter, switchMap, toArray} from 'rxjs/operators';
import {
  AppLoginPrincipalService,
  AssetsService, BranchContainerModel,
  BranchService,
  CompanyContainerModel,
  CompanyService,
  Country, LocationContainerModel, LocationService,
  Pagination,
  states
} from 'blg-akaun-ts-lib';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { CompanyStates } from '../../../state-controllers/company-controller/store/states';
import { CompanySelectors } from '../../../state-controllers/company-controller/store/selectors';
import { CompanyActions } from '../../../state-controllers/company-controller/store/actions';
import { ViewColumnFacade } from '../../../facades/view-column.facade';
import { ComponentStore } from '@ngrx/component-store';
import { MatTabGroup } from '@angular/material/tabs';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { AkaunConfirmationDialogComponent, AkaunMessageDialogComponent } from 'projects/shared-utilities';
import { SubSink } from 'subsink2';

interface LocalState {
  deactivateReturn: boolean;
  selectedIndex: number;
}

export interface DropDownList {
  value: string;
  viewValue: string;
}

export class BranchView2 {
  id;
  code;
  name;
  taxRegistrationNum;
  status;
  guid;
}

export class LocationView2 {
  id;
  code;
  name;
  status;
  guid;
  createdBy;
  company;
}
export class PagingNumbers {
  indexOffset;
  indexLimit;
  indexTotal;
  currentPage;
  totalPage;
}

@Component({
  selector: 'app-company-edit',
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})


export class CompanyEditComponent extends ViewColumnComponent {

  protected compName = 'Company Edit';
  protected readonly index = 2;
  private localState: LocalState;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateReturn$ = this.componentStore.select(state => state.deactivateReturn);
  readonly selectedIndex$ = this.componentStore.select(state => state.selectedIndex);

  prevIndex: number;
  private prevLocalState: any;

  @Output() innerDrawerIsOpened = new EventEmitter<boolean>();
  apiVisa = AppConfig.apiVisa

  companyContainerModel = new CompanyContainerModel();
  locationContainerModel = new LocationContainerModel();
  branchContainerModel = new BranchContainerModel();

  public form: FormGroup;
  branchDisplayedColumns: string[] = ['id', 'code', 'name', 'taxRegistrationNum', 'status'];
  locationDisplayedColumns: string[] = ['id', 'code', 'name', 'status'];
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  changesStyle: any;
  events: string[] = [];
  opened: boolean;
  currency;
  searchText: string;
  currencyCode: any;
  currencyName: any;
  countryName: any;
  countryId: any;
  stateName: any;
  stateCountryId: any;
  public arr: any = [];
  newArr: any = [];
  currencyArr: any = [];
  newCurrencyArr: any = [];
  countryArr: any = [];
  newCountryArr: any = [];
  countries: Country[] = [];
  states: states[] = [];
  stateArr: any = [];
  newStateArr: any = [];
  currentCountryId: any;
  gridView = false;
  gridView2 = false;
  viewIcon = 'assets/images/gridview.png';
  viewIcon2 = 'assets/images/gridview.png';
  viewTooltip;
  viewTooltip2;
  switch: any;
  companies: any = [];
  bread = 'Company Edit';
  breadCrumbs: any[];
  hideBreadCrumb = false;

  akaunMessageDialogComponentMatDialogRef: MatDialogRef<AkaunMessageDialogComponent>;
  akaunConfirmationDialogComponentMatRef: MatDialogRef<AkaunConfirmationDialogComponent>;
  status: DropDownList[] = [
    {value: 'ACTIVE', viewValue: 'ACTIVE'},
    {value: 'CLOSE', viewValue: 'CLOSE'}
  ];

  rowData: any;
  rowData2: any;
  //Pagination declaration here
  rowPerPage = 10;
  rowPerPage2 = 10;
  paging = new Pagination();
  pagingNumbers = new PagingNumbers();
  pagingNumbers2 = new PagingNumbers();
  // index = 0;
  filterToggle = false;
   // MatPaginator Inputs
   length = 100;
   pageSize = 10;
   pageSizeOptions: number[] = [5, 10, 25, 100];

   // MatPaginator Output
   pageEvent: PageEvent;
   rowNumber: number;
   gridColumnApi: any;
   gridColumnApi2: any;
   paginationPageSize;
   rowSelection;
   rowDataCategoryGrid: any;
   totalResults: any;
   totalResults2: any;
   paginationNumberFormatter: any;
   gridApi: any;
   gridApi2: any;

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilterComponentParams: {suppressFilterButton: true},
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true
  };
  compGuid: string;

  close: any;
  private columnsDefsBranch;
  private columnsDefsLocation;

  guid: string;

  private subs = new SubSink();

  @ViewChild('branchPaginator', {static: true}) branchPaginator: MatPaginator;
  @ViewChild('locationPaginator', {static: true}) locationPaginator: MatPaginator;
  @ViewChild(MatTabGroup) matTab: MatTabGroup;

  constructor(private fb: FormBuilder, public dialog: MatDialog,
              private companyService: CompanyService,
              private branchService: BranchService,
              private locationService: LocationService,
              private assetsService: AssetsService,
              private _route: ActivatedRoute,
              private appLoginPrincipalService: AppLoginPrincipalService,
              private readonly store: Store<CompanyStates>,
              private viewColFacade: ViewColumnFacade,
              private readonly componentStore: ComponentStore<LocalState>) {
    super();
    this.columnsDefsBranch = [
      {
        headerName: 'No.', valueGetter: 'node.rowIndex + 1', filter: false, suppressSizeToFit: true, width: 60,
        minWidth: 60,
        maxWidth: 60
      },
      {headerName: 'Branch Name', field: 'name'},
      {headerName: 'Branch Code', field: 'code'},
      {headerName: 'Tax Registraion Number', field: 'taxRegistrationNum'},
      {headerName: 'Status', field: 'status'},
      {headerName: 'GUID', field: 'guid'}
    ];

    this.columnsDefsLocation = [
      {
        headerName: 'No.', valueGetter: 'node.rowIndex + 1', filter: false, suppressSizeToFit: true, width: 60,
        minWidth: 60,
        maxWidth: 60
      },
      {headerName: 'Location Name', field: 'name'},
      {headerName: 'Company Name', field: 'company', sort: 'asc'},
      {headerName: 'Location Code', field: 'code'},
      {
        headerName: 'Status', field: 'status', suppressSizeToFit: true, width: 90,
        minWidth: 90,
        maxWidth: 90
      },
      {headerName: 'Created By', field: 'createdBy'}
    ];

  }

  ngOnInit() {
    this.subs.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.subs.sink = this.store.select(CompanySelectors.selectGuid).subscribe( guid => {
      this.compGuid = guid;
      this.guid = guid;
      this.getCompany(this.compGuid);
    });
    this.subs.sink = this.assetsService.getCurrency().subscribe(
      (x: any) => {
        this.currency = x;
        for (const key in this.currency) {
          this.currencyCode = this.currency[key].code;
          this.currencyName = this.currency[key].name;
          this.arr.push({
            currency_code: this.currencyCode,
            currency_name: this.currencyName
          });
        }
        this.newArr = this.arr;
      }
    );

    this.subs.sink = this.assetsService.getcountries().pipe(
      switchMap((x: any) => {
        return x.countries;
      }),
      toArray()
    ).subscribe(
      (x: any) => {
        this.countries = x;
        for (const key in this.countries) {
          this.countryName = this.countries[key].name;
          this.countryId = this.countries[key].id;
          this.countryArr.push({
            country_name: this.countryName,
            country_id: this.countryId
          });
        }
        this.newCountryArr = this.countryArr;
      }
    );


    this.form = this.fb.group({
      currentCurrency: ['', [ Validators.maxLength(255)] ],
      currentCountry: ['', [ Validators.maxLength(255)] ],
      currentState: ['', [ Validators.maxLength(255)] ],
      status: ['', [ Validators.maxLength(255)] ],
      currentStatus: ['', [ Validators.maxLength(255)] ],
      name:['', [Validators.required, Validators.maxLength(255)] ],
      code: ['', [Validators.required, Validators.maxLength(255)] ],
      description: ['', [ Validators.maxLength(255)] ],
      abbreviation: ['', [ Validators.maxLength(255)] ],
      currency: ['', [Validators.required, Validators.maxLength(255)] ],
      registrationNum: ['', [Validators.required, Validators.maxLength(255)] ],
      companyIncoDate: ['', [Validators.required, Validators.maxLength(255)]],
      taxRegistrationNum: ['', [ Validators.maxLength(255)] ],
      phoneNum: ['', [ Validators.maxLength(255)] ],
      faxNum: ['', [ Validators.maxLength(255)] ],
      website: ['', [ Validators.maxLength(255)] ],
      email: ['', [ Validators.maxLength(255)] ],
      closingDate: ['', [ Validators.maxLength(255)] ],
      address1: ['', [ Validators.maxLength(255)] ],
      address2: ['', [ Validators.maxLength(255)] ],
      address3: ['', [ Validators.maxLength(255)] ],
      city: ['', [ Validators.maxLength(255)] ],
      postalCode: ['', [ Validators.maxLength(255)] ],
      state: ['', [ Validators.maxLength(255)] ],
      country: ['', [ Validators.maxLength(255)] ],
      revision: ['', [ Validators.maxLength(255)] ],
      searchText: ['', [ Validators.maxLength(255)] ],
      createdBy: ['', [ Validators.maxLength(255)] ],
      createdDate: ['', [ Validators.maxLength(255)] ],
      modifiedBy: ['', [ Validators.maxLength(255)] ],
      modifiedDate: ['', [ Validators.maxLength(255)] ],
    });
  }

  checkDate() {
    const dateFormat = new DatePipe('en-US').transform('yyyy/mm/dd');
  }

  onSubmit() {
    // this.companyContainerModel.bl_fi_mst_comp.code = this.form.value.code;
    // this.companyContainerModel.bl_fi_mst_comp.guid = this.compGuid;
    // this.companyContainerModel.bl_fi_mst_comp.name = this.form.value.name;
    // this.companyContainerModel.bl_fi_mst_comp.abbreviation = this.form.value.abbreviation;
    // this.companyContainerModel.bl_fi_mst_comp.descr = this.form.value.description;
    // this.companyContainerModel.bl_fi_mst_comp.tax_registration_id = this.form.value.taxRegistrationNum;
    // this.companyContainerModel.bl_fi_mst_comp.comp_registration_num = this.form.value.registrationNum;
    // this.companyContainerModel.bl_fi_mst_comp.ccy_code = this.form.value.currency;

    // this.companyContainerModel.bl_fi_mst_comp_ext.forEach((ext) => {
    //   if (ext.param_code === OrganisationConstants.ADDRESS) {
    //     ext.value_json.phoneNumber = this.form.value.phoneNum;
    //     ext.value_json.address1 = this.form.value.address1;
    //     ext.value_json.address2 = this.form.value.address2;
    //     ext.value_json.address3 = this.form.value.address3;
    //     ext.value_json.city = this.form.value.city;
    //     ext.value_json.postalCode = this.form.value.postalCode;
    //     ext.value_json.state = this.form.value.state;
    //     ext.value_json.country = this.form.value.country;
    //   }
    //   if (ext.param_code === OrganisationConstants.CONTACT_INFO) {
    //     ext.value_json.faxNum = this.form.value.faxNum;
    //     ext.value_json.website = this.form.value.website;
    //     ext.value_json.email = this.form.value.email;
    //     ext.value_json.companyIncoDate = this.form.value.companyIncoDate;
    //     ext.value_json.closingDate = this.form.value.closingDate;
    //     ext.status = this.form.value.status;
    //   }
    //   if (ext.param_code === OrganisationConstants.ENTITY_STATUS) {
    //     ext.value_string = this.form.value.status;
    //   }
    //   if (ext.param_code === 'MAIN_BRANCH') {
    //     ext.value_string = this.form.value.branchGuid;
    //     console.log('ext_string', this.form.value.branchGuid);
    //   }
    // });

    if (this.form.value.status === 'CLOSE') {
      this.subs.sink = this.locationService.get(this.apiVisa).subscribe((response: any) => {
        response.data.forEach((ext) => {
          this.locationContainerModel = ext;
          if (ext.bl_inv_mst_location.guid_bl_fi_mst_comp === this.compGuid) {
            this.locationContainerModel.bl_inv_mst_location_ext.forEach(ext2 => {
              if (ext2.param_code === OrganisationConstants.CONTACT_INFO) {
                ext2.value_json.closingDate = this.form.value.closingDate;
                ext2.status = 'CLOSE';
              }
              if (ext.param_code === OrganisationConstants.ENTITY_STATUS) {
                ext.value_string = this.form.value.status;
              }
            });

            this.subs.sink = this.locationService.edit(this.locationContainerModel, this.apiVisa).subscribe(
              (response2: any) => {
                console.log('response2', response2);
              }
            );
          }

        });
      });
      this.subs.sink = this.branchService.get(this.apiVisa).subscribe((response: any) => {
        response.data.forEach((ext) => {
          this.branchContainerModel = ext;
          if (ext.bl_fi_mst_branch.comp_guid === this.compGuid) {
            this.branchContainerModel.bl_fi_mst_branch_ext.forEach(ext2 => {
              if (ext2.param_code === OrganisationConstants.CONTACT_INFO) {
                ext2.value_json.closingDate = this.form.value.closingDate;
                ext2.status = 'CLOSE';
              }
            });

            this.subs.sink = this.branchService.edit(this.branchContainerModel, this.apiVisa).subscribe(
              (response3: any) => {
                console.log('response2', response3);
              }
            );
          }

        });
      });
    }

    // console.log('---this.companyContainerModel---', this.companyContainerModel);
    this.store.dispatch(CompanyActions.updateCompanyInit({guid: this.guid, company: this.form}))

    // this.companyService.edit(this.companyContainerModel, this.apiVisa).subscribe(
    //   (response: any) => {
    //     console.log('response', response);
    //     this.akaunMessageDialogComponentMatDialogRef = this.dialog.open(AkaunMessageDialogComponent, {width: '400px'});
    //     this.akaunMessageDialogComponentMatDialogRef.componentInstance.confirmMessage = 'Your company has been edited!';
    //     this.akaunMessageDialogComponentMatDialogRef.afterClosed().subscribe((result) => {
    //     });
    //   });
  }

  onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateAdd: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  deleteCompany() {
    this.store.dispatch(CompanyActions.deleteCompanyInit({guid: this.guid}));
    this.viewColFacade.resetIndex(0);
  }

  getCompany(guid: string) {
    this.subs.sink = this.companyService.getByGuid(guid, this.apiVisa).subscribe((response: any) => {
        this.companyContainerModel = response.data;
        this.form.patchValue(
          {
            code: response.data.bl_fi_mst_comp.code,
            name: response.data.bl_fi_mst_comp.name,
            abbreviation: response.data.bl_fi_mst_comp.abbreviation,
            description: response.data.bl_fi_mst_comp.descr,
            taxRegistrationNum: response.data.bl_fi_mst_comp.tax_registration_id,
            registrationNum: response.data.bl_fi_mst_comp.comp_registration_num,
            currency: response.data.bl_fi_mst_comp.ccy_code,
            currentCurrency: response.data.bl_fi_mst_comp.ccy_code,
            revision: response.data.bl_fi_mst_comp.revision
          }
        );

        if (response.data.bl_fi_mst_comp.modified_by_subject_guid) {
          const paging2 = new Pagination();
          paging2.conditionalCriteria = [
            {
              columnName: 'subject_guid',
              operator: '=',
              value: (response.data.bl_fi_mst_comp.modified_by_subject_guid).toString()
            }
          ];
          this.subs.sink = this.appLoginPrincipalService.getByCriteria(paging2, this.apiVisa).subscribe((appLoginPrincipal) => {
            appLoginPrincipal.data.forEach((appLoginPrincipalResponse) => {
              if (appLoginPrincipalResponse.app_login_principal.principal_type === 'EMAIL_USERNAME') {
                this.form.patchValue(
                  {
                    modifiedBy: appLoginPrincipalResponse.app_login_principal.principal_id,
                  }
                );
              }
            });
          });
        }

        if (response.data.bl_fi_mst_comp.created_by_subject_guid) {
          const paging2 = new Pagination();
          paging2.conditionalCriteria = [
            {
              columnName: 'subject_guid',
              operator: '=',
              value: (response.data.bl_fi_mst_comp.created_by_subject_guid).toString()
            }
          ];
          this.subs.sink = this.appLoginPrincipalService.getByCriteria(paging2, this.apiVisa).subscribe((appLoginPrincipal) => {
            appLoginPrincipal.data.forEach((appLoginPrincipalResponse) => {
              if (appLoginPrincipalResponse.app_login_principal.principal_type === 'EMAIL_USERNAME') {
                this.form.patchValue(
                  {
                    createdBy: appLoginPrincipalResponse.app_login_principal.principal_id,
                  }
                );
              }
            });
          });
        }

        if (response.data.bl_fi_mst_comp.created_date !== 'Invalid date') {
          this.form.patchValue(
            {
              createdDate: moment(response.data.bl_fi_mst_comp.created_date).format('YYYY-MM-DD HH:mm:ss'),
            }
          );
        }

        if (response.data.bl_fi_mst_comp.modified_date !== 'Invalid date') {
          this.form.patchValue(
            {
              modifiedDate: moment(response.data.bl_fi_mst_comp.modified_date).format('YYYY-MM-DD HH:mm:ss')          }
          );
        }

        response.data.bl_fi_mst_comp_ext.forEach((ext) => {
          if (ext.param_code === OrganisationConstants.BUSINESS_REGISTRATION_NUMBER) {
            this.form.patchValue({
              businessRegistrationNumber: ext.value_string
            });
          }
          if (ext.param_code === OrganisationConstants.ADDRESS) {
            this.form.patchValue({
              phoneNum: ext.value_json.phoneNumber,
              address1: ext.value_json.address1,
              address2: ext.value_json.address2,
              address3: ext.value_json.address3,
              city: ext.value_json.city,
              postalCode: ext.value_json.postalCode,
              country: ext.value_json.country,
              state: ext.value_json.state,
            });
          }
          if (ext.param_code === OrganisationConstants.CONTACT_INFO) {
            if (ext.status === 'CLOSE') {
              this.close = true;
            }
            this.form.patchValue({
              faxNum: ext.value_json.faxNum,
              website: ext.value_json.website,
              email: ext.value_json.email,
              companyIncoDate: ext.value_json.companyIncoDate,
              closingDate: ext.value_json.closingDate,
              status: ext.status,
              currentStatus: ext.value_json.status,
            });
          }
        });

        this.subs.sink = this.assetsService.getcountries().pipe(
          switchMap((x: any) => x.countries),
          filter((x: any) => x.id === this.form.value.country),
          toArray()
        ).subscribe(
          (x: any) => {
            this.countries = x;
            // tslint:disable-next-line:forin
            for (const key in this.countries) {
              this.currentCountryId = this.countries[key].id;
            }
          }
        );
        if (this.currentCountryId === undefined) {
          this.currentCountryId = 0;
        }
        this.subs.sink = this.assetsService.getStates().pipe(
          switchMap((x: any) => x.states),
          filter((x: any) => x.country_id === this.currentCountryId.toString()),
          toArray()
        ).subscribe(
          (x: any) => {
            this.states = x;
            // tslint:disable-next-line:forin
            for (const key in this.states) {
              this.stateName = this.states[key].name;
              this.stateCountryId = this.states[key].country_id;
              this.stateArr.push({
                state_name: this.stateName,
                state_country_id: this.stateCountryId
              });
            }
            this.newStateArr = this.stateArr;
          }
        );
      }
    );
    const paging = new Pagination();
    paging.conditionalCriteria = [
      {columnName: 'comp_guid', operator: '=', value: guid}
    ];
    this.subs.sink = this.branchService.getByCriteria(paging, this.apiVisa).subscribe((branchResponse: any) => {
        this.mapDataToListing(branchResponse.data);
      }
    );
    this.subs.sink = this.locationService.getByCriteria(paging, this.apiVisa).subscribe((locationResponse: any) => {
        this.mapDataToListing2(locationResponse.data);
      }
    );
  }

  mapDataToListing(branchList: Array<BranchContainerModel>) {
    const branchViewList: Array<BranchView2> = [];
    branchList.forEach((branch, index) => {
      const branchView = new BranchView2();
      branchView.id = index + 1;
      branchView.code = branch.bl_fi_mst_branch.code;
      branchView.name = branch.bl_fi_mst_branch.name;
      branchView.taxRegistrationNum = branch.bl_fi_mst_branch.tax_registration_id;
      branchView.guid = branch.bl_fi_mst_branch.guid;
      branch.bl_fi_mst_branch_ext.forEach((ext) => {
        if (ext.param_code === OrganisationConstants.CONTACT_INFO) {
          branchView.status = ext.status;
        }
      });

      branchViewList.push(branchView);
    });
    this.rowData = branchViewList;
  }

  mapDataToListing2(locationList: Array<LocationContainerModel>) {
    const locationViewList: Array<LocationView2> = [];
    const index = 0;
    locationList.forEach((location) => {
      if (location.bl_inv_mst_location.guid_bl_fi_mst_comp === this._route.snapshot.paramMap.get('guid')) {
        const locationView = new LocationView2();
        locationView.id = index + 1;
        locationView.code = location.bl_inv_mst_location.code;
        locationView.name = location.bl_inv_mst_location.name;
        locationView.guid = location.bl_inv_mst_location.guid;

        location.bl_inv_mst_location_ext.forEach((ext) => {
          if (ext.param_code === OrganisationConstants.CONTACT_INFO) {
            locationView.status = ext.status;
          }
        });

        this.subs.sink = this.companyService.get(this.apiVisa).pipe(
          switchMap((x: any) => {
            return x.data;
          }),
          toArray()
        ).subscribe((x: any) => {
            this.companies = x;
            for (const key in this.companies) {
              if (this.companies[key].bl_fi_mst_comp.guid === location.bl_inv_mst_location.guid_bl_fi_mst_comp) {
                locationView.company = this.companies[key].bl_fi_mst_comp.name;
              }
            }
          }
        );

        location.bl_inv_mst_location_ext.forEach(locExt => {
          if (locExt.param_code === OrganisationConstants.CREATED_BY) {
            locationView.createdBy = locExt.value_json.email;
          }
        });

        locationViewList.push(locationView);
      }
    });
    this.rowData2 = locationViewList;
  }

  applyCurrencyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.newCurrencyArr = this.currencyArr.filter((option) => option.currency_name.toLowerCase().includes(filterValue) ||
      option.currency_code.toLowerCase().includes(filterValue));
  }

  applyCountryFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.newCountryArr = this.countryArr.filter((option) => option.country_name.toLowerCase().includes(filterValue));
  }

  applyStateFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.newStateArr = this.stateArr.filter((option) => option.state_name.toLowerCase().includes(filterValue));
  }

  selectCountry(countryid) {
    this.stateArr = [];
    this.subs.sink = this.assetsService.getStates().pipe(
      switchMap((x: any) => x.states),
      filter((x: any) => x.country_id === countryid.toString()),
      toArray()
    ).subscribe(
      (x: any) => {
        this.states = x;
        // tslint:disable-next-line:forin
        for (const key in this.states) {
          this.stateName = this.states[key].name;
          this.stateCountryId = this.states[key].country_id;
          this.stateArr.push({
            state_name: this.stateName,
            state_country_id: this.stateCountryId
          });
        }
        this.newStateArr = this.stateArr;
      }
    );
  }


  gridViewToggle() {
    this.gridView = !this.gridView;
    this.gridView ? this.viewIcon = 'assets/images/listview.png' : this.viewIcon = 'assets/images/gridview.png';
    this.gridView ? this.viewTooltip = 'Toggle list view' : this.viewTooltip = 'Toggle grid view';
  }

  gridViewToggle2() {
    this.gridView2 = !this.gridView2;
    this.gridView2 ? this.viewIcon2 = 'assets/images/listview.png' : this.viewIcon2 = 'assets/images/gridview.png';
    this.gridView2 ? this.viewTooltip2 = 'Toggle list view' : this.viewTooltip2 = 'Toggle grid view';
  }

  offSideBar(event: any) {
    // if (this.ui === true) {
    //   this.dataSharingService.branchGuid = event.guid;
    //   this.switch = true;
    //   if (!this.sidelayer1.opened) {
    //     this.sidelayer1.toggle();
    //     this.innerDrawerIsOpened.emit((this.sidelayer1.opened));

    //   }
    // } else {
    //   this.dataSharingService.branchGuid = event.guid;
    //   this.router.navigate(['./applets/akaun/dev/example-applet/branch-edit/' + event.guid]);
    // }
  }

  closingDate(status2) {
    if (status2 === 'CLOSE') {
      this.akaunConfirmationDialogComponentMatRef = this.dialog.open(AkaunConfirmationDialogComponent, {width: '400px'});
      this.akaunConfirmationDialogComponentMatRef.componentInstance.confirmMessage = 'Are you sure you want to close?';
      this.subs.sink = this.akaunConfirmationDialogComponentMatRef.afterClosed().subscribe((result) => {
        if (result === true) {
          this.close = true;
        } else {
          this.form.patchValue({
            status: 'ACTIVE'
          });
        }
      });
    } else {
      this.close = false;
    }
  }

  ngOnDestroy() {
    if (this.matTab) {
      this.viewColFacade.updateInstance<LocalState>(this.index, {
        ...this.localState,
        selectedIndex: this.matTab.selectedIndex
      });
    }
    this.subs.unsubscribe();
  }
}


