import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-issue-link-edit-details',
  templateUrl: './issue-link-edit-details.component.html',
  styleUrls: ['./issue-link-edit-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssueLinkEditDetailsComponent implements OnInit {

  public form: FormGroup;

  constructor() {}

  ngOnInit() { 
    this.form = new FormGroup({
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