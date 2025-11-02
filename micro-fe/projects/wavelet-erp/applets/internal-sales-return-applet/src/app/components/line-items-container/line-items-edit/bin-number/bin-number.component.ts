import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectionList } from '@angular/material/list';
import { Store } from '@ngrx/store';
import { SubSink } from 'subsink2';
import { LineItemSelectors } from '../../../../state-controllers/line-item-controller/store/selectors';
import { LineItemStates } from '../../../../state-controllers/line-item-controller/store/states';

@Component({
  selector: 'app-edit-line-item-bin-number',
  templateUrl: './bin-number.component.html',
  styleUrls: ['./bin-number.component.scss']
})
export class EditLineItemBinNumberComponent implements OnInit, OnDestroy {

  protected subs = new SubSink();

  lineItem$ = this.store.select(LineItemSelectors.selectLineItem);

  form: FormGroup;
  selectAll = new FormControl(false);
  binNumbers: any[] = [];
  binInvalid: boolean;

  @ViewChild(MatSelectionList, {static: true}) matList: MatSelectionList;

  constructor(
    protected readonly store: Store<LineItemStates>) { 
  }

  ngOnInit() {
    this.subs.sink = this.lineItem$.subscribe({
      next: (resolve: any) => {
        if (resolve.bin_no) {
          this.binNumbers = resolve.bin_no.bins
        }
      }
    });

    this.form = new FormGroup({
      bin_code: new FormControl('', Validators.required),
      container_measure: new FormControl('', Validators.required),
      container_qty: new FormControl('', Validators.required),
      qty: new FormControl('', Validators.compose([Validators.required, Validators.min(1)]))
    });
  }

  onSelect(e) {
    this.selectAll.patchValue(false);
  }

  onSelectAll() {
    this.matList.selectedOptions.selected.length === this.matList.options.length ? this.matList.deselectAll() : this.matList.selectAll();
  }

  onRemove() {
    // TODO: There is an error when clicking delete when so selection is made and then a selection was made
    this.binNumbers = this.binNumbers.filter(s => !this.matList._value.includes(s));
    this.selectAll.patchValue(false);
  }

  disableAdd() {
    return this.form.invalid;
  }

  onAdd() {
    const bin_code = this.form.controls['bin_code'].value;
    const ctr_measure = this.form.controls['container_measure'].value;
    const ctr_qty = this.form.controls['container_qty'].value;
    const qty = this.form.controls['qty'].value;

    this.binNumbers.some(b => b.bin_hdr_code === bin_code) ? this.binInvalid = true : this.binInvalid = false;

    if (!this.binInvalid) {
      this.binNumbers.push(
        {
          bin_hdr_guid: null,
          bin_line_guid: null,
          bin_hdr_code: bin_code,
          container_measure: ctr_measure,
          container_qty: ctr_qty,
          qty: qty,
        }
      );
      this.form.reset();
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}