import { AfterViewChecked, Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectionList } from '@angular/material/list';
import { MatTabGroup } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import { SubSink } from 'subsink2';
import { SerialNumberScanComponent } from './serial-number-scan/serial-number-scan.component';
import { SerialNumberListingComponent } from './serial-number-listing/serial-number-listing.component';
import { DraftStates } from '../../../../../state-controllers/draft-controller/store/states';
import { HDRSelectors } from '../../../../../state-controllers/draft-controller/store/selectors';
import { ItemSelectors } from '../../../../../state-controllers/sales-return-controller/store/selectors';
import { SalesReturnSelectors } from '../../../../../state-controllers/sales-return-controller/store/selectors';
import { SalesReturnStates } from '../../../../../state-controllers/sales-return-controller/store/states';

@Component({
  selector: 'app-line-item-serial-number',
  templateUrl: './serial-number.component.html',
  styleUrls: ['./serial-number.component.css']
})
export class LineItemSerialNumberComponent implements OnInit, OnDestroy, AfterViewChecked {

  @Input() selectedIndex$;
  @Input() editMode: boolean;

  protected subs = new SubSink();

  readonly draft$ = this.draftStore.select(HDRSelectors.selectHdr);
  readonly lineItem$ = this.store.select(SalesReturnSelectors.selectLineItem);
  readonly invItem$ = this.store.select(ItemSelectors.selectInvItem);
  readonly serial$ = this.store.select(ItemSelectors.selectSerial);

  selectAll = new FormControl(false);
  serialNumbers: string[] = [];

  @ViewChild(MatTabGroup, {static: true}) matTab: MatTabGroup;
  @ViewChild(MatSelectionList, {static: true}) matList: MatSelectionList;
  @ViewChild(SerialNumberScanComponent) scan: SerialNumberScanComponent;
  @ViewChild(SerialNumberListingComponent) listing: SerialNumberListingComponent;

  constructor(
    protected readonly store: Store<SalesReturnStates>,
    protected readonly draftStore: Store<DraftStates>) { 
  }

  ngOnInit() {
    if (this.editMode) {
      this.subs.sink = this.lineItem$.subscribe({
        next: (resolve: any) => {
          this.serialNumbers = resolve.serial_no.serialNumbers;
        }
      });
    } 
    this.subs.sink = this.serial$.subscribe(
      sn => {
        if (sn) this.serialNumbers.push(sn);
      }
    );
  }

  ngAfterViewChecked() {
    this.matTab.realignInkBar();
  }

  onSelect(e) {
    this.selectAll.patchValue(false);
  }

  onSelectAll() {
    this.matList.selectedOptions.selected.length === this.matList.options.length ? this.matList.deselectAll() : this.matList.selectAll();
  }

  onRemove() {
    // TODO: There is an error when clicking delete when so selection is made and then a selection was made
    this.serialNumbers = this.serialNumbers.filter(s => !this.matList._value.includes(s));
    this.selectAll.patchValue(false);
    this.listing.setGridData();
  }

  addSerialNumberFromScan(sn: string) {
    if (sn && sn.length >= 3 && !this.serialNumbers.includes(sn) && this.listing.existingSerialNumbers.includes(sn)) {
      this.serialNumbers.push(sn);
      this.scan.invalid = false;
    } else {
      this.scan.invalid = true;
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}