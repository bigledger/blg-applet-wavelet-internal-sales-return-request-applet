import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { LineItemsModule } from './components/line-items-container/line-items.module';
import { PrintableFormatSettingsModule } from './components/settings-container/printable-format-settings-container/printable-format-settings-container.module';
import { SalesReturnModule } from './components/sales-return-container/sales-return.module';
import { ViewColumnFacade } from './facades/view-column.facade';
import { reducers } from './state-controllers/view-cache-controller/store/reducers';
import { viewCacheFeatureKey } from './state-controllers/view-cache-controller/store/reducers/view-cache.reducers';

@NgModule({
  imports: [
    CommonModule,
    SalesReturnModule,
    LineItemsModule,
    PrintableFormatSettingsModule,
    StoreModule.forFeature(viewCacheFeatureKey, reducers.viewCache)
  ],
  providers: [ViewColumnFacade]
})
export class ViewCacheModule {}
