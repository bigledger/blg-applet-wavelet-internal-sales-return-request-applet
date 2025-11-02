import { NgModule } from '@angular/core';
import { UtilitiesModule } from 'projects/shared-utilities/utilities/utilities.module';
import { SlideRendererComponent } from './components/utilities/slide-renderer/slide-renderer.component';


@NgModule({
    imports: [
        UtilitiesModule
    ],
    exports: [

    ],
    declarations: [
        SlideRendererComponent
    ],
})
export class AppletUtilitiesModule { }
