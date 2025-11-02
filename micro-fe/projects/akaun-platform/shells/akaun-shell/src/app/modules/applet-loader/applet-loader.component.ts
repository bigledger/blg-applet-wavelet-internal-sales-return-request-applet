import {
  AfterContentInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DynamicComponent} from './dynmic-component/dynamic.component';
import {StorgeEnum} from '../../models/storge.enum';
import {LoadMFScriptService} from 'blg-akaun-ts-lib';

@Component({
  selector: 'app-example-applet-page',
  templateUrl: './applet-loader.component.html',
  styleUrls: ['./applet-loader.component.css']
})
export class AppletLoaderComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild('entry', {read: ViewContainerRef, static: true}) entry: ViewContainerRef;
  component;
  tenantcode = 'tnt_hassan_code';
  es_module_url;
  appletMFTag;

  constructor(private activatedRoute: ActivatedRoute,
              private loadMFScriptService: LoadMFScriptService,
              private resolver: ComponentFactoryResolver) {

    console.log('SHELL AppletLoaderComponent constructor');
    this.es_module_url = sessionStorage.getItem(StorgeEnum.es_module_url);
    this.appletMFTag = sessionStorage.getItem(StorgeEnum.appletMFTag);
    const routerLink = sessionStorage.getItem(StorgeEnum.routerLink);

    this.dynamicComponent();

  }

  ngOnInit() {
  }

  async dynamicComponent() {
    this.loadMFScriptService.loadScript(this.es_module_url);

    const authFromFactory = await this.resolver.resolveComponentFactory(DynamicComponent);
    this.component = this.entry.createComponent(authFromFactory);
    console.log('shell tenantcode', this.tenantcode);
    this.component.instance.tenantCode = this.tenantcode;
    this.component.instance.es_module_url = this.es_module_url;
    this.component.instance.appletMFTag = this.appletMFTag;

  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy applet loader');
    this.component.destroy();
  }

  ngAfterContentInit(): void {
    console.log('ngAfterContentInit');
  }

}
