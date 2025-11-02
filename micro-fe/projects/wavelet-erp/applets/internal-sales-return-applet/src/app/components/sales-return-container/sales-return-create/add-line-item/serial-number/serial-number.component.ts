import { AfterViewChecked, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectionList } from '@angular/material/list';
import { MatTabGroup } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import { SubSink } from 'subsink2';
import { InternalSalesReturnSelectors } from '../../../../../state-controllers/internal-sales-return-controller/store/selectors';
import { InternalSalesReturnStates } from '../../../../../state-controllers/internal-sales-return-controller/store/states';
import { SerialNumberScanComponent } from './scan/scan.component';

@Component({
  selector: 'app-line-item-add-serial-number',
  templateUrl: './serial-number.component.html',
  styleUrls: ['./serial-number.component.css']
})
export class LineItemAddSerialNumberComponent implements OnInit, OnDestroy, AfterViewChecked {

  @Input() selectedIndex;
  @Input() editMode: boolean;

  protected subs = new SubSink();

  lineItem$ = this.store.select(InternalSalesReturnSelectors.selectLineItem);

  selectAll = new FormControl(false);
  serialNumbers: string[] = [];

  @ViewChild(MatTabGroup, { static: true }) matTab: MatTabGroup;
  @ViewChild(MatSelectionList, { static: true }) matList: MatSelectionList;
  @ViewChild(SerialNumberScanComponent) scan: SerialNumberScanComponent;

  constructor(
    protected readonly store: Store<InternalSalesReturnStates>) {
  }

  ngOnInit() {
    if (this.editMode) {
      this.subs.sink = this.lineItem$.subscribe({
        next: (resolve: any) => {
          if(resolve?.serial_no.serialNumbers){
            this.serialNumbers = resolve.serial_no.serialNumbers;
          }else{
            this.serialNumbers = [];
          }
        }
      });
    }
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
  }

  addSerialNumberFromScan(e: string) {
    if (e && e.length >= 3 && !this.serialNumbers.includes(e)) {
      this.serialNumbers.push(e);
      this.scan.invalid = false;
    } else {
      this.scan.invalid = true;
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
