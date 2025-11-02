import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { bl_fi_mst_entity_ext_RowClass, bl_fi_mst_entity_line_RowClass, CountryContainerModel, CountryService, EntityContainerModel, Pagination, SettlementMethodContainerModel, } from 'blg-akaun-ts-lib';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { switchMap, toArray } from 'rxjs/operators';
import { AppConfig } from 'projects/shared-utilities/visa';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { ViewColumnFacade } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/facades/view-column.facade';
import { CustomerConstants } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/models/customer-constants';
import { CustomerActions } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/actions';
import { CustomerSelectors } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/selectors';
import { CustomerStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/states';

@Component({
  selector: 'app-address-edit',
  templateUrl: './customer-address-edit.component.html',
  styleUrls: ['./customer-address-edit.component.css']
})
export class EditAddressComponent extends ViewColumnComponent implements OnInit {
  data: any;
  states: any;
  statesShipping: any;
  countries: any;
  stateName: any;
  stateCountryCode: any;
  stateArr: any = [];
  newStateArr: any = [];
  countryName: any;
  countryAlphaCode: any;
  countryArr: any = [];
  newCountryArr: any = [];
  // currentCountryCode: any;
  public addressInfo: FormGroup;
  address = [
    { value: CustomerConstants.MAIN_ADDRESS, viewValue: 'Main Address' },
    { value: CustomerConstants.BILLING_ADDRESS, viewValue: 'Billing Address' },
    { value: CustomerConstants.SHIPPING_ADDRESS, viewValue: 'Shipping Address' },
  ];
  bread = 'Address Create';
  breadCrumbs: any[];
  ui: any;
  public innerWidth: any;
  hideBreadCrumb = false;
  countryContainerModel = new CountryContainerModel();
  insertLineGuid: any;
  custGuid: any;
  entityBody = new EntityContainerModel();
  // extMap: Map<string, any> = new Map<string, any>();
  changePage = false;
  shippingAddress = false;
  billingAddress = false;
  form: FormGroup;

  @Input() customerExtLineItem$: Observable<bl_fi_mst_entity_line_RowClass>;

  deactivateReturn$;
  // @Input() customerExtLineItem$: Observable<bl_fi_mst_entity_line_RowClass>;



  protected readonly index = 4;
  prevIndex: number;
  private prevLocalState: any;
  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  apiVisa = AppConfig.apiVisa;
  paging = new Pagination();
  @Input() customer$: Observable<any>;
  addSuccess = 'Update';
  isClicked = 'primary';
  constructor(private fb: FormBuilder,
    private readonly store: Store<CustomerStates>,
    private viewColFacade: ViewColumnFacade,
    private countryService: CountryService,
  ) {
    super();
  }

  ngOnInit() {
    this.addressInfo = this.fb.group({
      address_pos: [''],
      city: ['', Validators.required],
      name: [''],
      state: ['', Validators.required],
      stateCode: [""],
      status: [''],
      country: ['', Validators.required],
      addressType: ['', Validators.required],
      originalAddressType: [''],
      postal_code: ['', Validators.required],
      address_line_1: [''],
      address_line_2: [''],
      address_line_3: [''],
      address_line_4: [''],
      address_line_5: [''],
      default_address_status: [''],
      receiver_name: [''],
      mobile_no: [''],
      email: [''],

      currentAddressType: [''],
      currentCountry: [''],
      currentState: [''],
      // guid: ['', Validators.required],
    });
    this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.customer$ = this.store.select(CustomerSelectors.selectExt);
    this.customer$.subscribe(
      data => {

        const addressData = data[0];

        this.addressInfo.patchValue(
          {
            originalAddressType: addressData.originalAddressType,
            address_pos: addressData.address_pos,
            city: addressData.city,
            name: addressData.name,
            state: addressData.state,
            stateCode: addressData.stateCode,
            status: addressData.status,
            country: addressData.country,
            addressType: addressData.addressType,
            postal_code: addressData.postal_code,
            address_line_1: addressData.address_line_1,
            address_line_2: addressData.address_line_2,
            address_line_3: addressData.address_line_3,
            address_line_4: addressData.address_line_4,
            address_line_5: addressData.address_line_5,
            default_address_status: addressData.default_address_status,
            receiver_name: addressData.receiver_name,
            mobile_no: addressData.mobile_no,
            email: addressData.email

            // guid: data[0].guid,
            // currentAddressType: addressData.currentAddressType,
            // currentCountry: addressData.currentCountry,
            // currentState: addressData.currentState,
          });
        this.selectCountry({ countryName: this.addressInfo.value.country });
      });

    // get country listing
    this.countryService.get(this.apiVisa).pipe(
      switchMap((x: any) => {
        return x.data;
      }),
      toArray()
    ).subscribe((x: any) => {
      this.countries = x;
      // tslint:disable-next-line:forin
      if (this.countryArr.length === 0) {
        for (const key in this.countries) {
          if (this.countries[key].bl_fi_country_hdr.country_name === 'Malaysia') {
            this.countryArr.unshift({
              country_name: this.countries[key].bl_fi_country_hdr.country_name,
              country_code: this.countries[key].bl_fi_country_hdr.alpha3_code,
              state: this.countries[key].bl_fi_country_hdr.states_json
            });
          } else {
            this.countryArr.push({
              country_name: this.countries[key].bl_fi_country_hdr.country_name,
              country_code: this.countries[key].bl_fi_country_hdr.alpha3_code,
              state: this.countries[key].bl_fi_country_hdr.states_json
            });
          }
        }
        this.newCountryArr = this.countryArr;
      }
      this.selectCountry({ countryName: this.addressInfo.value.country });
    });
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

  selectCountry(countrySelected: { countryAlphaCode?, countryName?}) {
    // get state listing
    this.stateArr = [];
    const paging = new Pagination();

    if (countrySelected.countryAlphaCode) {
      paging.conditionalCriteria = [
        { columnName: 'alpha3_code', operator: '=', value: countrySelected.countryAlphaCode },
      ];
    }
    else if (countrySelected.countryName) {
      paging.conditionalCriteria = [
        { columnName: 'country_name', operator: '=', value: countrySelected.countryName },
      ];
    }

    this.countryService.getByCriteria(paging, this.apiVisa)
      .subscribe(
        (x: any) => {
          this.states = x.data[0].bl_fi_country_hdr.states_json;
          for (const key in this.states) {
            this.newStateArr = this.states;
          }
        }
      );
  }

  onStateSelection(event){
    const selectedState = this.newStateArr?.states.find(state => state.name === event);
    this.addressInfo.patchValue({
      stateCode: selectedState?.code
    })
  }

  onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateAdd: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  onSave() {
    // this.addressExt.value_json = this.addressInfo.value;
    // this.store.dispatch(CustomerActions.editAddressExt({ guid: this.addressInfo.value.guid, ext: this.addressExt }));
    let newAddress = this.addressInfo.value;
    delete newAddress.currentAddressType;
    delete newAddress.currentCountry;
    delete newAddress.currentState;

    this.store.dispatch(CustomerActions.editAddress({ address: newAddress }));
    this.addSuccess = 'Success';
    this.isClicked = 'buttonSuccess';
    setTimeout(() => {
      this.addSuccess = 'Update';
      this.isClicked = 'primary';
    }, 1500);
    this.addressInfo.reset();
  }

  onRemove() {
    this.addressInfo.patchValue(
      {
        status: 'DELETED'
      },
    );
    // this.addressExt.ext.status = 'DELETED';
    this.onSave();
  }

}
