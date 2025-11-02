import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-slide-renderer',
  templateUrl: './slide-renderer.component.html',
  styleUrls: ['./slide-renderer.component.css']
})
export class SlideRendererComponent implements ICellRendererAngularComp {

  agInit(params: ICellRendererParams) {
  }

  refresh(params: ICellRendererParams): boolean {
    console.log(params);
    return true;
  }
}
