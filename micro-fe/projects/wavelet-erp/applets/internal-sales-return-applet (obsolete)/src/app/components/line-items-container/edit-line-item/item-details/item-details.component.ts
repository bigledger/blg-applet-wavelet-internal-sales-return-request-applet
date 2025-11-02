import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { MatTabGroup } from '@angular/material/tabs';
import { EditLineItemDetailsMainComponent } from './main-details/main-details.component';
import { EditLineItemDetailsDepartmentComponent } from './department/department.component';
import { EditLineItemDetailsDeliveryInstructions } from './delivery-instructions/delivery-instructions.component';

@Component({
  selector: 'app-edit-line-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class EditLineItemDetailsComponent extends ViewColumnComponent {
  @Input() selectedIndex$
  @ViewChild(MatTabGroup) matTab: MatTabGroup;
  @ViewChild(EditLineItemDetailsMainComponent) main: EditLineItemDetailsMainComponent;
  @ViewChild(EditLineItemDetailsDeliveryInstructions) delivery: EditLineItemDetailsDeliveryInstructions
  @ViewChild(EditLineItemDetailsDepartmentComponent) dept: EditLineItemDetailsDepartmentComponent;
}