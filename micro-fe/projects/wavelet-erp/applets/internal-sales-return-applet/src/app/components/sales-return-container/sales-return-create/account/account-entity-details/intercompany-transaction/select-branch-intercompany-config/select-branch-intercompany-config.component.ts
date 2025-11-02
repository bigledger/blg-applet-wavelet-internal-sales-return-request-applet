import { Component, OnInit, OnDestroy, EventEmitter, Output, Input, ElementRef,  ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import {
  BranchIntercompanySettingService,
  BranchIntercompanySettingContainerModel,
  Pagination
} from 'blg-akaun-ts-lib';
import { Store } from '@ngrx/store';
import { ReplaySubject, Observable  } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { AppConfig } from "projects/shared-utilities/visa";
import { MatChipInputEvent } from "@angular/material/chips";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import {HDRActions}from '../../../../../../../state-controllers/draft-controller/store/actions';
import { DraftStates } from '../../../../../../../state-controllers/draft-controller/store/states';

@Component({
  selector: 'select-branch-intercompany-config',
  templateUrl: './select-branch-intercompany-config.component.html',
  styleUrls: ['./select-branch-intercompany-config.component.css']
})
export class SelectBranchIntercompanyConfigComponent implements OnInit, OnDestroy {

  @Input() configControl: FormControl;
  @Input() branchGuid: any;
  @Input() configs: any; // to populate the field during edit.
  @Output() selectionChange = new EventEmitter();

  public form: FormGroup;

  private subs = new SubSink();
  private apiVisa = AppConfig.apiVisa;
  private ISR:string = 'INTERNAL_SALES_RETURN'
  configFilterControl = new FormControl();
  filteredConfigs$: ReplaySubject<BranchIntercompanySettingContainerModel[]> = new ReplaySubject<BranchIntercompanySettingContainerModel[]>(1);
  configList: any[];
  selectedConfigs = []
  settings:any;
  @ViewChild("configInput") configInput: ElementRef<HTMLInputElement>;

  separatorKeysCodes:any;
  constructor( 
    private configService: BranchIntercompanySettingService,
    protected readonly store: Store<DraftStates>,

    ) {}

  ngOnInit() {

    console.log("branch_guids", this.branchGuid)
  
    let pagination = new Pagination();
    if (this.branchGuid !== undefined && this.branchGuid !== null){
      pagination.conditionalCriteria = [
        { columnName: "limit", operator: "=", value: "9999999" },
        { columnName: "branch_guids", operator: "=", value: this.branchGuid },
        { columnName: "source_doc_types", operator: "=", value: this.ISR }
      ];
    }else{
      pagination.conditionalCriteria = [
        { columnName: "limit", operator: "=", value: "9999999" },
        { columnName: "source_doc_types", operator: "=", value: this.ISR }
      ];
    }
    
        this.subs.sink = this.configService.getByCriteria(pagination, this.apiVisa).subscribe(
          {next: resolve => {
            this.configList = resolve.data;
            this.filteredConfigs$.next(this.configList);
            console.log("config list",  this.configList)
            if(this.configs !== null && this.configs !== undefined){
              this.populateForm()
            }

          }});
    
        this.subs.sink = this.configFilterControl.valueChanges.pipe(
          debounceTime(300),
          distinctUntilChanged()
        ).subscribe({next: resolve => this.filterConfig(resolve)});

        
  }

  populateForm(){
    let cnfGuids = []
    if(this.configs.configGuids !== undefined && this.configs.configGuids !== null && this.configList.length !==0 ){
      // console.log("configs", this.configs)
      // console.log("configList", this.configList)
      let cnfs = this.configList.filter(cn => 
        this.configs.configGuids.includes(cn.bl_fi_mst_branch_intercompany_setting.guid.toString())  )
      // console.log("cnfs", cnfs)
      cnfs.forEach(cn => {
        cn.selected = true
        this.selectedConfigs.push(cn);
      })
    }
  
  }


  filterConfig(search: string) {
    if (!search) {
      this.filteredConfigs$.next(this.configList);
    } else {
      search = search.toLocaleLowerCase();
      const filter = this.configList.filter(c => 
        c.bl_fi_mst_branch_intercompany_setting.config_code.toLocaleLowerCase().includes(search) 
        || c.bl_fi_mst_branch_intercompany_setting.config_name.toLocaleLowerCase().includes(search)  );
      this.filteredConfigs$.next(filter);
    }

  }

  add(event: MatChipInputEvent): void {
    // console.log("add category")
    const value = (event.value || "").trim();
    // Add our branch
    if (value) {
      this.selectedConfigs.push(value);
    }
    // Clear the input value
    event.input.value = "";
    this.configFilterControl.setValue(null);
  }

  remove(config: any): void {
    const i = this.selectedConfigs.findIndex(
      (value) => value.guid === config.guid
    );
    this.selectedConfigs[i].selected = false
    this.selectedConfigs.splice(i, 1);
    let configGuids = []
    this.selectedConfigs.forEach((cg) => {
      configGuids.push(cg.bl_fi_mst_branch_intercompany_setting.guid.toString());
    })
    // console.log("configGuids", configGuids)
    this.settings = this.constructIntercompanySetting(configGuids)
    this.selectionChange.emit()
    // this.store.dispatch(HDRActions.setBranchIntercompanySettingGuids({setting: this.settings }))
    
  }

  optionClicked(event: Event, branch: any) {
    event.stopPropagation();
    this.configToggleSelection(branch);
  }

  configToggleSelection(branch: any) {
    console.log(branch);
    branch.selected = !branch.selected;
    this.configInput.nativeElement.value = "";
    if (branch.selected) {
      this.selectedConfigs.push(branch);
    } else {
      const i = this.selectedConfigs.findIndex((value) => value.bl_fi_mst_branch_intercompany_setting.guid === branch.bl_fi_mst_branch_intercompany_setting.guid);
      this.selectedConfigs.splice(i, 1);
    }
    let configGuids = []
    this.selectedConfigs.forEach((cg) => {
      configGuids.push(cg.bl_fi_mst_branch_intercompany_setting.guid.toString());
    })
    // console.log("configGuids", configGuids)
    this.settings = this.constructIntercompanySetting(configGuids)
    this.selectionChange.emit()
    // this.store.dispatch(HDRActions.setBranchIntercompanySettingGuids({setting: this.settings }))
    
  }

  constructIntercompanySetting(configGuids:any){
    let configJson ={configGuids}
    // console.log("configJson", configJson)
    return configJson;
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log(event.option);
    this.selectedConfigs.push(event.option.value);
    this.configInput.nativeElement.value = "";
    this.configFilterControl.setValue(null);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}

