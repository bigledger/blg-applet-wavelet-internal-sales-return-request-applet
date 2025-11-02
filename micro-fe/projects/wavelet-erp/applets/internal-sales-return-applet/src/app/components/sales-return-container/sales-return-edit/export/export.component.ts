import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { bl_fi_generic_doc_hdr_RowClass, PrintableFormatContainerModel, BranchDefaultPrintableFormatHdrService, Pagination } from 'blg-akaun-ts-lib';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { AppConfig } from 'projects/shared-utilities/visa';
import { Observable, combineLatest } from 'rxjs';
import { SubSink } from 'subsink2';
import { AppletConstants } from '../../../../models/constants/applet-constants';
// import { AppletConstants } from '../../../../models/constants/applet-constants';
import { InternalSalesReturnActions } from '../../../../state-controllers/internal-sales-return-controller/store/actions';
import { InternalSalesReturnStates } from '../../../../state-controllers/internal-sales-return-controller/store/states';
import { BranchSettingsSelectors } from '../../../../state-controllers/branch-settings-controller/selectors';
import { BranchSettingsStates } from '../../../../state-controllers/branch-settings-controller/states';

@Component({
  selector: 'app-internal-sales-return-edit-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class InternalSalesReturnEditExportComponent implements OnInit, OnDestroy {

  protected subs = new SubSink();

  @Input() draft$: Observable<bl_fi_generic_doc_hdr_RowClass>;
  @Output() print = new EventEmitter();

  readonly appletSettings$ = this.sessionStore.select(SessionSelectors.selectMasterSettings);
  readonly branchPrintableFormat = this.branchSettingsStore.select(BranchSettingsSelectors.selectDefaultFormat);

  apiVisa = AppConfig.apiVisa;
  printableFormat = new FormControl();
  txn_type = AppletConstants.docType;
  branchGuid: any;

  constructor(private readonly store: Store<InternalSalesReturnStates>,
    private branchPrintableService: BranchDefaultPrintableFormatHdrService,
    private readonly sessionStore: Store<SessionStates>,
    private branchSettingsStore: Store<BranchSettingsStates>) { }

  ngOnInit() {
    // console.log("BRANCH", this.branchPrintableFormat);
    // this.subs.sink = this.appletSettings$.subscribe(settings => {
    //   if(!this.branchPrintableFormat) {
    //     this.printableFormat.setValue(settings?.PRINTABLE);
    //   } else {
    //     this.printableFormat.setValue(settings?.PRINTABLE);
    //   }
    //   console.log(settings);
    //   console.log("PRINTABLE FORMAT", this.printableFormat);
    // });

    this.subs.sink = this.draft$.subscribe((draft) => {
      this.branchGuid = draft.guid_branch;
      console.log(this.branchGuid);
    });

    combineLatest([
      this.sessionStore.select(SessionSelectors.selectMasterSettings),
      this.branchSettingsStore.select(BranchSettingsSelectors.selectDefaultFormat),
    ]).pipe(
    ).subscribe({next: ([
      master, defaultPrintable
    ]:any) => {
      // Determine if branchSettingsDefaultPrintableFormat is available, otherwise fall back to masterSettings
      const defaultGuid = defaultPrintable?.bl_fi_mst_branch_default_printable_format_hdr?.default_printable_format_guid 
                          ?? master?.PRINTABLE; // Using nullish coalescing for readability
      
      this.printableFormat.setValue(defaultGuid);
    }});
  }

  onPrintableFormatChange(e: PrintableFormatContainerModel) {
    this.printableFormat.setValue(e.bl_prt_printable_format_hdr.guid.toString());
  };


  onPrint() {
    // if (this.printableFormat.value) {
    //   this.store.dispatch(InternalSalesReturnActions.printJasperPdfInit({ guid: this.printableFormat.value.toString() }));
    // }
    const paging = new Pagination();

    paging.conditionalCriteria.push({
      columnName: "branch_guid",
      operator: "=",
      value: this.branchGuid,
    });

    paging.conditionalCriteria.push({
      columnName: "server_doc_type",
      operator: "=",
      value: "INTERNAL_SALES_RETURN",
    });

    this.subs.sink = this.branchPrintableService
      .getByCriteria(paging, this.apiVisa)
      .subscribe((res) => {
        const printable = res.data.length
          ? res.data[0].bl_fi_mst_branch_default_printable_format_hdr
              .default_printable_format_guid
          : null;

        this.store.dispatch(
          InternalSalesReturnActions.printJasperPdfInit({
            guid: printable ? printable : this.printableFormat.value.toString(),
          })
        );
      });
  }

  onOpen() {
    if (this.printableFormat.value) {
      this.store.dispatch(InternalSalesReturnActions.openJasperPdfInit({ guid: this.printableFormat.value.toString() }));
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}