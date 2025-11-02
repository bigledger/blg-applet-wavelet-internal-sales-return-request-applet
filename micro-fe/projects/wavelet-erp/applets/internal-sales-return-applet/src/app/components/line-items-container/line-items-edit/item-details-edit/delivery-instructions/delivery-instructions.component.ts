import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { SubSink } from 'subsink2';
import { LineItemSelectors } from '../../../../../state-controllers/line-item-controller/store/selectors';
import { LineItemStates } from '../../../../../state-controllers/line-item-controller/store/states';

@Component({
  selector: 'app-edit-item-details-delivery-instructions',
  templateUrl: './delivery-instructions.component.html',
  styleUrls: ['./delivery-instructions.component.scss'],
})
export class EditLineItemDetailsDeliveryInstructions implements OnInit, OnDestroy {

  protected subs = new SubSink();

  lineItem$ = this.store.select(LineItemSelectors.selectLineItem);
  SalesReturn$ = this.store.select(LineItemSelectors.selectSalesReturn);
  form: FormGroup;
  copyEntity = new FormControl();
  copyRecipient = new FormControl();

  leftColControls = [
    { label: 'Instructions', formControl: 'instructions', type: 'text-area', readonly: false },
    { label: 'Delivery Date', formControl: 'deliveryDate', type: 'date', readonly: false },
  ];

  constructor(protected readonly store: Store<LineItemStates>) { }

  ngOnInit() {
    this.form = new FormGroup({
      instructions: new FormControl(),
      deliveryDate: new FormControl(),
      from: new FormControl(),
      to: new FormControl(),
      message: new FormControl()
    });

    this.subs.sink = this.lineItem$.subscribe({
      next: (b: any) => {
        this.form.patchValue({
          instructions: b?.line_property_json?.delivery_instructions?.instructions,
          deliveryDate: b?.line_property_json?.delivery_instructions?.deliveryDate,
          from: b?.line_property_json?.delivery_instructions?.from,
          to: b?.line_property_json?.delivery_instructions?.to,
          message: b?.line_property_json?.delivery_instructions?.message
        });
      }
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
