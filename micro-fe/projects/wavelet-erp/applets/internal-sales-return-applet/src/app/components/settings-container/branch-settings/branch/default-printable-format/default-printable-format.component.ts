import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { Store } from '@ngrx/store';
import { BranchDefaultPrintableFormatHdrContainerModel, Pagination, BranchDefaultPrintableFormatHdrService } from 'blg-akaun-ts-lib';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { SubSink } from 'subsink2';
import { BranchSettingsActions } from '../../../../../state-controllers/branch-settings-controller/actions';
import { BranchSettingsSelectors } from '../../../../../state-controllers/branch-settings-controller/selectors';
import { BranchSettingsStates } from '../../../../../state-controllers/branch-settings-controller/states';

interface LocalState {
  deactivateReturn: boolean;
  selectedIndex: number;
  deactivateAdd: boolean;
  deactivateList: boolean;
}

@Component({
  selector: "app-default-printable-format",
  templateUrl: "./default-printable-format.component.html",
  styleUrls: ["./default-printable-format.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class DefaultPrintableFormatComponent extends ViewColumnComponent {
  form: FormGroup;
  apiVisa = AppConfig.apiVisa;
  private subs = new SubSink();
  options: any = {};
  branch;
  printableFormat;
  constructor(
    private branchSettingsStore: Store<BranchSettingsStates>,
    private store: Store<SessionStates>,
    private branchPrintableService: BranchDefaultPrintableFormatHdrService,
  ) {
    super();
    this.form = new FormGroup({});
  }
  ngOnInit() {
    this.subs.sink = this.branchSettingsStore
      .select(BranchSettingsSelectors.selectBranch)
      .subscribe((b) => {
        if (b) {
          this.branch = b;
          this.store.dispatch(BranchSettingsActions.selectDefaultPrintableFormatInit({
            branchGuid: b.bl_fi_mst_branch.guid, 
            serverDocType:'INTERNAL_SALES_RETURN_REQUEST'
          }));
        }
      });
    this.form = new FormGroup({
      printableFormatHdr: new FormControl(""),
      header: new FormControl(""),
      footer: new FormControl(""),
    });
    this.subs.sink = this.branchSettingsStore
      .select(BranchSettingsSelectors.selectDefaultFormat)
      .subscribe((p: any) => {
        if (p) {
          this.printableFormat = p;
          this.form.patchValue({
            printableFormatHdr:
              p.bl_fi_mst_branch_default_printable_format_hdr
                .default_printable_format_guid,
            header: p.bl_fi_mst_branch_default_printable_format_hdr.header,
            footer: p.bl_fi_mst_branch_default_printable_format_hdr.footer,
          });
        }
      });
  }

  async onSave() {
    // Avoid creating new record in database (only allow updating) if the same branch_guid and server_doc_type are found
    const paging = new Pagination();
    paging.conditionalCriteria.push({ columnName: 'branch_guid', operator: '=', value: this.branch.bl_fi_mst_branch.guid.toString() });
    paging.conditionalCriteria.push({ columnName: 'server_doc_type', operator: '=', value: 'INTERNAL_SALES_RETURN_REQUEST' });
    const resolve = await this.branchPrintableService.getByCriteria(paging, this.apiVisa).subscribe(
      resolve => {
        if (resolve.data.length > 0) {
          this.printableFormat = resolve.data[0]
        } else {
          this.printableFormat = null;
        }

        let container: BranchDefaultPrintableFormatHdrContainerModel = new BranchDefaultPrintableFormatHdrContainerModel();
        
        if (this.printableFormat) {
          container = this.printableFormat;
          container.bl_fi_mst_branch_default_printable_format_hdr.header =
            this.form.value.header;
          container.bl_fi_mst_branch_default_printable_format_hdr.footer =
            this.form.value.footer;
          (
            container as any
          ).bl_fi_mst_branch_default_printable_format_hdr.default_printable_format_guid =
            this.form.value.printableFormatHdr;
          //console.log('container',container);
          this.store.dispatch(
            BranchSettingsActions.editDefaultPrintableFormatInit({ container })
          );
        } else {
          container.bl_fi_mst_branch_default_printable_format_hdr.branch_guid =
            this.branch.bl_fi_mst_branch.guid;
          container.bl_fi_mst_branch_default_printable_format_hdr.branch_code =
            this.branch.bl_fi_mst_branch.code;
          container.bl_fi_mst_branch_default_printable_format_hdr.branch_name =
            this.branch.bl_fi_mst_branch.name;
          container.bl_fi_mst_branch_default_printable_format_hdr.server_doc_type =
            "INTERNAL_SALES_RETURN_REQUEST";
          container.bl_fi_mst_branch_default_printable_format_hdr.header =
            this.form.value.header;
          container.bl_fi_mst_branch_default_printable_format_hdr.footer =
            this.form.value.footer;
          (
            container as any
          ).bl_fi_mst_branch_default_printable_format_hdr.default_printable_format_guid =
            this.form.value.printableFormatHdr;
          this.store.dispatch(
            BranchSettingsActions.addDefaultPrintableFormatInit({ container })
          );
        }
      }
    );
  }
}