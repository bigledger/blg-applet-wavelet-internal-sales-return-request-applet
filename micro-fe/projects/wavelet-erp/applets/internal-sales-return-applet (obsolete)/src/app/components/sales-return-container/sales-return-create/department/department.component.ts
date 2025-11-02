import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AppConfig } from 'projects/shared-utilities/visa';
import { SubSink } from 'subsink2';
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
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sales-return-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit, OnDestroy  {

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
    private segmentCOAService: SegmentCoaService
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
    this.subs.sink = this.draft$.subscribe({ next: resolve => {
      this.form.patchValue({
        segment: resolve.guid_segment,
        profitCenter: resolve.guid_profit_center,
        dimension: resolve.guid_dimension,
        project: resolve.guid_project,
      });
    }});

  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  
}