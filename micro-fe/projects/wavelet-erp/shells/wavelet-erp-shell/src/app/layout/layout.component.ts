import * as $ from 'jquery';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  ViewChild,
  HostListener,
  Directive,
  AfterViewInit,
  OnInit, Input
} from '@angular/core';
import {MenuItems} from '../shared/menu-items';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
/** @title Responsive sidenav */
@Component({
  selector: 'app-layout',
  templateUrl: 'layout.component.html',
  styleUrls: []
})
export class LayoutComponent implements OnDestroy, AfterViewInit,OnInit {
  mobileQuery: MediaQueryList;
  dir = 'ltr';
  green: boolean;
  blue: boolean;
  dark: boolean;
  minisidebar: boolean;
  boxed: boolean;
  danger: boolean;
  showHide: boolean;
  sidebarOpened;
  token: string;

  public config: PerfectScrollbarConfigInterface = {};
  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    private router: Router
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnInit() {
    this.token = localStorage.getItem('authToken');
    console.log('Header get authToken:::', this.token);
    if (!this.token) {
      this.router.navigate(['./home']);
    }
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  ngAfterViewInit() {
    // This is for the topbar search
    (<any>$('.srh-btn, .cl-srh-btn')).on('click', function() {
      (<any>$('.app-search')).toggle(200);
    });
    // This is for the megamenu
  }

  // Mini sidebar
  @Input()
  set message(message: string) {
    console.log('>>>>>??? ', message);

  }
  get message(): string {
    console.log('>>>>> ', this._message)
    return this._message;
  }
  _message: string;
}
