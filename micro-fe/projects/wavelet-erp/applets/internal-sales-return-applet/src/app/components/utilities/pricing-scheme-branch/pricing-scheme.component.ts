import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  EmployeeService,
  PricingSchemeContainerModel,
  PricingSchemeService
} from 'blg-akaun-ts-lib';
import { AppConfig } from 'projects/shared-utilities/visa';
import { ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SubSink } from 'subsink2';

@Component({
  selector: 'app-pricing-scheme-branch',
  templateUrl: './pricing-scheme.component.html',
  styleUrls: ['./pricing-scheme.component.css']
})
export class PricingSchemeBranchComponent implements OnInit, OnDestroy {
  @Input() pricingScheme = new FormControl();
  @Output() pricingSchemeSelected = new EventEmitter<PricingSchemeContainerModel>();

  selectedEntity: PricingSchemeContainerModel;
  private subs = new SubSink();

  private apiVisa = AppConfig.apiVisa;
  filterControl = new FormControl();
  filteredOptions$: ReplaySubject<PricingSchemeContainerModel[]> = new ReplaySubject<PricingSchemeContainerModel[]>(1);
  entityList: PricingSchemeContainerModel[];

  constructor( private pricingSchemeService: PricingSchemeService, ) {}

  ngOnInit() {
    this.subs.sink = this.pricingSchemeService.get(this.apiVisa).subscribe(
      {next: resolve => {
        this.entityList = resolve.data;
        this.filteredOptions$.next(this.entityList);
      }});
    // if (this.currency.value) {
    //   this.subs.sink = this.currencyService.getByGuid(this.currency.value, this.apiVisa).subscribe( resolved => {
    //     this.branchList = [resolved.data];
    //     this.filteredOptions$.next([resolved.data]);
    //     this.onSelect(resolved.data.bl_fi_mst_branch.guid.toString());
    //   });
    // }
    this.subs.sink = this.filterControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe({next: resolve => this.filterCurrency(resolve)});
  }

  filterCurrency(search: string) {
    if (!search) {
      this.filteredOptions$.next(this.entityList);
    } else {
      search = search.toLocaleLowerCase();
      const filter = this.entityList.filter(c => c.bl_fi_mst_pricing_scheme_hdr.name.toLocaleLowerCase().includes(search));
      this.filteredOptions$.next(filter);
    }

  }

  onSelect(entityGuid: string) {
    console.log('pricing', entityGuid);
    if (entityGuid) {
      this.pricingScheme.patchValue(entityGuid);
      this.selectedEntity = this.entityList.find(agent => agent.bl_fi_mst_pricing_scheme_hdr.guid === entityGuid);
      this.pricingSchemeSelected.emit(this.selectedEntity);
     
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
