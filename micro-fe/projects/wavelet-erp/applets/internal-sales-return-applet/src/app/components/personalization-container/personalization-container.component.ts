import {Component, OnInit} from '@angular/core';
import { personalizationItems } from '../../models/menu-items';

@Component({
  selector: 'app-personalization-container',
  templateUrl: './personalization-container.component.html',
  styleUrls: ['./personalization-container.component.scss']
})
export class PersonalizationContainerComponent implements OnInit {

  routes = personalizationItems;

  constructor() {}

  ngOnInit() {
  }
}


