import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators , FormControl} from '@angular/forms';

export interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-celmonze-launchpad-panel',
  templateUrl: './celmonze-launchpad-panel.component.html',
  styleUrls: ['./celmonze-launchpad-panel.component.scss']
})
export class CelmonzeLaunchpadPanelComponent implements OnInit {

  isLinear = false;
  HostNameForm: FormGroup;
  AppletForm: FormGroup;
  AccessLevelForm: FormGroup;

  constructor(private _formBuilder: FormBuilder) {}

  toppings = new FormControl();
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];


  ngOnInit() {
    this.HostNameForm = this._formBuilder.group({
      hostname: ['', Validators.required]
    });
    this.AppletForm = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.AccessLevelForm = this._formBuilder.group({
      tenant: ['', Validators.required]
    });
  }
}
