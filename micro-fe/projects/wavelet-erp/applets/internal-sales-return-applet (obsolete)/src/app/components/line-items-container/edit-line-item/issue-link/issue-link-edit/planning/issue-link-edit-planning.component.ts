import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-issue-link-edit-planning',
  templateUrl: './issue-link-edit-planning.component.html',
  styleUrls: ['./issue-link-edit-planning.component.scss'],
})
export class EditLineItemIssueLinkEditPlanningComponent implements OnInit {

  public form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() { 
    this.form = this.fb.group({
      targetStartDate: new FormControl(),
      targetEndDate: new FormControl(),
      actualStartDate: new FormControl(),
      actualEndDate: new FormControl(),
      calcStartDate: new FormControl(),
      calcEndDate: new FormControl(),
      baseStartDate: new FormControl(),
      baseEndDate: new FormControl(),
      billCurrency: new FormControl(),
      billAmt: new FormControl(),
      costCurrency: new FormControl(),
      costAmt: new FormControl(),
      storyPoint: new FormControl(),
      mandayTarget: new FormControl(),
      mandayActual: new FormControl(),
      mandayAlloc: new FormControl(),
      mandayBilling: new FormControl()
    });
  }

  onSubmit() {

  }

  onReturn() {
    
  }

}