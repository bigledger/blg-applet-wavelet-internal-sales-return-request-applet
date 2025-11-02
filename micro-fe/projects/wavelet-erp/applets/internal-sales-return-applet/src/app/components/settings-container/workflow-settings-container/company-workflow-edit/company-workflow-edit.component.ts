import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { CompanyWorkflowGendocProcessContainerModel, CompanyWorkflowGendocProcessService, Pagination, WfMdProcessHdrService } from 'blg-akaun-ts-lib';
import { SubSink } from 'subsink2';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { ViewColumnFacade } from '../../../../facades/view-column.facade';
import { WorkflowStates } from '../../../../state-controllers/workflow-controller/store/states';
import { WorkflowSelectors } from '../../../../state-controllers/workflow-controller/store/selectors';
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
  selector: 'app-company-workflow-edit',
  templateUrl: './company-workflow-edit.component.html',
  styleUrls: ['./company-workflow-edit.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})

export class CompanyWorkflowEditComponent extends ViewColumnComponent implements OnInit{

  private subs = new SubSink();

  protected compName = 'Edit Company Workflow';
  protected index = 2;
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
  selectedData: CompanyWorkflowGendocProcessContainerModel;
  deleteConfirmation = false;
  docType = AppletConstants.docType;
  pagination = new Pagination();
  companyGuid;
  // docGuid;

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
      companyGuid: new FormControl(),
      processGuid: new FormControl('', Validators.required),
      appletGuid: new FormControl(),
      description: new FormControl(),
      serverDoc: new FormControl(this.docType),
    });
    this.subs.sink = this.store.select(WorkflowSelectors.selectedCompanyWorkflow).subscribe((result) => {
      if(result){
        this.selectedData = result;
        this.companyGuid = result.bl_fi_comp_workflow_gendoc_process_template_hdr.company_guid;
        // this.docGuid = result.bl_fi_comp_workflow_gendoc_process_template_hdr.guid;
        this.form.patchValue({
          processGuid: result.bl_fi_comp_workflow_gendoc_process_template_hdr.process_hdr_guid,
          companyGuid: result.bl_fi_comp_workflow_gendoc_process_template_hdr.company_guid,
          appletGuid: result.bl_fi_comp_workflow_gendoc_process_template_hdr.applet_guid,
          description: result.bl_fi_comp_workflow_gendoc_process_template_hdr.descr,
          serverDoc: result.bl_fi_comp_workflow_gendoc_process_template_hdr.server_doc_type
        })
      }
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
    Object.assign(container, this.selectedData);
    const processGuid = this.form.value.processGuid.toString();
    this.subs.sink = this.processHdrService.getByGuid(processGuid, this.apiVisa).subscribe(
      resolve => {
        container.bl_fi_comp_workflow_gendoc_process_template_hdr.process_hdr_code = resolve.data.bl_wf_md_process_hdr.name;

        container.bl_fi_comp_workflow_gendoc_process_template_hdr.company_guid = this.form.value.companyGuid;
        container.bl_fi_comp_workflow_gendoc_process_template_hdr.process_hdr_guid = processGuid;
        container.bl_fi_comp_workflow_gendoc_process_template_hdr.descr = this.form.value.description;
        container.bl_fi_comp_workflow_gendoc_process_template_hdr.server_doc_type = this.docType;
        container.bl_fi_comp_workflow_gendoc_process_template_hdr.applet_guid = this.appletGuid;
  
        this.store.dispatch(WorkflowActions.updateCompanyWorkflowInit({ container }));
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

  async onDelete() {
    console.log("Deleting Data");
    if (this.deleteConfirmation) {
      this.store.dispatch(WorkflowActions.deleteCompanyWorkflowInit({ guid: this.selectedData.bl_fi_comp_workflow_gendoc_process_template_hdr.guid.toString() }));
      this.onReturn();
    } else {
      this.deleteConfirmation = true;
      this.componentStore.patchState({ deleteConfirmation: true });
    }
  }

}

