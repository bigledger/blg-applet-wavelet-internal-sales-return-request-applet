import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-cashbook-applet-page',
  templateUrl: './cashbook-applet.component.html',
  styleUrls: ['./cashbook-applet.component.css']
})
export class CashbookAppletComponent implements OnInit {

  tenantcode = 'tnt_hassan_code';
  constructor( private activatedRoute: ActivatedRoute) {
    console.log('SHELL CashbookAppletComponent constructor');
    this.activatedRoute.queryParams.subscribe((param) => {
      this.tenantcode = param.tenantcode;  // tnt_hassan_code
      console.log('param============',param);
    });

  }

  ngOnInit() {
  }

}
