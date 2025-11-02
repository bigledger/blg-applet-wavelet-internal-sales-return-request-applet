import { NgModule } from '@angular/core';

import {MenuItems} from './menu-items';

import {
  AccordionAnchorDirective,
  AccordionLinkDirective,
  AccordionDirective
} from './accordion';
import {SanitizeHtmlPipe} from '../pipes/sanitize-html.pipe';

@NgModule({
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    SanitizeHtmlPipe
  ],
  exports: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    SanitizeHtmlPipe
  ],
  providers: [MenuItems]
})
export class SharedModule {}
