import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ComponentStore } from '@ngrx/component-store';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { EditLineItemDetailsDeliveryInstructions } from './delivery-instructions/delivery-instructions.component';
import { EditLineItemDetailsDepartmentComponent } from './department/department.component';
import { EditLineItemDetailsMainComponent } from './main-details/main-details.component';
import { AppletSettings } from '../../../../models/applet-settings.model';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { Store } from '@ngrx/store';
import { SubSink } from 'subsink2';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-edit-line-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]

})
export class EditLineItemDetailsComponent extends ViewColumnComponent {
  protected subs = new SubSink();

  @Input() selectedIndex$
  @Input() appletSettings: AppletSettings;
  @ViewChild(MatTabGroup) matTab: MatTabGroup;
  @ViewChild(EditLineItemDetailsMainComponent) main: EditLineItemDetailsMainComponent;
  @ViewChild(EditLineItemDetailsDeliveryInstructions) delivery: EditLineItemDetailsDeliveryInstructions
  @ViewChild(EditLineItemDetailsDepartmentComponent) dept: EditLineItemDetailsDepartmentComponent;

  appletSettings$ = combineLatest([
    this.sessionStore.select(SessionSelectors.selectMasterSettings),
    this.sessionStore.select(SessionSelectors.selectPersonalSettings)
  ]).pipe(map(([a, b]) => ({...a, ...b})));

  orientation: boolean = false;

  constructor(
    private readonly sessionStore: Store<SessionStates>) {
      super();
  }

  ngOnInit() {
    this.subs.sink = this.appletSettings$.subscribe({ next: (resolve: AppletSettings) => { 
      this.appletSettings = resolve } });
  }

  showPanels(): boolean {
    if(this.appletSettings?.VERTICAL_ORIENTATION){
      if(this.appletSettings?.DEFAULT_ORIENTATION === 'HORIZONTAL'){
        this.orientation = false;
      } else {
        this.orientation = true;
      }
    } else {
      if(this.appletSettings?.DEFAULT_ORIENTATION === 'VERTICAL'){
        this.orientation = true;
      } else {
        this.orientation = false;
      }
    }
    return this.orientation;
  }
}
