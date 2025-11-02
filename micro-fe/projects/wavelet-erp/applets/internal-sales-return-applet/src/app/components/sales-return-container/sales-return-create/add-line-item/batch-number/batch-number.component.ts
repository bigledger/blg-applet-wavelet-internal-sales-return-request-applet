import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectionList } from '@angular/material/list';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { SubSink } from 'subsink2';
import { InternalSalesReturnSelectors } from '../../../../../state-controllers/internal-sales-return-controller/store/selectors';
import { InternalSalesReturnStates } from '../../../../../state-controllers/internal-sales-return-controller/store/states';

@Component({
  selector: 'app-line-item-add-batch-number',
  templateUrl: './batch-number.component.html',
  styleUrls: ['./batch-number.component.css']
})
export class LineItemAddBatchNumberComponent implements OnInit, OnDestroy {

  @Input() editMode: boolean;

  protected subs = new SubSink();

  lineItem$ = this.store.select(InternalSalesReturnSelectors.selectLineItem);

  form: FormGroup;
  selectAll = new FormControl(false);
  batchNumbers: any[] = [];
  batchInvalid: boolean;
  dateInvalid: boolean;

  @ViewChild(MatSelectionList, { static: true }) matList: MatSelectionList;

  constructor(
    protected readonly store: Store<InternalSalesReturnStates>) {
  }

  ngOnInit() {
    if (this.editMode) {
      this.subs.sink = this.lineItem$.subscribe({
        next: (resolve: any) => {
          if (resolve.batch_no) {
            resolve.batch_no.batches.forEach(b => {
              b.issue_date = moment(b.issue_date);
              b.expiry_date = moment(b.expiry_date);
            });
            this.batchNumbers = resolve.batch_no.batches;
          }
        }
      });
    }

    this.form = new FormGroup({
      batch_no: new FormControl('', Validators.required),
      qty: new FormControl('', Validators.compose([Validators.required, Validators.min(1)])),
      issue_date: new FormControl('', Validators.required),
      expiry_date: new FormControl('', Validators.required)
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
          batch_no: this.form.controls['batch_no'].value,
          qty: this.form.controls['qty'].value,
          issue_date: this.form.controls['issue_date'].value,
          expiry_date: this.form.controls['expiry_date'].value,
        }
      );
      this.form.reset();
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
