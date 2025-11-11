import { BrowserModule } from "@angular/platform-browser";
import { Injector, NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { createCustomElement } from "@angular/elements";

@NgModule({
  declarations: [
    AppComponent,
    //InternalOutboundStockTransferCreateDetailsComponent,
  ],
  imports: [
    BrowserModule
  ],

  providers: [],
  entryComponents: [AppComponent],
  // bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private injector: Injector) {
    const el = createCustomElement(AppComponent, { injector });
    customElements.define("app-root", el);
  }

  ngDoBootstrap() {}
}
