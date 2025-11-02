import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-edit-issue-main-details',
  templateUrl: './edit-issue-main-details.component.html',
  styleUrls: ['./edit-issue-main-details.component.css']
})
export class EditIssueMainDetailsComponent implements OnInit {

  form: FormGroup;

  leftColControls = [
    {label: 'Project', formControl: 'project', type: 'text', readonly: true, hint: ''},
    {label: 'Issue Number', formControl: 'issueNumber', type: 'text', readonly: true, hint: ''},
    {label: 'Issue Type', formControl: 'issueType', type: 'select', readonly: false, hint: ''},
    {label: 'Assignee', formControl: 'assignee', type: 'select', readonly: false, hint: ''},
    {label: 'Reporter', formControl: 'reporter', type: 'select', readonly: false, hint: ''},
    {label: 'Summary', formControl: 'summary', type: 'select', readonly: false, hint: ''},
  ];

  constructor() { }

  ngOnInit() {
    this.form = new FormGroup({
      project: new FormControl(),
      issueNumber: new FormControl(),
      issueType: new FormControl(),
      assignee: new FormControl(),
      reporter: new FormControl(),
      summary: new FormControl(),
    })
  }

}
