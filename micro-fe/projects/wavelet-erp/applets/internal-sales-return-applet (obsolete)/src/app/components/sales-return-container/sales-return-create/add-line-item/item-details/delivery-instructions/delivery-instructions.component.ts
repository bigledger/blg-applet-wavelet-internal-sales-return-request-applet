import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { SubSink } from 'subsink2';
import { SalesReturnStates } from '../../../../../../state-controllers/sales-return-controller/store/states';
import { SalesReturnSelectors } from '../../../../../../state-controllers/sales-return-controller/store/selectors';
import { DraftStates } from '../../../../../../state-controllers/draft-controller/store/states';
import { HDRSelectors } from '../../../../../../state-controllers/draft-controller/store/selectors'
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-item-details-delivery-instructions',
  templateUrl: './delivery-instructions.component.html',
  styleUrls: ['./delivery-instructions.component.scss'],
})
export class ItemDetailsDeliveryInstructions implements OnInit, OnDestroy {

  @Input() editMode: boolean;

  protected subs = new SubSink();

  lineItem$ = this.store.select(SalesReturnSelectors.selectLineItem);

  form: FormGroup;
  copyEntity = new FormControl();
  copyRecipient = new FormControl();

  leftColControls = [
    { label: 'Instructions', formControl: 'instructions', type: 'text-area', readonly: false },
    { label: 'Delivery Date', formControl: 'deliveryDate', type: 'date', readonly: false },
  ];

  constructor(
    protected readonly store: Store<SalesReturnStates>,
    protected readonly draftStore: Store<DraftStates>) { 
  }

  ngOnInit() {
    this.form = new FormGroup({
      instructions: new FormControl(),
      deliveryDate: new FormControl(),
      from: new FormControl(),
      to: new FormControl(),
      message: new FormControl(),
    });

    this.subs.sink = combineLatest([this.copyEntity.valueChanges, this.draftStore.select(HDRSelectors.selectHdr)]).subscribe({
      next: ([a, draft]) => {
        if (a) {
          this.form.patchValue({
            from: draft.property_json?.purchaser?.purchaserName
          })
        } else {
          this.form.patchValue({
            from: null
          })
        }
      }
    });
    this.subs.sink = combineLatest([this.copyRecipient.valueChanges, this.draftStore.select(HDRSelectors.selectHdr)]).subscribe({
      next: ([a, draft]) => {
        if (a) {
          this.form.patchValue({
            to: (<any>draft.doc_entity_hdr_json).entityName
          })
        } else {
          this.form.patchValue({
            to: null
          })
        }
      }
    });

    if (this.editMode) {
      this.subs.sink = this.lineItem$.subscribe({ next: (b: any) => {
        this.form.patchValue({
          instructions: b.line_property_json?.delivery_instructions?.instructions,
          deliveryDate: b.line_property_json?.delivery_instructions?.deliveryDate,
          from: b.line_property_json?.delivery_instructions?.from,
          to: b.line_property_json?.delivery_instructions?.to,
          message: b.line_property_json?.delivery_instructions?.message
        });
      }});

      this.subs.sink = this.draftStore.select(HDRSelectors.selectHdr).subscribe({ next: (resolve: any) => {
        if (this.form.value.from === resolve.property_json?.purchaser?.purchaserName)
          this.copyEntity.patchValue(true);
        if (this.form.value.to === resolve.doc_entity_hdr_json?.entityName)
          this.copyRecipient.patchValue(true);
      }})
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}