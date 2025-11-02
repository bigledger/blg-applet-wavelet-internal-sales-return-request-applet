import { Component, OnInit, QueryList, ViewChildren, ViewContainerRef } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams, IAfterGuiAttachedParams } from "ag-grid-community";
import { SessionActions } from "projects/shared-utilities/modules/session/session-controller/actions";
import { SessionSelectors } from "projects/shared-utilities/modules/session/session-controller/selectors";
import { SessionStates } from "projects/shared-utilities/modules/session/session-controller/states";
import { Store } from '@ngrx/store';
import { SubSink } from 'subsink2';

@Component({
  selector: "app-date-cell-renderer-v2",
  templateUrl: "./date-cell-renderer-v2.component.html",
  styleUrls: ["./date-cell-renderer-v2.component.css"],
})
export class DateCellRendererComponentV2 implements ICellRendererAngularComp {
  params: ICellRendererParams;
  inputDate: any;
  private subs = new SubSink();
  EDIT_CONTRA_TXN_DATE = false;
  constructor(protected readonly sessionStore: Store<SessionStates>) {}

  refresh(params: ICellRendererParams): boolean {
    return true;
  }

  agInit(params: ICellRendererParams): void {
    this.subs.sink = this.sessionStore.select(SessionSelectors.selectMasterSettings).subscribe((resolve: any) => {
      this.EDIT_CONTRA_TXN_DATE = resolve?.EDIT_CONTRA_TXN_DATE;
    });
    this.params = params;
    this.inputDate = this.params?.value || new Date();
  }

  getValue(): any {
    return this.inputDate;
  }

  isPopup(): boolean {
    return true;
  }

  dateChange(date?:any){
    console.log('dateChange',date);
    this.inputDate = date;
    this.params.data.contra_date = this.inputDate;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
