import { AfterViewChecked, Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectionList } from '@angular/material/list';
import { MatTabGroup } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { GenericDocContainerModel } from 'blg-akaun-ts-lib';
import { EditLineItemSerialNumberScanComponent } from './serial-number-scan/serial-number-scan.component';
import { EditLineItemSerialNumberListingComponent } from './serial-number-listing/serial-number-listing.component';
import { LineItemSelectors } from '../../../../state-controllers/line-item-controller/store/selectors';
import { LineItemStates } from '../../../../state-controllers/line-item-controller/store/states';

@Component({
  selector: 'app-edit-line-item-serial-number',
  templateUrl: './serial-number.component.html',
  styleUrls: ['./serial-number.component.scss']
})
export class EditLineItemSerialNumberComponent implements OnInit, OnDestroy, AfterViewChecked {

  @Input() selectedIndex$;

  protected subs = new SubSink();

  readonly return$ = this.store.select(LineItemSelectors.selectOrder).pipe(
    map((doc: GenericDocContainerModel) => doc.bl_fi_generic_doc_hdr)
  );
  readonly lineItem$ = this.store.select(LineItemSelectors.selectLineItem);
  readonly invItem$ = this.store.select(LineItemSelectors.selectInvItem);

  serialNumbers: string[] = [];
  selectAll = new FormControl(false);

  @ViewChild(MatTabGroup) matTab: MatTabGroup;
  @ViewChild(MatSelectionList, {static: true}) matList: MatSelectionList;
  @ViewChild(EditLineItemSerialNumberScanComponent) scan: EditLineItemSerialNumberScanComponent;
  @ViewChild(EditLineItemSerialNumberListingComponent) listing: EditLineItemSerialNumberListingComponent;

  constructor(protected readonly store: Store<LineItemStates>) { }

  ngOnInit() {
    this.lineItem$.subscribe({ next: (resolve: any) => {
      if (resolve.serial_no) {
        this.serialNumbers = resolve.serial_no.serialNumbers;
      }
    }});
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
    if (sn && sn.length > 3 && !this.serialNumbers.includes(sn) && this.listing.existingSerialNumbers.includes(sn)) {
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
