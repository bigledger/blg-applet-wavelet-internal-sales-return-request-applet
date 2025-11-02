import {ChangeDetectionStrategy, Component, ViewChild} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {OrganisationConstants} from '../../../models/organisation-constants';
import {filter, switchMap, toArray} from 'rxjs/operators';
import {
  AssetsService,
  bl_fi_mst_comp_ext_RowClass,
  CompanyContainerModel,
  CompanyService,
  Country,
  states
} from 'blg-akaun-ts-lib';
import { Store } from '@ngrx/store';
import { CompanyStates } from '../../../state-controllers/company-controller/store/states';
import { ViewColumnFacade } from '../../../facades/view-column.facade';
import { ComponentStore } from '@ngrx/component-store';
import { MatTabGroup } from '@angular/material/tabs';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { AkaunMessageDialogComponent } from 'projects/shared-utilities';
import { SubSink } from 'subsink2';

interface LocalState {
  deactivateReturn: boolean;
  selectedIndex: number;
}

@Component({
  selector: 'app-company-create',
  templateUrl: './company-create.component.html',
  styleUrls: ['./company-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class CompanyCreateComponent extends ViewColumnComponent {

  protected compName = 'Company Create';
  protected readonly index = 1;
  private localState: LocalState;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateReturn$ = this.componentStore.select(state => state.deactivateReturn);
  readonly selectedIndex$ = this.componentStore.select(state => (state.selectedIndex));

  prevIndex: number;
  private prevLocalState: any;

  apiVisa = AppConfig.apiVisa;

  public form: FormGroup;
  public currency;
  currencyCode: any;
  currencyName: any;
  countryName: any;
  countryId: any;
  stateName: any;
  stateCountryId: any;
  currencyArr: any = [];
  newCurrencyArr: any = [];
  countryArr: any = [];
  newCountryArr: any = [];
  countries: Country[] = [];
  companyArr: any = [];
  currentCountryId: any;
  newCompanyArr: any = [];
  companies: any = [];
  companyCode: any;
  states: states[] = [];
  stateArr: any = [];
  newStateArr: any = [];

  akaunMessageDialogComponentMatDialogRef: MatDialogRef<AkaunMessageDialogComponent>;

  private subs = new SubSink();

  @ViewChild(MatTabGroup) matTab: MatTabGroup;

  constructor(private fb: FormBuilder,
              public dialog: MatDialog,
              private companyService: CompanyService,
              private assetsService: AssetsService,
              private viewColFacade: ViewColumnFacade,
              private readonly store: Store<CompanyStates>,
              private readonly componentStore: ComponentStore<LocalState>
  ) {
    super();
  }

  ngOnInit() {
    this.subs.sink = this.localState$.subscribe(a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);

    this.subs.sink = this.companyService.get(this.apiVisa).pipe(
      switchMap((x: any) => {
        return x.data;
      }),
      toArray()
    ).subscribe((x: any) => {
        this.companies = x;
        // tslint:disable-next-line:forin
        for (const key in this.companies) {
          this.companyCode = this.companies[key].bl_fi_mst_comp.code;
          this.companyArr.push({
            company_code: this.companyCode,
          });
        }
        this.newCompanyArr = this.companyArr;
      }
    );
    this.subs.sink = this.assetsService.getCurrency().subscribe(
      (x: any) => {
        this.currency = x;
        // tslint:disable-next-line:forin
        for (const key in this.currency) {
          this.currencyCode = this.currency[key].code;
          this.currencyName = this.currency[key].name;
          this.currencyArr.push({
            currency_code: this.currencyCode,
            currency_name: this.currencyName
          });
        }
        this.newCurrencyArr = this.currencyArr;
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
        // tslint:disable-next-line:forin
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
      currentCurrency: [''],
      currentCountry: [''],
      currentState: [''],
      status: [''],
      currentStatus: [''],
      name: ['', Validators.compose([Validators.required])],
      code: ['', Validators.compose([Validators.required])],
      description: [''],
      abbreviation: [''],
      currency: ['MYR', Validators.compose([Validators.required])],
      registrationNum: ['', Validators.compose([Validators.required])],
      taxRegistrationNum: [''],
      phoneNum: [''],
      faxNum: [''],
      website: [''],
      email: [''],
      address1: [''],
      address2: [''],
      address3: [''],
      city: [''],
      postalCode: [''],
      state: [''],
      country: [''],
    });
  }

  onSubmit() {
    let exist = false;
    this.newCompanyArr.forEach((ext) => {
      if (ext.company_code === this.form.value.code) {
        this.akaunMessageDialogComponentMatDialogRef = this.dialog.open(AkaunMessageDialogComponent, {width: '400px'});
        this.akaunMessageDialogComponentMatDialogRef.componentInstance.confirmMessage = 'Company code already exists!';
        exist = true;
      }
    });
    if (exist === false) {
      const companyContainerModel = new CompanyContainerModel();
      companyContainerModel.bl_fi_mst_comp.code = this.form.value.code;
      companyContainerModel.bl_fi_mst_comp.name = this.form.value.name;
      if (this.form.value.abbreviation === '') {
        companyContainerModel.bl_fi_mst_comp.abbreviation = ' ';
      } else {
        companyContainerModel.bl_fi_mst_comp.abbreviation = this.form.value.abbreviation;
      }
      companyContainerModel.bl_fi_mst_comp.descr = this.form.value.description;
      companyContainerModel.bl_fi_mst_comp.tax_registration_id = this.form.value.taxRegistrationNum;
      companyContainerModel.bl_fi_mst_comp.comp_registration_num = this.form.value.registrationNum;
      companyContainerModel.bl_fi_mst_comp.ccy_code = this.form.value.currency;

      companyContainerModel.bl_fi_mst_comp_ext.push(
        this.createNewCompanyExt(OrganisationConstants.BUSINESS_REGISTRATION_NUMBER, 'STRING', this.form.value.businessRegistrationNumber));

      companyContainerModel.bl_fi_mst_comp_ext.push(
        this.createNewCompanyExt(OrganisationConstants.ENTITY_STATUS, 'STRING', 'ACTIVE'));

      companyContainerModel.bl_fi_mst_comp_ext.push(
        this.createNewCompanyExt(OrganisationConstants.CREATED_BY, 'JSON',
          {
            'email': localStorage.getItem('email'),
            'guid': localStorage.getItem('guid'),
          }
        ));

      companyContainerModel.bl_fi_mst_comp_ext.push(
        this.createNewCompanyExt(OrganisationConstants.ADDRESS, 'JSON',
          {
            'phoneNumber': this.form.value.phoneNum,
            'address1': this.form.value.address1,
            'address2': this.form.value.address2,
            'address3': this.form.value.address3,
            'city': this.form.value.city,
            'postalCode': this.form.value.postalCode,
            'state': this.form.value.state,
            'country': this.form.value.country,
          }
        ));

      companyContainerModel.bl_fi_mst_comp_ext.push(
        this.createNewCompanyExt(OrganisationConstants.CONTACT_INFO, 'JSON',
          {
            'faxNum': this.form.value.faxNum,
            'website': this.form.value.website,
            'email': this.form.value.email,
            'companyIncoDate': null,
            'closingDate': null,
          }
        ));
      this.viewColFacade.createCompany(companyContainerModel);
    }
  }

  onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateAdd: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  createNewCompanyExt(
    param_code_and_name: string,
    param_type: string,
    param_value: any
  ) {
    const obj = new bl_fi_mst_comp_ext_RowClass();
    obj.param_name = param_code_and_name;
    obj.param_code = param_code_and_name;
    obj.ext_type = 'SYS_APPLET';
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

  ngOnDestroy() {
    if (this.matTab) {
      this.viewColFacade.updateInstance<LocalState>(this.index, {
        ...this.localState,
        selectedIndex: this.matTab.selectedIndex
      });
    }
  }

}
