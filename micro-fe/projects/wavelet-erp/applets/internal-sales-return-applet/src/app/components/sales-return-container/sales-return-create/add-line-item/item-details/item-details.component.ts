import { Component, Input, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ItemDetailsDeliveryInstructions } from './delivery-instructions/delivery-instructions.component';
import { ItemDetailsDepartmentComponent } from './department/department.component';
import { ItemDetailsMainComponent } from './main-details/main-details.component';
import { ItemDetailsDeliveryDetailsComponent } from './delivery-details/delivery-details.component';
import { AppletSettings } from '../../../../../models/applet-settings.model';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { Store } from '@ngrx/store';
import { SubSink } from 'subsink2';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-line-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss'],
})
export class LineItemDetailsComponent {
  protected subs = new SubSink();

  @Input() selectedIndex;
  @Input() editMode: boolean;
  @Input() appletSettings: AppletSettings;
  @ViewChild(MatTabGroup) matTab: MatTabGroup;
  @ViewChild(ItemDetailsMainComponent) main: ItemDetailsMainComponent;
  @ViewChild(ItemDetailsDeliveryInstructions) delivery: ItemDetailsDeliveryInstructions
  @ViewChild(ItemDetailsDepartmentComponent) dept: ItemDetailsDepartmentComponent;
  @ViewChild(ItemDetailsDeliveryDetailsComponent) linedelivery: ItemDetailsDeliveryDetailsComponent;
  orientation: boolean = false;

  appletSettings$ = combineLatest([
    this.sessionStore.select(SessionSelectors.selectMasterSettings),
    this.sessionStore.select(SessionSelectors.selectPersonalSettings)
  ]).pipe(map(([a, b]) => ({...a, ...b})));

  constructor(
    private readonly sessionStore: Store<SessionStates>) {}

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
