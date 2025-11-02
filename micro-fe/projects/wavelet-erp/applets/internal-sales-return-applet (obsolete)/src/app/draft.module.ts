import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { draftFeatureKey, draftReducers } from './state-controllers/draft-controller';
import { AttachmentEffects } from './state-controllers/draft-controller/store/effects/attachment.effects';
import { PaymentEffects } from './state-controllers/draft-controller/store/effects/payment.effects';

@NgModule({
    imports: [
        StoreModule.forFeature(draftFeatureKey, draftReducers),
        EffectsModule.forFeature([
            AttachmentEffects,
            PaymentEffects,
        ])
    ],
})
export class DraftModule {}
