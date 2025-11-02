

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
import { InternalSalesReturnSelectors } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/internal-sales-return-controller/store/selectors';
import { InternalSalesReturnStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/internal-sales-return-controller/store/states';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { HDRSelectors } from '../../../../../../state-controllers/draft-controller/store/selectors';
import { DraftStates } from '../../../../../../state-controllers/draft-controller/store/states';

@Component({
  selector: 'app-item-details-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class ItemDetailsDepartmentComponent implements OnInit, OnDestroy {

  @Input() editMode: boolean;

  protected subs = new SubSink();

  dept$ = combineLatest([
    this.draftStore.select(HDRSelectors.selectDimension),
    this.draftStore.select(HDRSelectors.selectProfitCenter),
    this.draftStore.select(HDRSelectors.selectProject),
    this.draftStore.select(HDRSelectors.selectSegment)
  ]).pipe(
    map(([a, b, c, d]) => ({ guid_dimension: a, guid_profit_center: b, guid_project: c, guid_segment: d }))
  );
  genDocLock$ = this.store.select(InternalSalesReturnSelectors.selectGenDocLock);

  apiVisa = AppConfig.apiVisa;
  public form: FormGroup;
  copyFromHdr = new FormControl();
  genDocLock:boolean;

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
    private readonly store: Store<InternalSalesReturnStates>
  ) { }

  ngOnInit() {
    this.subs.sink = this.genDocLock$.subscribe(lock=>{
      this.genDocLock = lock;
    })
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
    this.subs.sink = combineLatest([this.copyFromHdr.valueChanges, this.dept$]).subscribe({
      next: ([a, b]) => {
        if (a) {
          this.form.patchValue({
            segment: b.guid_segment,
            profitCenter: b.guid_profit_center,
            dimension: b.guid_dimension,
            project: b.guid_project,
          })
        } else {
          this.form.reset();
        }
      }
    });
    this.copyFromHdr.patchValue(true);

    if (this.editMode) {
      this.copyFromHdr.patchValue(false);
      this.subs.sink = this.store.select(InternalSalesReturnSelectors.selectLineItem).subscribe({
        next: resolve => {
          this.form.patchValue({
            segment: resolve.guid_segment,
            profitCenter: resolve.guid_profit_center,
            dimension: resolve.guid_dimension,
            project: resolve.guid_project,
          })
        }
      })
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
