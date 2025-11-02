import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { draftFeatureKey, draftReducers } from './state-controllers/draft-controller';
import { AttachmentEffects } from './state-controllers/draft-controller/store/effects/attachment.effects';
import { SettlementEffects } from './state-controllers/draft-controller/store/effects/settlement.effects';
import { PNSEffects } from './state-controllers/draft-controller/store/effects/pns.effects';
import {ContraEffects} from './state-controllers/draft-controller/store/effects/contra.effects';
import {
  SettlementAdjustmentEffects
} from "./state-controllers/draft-controller/store/effects/settlement-adjustment.effects";

@NgModule({
    imports: [
        StoreModule.forFeature(draftFeatureKey, draftReducers),
        EffectsModule.forFeature([
            AttachmentEffects,
            SettlementEffects,
            PNSEffects,
          ContraEffects,
          SettlementAdjustmentEffects,
        ])
    ],
})
export class DraftModule { }
