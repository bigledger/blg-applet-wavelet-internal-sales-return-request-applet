import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  CompanyContainerModel, CompanyService
} from 'blg-akaun-ts-lib';
import { AppConfig } from 'projects/shared-utilities/visa';
import { ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SubSink } from 'subsink2';

@Component({
  selector: 'company-dropdown',
  templateUrl: './company-dropdown.component.html',
  styleUrls: ['./company-dropdown.component.css']
})
export class CompanyDropdownComponent implements OnInit, OnDestroy {

  @Input() company: FormControl;
  @Output() companyChange = new EventEmitter<FormControl>();

  private subs = new SubSink();

  private apiVisa = AppConfig.apiVisa;
  filterControl = new FormControl();
  filteredOptions$: ReplaySubject<CompanyContainerModel[]> = new ReplaySubject<CompanyContainerModel[]>(1);
  companyList: CompanyContainerModel[];

  constructor(
     private companyService: CompanyService 
     ) {}

  ngOnInit() {
    this.subs.sink = this.companyService.get(this.apiVisa).subscribe(
      {next: resolve => {
        this.companyList = resolve.data;
        this.filteredOptions$.next(this.companyList);
      }});
    this.subs.sink = this.filterControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe({next: resolve => this.filterApplet(resolve)});
  }

  filterApplet(search: string) {
    if (!search) {
      this.filteredOptions$.next(this.companyList);
    } else {
      search = search.toLocaleLowerCase();
      const filter = this.companyList.filter(c => c.bl_fi_mst_comp.name.toLocaleLowerCase().includes(search));
      this.filteredOptions$.next(filter);
    }

  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
