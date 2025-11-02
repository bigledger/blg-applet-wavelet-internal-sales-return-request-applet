import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";

@Component({
  selector: "app-date-cell-renderer",
  templateUrl: "./date-cell-renderer.component.html",
  styleUrls: ["./date-cell-renderer.component.css"],
})
export class DateCellRendererComponent implements ICellRendererAngularComp {
  params: ICellRendererParams;
  inputDate: any;

  constructor(private cdRef: ChangeDetectorRef) {}

  refresh(params: ICellRendererParams): boolean {
    return true;
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.inputDate = this.params.value;
    this.cdRef.detectChanges();
  }

  getValue(): any {
    return this.inputDate;
  }

  isPopup(): boolean {
    return true;
  }

  dateChange(date?: any) {
    this.inputDate = date;
    this.params.data.track_delivery_date_requested = this.inputDate;
    this.cdRef.detectChanges();
  }
}
