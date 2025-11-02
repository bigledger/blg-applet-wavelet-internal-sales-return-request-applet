import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { SalesReturnActions } from '../../../../state-controllers/sales-return-controller/store/actions';
import { SalesReturnStates } from '../../../../state-controllers/sales-return-controller/store/states';

@Component({
  selector: 'app-sales-return-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class SalesReturnExportComponent implements OnInit {

  @Output() print = new EventEmitter();

  constructor(private readonly store: Store<SalesReturnStates>) { }

  ngOnInit() {
  }

  onPrint() {
    this.store.dispatch(SalesReturnActions.printJasperPdfInit());
  }

}