import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UUID } from 'angular2-uuid';
import { bl_fi_mst_entity_ext_RowClass, bl_fi_mst_entity_line_RowClass, CountryContainerModel, CountryService, EntityContainerModel, Pagination, PagingResponseModel, SettlementMethodContainerModel, SettlementMethodService } from 'blg-akaun-ts-lib';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { ViewColumnFacade } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/facades/view-column.facade';
import { CustomerConstants } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/models/customer-constants';
import { CustomerActions } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/actions';
import { CustomerStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/states';


import { Observable } from 'rxjs';
import { switchMap, toArray } from 'rxjs/operators';

@Component({
  selector: 'app-address-create',
  templateUrl: './customer-address-create.component.html',
  styleUrls: ['./customer-address-create.component.css']
})
export class CreateAddressComponent extends ViewColumnComponent implements OnInit {

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
  deactivateReturn$;
  @Input() customerExtLineItem$: Observable<bl_fi_mst_entity_line_RowClass>;


  protected readonly index = 4;
  prevIndex: number;
  private prevLocalState: any;
  readonly localState$ = this.viewColFacade.selectLocalState(this.index);

  apiVisa = AppConfig.apiVisa;
  paging = new Pagination();
  addSuccess = 'Add';
  isClicked = 'primary';
  constructor(
    private countryService: CountryService,
    private readonly store: Store<CustomerStates>,
    private fb: FormBuilder,
    private viewColFacade: ViewColumnFacade,
  ) {
    super();
  }

  ngOnInit() {
    // get country listing
    this.countryService.get(this.apiVisa).pipe(
      switchMap((x: any) => {
        return x.data;
      }),
      toArray()
    ).subscribe((x: any) => {
      this.countries = x;
      // tslint:disable-next-line:forin
      for (const key in this.countries) {
        // @ts-ignore
        if (this.countries[key].bl_fi_country_hdr.country_name === 'Malaysia') {
          this.countryArr.unshift({
            // @ts-ignore
            country_name: this.countries[key].bl_fi_country_hdr.country_name,
            // @ts-ignore
            country_code: this.countries[key].bl_fi_country_hdr.alpha3_code,
            // @ts-ignore
            state: this.countries[key].bl_fi_country_hdr.states_json
          });
        } else {
          this.countryArr.push({
            // @ts-ignore
            country_name: this.countries[key].bl_fi_country_hdr.country_name,
            // @ts-ignore
            country_code: this.countries[key].bl_fi_country_hdr.alpha3_code,
            // @ts-ignore
            state: this.countries[key].bl_fi_country_hdr.states_json
          });
        }
      }
      this.newCountryArr = this.countryArr;
    });

    this.addressInfo = this.fb.group({
      city: ['', Validators.required],
      name: [''],
      state: ['', Validators.required],
      stateCode: [""],
      status: ['ACTIVE'],
      country: ['', Validators.required],
      addressType: ['', Validators.required],
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

  selectCountry(states, countryid) {
    // get state listing
    this.stateArr = [];
    this.states = states.states;
    // tslint:disable-next-line:forin
    for (const key in states.states) {
      this.stateArr.push({
        state_name: this.states[key].name,
        state_country_id: countryid,
        state_code: this.states[key].code
      });
    }
    this.newStateArr = this.stateArr;
  }

  onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateAdd: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  onStateSelection(event){
    const selectedState = this.newStateArr.find(state => state.state_name === event);
    this.addressInfo.patchValue({
      stateCode: selectedState?.state_code
    })
  }

  onSave() {
    let userGuid = localStorage.getItem('guid');
    let date = new Date();
    this.addressInfo.patchValue(
      {
        createdBy: userGuid,
        createdDate: date,
        modifiedBy: userGuid,
        modifiedDate: date,
        status: 'ACTIVE',
        guid: UUID.UUID()
      })
    // this.addressInfo
    // const newAddressExt = this.createNewCustomerExt
    //   (CustomerConstants.ADDRESS,
    //     CustomerConstants.ADDRESS, 'JSON',
    //     this.addressInfo.value);

    // this.store.dispatch(CustomerActions.createAddressExt({
    //     ext: newAddressExt
    // }))

    // let obj;
    // obj =  { "address": this.addressInfo.value }

    // this.store.dispatch(CustomerActions.createAddress({
    //   ext: obj
    // }))

    const newAddress = this.addressInfo.value;
    delete newAddress.currentAddressType;
    delete newAddress.currentCountry;
    delete newAddress.currentState;
    this.store.dispatch(CustomerActions.createAddress({ address: newAddress }));

    this.addSuccess = 'Success';
    this.isClicked = 'buttonSuccess';
    setTimeout(() => {
      this.addSuccess = 'Add';
      this.isClicked = 'primary';
      this.addressInfo.reset();
    }, 1500)
    this.onReturn();
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

  createNewAddressJson(
    address_type: string,
    address_value
  ) {
    let obj;
    obj = { address_value }
    // switch (address_type) {
    //   case "MAIN_ADDRESS":
    //     obj = {
    //       "main_address": {
    //         address_value
    //       }
    //     }
    //     return obj;
    //   case "SHIPPING_ADDRESS":
    //     obj = {
    //       "shipping_address": {
    //         address_value
    //       }
    //     }
    //     return obj;
    //   case "BILLING_ADDRESS":
    //     obj = {
    //       "billing_address": {
    //         address_value
    //       }
    //     }
    //     return obj;

    return obj;
  }

}

