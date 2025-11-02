import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ComponentStore } from '@ngrx/component-store';

@Component({
  selector: 'app-issue-link-edit-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class IssueLinkEditDetailsComponent implements OnInit, OnDestroy {

  public form: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      project: new FormControl(),
      issueType: new FormControl(),
      assignee: new FormControl(),
      reporter: new FormControl(),
      summary: new FormControl(),
      description: new FormControl(),
      parent: new FormControl(),
      createdDate: new FormControl()
    });
  }

  onSubmit() {

  }

  onReturn() {

  }

  ngOnDestroy() {

  }


}
