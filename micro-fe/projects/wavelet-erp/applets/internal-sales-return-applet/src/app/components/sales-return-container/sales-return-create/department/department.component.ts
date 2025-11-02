import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  bl_fi_generic_doc_hdr_RowClass,
  DimensionContainerModel,
  DimensionService,
  Pagination,
  ProfitCenterContainerModel,
  ProfitCenterService,
  ProjectCoaContainerModel,
  ProjectCoaService,
  SegmentCoaContainerModel,
  SegmentCoaService
} from 'blg-akaun-ts-lib';
import { AppConfig } from 'projects/shared-utilities/visa';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink2';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { InternalSalesReturnActions } from '../../../../state-controllers/internal-sales-return-controller/store/actions';
import { InternalSalesReturnStates } from '../../../../state-controllers/internal-sales-return-controller/store/states';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-internal-sales-return-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit, OnDestroy {

  protected subs = new SubSink();

  @Input() draft$: Observable<bl_fi_generic_doc_hdr_RowClass>;
  @Output() updateDepartment = new EventEmitter();

  apiVisa = AppConfig.apiVisa;
  public form: FormGroup;

  dimension: DimensionContainerModel[];
  profitCenter: ProfitCenterContainerModel[];
  project: ProjectCoaContainerModel[];
  segment: SegmentCoaContainerModel[];

  constructor(
    private dimensionService: DimensionService,
    private profitCenterService: ProfitCenterService,
    private projectCOAService: ProjectCoaService,
    private segmentCOAService: SegmentCoaService,
    protected readonly store: Store<InternalSalesReturnStates>
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      segment: new FormControl(),
      dimension: new FormControl(),
      profitCenter: new FormControl(),
      project: new FormControl(),
    });

    this.subs.sink = this.dimensionService.getByCriteria(new Pagination(0, 100), this.apiVisa).subscribe(
      { next: resolve => this.dimension = resolve.data }
    );
    this.subs.sink = this.profitCenterService.getByCriteria(new Pagination(0, 100), this.apiVisa).subscribe(
      { next: resolve => this.profitCenter = resolve.data }
    );
    this.subs.sink = this.projectCOAService.getByCriteria(new Pagination(0, 100), this.apiVisa).subscribe(
      { next: resolve => this.project = resolve.data }
    );
    this.subs.sink = this.segmentCOAService.getByCriteria(new Pagination(0, 100), this.apiVisa).subscribe(
      { next: resolve => this.segment = resolve.data }
    );
    this.subs.sink = this.draft$.subscribe({
      next: resolve => {
        this.form.patchValue({
          segment: resolve.guid_segment,
          profitCenter: resolve.guid_profit_center,
          dimension: resolve.guid_dimension,
          project: resolve.guid_project,
        });
        if (resolve.posting_status === "VOID" || resolve.posting_status === "DISCARDED") {
          this.form.disable();
        }
      }
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
