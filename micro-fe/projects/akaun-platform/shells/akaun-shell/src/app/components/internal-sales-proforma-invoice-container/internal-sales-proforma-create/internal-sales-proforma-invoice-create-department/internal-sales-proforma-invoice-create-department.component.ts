import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  DimensionContainerModel,
  DimensionService,
  bl_fi_generic_doc_hdr_RowClass,
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

@Component({
  selector: 'app-internal-sales-proforma-invoice-create-department',
  templateUrl: './internal-sales-proforma-invoice-create-department.component.html',
  styleUrls: ['./internal-sales-proforma-invoice-create-department.component.css']
})
export class InternalSalesProformaInvoiceCreateDepartmentComponent implements OnInit, OnDestroy {

  @Input() draft$: Observable<bl_fi_generic_doc_hdr_RowClass>;

  @Output() updateDepartment = new EventEmitter();

  private subs = new SubSink();

  form: FormGroup;

  leftColControls = [
    {label: 'Segment', formControl: 'segment', type: 'segment', readonly: false, hint: ''},
    {label: 'Profit Centre', formControl: 'profitCenter', type: 'profitCenter', readonly: false, hint: ''},
  ];

  rightColControls = [
    {label: 'Dimension', formControl: 'dimension', type: 'dimension', readonly: false, hint: ''},
    {label: 'Project', formControl: 'project', type: 'project', readonly: false, hint: ''},
  ];

  dimension: DimensionContainerModel[];
  profitCenter: ProfitCenterContainerModel[];
  project: ProjectCoaContainerModel[];
  segment: SegmentCoaContainerModel[];

  apiVisa = AppConfig.apiVisa;

  constructor(
    private dimensionService: DimensionService,
    private profitCenterService: ProfitCenterService,
    private projectCOAService: ProjectCoaService,
    private segmentCOAService: SegmentCoaService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      segment: new FormControl(),
      profitCenter: new FormControl(),
      dimension: new FormControl(),
      project: new FormControl(),
    });
    this.subs.sink = this.dimensionService.getByCriteria(new Pagination(0, 100), this.apiVisa).subscribe(
      {next: resolve => this.dimension = resolve.data}
    );
    this.subs.sink = this.profitCenterService.getByCriteria(new Pagination(0, 100), this.apiVisa).subscribe(
      {next: resolve => this.profitCenter = resolve.data}
    );
    this.subs.sink = this.projectCOAService.getByCriteria(new Pagination(0, 100), this.apiVisa).subscribe(
      {next: resolve => this.project = resolve.data}
    );
    this.subs.sink = this.segmentCOAService.getByCriteria(new Pagination(0, 100), this.apiVisa).subscribe(
      {next: resolve => this.segment = resolve.data}
    );
    this.subs.sink = this.draft$.subscribe({next: resolve => {
      this.form.patchValue({
        segment: resolve.guid_segment,
        profitCenter: resolve.guid_profit_center,
        dimension: resolve.guid_dimension,
        project: resolve.guid_project,
      });
    }});
    this.subs.sink = this.form.valueChanges.subscribe({next: (form) => {
      this.updateDepartment.emit(form);
    }});
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
