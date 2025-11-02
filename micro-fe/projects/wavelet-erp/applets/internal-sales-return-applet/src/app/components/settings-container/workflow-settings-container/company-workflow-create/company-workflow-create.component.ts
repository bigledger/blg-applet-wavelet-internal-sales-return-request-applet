import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { CompanyContainerModel, CompanyWorkflowGendocProcessContainerModel, CompanyWorkflowGendocProcessService, Pagination, WfMdProcessHdrService } from 'blg-akaun-ts-lib';
import { SubSink } from 'subsink2';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { ViewColumnFacade } from '../../../../facades/view-column.facade';
import { WorkflowStates } from '../../../../state-controllers/workflow-controller/store/states';
import { AppletConstants } from '../../../../models/constants/applet-constants';
import { AppConfig } from 'projects/shared-utilities/visa';
import { WorkflowActions } from '../../../../state-controllers/workflow-controller/store/actions';

interface LocalState {
  deactivateAdd: boolean;
  deactivateReturn: boolean;
  deactivateList: boolean;
  selectedIndex: number;
  deleteConfirmation: boolean;
}

@Component({
  selector: 'app-company-workflow-create',
  templateUrl: './company-workflow-create.component.html',
  styleUrls: ['./company-workflow-create.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})

export class CompanyWorkflowCreateComponent extends ViewColumnComponent implements OnInit{

  private subs = new SubSink();

  protected compName = 'Create Company Workflow';
  protected index = 1;
  protected localState: LocalState;
  apiVisa = AppConfig.apiVisa;

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateAdd$ = this.componentStore.select(state => state.deactivateAdd);
  readonly deactivateReturn$ = this.componentStore.select(state => state.deactivateReturn);
  readonly deactivateList$ = this.componentStore.select(state => state.deactivateList);
  readonly selectedIndex$ = this.componentStore.select(state => state.selectedIndex);
  readonly deleteConfirmation$ = this.componentStore.select(state => state.deleteConfirmation);

  prevIndex: number;
  protected prevLocalState: any;
  public form: FormGroup;
  selectedData: CompanyContainerModel;
  deleteConfirmation = false;
  docType = AppletConstants.docType;
  pagination = new Pagination();
  companyGuid;

  appletGuid = sessionStorage.getItem('appletGuid');

  constructor(
    private viewColFacade: ViewColumnFacade,
    private readonly componentStore: ComponentStore<LocalState>,
    private processHdrService : WfMdProcessHdrService,
    protected readonly store: Store<WorkflowStates>,
    ) {
    super();
  }

  ngOnInit() {
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.subs.sink = this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.subs.sink = this.localState$.subscribe( a => {
      this.localState = a;
      this.componentStore.setState(a);
    });
    this.form = new FormGroup({
      companyGuid: new FormControl('', Validators.required),
      processGuid: new FormControl('', Validators.required),
      appletGuid: new FormControl(this.appletGuid),
      serverDoc: new FormControl(this.docType),
      description: new FormControl(),
    });
  }

  onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateAdd: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  onSave() {
    const container = new CompanyWorkflowGendocProcessContainerModel();  
    const processGuid = this.form.value.processGuid.toString();
    this.subs.sink = this.processHdrService.getByGuid(processGuid, this.apiVisa).subscribe(
      resolve => {
        container.bl_fi_comp_workflow_gendoc_process_template_hdr.process_hdr_code = resolve.data.bl_wf_md_process_hdr.name;

        container.bl_fi_comp_workflow_gendoc_process_template_hdr.company_guid = this.form.value.companyGuid;
        container.bl_fi_comp_workflow_gendoc_process_template_hdr.company_code = this.form.value.companyCode;
        container.bl_fi_comp_workflow_gendoc_process_template_hdr.process_hdr_guid = this.form.value.processGuid ;
        container.bl_fi_comp_workflow_gendoc_process_template_hdr.server_doc_type = this.docType;
        container.bl_fi_comp_workflow_gendoc_process_template_hdr.applet_guid = this.appletGuid;
        container.bl_fi_comp_workflow_gendoc_process_template_hdr.descr = this.form.value.description;
  
        this.store.dispatch(WorkflowActions.createCompanyWorkflowInit({ container }));
        this.onReturn();
      },
      error => {
        console.error("Error:", error);
      }
    );
  }
  

  disableButton() {
    return this.form?.invalid;
   }

}

