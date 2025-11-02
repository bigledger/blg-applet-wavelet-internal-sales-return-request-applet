import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-delivery-installation-applet-page',
  templateUrl: './delivery-installation-applet.component.html',
  styleUrls: ['./delivery-installation-applet.component.css']
})
export class DeliveryInstallationAppletComponent implements OnInit {

  tenantcode = 'akaun_master';
  constructor( private activatedRoute: ActivatedRoute) {
    console.log('SHELL ExampleAppletComponent constructor');
    this.activatedRoute.queryParams.subscribe((param) => {
      this.tenantcode = param.tenantcode;  // tnt_hassan_code
      console.log('param============',param);
    });

  }

  ngOnInit() {
  }

}
