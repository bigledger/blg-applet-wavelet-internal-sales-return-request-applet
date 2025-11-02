import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { CompanyModule } from './components/company-container/company.module';
import { GenericModule } from './components/generic-container/generic.module';
import { ViewColumnFacade } from './facades/view-column.facade';
import { reducers } from './state-controllers/view-cache-controller/store/reducers';
import { viewCacheFeatureKey } from './state-controllers/view-cache-controller/store/reducers/view-cache.reducers';

@NgModule({
  imports: [
    CommonModule,
    CompanyModule,
    GenericModule,
    StoreModule.forFeature(viewCacheFeatureKey, reducers.viewCache),
  ],
  providers: [ViewColumnFacade]
})
export class ViewCacheModule {}
