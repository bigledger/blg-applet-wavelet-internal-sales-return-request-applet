import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class TabControlService {

  private activateTabSubject = new BehaviorSubject<number>(0);

  activateTab$ = this.activateTabSubject.asObservable();

  activateTab(tabIndex: number) {
    this.activateTabSubject.next(tabIndex);
  }
}