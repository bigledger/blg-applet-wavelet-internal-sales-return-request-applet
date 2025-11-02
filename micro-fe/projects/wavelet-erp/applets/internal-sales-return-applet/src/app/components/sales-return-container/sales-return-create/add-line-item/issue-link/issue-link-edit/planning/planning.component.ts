import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ComponentStore } from '@ngrx/component-store';

@Component({
  selector: 'app-issue-link-edit-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class IssueLinkEditPlanningComponent implements OnInit, OnDestroy {

  public form: FormGroup;

  constructor(private fb: FormBuilder) { }

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

  ngOnDestroy() {

  }

}
