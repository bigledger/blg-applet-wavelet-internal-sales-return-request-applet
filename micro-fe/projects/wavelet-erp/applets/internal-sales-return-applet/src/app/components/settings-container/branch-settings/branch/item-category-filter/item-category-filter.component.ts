import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { ComponentStore } from '@ngrx/component-store';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { LabelService, Pagination } from 'blg-akaun-ts-lib';
import { AppConfig } from 'projects/shared-utilities/visa';
import { Store } from '@ngrx/store';
import { SubSink } from 'subsink2';
import { InternalSalesReturnStates } from '../../../../../state-controllers/internal-sales-return-controller/store/states';
import { InternalSalesReturnSelectors } from '../../../../../state-controllers/internal-sales-return-controller/store/selectors';
import { InternalSalesReturnActions } from '../../../../../state-controllers/internal-sales-return-controller/store/actions';
import { BranchSettingsSelectors } from '../../../../../state-controllers/branch-settings-controller/selectors';
import { BranchSettingsStates } from '../../../../../state-controllers/branch-settings-controller/states';

interface LocalState {
    deactivateReturn: boolean;
    selectedIndex: number;
    deactivateAdd: boolean;
    deactivateList: boolean;
  }
  
  @Component({
    selector: 'app-item-category-filter',
    templateUrl: './item-category-filter.component.html',
    styleUrls: ['./item-category-filter.component.css']
  })

  
  export class ItemCategoryFilterComponent  extends ViewColumnComponent {
    labelListGuid0;
    labelListGuid1;
    labelListGuid2;
    labelListGuid3;
    labelListGuid4;
    labelListGuid5;
    labelListGuid6;
    labelListGuid7;
    labelListGuid8;
    labelListGuid9;
    labelListGuid10;

    form: FormGroup;
    apiVisa = AppConfig.apiVisa;
    private subs = new SubSink;
    options:any= {'level': 1, 'multiple': true}
    branchGuid;
    constructor(
      private store: Store<InternalSalesReturnStates>,
      private branchSettingsStore: Store<BranchSettingsStates>)
    {
      super();
    }
    ngOnInit(){
      this.subs.sink = this.store.select(InternalSalesReturnSelectors.selectCategoryGroupList).subscribe(c => {
        if (c) {
          const categoryCodes = ['EMP_CATEGORY_00','EMP_CATEGORY_01','EMP_CATEGORY_02','EMP_CATEGORY_03','EMP_CATEGORY_04','EMP_CATEGORY_05','EMP_CATEGORY_06','EMP_CATEGORY_07','EMP_CATEGORY_08','EMP_CATEGORY_09','EMP_CATEGORY_10'];
          
          for (let i = 0; i < categoryCodes.length; i++) {
            const code = categoryCodes[i];
         
            const filteredCategories = c.filter(cat => cat.bl_fi_mst_label_list_hdr.code === code);
            //console.log('filteredCategories',filteredCategories)
            this[`labelListGuid${i}`] = filteredCategories.length > 0
              ? filteredCategories[0].bl_fi_mst_label_list_hdr.guid
              : null;
          }
        }
      });
      this.subs.sink = this.branchSettingsStore.select(BranchSettingsSelectors.selectBranch).subscribe(b=>{
        this.branchGuid = b.bl_fi_mst_branch.guid;
      })
      
      this.options['multiple'] = true;
      this.options['required'] = false;
      this.form = new FormGroup({
        ITEM_CATEGORY_0: new FormControl(),
        ITEM_CATEGORY_1: new FormControl(),
        ITEM_CATEGORY_2: new FormControl(),
        ITEM_CATEGORY_3: new FormControl(),
        ITEM_CATEGORY_4: new FormControl(),
        ITEM_CATEGORY_5: new FormControl(),
        ITEM_CATEGORY_6: new FormControl(),
        ITEM_CATEGORY_7: new FormControl(),
        ITEM_CATEGORY_8: new FormControl(),
        ITEM_CATEGORY_9: new FormControl(),
        ITEM_CATEGORY_10: new FormControl(),
      })
      
      this.subs.sink = this.store.select(InternalSalesReturnSelectors.selectItemCategoryFilter).subscribe(i => {
        for (let level = 0; level <= 10; level++) {
          const cat = i.find(c => c.bl_applet_setting_filter_fi_item_category_link.level_value === level);
        
          if (cat) {
            const categoryGuids = (cat as any).bl_applet_setting_filter_fi_item_category_link.category_json?.guids;
            const formControlName = `ITEM_CATEGORY_${level}`;
        
            this.form.patchValue({
              [formControlName]: categoryGuids
            });
          }
        }
        
        
      })
    }

    onSubmit(){
      this.store.dispatch(InternalSalesReturnActions.saveSettingItemFilter({form:this.form,branch: this.branchGuid }));
    }


  }
