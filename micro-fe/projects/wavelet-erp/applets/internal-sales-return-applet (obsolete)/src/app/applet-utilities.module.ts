import { NgModule } from '@angular/core';
import { UtilitiesModule } from 'projects/shared-utilities/utilities/utilities.module';
import { PricingSchemeComponent } from './components/utilities/pricing-scheme/pricing-scheme.component';
import { SlideRendererComponent } from './components/utilities/slide-renderer/slide-renderer.component';


@NgModule({
    imports: [
        UtilitiesModule
    ],
    exports: [
        PricingSchemeComponent
    ],
    declarations: [
        PricingSchemeComponent,
        SlideRendererComponent
    ],
})
export class AppletUtilitiesModule { }
