import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { InternalSalesReturnSelectors } from '../../../../../../state-controllers/internal-sales-return-controller/store/selectors';
import { InternalSalesReturnStates } from '../../../../../../state-controllers/internal-sales-return-controller/store/states';
import { combineLatest } from 'rxjs';
import { SubSink } from 'subsink2';
import { HDRSelectors } from '../../../../../../state-controllers/draft-controller/store/selectors';
import { DraftStates } from '../../../../../../state-controllers/draft-controller/store/states';
@Component({
  selector: 'app-item-details-delivery-instructions',
  templateUrl: './delivery-instructions.component.html',
  styleUrls: ['./delivery-instructions.component.scss'],
})
export class ItemDetailsDeliveryInstructions implements OnInit, OnDestroy {

  @Input() editMode: boolean;

  protected subs = new SubSink();

  lineItem$ = this.store.select(InternalSalesReturnSelectors.selectLineItem);
  form: FormGroup;
  copyEntity = new FormControl();
  copyRecipient = new FormControl();

  leftColControls = [
    { label: 'Instructions', formControl: 'instructions', type: 'text-area', readonly: false },
    { label: 'Delivery Date', formControl: 'deliveryDate', type: 'date', readonly: false },
  ];

  constructor(
    protected readonly store: Store<InternalSalesReturnStates>,
    protected readonly draftStore: Store<DraftStates>
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      instructions: new FormControl(),
      deliveryDate: new FormControl(),
      from: new FormControl(),
      to: new FormControl(),
      message: new FormControl(),
    });

    this.subs.sink = combineLatest([this.copyEntity.valueChanges, this.draftStore.select(HDRSelectors.selectEntityName)]).subscribe({
      next: ([a, entityName]) => {
        if (a) {
          this.form.patchValue({
            from: entityName
          })
        } else {
          this.form.patchValue({
            from: null
          })
        }
      }
    });

    this.subs.sink = combineLatest([this.copyRecipient.valueChanges, this.draftStore.select(HDRSelectors.selectRecipientName)]).subscribe({
      next: ([a, recipientName]) => {
        if (a) {
          this.form.patchValue({
            to: recipientName
          })
        } else {
          this.form.patchValue({
            to: null
          })
        }
      }
    });

    if (this.editMode) {
      this.subs.sink = this.lineItem$.subscribe({
        next: (b: any) => {
          this.form.patchValue({
            instructions: b.line_property_json?.delivery_instructions?.instructions,
            deliveryDate: b.line_property_json?.delivery_instructions?.deliveryDate,
            from: b.line_property_json?.delivery_instructions?.from,
            to: b.line_property_json?.delivery_instructions?.to,
            message: b.line_property_json?.delivery_instructions?.message
          });
        }
      });
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
