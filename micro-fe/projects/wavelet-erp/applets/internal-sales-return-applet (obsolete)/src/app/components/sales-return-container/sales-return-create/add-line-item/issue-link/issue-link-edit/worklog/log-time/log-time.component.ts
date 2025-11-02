import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ViewColumnFacade } from '../../../../../../../../facades/view-column.facade';
import { AppConfig } from 'projects/shared-utilities/visa';
import { SubSink } from 'subsink2';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';

interface LocalState {
  deactivateReturn: boolean;
  deactivateAdd: boolean;
}

@Component({
  selector: 'app-issue-link-edit-log-time',
  templateUrl: './log-time.component.html',
  styleUrls: ['./log-time.component.scss'],
})
export class IssueLinkEditLogTimeComponent extends ViewColumnComponent {

  protected subs = new SubSink();
  
  protected compName = "Log Time"
  protected readonly index = 13;
  protected prevLocalState: any;

  prevIndex: number;
  apiVisa = AppConfig.apiVisa;
  public form: FormGroup;

  constructor(
    private viewColFacade: ViewColumnFacade) {
    super();
  }

  ngOnInit() {
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.form = new FormGroup({
      activityType: new FormControl(),
      date: new FormControl(),
      duration: new FormControl(),
      description: new FormControl()
    });
  }

  onSubmit() {

  }

  onReturn() {
    this.viewColFacade.updateInstance<LocalState>(this.prevIndex, {
      ...this.prevLocalState,
      deactivateAdd: false,
      deactivateReturn: false,
    });
      this.viewColFacade.onPrev(this.prevIndex);
  }
  
  ngOnDestroy() {
    this.subs.unsubscribe();  
  }

}