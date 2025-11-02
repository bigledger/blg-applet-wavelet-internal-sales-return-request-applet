import {AfterViewInit, Component, OnInit} from '@angular/core';
import {LoadMFScriptService} from 'blg-akaun-ts-lib';


@Component({
  selector: 'app-dynmic-component-page',
  templateUrl: './dynamic.component.html',
  styleUrls: ['./dynamic.component.css']
})
export class DynamicComponent implements OnInit {
  tenantCode = '';
  es_module_url;
  appletMFTag = '';
  constructor(private loadMFScriptService: LoadMFScriptService) {

  }

  ngOnInit() {
    console.log('DynamicComponent:ngOnInit=> ', this.tenantCode);
    console.log('DynamicComponent:ngOnInit=> ', this.es_module_url);
    console.log('DynamicComponent:ngOnInit=> ', this.appletMFTag);
   // this.loadMFScriptService.loadScript(this.es_module_url);

  }
}
