import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { Injector, NgModule } from "@angular/core";
import { createCustomElement } from "@angular/elements";
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material/core";
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from "@angular/material/snack-bar";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG
} from "ngx-perfect-scrollbar";
import { ToastrModule } from "ngx-toastr";
import { AkaunConfirmationDialogComponent, AkaunMessageDialogComponent } from "projects/shared-utilities";
import { appReducers } from "projects/shared-utilities/application-controller/store/reducers";
import { LayoutModule } from "projects/shared-utilities/modules/layout/layout.module";
import { PermissionModule } from "projects/shared-utilities/modules/permission/permission.module";
import { environment } from "src/environments/environment";
import { AppComponent } from "./app.component";
import { AppRoutes } from "./app.routing";
import { AppletPersonalizationModule } from "./components/personalization-container/applet-personalization.module";
import { AppletSettingsModule } from "./components/settings-container/applet-settings.module";
import { ViewCacheModule } from "./view-cache.module";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true,
};
export const MY_FORMATS = {
  parse: {
    dateInput: "LL",
  },
  display: {
    dateInput: "YYYY-MM-DD",
    monthYearLabel: "YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "YYYY",
  },
};

@NgModule({
  declarations: [
    AppComponent,
    AkaunMessageDialogComponent,
    AkaunConfirmationDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    PerfectScrollbarModule,
    RouterModule.forRoot(AppRoutes, { useHash: true }),
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: "toast-top-center",
      preventDuplicates: true,
    }),
    StoreModule.forRoot(appReducers, {
      runtimeChecks: {
        strictStateImmutability: false,
        strictActionImmutability: false
      }}
    ),
    EffectsModule.forRoot([]),
    !environment.production ? StoreDevtoolsModule.instrument({
      maxAge: 25
    }) : [],
    // shared
    LayoutModule,
    PermissionModule,
    // applet
    ViewCacheModule,
    AppletSettingsModule,
    AppletPersonalizationModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {
      duration: 3500,
      horizontalPosition: 'start',
      verticalPosition: 'bottom'
    }},
  ]
})
export class AppModule {
  constructor(private injector: Injector) {
    const el2 = createCustomElement(AppComponent, { injector: this.injector });
    if (
      !customElements.get(
        "example-applet-elements-" + sessionStorage.getItem("randomNumber")
      )
    ) {
      customElements.define(
        "example-applet-elements-" + sessionStorage.getItem("randomNumber"),
        el2
      );
      // to be able to run it the applet as the tag must be same as index.html
      if (document.getElementById("customtag")) {
        this.changeTagName(
          document.getElementById("customtag"),
          "example-applet-elements-" + sessionStorage.getItem("randomNumber")
        );
      }
    }
  }

  changeTagName(el, newTagName) {
    const n = document.createElement(newTagName);
    const attr = el.attributes;
    for (let i = 0, len = attr.length; i < len; ++i) {
      n.setAttribute(attr[i].name, attr[i].value);
    }
    n.innerHTML = el.innerHTML;
    el.parentNode.replaceChild(n, el);
  }

  ngDoBootstrap() {}
}
