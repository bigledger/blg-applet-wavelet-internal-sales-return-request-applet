import { BrowserModule } from "@angular/platform-browser";
import { Injector, NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { createCustomElement } from "@angular/elements";
import { InternalOutboundStockTransferCreateDetailsComponent } from "./projects/wavelet-erp/applets/stock-transfer-applet/src/app/components/internal-outbound-stock-transfer-container/internal-outbound-stock-transfer-create/internal-outbound-stock-transfer-create-details/internal-outbound-stock-transfer-create-details.component";

@NgModule({
  declarations: [
    AppComponent,
    InternalOutboundStockTransferCreateDetailsComponent,
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
