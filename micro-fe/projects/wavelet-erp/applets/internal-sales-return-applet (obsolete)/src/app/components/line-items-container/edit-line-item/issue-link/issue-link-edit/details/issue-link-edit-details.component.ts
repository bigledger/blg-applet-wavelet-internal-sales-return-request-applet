import { ChangeDetectionStrategy, Component, OnInit, } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ComponentStore } from '@ngrx/component-store';

@Component({
  selector: 'app-edit-issue-link-edit-details',
  templateUrl: './issue-link-edit-details.component.html',
  styleUrls: ['./issue-link-edit-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class EditLineItemIssueLinkEditDetailsComponent implements OnInit {

  public form: FormGroup;

  constructor(private fb: FormBuilder) {}

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

}