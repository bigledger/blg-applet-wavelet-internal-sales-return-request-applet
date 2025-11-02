import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
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
import { SubSink } from 'subsink2';
import { DraftStates } from '../../../../../state-controllers/draft-controller/store/states';
import { LineItemSelectors } from '../../../../../state-controllers/line-item-controller/store/selectors';
import { LineItemStates } from '../../../../../state-controllers/line-item-controller/store/states';

@Component({
  selector: 'app-edit-item-details-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class EditLineItemDetailsDepartmentComponent implements OnInit, OnDestroy {

  protected subs = new SubSink();

  @Output() updateDeptLineItem = new EventEmitter();

  lineItem$ = this.store.select(LineItemSelectors.selectLineItem);

  apiVisa = AppConfig.apiVisa;
  public form: FormGroup;
  copyFromHdr = new FormControl();

  dimension: DimensionContainerModel[];
  profitCenter: ProfitCenterContainerModel[];
  project: ProjectCoaContainerModel[];
  segment: SegmentCoaContainerModel[];

  constructor(
    protected readonly draftStore: Store<DraftStates>,
    private dimensionService: DimensionService,
    private profitCenterService: ProfitCenterService,
    private projectCOAService: ProjectCoaService,
    private segmentCOAService: SegmentCoaService,
    protected readonly store: Store<LineItemStates>) { }

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

    this.subs.sink = this.lineItem$.subscribe({
      next: (b: any) => {
        this.form.patchValue({
          segment: b?.guid_segment,
          profitCenter: b?.guid_profit_center,
          dimension: b?.guid_dimension,
          project: b?.guid_project,
        })
      }
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
