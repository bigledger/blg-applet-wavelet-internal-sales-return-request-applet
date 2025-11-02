import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { MatTabGroup } from '@angular/material/tabs';
import { ItemDetailsMainComponent } from './main-details/main-details.component';
import { ItemDetailsDepartmentComponent } from './department/department.component';
import { ItemDetailsDeliveryInstructions } from './delivery-instructions/delivery-instructions.component';

@Component({
  selector: 'app-line-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class LineItemDetailsComponent extends ViewColumnComponent {
  @Input() selectedIndex$: any;
  @Input() editMode: boolean;
  @ViewChild(MatTabGroup) matTab: MatTabGroup;
  @ViewChild(ItemDetailsMainComponent) main: ItemDetailsMainComponent;
  @ViewChild(ItemDetailsDeliveryInstructions) delivery: ItemDetailsDeliveryInstructions
  @ViewChild(ItemDetailsDepartmentComponent) dept: ItemDetailsDepartmentComponent;
}