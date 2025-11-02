import { Component, OnInit, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectionList } from '@angular/material/list';
import { Store } from '@ngrx/store';
import { bl_inv_bin_hdr_RowClass } from 'blg-akaun-ts-lib';
import { SubSink } from 'subsink2';
import { LineItemSelectors } from '../../../../state-controllers/line-item-controller/store/selectors';
import { LineItemStates } from '../../../../state-controllers/line-item-controller/store/states';

@Component({
  selector: 'app-edit-line-item-bin-number',
  templateUrl: './bin-number.component.html',
  styleUrls: ['./bin-number.component.scss']
})
export class EditLineItemBinNumberComponent implements OnInit, OnDestroy {

  @Output() selectBin = new EventEmitter();

  protected subs = new SubSink();

  lineItem$ = this.store.select(LineItemSelectors.selectLineItem);

  form: FormGroup;
  selectAll = new FormControl(false);
  binNumbers: any[] = [];
  binInvalid: boolean;
  total: number = 0;
  quantityBalance: number;
  invalidQty: boolean = false;

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
    this.store.select(LineItemSelectors.selectBin).subscribe({
      next: (resolve: bl_inv_bin_hdr_RowClass) => {
        if (resolve) {
          this.form.patchValue({
            bin_code: resolve.code,
            qty: 1
          });
          this.quantityBalance = Number(resolve.qty_balance);
        }
      }
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

  checkQtyInput(value: number) {
    // have to check with adjustment table once it is ready
    if (value > this.quantityBalance) this.invalidQty = true;
    else this.invalidQty = false;
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
      this.total = this.binNumbers.map(bin => bin.qty).reduce((prev, next) => prev + next);
    }
  }

  onSelectBin() {
    this.selectBin.emit();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}