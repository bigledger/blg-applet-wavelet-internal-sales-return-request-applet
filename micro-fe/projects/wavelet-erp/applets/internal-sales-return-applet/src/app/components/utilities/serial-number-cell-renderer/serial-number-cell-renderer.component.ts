import { Component, OnInit } from "@angular/core";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";

@Component({
  selector: "app-serial-number-cell-renderer",
  templateUrl: "./serial-number-cell-renderer.component.html",
  styleUrls: ["./serial-number-cell-renderer.component.css"],
})
export class SerialNumberCellRendererComponent
  implements ICellRendererAngularComp
{
  params: ICellRendererParams;
  serialNumbers: { serialNumber: number; checked: boolean }[] = [];
  serialNumbersToBeReturned: string[] = [];

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;

    if (params.data?.serialNumbersToBeReturned) {
      this.serialNumbersToBeReturned=params.data?.serialNumbersToBeReturned;

      params.data.serialNumbersToBeReturned.forEach((serial) => {
        this.serialNumbers.push({ serialNumber: serial, checked: true });
      });

      let notReturnedItems = this.params.value.filter(
        (serial) => params.data?.serialNumbersToBeReturned.indexOf(serial) < 0
      );

      notReturnedItems.forEach((serial) => {
        this.serialNumbers.push({ serialNumber: serial, checked: false });
      });
      console.log(notReturnedItems);
    } else {
      this.params.value.forEach((serial) => {
        this.serialNumbers.push({ serialNumber: serial, checked: false });
      });
    }
  }

  getValue(): any {
    return this.serialNumbers;
  }

  isPopup(): boolean {
    return true;
  }

  showOptions(event: MatCheckboxChange, serialNumber: string): void {
    if (event.checked) {
      this.serialNumbersToBeReturned.push(serialNumber);
    } else {
      this.serialNumbersToBeReturned = this.serialNumbersToBeReturned.filter(
        (obj) => {
          return obj !== serialNumber;
        }
      );
    }
    this.params.data.serialNumbersToBeReturned = this.serialNumbersToBeReturned;
    this.params.data.serialNumbersToBeReturnedLength =
      this.serialNumbersToBeReturned.length;
    this.params.api.refreshCells();
  }

  isAllSelected(): boolean {
    return this.serialNumbers.every((serial) => serial.checked);
  }

  selectAll(event: MatCheckboxChange): void {
    const selectAllValue = event.checked;

    this.serialNumbers.forEach((serial) => {
      serial.checked = selectAllValue;
      this.updateSelectedSerials(serial.serialNumber, selectAllValue);
    });

    this.params.api.refreshCells();
  }

  private updateSelectedSerials(serialNumber: any, checked: boolean): void {
    console.log("serialNumber",serialNumber);
    if (checked) {
      this.serialNumbersToBeReturned.push(serialNumber);
    } else {
      this.serialNumbersToBeReturned = this.serialNumbersToBeReturned.filter(
        (obj) => obj !== serialNumber
      );
    }

    this.serialNumbersToBeReturned = Array.from(new Set(this.serialNumbersToBeReturned));
    this.params.data.serialNumbersToBeReturned = this.serialNumbersToBeReturned;
    this.params.data.serialNumbersToBeReturnedLength = this.serialNumbersToBeReturned.length;
  }
}
