import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-example-applet-page',
  templateUrl: './example-applet.component.html',
  styleUrls: ['./example-applet.component.css']
})
export class ExampleAppletComponent implements OnInit {

  tenantcode = 'tnt_hassan_code';
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
