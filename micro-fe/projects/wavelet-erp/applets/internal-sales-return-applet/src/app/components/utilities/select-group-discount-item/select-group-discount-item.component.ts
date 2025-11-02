import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  Pagination, FinancialItemContainerModel, FinancialItemService,
} from 'blg-akaun-ts-lib';
import { AppConfig } from 'projects/shared-utilities/visa';
import { forkJoin, iif, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { debounceTime, tap, filter, switchMap, distinctUntilChanged, map, mergeMap, takeUntil } from 'rxjs/operators';
import { SubSink } from 'subsink2';

@Component({
  selector: 'app-select-group-discount-item',
  templateUrl: './select-group-discount-item.component.html',
  styleUrls: ['./select-group-discount-item.component.css']
})

export class SelectGroupDiscountItemComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  private apiVisa = AppConfig.apiVisa;
  @Input() groupDiscount = new FormControl();
  @Output() groupDiscountSelected = new EventEmitter<FinancialItemContainerModel>();
  @Output() groupDiscountChange = new EventEmitter<FormControl>();

  serverSideFiltering = new FormControl();
  serverSideSearching = false;
  filteredOptions$: ReplaySubject<FinancialItemContainerModel[]> = new ReplaySubject<FinancialItemContainerModel[]>(1);
  groupDiscountList: FinancialItemContainerModel[] = [];
  selectedGroupDiscount: FinancialItemContainerModel;
  filterControl = new FormControl();
  protected _onDestroy = new Subject<void>();

  constructor(
    private fiService: FinancialItemService
  ) {
  }

  ngOnInit() {
    const paging = new Pagination();
    paging.conditionalCriteria.push({
      columnName: 'txn_type',
      operator: '=',
      value: "GROUP_DISCOUNT",
    });
    
  
    this.subs.sink = this.fiService.getByCriteria(paging,this.apiVisa).subscribe(
      {next: resolve => {
        console.log()
        this.groupDiscountList = resolve.data;
        if(resolve.data && resolve.data.length===1){
          this.onSelect(resolve.data[0].bl_fi_mst_item_hdr.guid.toString());
        }
        this.filteredOptions$.next(this.groupDiscountList);
      }});
    this.subs.sink = this.filterControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe({next: resolve => this.filterGroupDiscount(resolve)});
  }

  

  filterGroupDiscount(search: string) {
    if (!search) {
      this.filteredOptions$.next(this.groupDiscountList);
    } else {
      search = search.toLocaleLowerCase();
      const filter = this.groupDiscountList.filter(c => 
        c.bl_fi_mst_item_hdr.code.toLowerCase().indexOf(search) > -1 ||
        c.bl_fi_mst_item_hdr.name.toLocaleLowerCase().includes(search) 
      );
      this.filteredOptions$.next(filter);
    }

  }

  onSelect(guid: string) {
    if (guid) {
      this.groupDiscount.patchValue(guid);
      this.selectedGroupDiscount = this.groupDiscountList.find(n => n.bl_fi_mst_item_hdr.guid === guid);
      this.groupDiscountSelected.emit(this.selectedGroupDiscount);
     
    }
  }


  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}