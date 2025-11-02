import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { ToastrModule } from 'ngx-toastr';
import { appReducers } from 'projects/shared-utilities/application-controller/store/reducers';
import { LayoutModule } from 'projects/shared-utilities/modules/layout/layout.module';
import { PermissionModule } from 'projects/shared-utilities/modules/permission/permission.module';
import { SessionModule } from 'projects/shared-utilities/modules/session/session.module';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';
import { AppletPersonalizationModule } from './components/personalization-container/applet-personalization.module';
import { AppletSettingsModule } from './components/settings-container/applet-settings.module';
import { DraftModule } from './draft.module';
import { ViewCacheModule } from './view-cache.module';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import {
  DateCellRendererComponentV2
} from "./components/utilities/date-cell-renderer-v2/date-cell-renderer-v2.component";
import {AgGridModule} from "ag-grid-angular";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD'
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true
};

@NgModule({
  declarations: [
    AppComponent,
    DateCellRendererComponentV2,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    SessionModule,
    HttpClientModule,
    PerfectScrollbarModule,
    NgxMatSelectSearchModule,
    RouterModule.forRoot(AppRoutes, { useHash: true, relativeLinkResolution: 'legacy' }),
    NgMultiSelectDropDownModule.forRoot(),
    ToastrModule.forRoot(
      {
        timeOut: 10000,
        positionClass: 'toast-top-center',
        preventDuplicates: true
      }
    ),
    StoreModule.forRoot(appReducers, {
      runtimeChecks: {
        strictStateImmutability: false,
        strictActionImmutability: false
      }
    }
    ),
    EffectsModule.forRoot([]),
    !environment.production ? StoreDevtoolsModule.instrument({
      maxAge: 25
    }) : [],
    LayoutModule,
    ViewCacheModule,
    PermissionModule,
    AppletSettingsModule,
    AppletPersonalizationModule,
    DraftModule,
    AgGridModule.withComponents([DateCellRendererComponentV2]),
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
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
      }
    },
  ]
})
export class AppModule {

  constructor(private injector: Injector) {
    if (!customElements.get('internal-sales-return-applet-elements-' + sessionStorage.getItem('randomNumber'))) {
      const el2 = createCustomElement(AppComponent, { injector: this.injector });
      customElements.define('internal-sales-return-applet-elements-' + sessionStorage.getItem('randomNumber'), el2);
      // to be able to run it the applet as the tag must be same as index.html
      if (document.getElementById('customtag')) {
        this.changeTagName(document.getElementById('customtag'), 'internal-sales-return-applet-elements-' + sessionStorage.getItem('randomNumber'));
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

  ngDoBootstrap() {
  }

}
