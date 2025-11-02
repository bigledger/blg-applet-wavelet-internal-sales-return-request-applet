import { Component, AfterViewInit, ElementRef, Directive, OnDestroy, OnInit, ViewChild, Input, Output, OnChanges, EventEmitter, SimpleChanges } from '@angular/core';
import { Spreadsheet } from 'src/assets/dhx-spreadsheet-package';
import 'src/assets/dhx-spreadsheet-package/codebase/spreadsheet.css';

export function transformSheetData(sheetData: any[]): any {
    const transformedData = [];
    sheetData.forEach((rowData, rowIndex) => {
      const rowNumber = rowIndex + 1;
    
      Object.keys(rowData).forEach((key, colIndex) => {
        const columnLetter = getColumnLetter(colIndex)
  
        transformedData.push({
          cell: `${columnLetter}${rowNumber}`,
          value: rowData[key] || '',
          css: rowIndex === 0 ? 'bold': 'left'
        });
      });
    });
  
    return transformedData;
}

function getColumnLetter(colIndex: number): string {
    let columnLetter = '';
    while (colIndex >= 0) {
      columnLetter = String.fromCharCode((colIndex % 26) + 97) + columnLetter;
      colIndex = Math.floor(colIndex / 26) - 1;
    }
    return columnLetter;
}

@Component({
  selector: 'app-spreadsheet',
  templateUrl: "./spreadsheet.component.html",
  styleUrls: ['./spreadsheet.component.css']
})

export class SpreadsheetComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('spreadsheetContainer', { static: true }) spreadsheetContainer!: ElementRef;

  @Input() spreadsheetData: any;
  @Input() readonlyCols: string[] = [];
  @Input() readonlyRows: string[] = [];
  @Output() onUpdateCell = new EventEmitter<{ cellObj: any }>();

  private spreadsheet!: Spreadsheet;

  ngOnInit() {
    this.spreadsheet = new Spreadsheet(this.spreadsheetContainer.nativeElement,{});
    
    this.spreadsheet.events.on("beforeEditStart", (cell) => {
      return this.checkReadonlyLogic(cell);
    });

    this.spreadsheet.events.on("afterAction", (actionName, config) => {
      if(actionName !== "setCellValue")
        return
      this.onUpdateCell.emit({cellObj: config});
    });
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['spreadsheetData'] && changes['spreadsheetData'].currentValue) {
      this.spreadsheet?.parse(this.spreadsheetData);
    }
  }

  checkReadonlyLogic(cell: string): boolean {
    if(this.readonlyCols.length === 0 && this.readonlyRows.length === 0)
      return true
    else{
      let readonlyColBoolean: boolean
      let readonlyRowBoolean: boolean
      
      if(this.readonlyCols.length !== 0){
        this.readonlyCols.every(colVal => {
          if(cell.toUpperCase().includes(colVal.toUpperCase())){
            readonlyColBoolean = false
            return false
          }
          else {
            readonlyColBoolean = true;
            return true;
          }
        })
      }

      if(this.readonlyRows.length !== 0){
        this.readonlyRows.every(rowVal => {
          if(cell.match(/\d+$/)[0] === rowVal){
            readonlyRowBoolean = false
            return false
          }
          else {
            readonlyRowBoolean = true;
            return true;
          }
        })
      }
      return readonlyColBoolean && readonlyRowBoolean
    }
  }

  ngOnDestroy() {
    this.spreadsheet?.destructor();
  }
}
