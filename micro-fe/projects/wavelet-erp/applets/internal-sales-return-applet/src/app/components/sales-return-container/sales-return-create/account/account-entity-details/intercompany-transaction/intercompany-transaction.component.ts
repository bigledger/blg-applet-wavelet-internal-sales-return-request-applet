import { Component, EventEmitter, OnInit, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink2';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { AppConfig } from 'projects/shared-utilities/visa';
import { bl_fi_generic_doc_hdr_RowClass, IntercompanyBranchService, BranchService  } from 'blg-akaun-ts-lib';
import {HDRActions}from '../../../../../../state-controllers/draft-controller/store/actions';
import { DraftStates } from '../../../../../../state-controllers/draft-controller/store/states';
import { SelectBranchIntercompanyConfigComponent } from './select-branch-intercompany-config/select-branch-intercompany-config.component';
@Component({
  selector: "intercompany-transaction",
  templateUrl: "./intercompany-transaction.component.html",
  styleUrls: ["./intercompany-transaction.component.css"],
})
export class IntercompanyTransactionComponent implements OnInit {
  @Input() draft$: Observable<bl_fi_generic_doc_hdr_RowClass>;
  @Output() updateMain = new EventEmitter();
  checkforIntercompanyBranches$: Observable<{ show: boolean}>
  protected subs = new SubSink();
  public form: FormGroup;
  modeValue;
  isReadOnly;
  apiVisa = AppConfig.apiVisa;
  branchGuid: any // passed into the branch intercompany setting config dropdown 
  entityGuid:any // passed into the selection to get the intercompany branch dropdown listing
  draftGenericDoc:any
  selectedConfigs:any //selection during create
  configs: any //from previous selections
  @ViewChild(SelectBranchIntercompanyConfigComponent) config: SelectBranchIntercompanyConfigComponent;
  constructor(
    private intercompanyBranchService: IntercompanyBranchService,
    private branchService: BranchService,
    protected readonly draftStore: Store<DraftStates>,
  ) {}
  ngOnInit(): void {
    this.form = new FormGroup({
      selectedBranch: new FormControl(),
      selectedEntity: new FormControl(),
      intercompanyBranch: new FormControl(),
      intercompanyConfig: new FormControl()
    });
    this.subs.sink = this.draft$.subscribe({ next: (resolve: any) => {
        console.log("intercompany TXN draft", resolve)
        this.draftGenericDoc = resolve;
        this.entityGuid = resolve.doc_entity_hdr_guid ? resolve.doc_entity_hdr_guid : null 
        this.branchGuid = resolve.guid_branch ? resolve.guid_branch : null 
        // check if the selected entity has intercompany branches (bl_fi_entity_branch_hdr) 
        if(resolve.doc_entity_hdr_guid!==null && resolve.doc_entity_hdr_guid!==undefined){
            this.checkForIntCompBranches()
          }
          this.form.patchValue({
            selectedBranch: resolve.code_branch,
            selectedEntity: resolve.doc_entity_hdr_json.entityName,
            intercompanyBranch: resolve.entity_branch_hdr_guid,
            intercompanyConfig: resolve.intercompany_settings_json.configGuids ? resolve.intercompany_settings_json.configGuids : null 
          })
          // call webservice if the code_branch is null
          if(resolve.code_branch !== undefined || resolve.code_branch !== null) {
            this.getBranch(this.branchGuid)
          }
          this.configs = resolve.intercompany_settings_json ? resolve.intercompany_settings_json : null 
    }})
  }
  getBranch(branchGuid:string) {
    if (branchGuid !== undefined && branchGuid !== null) {
      this.subs.sink = this.branchService.getByGuid(branchGuid.toString(), this.apiVisa)
        .pipe(
          map((branchResp:any) => {
            this.form.patchValue({
              selectedBranch : branchResp.data.bl_fi_mst_branch.code
            })
          }),
        )
        .subscribe();
    }
  }
  
  checkForIntCompBranches(){
    // console.log("this.selectedEntity ---->", this.selectedEntity)
    let payload = {
      guid:this.draftGenericDoc.doc_entity_hdr_guid
    }
    this.checkforIntercompanyBranches$ = this.intercompanyBranchService
    .getByEntity(payload, this.apiVisa).pipe(map( (response:any) => {
      // console.log(response);
       return { show: response.data.length > 0 ? true : false}
    }))
  }
  onSelect(entity:any){
    // console.log("dropdown select -->",entity)
    // save in draft
    this.draftStore.dispatch(HDRActions.setEntityBranchHdr({guid:entity.intercompanyBranch.toString()}))
  }
  onConfigSelect(event:any){
    console.log("config", this.config.settings)
    this.selectedConfigs = this.config.settings;
    // save in draft
    this.draftStore.dispatch(HDRActions.setBranchIntercompanySettingGuids({setting: this.config.settings }))
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}