import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectionList } from '@angular/material/list';
import { Store } from '@ngrx/store';
import { SubSink } from 'subsink2';
import { bl_inv_batch_hdr_RowClass } from 'blg-akaun-ts-lib';
import * as moment from 'moment';
import { ItemSelectors, SalesReturnSelectors } from '../../../../../state-controllers/sales-return-controller/store/selectors';
import { SalesReturnStates } from '../../../../../state-controllers/sales-return-controller/store/states';

@Component({
  selector: 'app-line-item-batch-number',
  templateUrl: './batch-number.component.html',
  styleUrls: ['./batch-number.component.css']
})
export class LineItemBatchNumberComponent implements OnInit, OnDestroy {

  @Input() editMode: boolean;
  @Output() selectBatch = new EventEmitter();

  protected subs = new SubSink();

  lineItem$ = this.store.select(SalesReturnSelectors.selectLineItem);

  form: FormGroup;
  selectAll = new FormControl(false);
  batchNumbers: any[] = [];
  batchInvalid: boolean;
  dateInvalid: boolean;
  total: number = 0;
  quantityBalance: number;
  invalidQty: boolean = false;

  @ViewChild(MatSelectionList, {static: true}) matList: MatSelectionList;

  constructor(
    protected readonly store: Store<SalesReturnStates>) { 
  }

  ngOnInit() {
    if (this.editMode) {
      this.subs.sink = this.lineItem$.subscribe({ next: (resolve: any) => {
        if (resolve.batch_no) {
          resolve.batch_no.batches.forEach(b => {
            b.issue_date = moment(b.issue_date);
            b.expiry_date = moment(b.expiry_date);
          });
          this.batchNumbers = resolve.batch_no.batches;
        }
      }});
    }
    this.form = new FormGroup({
      batch_no: new FormControl('', Validators.required),
      qty: new FormControl('', Validators.compose([Validators.required, Validators.min(1)])),
      issue_date: new FormControl('', Validators.required),
      expiry_date: new FormControl('', Validators.required)
    });
    this.store.select(ItemSelectors.selectBatch).subscribe({
      next: (resolve: bl_inv_batch_hdr_RowClass) => {
        if (resolve) {
          this.form.patchValue({
            batch_no: resolve.batch_no,
            qty: 1,
            issue_date: moment(resolve.issue_date),
            expiry_date: moment(resolve.expiry_date)
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
    this.batchNumbers = this.batchNumbers.filter(s => !this.matList._value.includes(s));
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
    const batch = this.form.controls['batch_no'].value;
    const quantity = this.form.controls['qty'].value;
    const issue = this.form.controls['issue_date'].value;
    const expiry = this.form.controls['expiry_date'].value;

    this.batchNumbers.some(b => b.batch_no === batch) ? this.batchInvalid = true : this.batchInvalid = false;
    issue.isAfter(expiry) ? this.dateInvalid = true : this.dateInvalid = false;

    if (!this.batchInvalid && !this.dateInvalid) {
      this.batchNumbers.push(
        {
          batch_no: batch,
          qty: quantity,
          issue_date: issue,
          expiry_date: expiry,
        }
      );
      this.form.reset();
      this.total = this.batchNumbers.map(batch => batch.qty).reduce((prev, next) => prev + next);
    }
  }

  onSelectBatch() {
    this.selectBatch.emit();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
