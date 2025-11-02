import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  Pagination,  FinancialItemService,BranchSettlementMethodService
} from 'blg-akaun-ts-lib';
import { AppConfig } from 'projects/shared-utilities/visa';
import { forkJoin, iif, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { debounceTime, tap, filter, switchMap, distinctUntilChanged, map, mergeMap, takeUntil } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { BranchSettingsStates } from '../../../state-controllers/branch-settings-controller/states';
import { BranchSettingsSelectors } from '../../../state-controllers/branch-settings-controller/selectors';

@Component({
  selector: 'app-select-default-settlement-method',
  templateUrl: './select-default-settlement-method.component.html',
  styleUrls: ['./select-default-settlement-method.component.css']
})

export class SelectDefaultSettlementItemComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  private apiVisa = AppConfig.apiVisa;
  @Input() defaultSettlement = new FormControl();
  @Input() settlementMethodType: string;
  @Input() branchGuid: any;
  @Output() defaultSettlementSelected = new EventEmitter<any>();
  @Output() defaultSettlementChange = new EventEmitter<FormControl>();

  serverSideFiltering = new FormControl();
  serverSideSearching = false;
  filteredOptions$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  defaultSettlementList: any[] = [];
  selectedDefaultSettlement: any;
  filterControl = new FormControl();
  protected _onDestroy = new Subject<void>();

  constructor(
    private readonly store: Store<BranchSettingsStates>,
    private fiItemService: FinancialItemService,
  ) {
  }

  ngOnInit() {
    this.subs.sink = this.store.select(BranchSettingsSelectors.selectBranchSettlementMethodList)
    .subscribe((result) => {
      const filteredArray = result.filter(item => item.settlementType === this.settlementMethodType);
      this.defaultSettlementList = filteredArray;
      this.filteredOptions$.next(this.defaultSettlementList);
    })

    this.subs.sink = this.filterControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe({next: resolve => this.filterDefaultSettlement(resolve)});
  }

  filterDefaultSettlement(search: string) {
    if (!search) {
      this.filteredOptions$.next(this.defaultSettlementList);
    } else {
      search = search.toLocaleLowerCase();
      const filter = this.defaultSettlementList.filter(c => 
        c.code.toLowerCase().indexOf(search) > -1 ||
        c.name.toLocaleLowerCase().includes(search) 
      );
      this.filteredOptions$.next(filter);
    }

  }

  onSelect(guid: string) {
    if (guid) {
      this.defaultSettlement.patchValue(guid);
      this.selectedDefaultSettlement = this.defaultSettlementList.find(n => n.guid === guid);
      this.defaultSettlementSelected.emit(this.selectedDefaultSettlement);
     
    }
  }


  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}