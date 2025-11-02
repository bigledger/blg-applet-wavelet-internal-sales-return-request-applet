import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  CountryContainerModel, CountryService,
  FinancialItemContainerModel, Pagination,
} from 'blg-akaun-ts-lib';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { SubSink } from 'subsink2';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { ComponentStore } from '@ngrx/component-store';
import { ViewColumnFacade } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/facades/view-column.facade';
import { CustomerActions } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/actions';
import { CustomerSelectors } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/selectors';
import { CustomerStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/states';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class EditCategoryComponent extends ViewColumnComponent implements OnInit {

  public form: FormGroup;
  protected subs = new SubSink();
  bread = 'Category Edit';
  breadCrumbs: any[];
  ui: any;
  public innerWidth: any;
  hideBreadCrumb = false;
  countryContainerModel = new CountryContainerModel();
  entityBody = new FinancialItemContainerModel();
  deactivateReturn$;
  protected readonly index = 14;
  prevIndex: number;
  private prevLocalState: any;
  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  // apiVisa = AppConfig.ApiVisa;
  @Input() itemExt$: Observable<any>;

  addSuccess = 'Update';
  isClicked = 'primary';
  itemCategory$: Observable<any[]>;
  categoryList: any;

  paging = new Pagination();

  constructor(private fb: FormBuilder,
    private readonly store: Store<CustomerStates>,
    private viewColFacade: ViewColumnFacade,
  ) { super(); }

  ngOnInit() {
    this.form = this.fb.group({
      guid: [''],
      CategoryName: [{ value: '', disabled: true }],
      CategoryCode: [{ value: '', disabled: true }],
      Description: [{ value: '', disabled: true }],
      status: [{ value: '', disabled: true }]
    });
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.itemExt$ = this.store.select(CustomerSelectors.selectExt);
    // get row clicked data from item edit
    this.subs.sink = this.itemExt$.subscribe(
      data => {

        const extData = data[0].ext;
        console.log(extData, 'caronrowdata');
        this.form.patchValue(
          {
            guid: extData.guid,
            CategoryName: extData.name,
            CategoryCode: extData.code,
            Description: extData.descr,
            status: extData.status
          });
      });
    this.itemCategory$ = this.store.select(CustomerSelectors.selectItemCategory);
    this.subs.sink = this.itemCategory$.subscribe(data => {
      console.log('itemCatselected', data);
      if (data) {
        this.categoryList = data;
      }
    }
    );

  }


  onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateAdd: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  onRemove() {
    this.form.patchValue(
      {
        status: 'DELETED'
      },
    );
    const removedItems = this.form.value.guid.toString();
    if (removedItems != null) {
      console.log(this.categoryList, 'thiscategoryList');
      this.categoryList.guids.forEach((item, index) => {
        console.log(item, 'eachnode');
        if (item.guid === removedItems) {
          console.log(index, 'indexeachnode');
          this.categoryList.guids.splice(index, 1);
          // this.messageCat = 'Category ' + item.name + ' removed from Item';
          // this.openSnackBar(this.messageCat, 'Close');
        }
      });
      // /remove the duplicate values on array
      const unique = this.categoryList.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
      });
      this.store.dispatch(CustomerActions.itemCategory({ category: this.categoryList.guids, updated: true }));
      this.onReturn();
    }
  }
  onSave() {

  }
}
