import { AfterViewChecked, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectionList } from '@angular/material/list';
import { MatTabGroup } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { SubSink } from "subsink2";
import { LineItemSelectors } from '../../../../state-controllers/line-item-controller/store/selectors';
import { LineItemStates } from '../../../../state-controllers/line-item-controller/store/states';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';

@Component({
  selector: 'app-edit-line-item-serial-number',
  templateUrl: './serial-number.component.html',
  styleUrls: ['./serial-number.component.scss']
})
export class EditLineItemSerialNumberComponent implements OnInit, AfterViewChecked {

  protected subs = new SubSink();

  @Input() selectedIndex$;

  lineItem$ = this.store.select(LineItemSelectors.selectLineItem);

  appletSettings$ = combineLatest([
    this.sessionStore.select(SessionSelectors.selectMasterSettings),
    this.sessionStore.select(SessionSelectors.selectPersonalSettings)
  ]).pipe(map(([a, b]) => ({...a, ...b})));

  serialNumbers: string[] = [];
  selectAll = new FormControl(false);
  appletSettings;
  orientation: boolean = false;

  @ViewChild(MatTabGroup) matTab: MatTabGroup;
  @ViewChild(MatSelectionList, { static: true }) matList: MatSelectionList;

  constructor(
    protected readonly store: Store<LineItemStates>,
    private readonly sessionStore: Store<SessionStates>
  ) { }

  ngOnInit() {
    this.lineItem$.subscribe({
      next: (resolve: any) => {
        this.serialNumbers = resolve?.serial_no?.serialNumbers;
      }
    })

    this.subs.sink = this.appletSettings$.subscribe(resolve => {
      this.appletSettings = resolve ;
    }); 
  }

  ngAfterViewChecked() {
    if(this.matTab) {
      this.matTab.realignInkBar();
    }
  }

  onSelect(e) {
    this.selectAll.patchValue(false);
  }

  onSelectAll() {
    this.matList.selectedOptions.selected.length === this.matList.options.length ? this.matList.deselectAll() : this.matList.selectAll();
  }

  onRemove() {
    // TODO: There is an error when clicking delete when so selection is made and then a selection was made
    this.serialNumbers = this.serialNumbers.filter(s => !this.matList._value.includes(s));
    this.selectAll.patchValue(false);
  }

  addSerialNumberFromScan(e: string) {
    if (e && !this.serialNumbers.includes(e)) {
      this.serialNumbers.push(e);
    }
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
