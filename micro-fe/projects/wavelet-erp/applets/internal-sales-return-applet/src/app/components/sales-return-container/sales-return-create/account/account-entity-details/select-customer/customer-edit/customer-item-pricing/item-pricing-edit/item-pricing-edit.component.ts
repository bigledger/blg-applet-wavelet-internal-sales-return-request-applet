import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  bl_fi_mst_item_entity_pricing_link_RowClass,
  CountryContainerModel, CountryService,
  FinancialItemContainerModel, FinancialItemService, ItemEntityPricingContainerModel, ItemEntityPricingService, Pagination,
} from 'blg-akaun-ts-lib';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { SubSink } from 'subsink2';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { ComponentStore } from '@ngrx/component-store';
import { AppConfig } from 'projects/shared-utilities/visa';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppStates } from 'projects/shared-utilities/application-controller/store/states';
import { ViewColActions } from 'projects/shared-utilities/application-controller/store/actions';
import { ViewColumnFacade } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/facades/view-column.facade';
import { CustomerActions } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/actions';
import { CustomerSelectors } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/selectors';
import { CustomerStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/states';

@Component({
  selector: 'app-item-pricing-edit',
  templateUrl: './item-pricing-edit.component.html',
  styleUrls: ['./item-pricing-edit.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class EditItemPricingComponent extends ViewColumnComponent implements OnInit {

  public form: FormGroup;
  protected subs = new SubSink();
  bread = 'Item Pricing Edit';
  breadCrumbs: any[];
  ui: any;
  public innerWidth: any;
  hideBreadCrumb = false;
  countryContainerModel = new CountryContainerModel();
  entityBody = new FinancialItemContainerModel();
  deactivateReturn$;
  protected readonly index = 21;
  prevIndex: number;
  private prevLocalState: any;
  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  // apiVisa = AppConfig.ApiVisa;
  @Input() itemExt$: Observable<any>;
  @Input() customerEnt$: Observable<any>;

  addSuccess = 'Update';
  isClicked = 'primary';
  itemCategory$: Observable<any[]>;
  categoryList: any;
  newCurrency: any;
  getCurrency$: Observable<any>;
  currencyArr: any = [];
  extData: ItemEntityPricingContainerModel;

  paging = new Pagination();

  constructor(private fb: FormBuilder,
    private readonly store: Store<CustomerStates>,
    private viewColFacade: ViewColumnFacade,
    private itemPricing: ItemEntityPricingService,
    private snackBar: MatSnackBar,
    private fiservice: FinancialItemService,
    private readonly appStore: Store<AppStates>,
  ) { super(); }

  ngOnInit() {
    this.form = this.fb.group({
      guid: [''],
      itemName: [{ value: '', disabled: true }],
      itemCode: [{ value: '', disabled: true }],
      customerName: [{ value: '', disabled: true }],
      customerCode: [{ value: '', disabled: true }],
      currency: [{ value: '', disabled: true }],
      purchasePrice: [{ value: '', disabled: false }, Validators.required],
      salesPrice: [{ value: '', disabled: false }, Validators.required],
    });
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.itemExt$ = this.store.select(CustomerSelectors.selectExt);
    this.subs.sink = this.itemExt$.subscribe(
      data => {
        data.forEach(element => {
          if (element.bl_fi_mst_item_entity_pricing_link) {
            this.extData = element;
            console.log(this.extData, 'caronrowdata');
            this.subs.sink = this.fiservice.getByGuid(this.extData.bl_fi_mst_item_entity_pricing_link.item_hdr_guid.toString(), AppConfig.apiVisa)
              .subscribe(resolved => {
                this.form.patchValue(
                  {
                    guid: this.extData.bl_fi_mst_item_entity_pricing_link.guid,
                    purchasePrice: this.extData.bl_fi_mst_item_entity_pricing_link.purchase_unit_price,
                    salesPrice: this.extData.bl_fi_mst_item_entity_pricing_link.sales_unit_price,
                    itemCode: resolved.data.bl_fi_mst_item_hdr.code,
                    itemName: resolved.data.bl_fi_mst_item_hdr.name,
                    currency: resolved.data.bl_fi_mst_item_hdr.ccy_code,
                    customerCode: this.extData.bl_fi_mst_item_entity_pricing_link.entity_item_code,
                    customerName: this.extData.bl_fi_mst_item_entity_pricing_link.entity_item_name,
                  });
              })
          }
        })
      });
    this.itemCategory$ = this.store.select(CustomerSelectors.selectItemCategory);
    this.subs.sink = this.itemCategory$.subscribe(data => {
      console.log('itemCatselected', data);
      if (data) {
        this.categoryList = data;
      }
    });

    // this.subs.sink = this.form.valueChanges.subscribe({
    //   next: (form) => {
    //     console.log("form: ", form);
    //   }
    // });
  }

  disableButton() {
    return this.form?.invalid
  }

  onReturn() {
    this.store.dispatch(CustomerActions.resetCustomerEditExt());
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateList: false,
      rowIndexList: null,
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  onRemove() {
  }

  onSave() {
    console.log("data onSave(): ", this.extData)
    let newData = new ItemEntityPricingContainerModel();
    newData.bl_fi_mst_item_entity_pricing_link = this.extData.bl_fi_mst_item_entity_pricing_link;
    newData.bl_fi_mst_item_entity_pricing_link.sales_unit_price = this.form.controls['salesPrice'].value;
    newData.bl_fi_mst_item_entity_pricing_link.purchase_unit_price = this.form.controls['purchasePrice'].value;
    console.log("data onSave(): ", newData)
    this.subs.sink = this.itemPricing.put(newData, AppConfig.apiVisa)
      .subscribe(resolved => {
        console.log("resolved Item Pricing Update:\n", resolved)
      })
    this.store.dispatch(CustomerActions.resetCustomerEditExt());
    this.snackBar.open(`${this.form.controls['itemName'].value} edited`, 'Close');
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateList: false,
      rowIndexList: null,
    });
    this.appStore.dispatch(ViewColActions.resetIndex({ index: 2 }));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
