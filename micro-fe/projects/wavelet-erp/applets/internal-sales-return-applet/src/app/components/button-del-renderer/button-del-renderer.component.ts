import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-button-del-renderer',
  templateUrl: './button-del-renderer.component.html'
})

export class ButtonDeleteRendererComponent implements ICellRendererAngularComp {

  params;
  label: string;
  disabledCreate = false;


  agInit(params): void {
    this.params = params;
    this.label = this.params.label || null;
    //this.disabledCreate = (params.valueFormatted ? params.valueFormatted : params.value) !== '';
    
  }

  refresh(params?: any): boolean {
    return true;
  }

  onButtonClick($event) {
    if (this.params.onClick instanceof Function) {
      const params = {
        event: $event,
        rowData: this.params.node.data
      };
      this.params.onClick(params);
    }
  }
}
