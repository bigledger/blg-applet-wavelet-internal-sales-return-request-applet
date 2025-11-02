import {Component, OnInit} from '@angular/core';
import { settingItems } from '../../models/menu-items';

@Component({
  selector: 'app-settings-container',
  templateUrl: './settings-container.component.html',
  styleUrls: ['./settings-container.component.scss']
})

export class SettingsContainerComponent implements OnInit {

  routes = settingItems;

  constructor() {}

  ngOnInit() {
  }

}


