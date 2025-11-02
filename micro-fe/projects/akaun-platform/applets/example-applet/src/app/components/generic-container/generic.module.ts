import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DropDownModule } from 'blg-akaun-ng-lib';
import { GenericContainerComponent } from './generic-container.component';
import { GenericListingComponent } from './generic-listing/generic-listing.component';
import { GenericCreateComponent } from './generic-create/generic-create.component';
import { AgGridModule } from 'ag-grid-angular';
import { GenericCreateMainComponent } from './generic-create/generic-create-main/generic-order-create-main.component';
import { GenericCreateLineItemsComponent } from './generic-create/generic-create-line-items/generic-create-line-items.component';
import { UtilitiesModule } from 'projects/shared-utilities/utilities/utilities.module';

@NgModule({
  declarations: [
    GenericContainerComponent,
    GenericListingComponent,
    GenericCreateComponent,
    GenericCreateMainComponent,
    GenericCreateLineItemsComponent
  ],
  imports: [
    CommonModule,
    UtilitiesModule,
    DropDownModule,
    AgGridModule
  ],
  entryComponents: [
    GenericListingComponent,
    GenericCreateComponent
  ]
})
export class GenericModule { }
