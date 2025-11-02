import { AfterViewChecked, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectionList } from '@angular/material/list';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-add-line-item-serial-number',
  templateUrl: './add-line-item-serial-number.component.html',
  styleUrls: ['./add-line-item-serial-number.component.css']
})
export class AddLineItemSerialNumberComponent implements OnInit, AfterViewChecked {

  @Input() childSelectedIndex$;

  serialNumbers: string[] = [];

  selectAll = new FormControl(false);

  @ViewChild(MatTabGroup, {static: true}) matTab: MatTabGroup;
  @ViewChild(MatSelectionList, {static: true}) matList: MatSelectionList;

  constructor() { }

  ngOnInit() {
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
    if (e && !this.serialNumbers.includes(e)) {
      this.serialNumbers.push(e);
    }
  }

}
