import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppConfig } from 'projects/shared-utilities/visa';
import { SubSink } from 'subsink2';
import { DraftStates } from '../../../../../../state-controllers/draft-controller/store/states';
import { SalesReturnStates } from '../../../../../../state-controllers/sales-return-controller/store/states';
import { SalesReturnSelectors } from '../../../../../../state-controllers/sales-return-controller/store/selectors';
import { HDRSelectors } from '../../../../../../state-controllers/draft-controller/store/selectors';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
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

@Component({
  selector: 'app-item-details-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class ItemDetailsDepartmentComponent implements OnInit, OnDestroy  {

  @Input() editMode: boolean;

  protected subs = new SubSink();

  dept$ = combineLatest([
    this.draftStore.select(HDRSelectors.selectDimension),
    this.draftStore.select(HDRSelectors.selectProfitCenter),
    this.draftStore.select(HDRSelectors.selectProject),
    this.draftStore.select(HDRSelectors.selectSegment)
  ]).pipe(
    map(([a, b, c, d]) => ({guid_dimension: a, guid_profit_center: b, guid_project: c, guid_segment: d}))
  );
  lineitem$ = this.store.select(SalesReturnSelectors.selectLineItem);

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
    private readonly store: Store<SalesReturnStates>
  ) {}

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
    this.subs.sink = combineLatest([this.copyFromHdr.valueChanges, this.dept$, this.lineitem$]).subscribe({
      next: ([a, b, c]) => {
        if (a) {
          this.form.patchValue({
            segment: b.guid_segment,
            profitCenter: b.guid_profit_center,
            dimension: b.guid_dimension,
            project: b.guid_project,
          })
        }
        else {
          this.form.patchValue({
            segment: c.guid_segment,
            profitCenter: c.guid_profit_center,
            dimension: c.guid_dimension,
            project: c.guid_project,
          })
        }
      }
    });
    this.copyFromHdr.patchValue(true);

    if (this.editMode) {
      this.copyFromHdr.patchValue(false);
      this.subs.sink = this.dept$.subscribe({ next: resolve => {
        if (this.form.value.segment === resolve.guid_segment && this.form.value.profitCenter === resolve.guid_profit_center
          && this.form.value.dimension === resolve.guid_dimension && this.form.value.project === resolve.guid_project) {
            this.copyFromHdr.patchValue(true);
          }
      }})
      // this.store.select(SalesReturnSelectors.selectLineItem).pipe(
      //   withLatestFrom(this.dept$),
      //   map(([a, b]) => {
      //   this.form.patchValue({
      //     segment: a.guid_segment,
      //     profitCenter: a.guid_profit_center,
      //     dimension: a.guid_dimension,
      //     project: a.guid_project,
      //   });
      //   if (a.guid_segment === b.guid_segment && a.profitCenter === b.guid_profit_center
      //     && a.dimension ===b.guid_dimension && a.project === b.guid_project) {
      //       this.copyFromHdr.patchValue(true);
      //     } else {
      //       this.copyFromHdr.patchValue(false);
      //     }
      //   })
      // )
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  
}