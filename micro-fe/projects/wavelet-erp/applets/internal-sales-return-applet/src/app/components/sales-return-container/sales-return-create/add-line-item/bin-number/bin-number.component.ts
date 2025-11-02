import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectionList } from '@angular/material/list';
import { Store } from '@ngrx/store';
import { SubSink } from 'subsink2';
import { InternalSalesReturnSelectors } from '../../../../../state-controllers/internal-sales-return-controller/store/selectors';
import { InternalSalesReturnStates } from '../../../../../state-controllers/internal-sales-return-controller/store/states';
import { FinancialItemContainerModel, FinancialItemService } from 'blg-akaun-ts-lib';
import { Observable } from 'rxjs/Observable';
import { map, mergeMap } from 'rxjs/operators';
import { AppConfig } from 'projects/shared-utilities/visa';
import { updateTotalBin } from '../../../../../state-controllers/internal-sales-return-controller/store/actions/internal-sales-return.actions';

@Component({
  selector: 'app-line-item-add-bin-number',
  templateUrl: './bin-number.component.html',
  styleUrls: ['./bin-number.component.css']
})
export class LineItemAddBinNumberComponent implements OnInit, OnDestroy {

  @Input() editMode: boolean;
  item$: Observable<FinancialItemContainerModel>;
  protected subs = new SubSink();

  lineItem$ = this.store.select(InternalSalesReturnSelectors.selectLineItem);
  apiVisa = AppConfig.apiVisa;
  form: FormGroup;
  selectAll = new FormControl(false);
  binNumbers: any[] = [];
  binInvalid: boolean;
  total = 0;
  invalidContainerMeasure: boolean = false
  invalidContainerQuantity: boolean = false
  @ViewChild(MatSelectionList, { static: true }) matList: MatSelectionList;

  constructor(
    protected readonly store: Store<InternalSalesReturnStates>,
    protected fiService: FinancialItemService,) {
  }

  ngOnInit() {
    if (this.editMode) {
      this.subs.sink = this.store.select(InternalSalesReturnSelectors.selectTotalBin).subscribe(total=>{
        this.total = total;})
      this.subs.sink = this.lineItem$.subscribe({
        next: (resolve: any) => {
          if (resolve.bin_no) {
            this.binNumbers = resolve.bin_no.bins;
            this.calculateTotal();
          }
        }
      });
    }
    this.item$ = this.store.select(InternalSalesReturnSelectors.selectLineItem).pipe(
      mergeMap((resolve: any) =>
        this.fiService.getByGuid(resolve.item_guid, this.apiVisa).pipe(
          map(a => a.data))
      )
    );

    this.form = new FormGroup({
      bin_code: new FormControl('', Validators.required),
      container_measure: new FormControl(0.00, Validators.compose([Validators.required, Validators.min(0)])),
      container_qty: new FormControl(0.00, Validators.compose([Validators.required, Validators.min(0)])),
      qty: new FormControl(0.00, Validators.compose([Validators.required, Validators.min(1)])),
      container_uom: new FormControl('', Validators.required)
    });

    this.subs.sink = this.store.select(InternalSalesReturnSelectors.selectSalesReturnDocument).subscribe(resolve =>{
      if (resolve.bl_fi_generic_doc_hdr.posting_status == "VOID"){
        this.form.disable()
      }
    });
    this.calculateTotal();
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
    this.calculateTotal();
  }

  disableAdd() {
    return this.form.invalid;
  }

  calculateBinQuantity(){
    const containerMeasure = this.form.controls['container_measure'].value;
    const containerQuantity = this.form.controls['container_qty'].value;

    if(containerMeasure >= 0){
      this.invalidContainerMeasure = false;
    } else {
      this.invalidContainerMeasure = true;
    }

    if(containerQuantity >= 0){
      this.invalidContainerQuantity = false;
    } else {
      this.invalidContainerQuantity = true;

    }

    const quantity = containerMeasure * containerQuantity;

    this.form.patchValue({
      qty : quantity > 0 ? quantity : 0.00
    })
  }

  onSelectedUomModel(e: any) {
    this.form.controls['container_uom'].patchValue(e.uom);
  }

  onAdd() {
    const bin_code = this.form.controls['bin_code'].value;
    const ctr_measure = this.form.controls['container_measure'].value;
    const ctr_qty = this.form.controls['container_qty'].value;
    const qty = this.form.controls['qty'].value;
    const container_uom = this.form.controls['container_uom'].value;

    this.binNumbers.some(b => b.bin_hdr_code === bin_code) ? this.binInvalid = true : this.binInvalid = false;

    if (!this.binInvalid) {
      this.binNumbers.push(
        {
          bin_hdr_guid: null,
          bin_line_guid: null,
          bin_hdr_code: bin_code,
          bin_line_code: bin_code,
          container_measure: ctr_measure,
          container_qty: ctr_qty,
          qty: qty,
          container_uom: container_uom,
          container_width: null,
        }
      );
      this.form.reset();
      this.calculateTotal();
    }
  }

  calculateTotal() {
    this.total = this.binNumbers.map(bin => bin.qty).reduce((prev, next) => prev + next, 0);
    this.store.dispatch(updateTotalBin({ totalBin: this.total }));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}