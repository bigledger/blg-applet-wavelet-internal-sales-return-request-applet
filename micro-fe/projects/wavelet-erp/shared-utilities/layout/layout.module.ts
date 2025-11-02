import { NgModule } from "@angular/core";
import { AccordionAnchorDirective, AccordionDirective, AccordionLinkDirective } from "./accordion";
import { LayoutComponent } from "./layout.component";
import { FilterPipe } from "./filter.pipe";
import { AppSidebarComponent } from "./sidebar/sidebar.component";
import { CommonModule } from "@angular/common";
import { NgxUiLoaderModule, NgxUiLoaderRouterModule, NgxUiLoaderHttpModule, NgxUiLoaderService } from "ngx-ui-loader";
import { RouterModule } from "@angular/router";
import { UtilitiesModule } from "projects/akaun-platform/shared-utilities/utilities/utilities.module";

@NgModule({
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    FilterPipe,
    LayoutComponent,
    AppSidebarComponent
  ],
  exports: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    NgxUiLoaderModule,
    NgxUiLoaderRouterModule,
    NgxUiLoaderHttpModule,
    RouterModule,
    UtilitiesModule
  ],
  providers: [
    NgxUiLoaderService
  ]
})
export class LayoutModule {}
