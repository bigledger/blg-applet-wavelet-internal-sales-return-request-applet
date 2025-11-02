import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { mainPath } from './app.routing';
import { menuItems } from './models/menu-items';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  readonly appletName = 'Example Applet';
  readonly menuItems = menuItems;
  readonly mainPath = mainPath;

  constructor(
    private router: Router) {
  }

  ngOnInit() {
    this.router.initialNavigation();
  }

}
