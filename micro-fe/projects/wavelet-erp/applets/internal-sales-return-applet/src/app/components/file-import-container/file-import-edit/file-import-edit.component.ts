import { ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
} from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatTabGroup } from "@angular/material/tabs";
import {
  Pagination,
  AppLoginPrincipalService,
  SalesReturnFileImportContainerModel,
  SalesReturnFileImportService
} from "blg-akaun-ts-lib";
import { Store } from "@ngrx/store";
import { ComponentStore } from "@ngrx/component-store";
import { ViewColumnFacade } from "../../../facades/view-column.facade";
import { Observable, of, Subject } from "rxjs";
import { AkaunConfirmationDialogComponent } from "projects/shared-utilities";
import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import * as moment from "moment";
import { ViewColumnComponent } from "projects/shared-utilities/view-column.component";
import { AppConfig } from "projects/shared-utilities/visa";
import { FileImportStates } from "../../../state-controllers/file-import-controller/store/states";
import { FileImportSelectors } from "../../../state-controllers/file-import-controller/store/selectors";
import { AppletSettings } from '../../../models/applet-settings.model';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';
import { SubSink } from 'subsink2';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

interface LocalState {
  deactivateAdd: boolean;
  deactivateList: boolean;
  selectedRow: any;
  deactivateReturn: boolean;
  selectedIndex: number;
}

@Component({
  selector: 'app-import-file',
  templateUrl: './file-import-edit.component.html',
  styleUrls: ['./file-import-edit.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore]
})
export class ImportFileEditComponent extends ViewColumnComponent {
  paging = new Pagination();
  private subs = new SubSink();
  gridApi;
  gridColumnApi;
  columnsDefs;
  configColumnsDefs;

  sideBar = {
    toolPanels: ["columns"],
    defaultToolPanel: "",
  };

  form: FormGroup;
  toggleColumn$: Observable<boolean>;
  akaunConfirmationDialogComponentMatRef: MatDialogRef<AkaunConfirmationDialogComponent>;
  fileimportGuid: any;
  prevIndex: number;
  private localState: LocalState;
  private prevLocalState: any;
  protected readonly index = 2; 
  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  readonly deactivateReturn$ = this.componentStore.select(
    (state) => state.localState.deactivateReturn
  );
  readonly selectedIndex$ = this.componentStore.select(
    (state) => state.localState.selectedIndex
  );
  protected compName = "File Import Edit";
  username: any;
  orientation: boolean = false;

  defaultColDef = {
    filter: "agTextColumnFilter",
    floatingFilterComponentParams: { suppressFilterButton: true },
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
  };

  fileimportContainer = new SalesReturnFileImportContainerModel();

  @ViewChild(MatTabGroup, { static: true }) matTab: MatTabGroup;
  @ViewChild("activeTab", { static: false }) activeTab: MatTabGroup;
  @ViewChild("autosize", { static: true }) autosize: CdkTextareaAutosize;

  paging2 = new Pagination();
  rowData: any = [];
  apiVisa = AppConfig.apiVisa;
  protected _onDestroy = new Subject<void>();
  appletSettings: AppletSettings;

  appletSettings$ = combineLatest([
    this.sessionStore.select(SessionSelectors.selectMasterSettings),
    this.sessionStore.select(SessionSelectors.selectPersonalSettings)
  ]).pipe(map(([a, b]) => ({...a, ...b})));

  constructor(
    public dialog: MatDialog,
    private fileimportService: SalesReturnFileImportService,
    private fb: FormBuilder,
    private readonly store: Store<FileImportStates>,
    private readonly componentStore: ComponentStore<{ localState: LocalState }>,
    private viewColFacade: ViewColumnFacade,
    private appLoginPrincipalService: AppLoginPrincipalService,
    private readonly sessionStore: Store<SessionStates>
  ) {
    super();
    }

  resetform() {
    this.form = this.fb.group({
      file_name: [""],
      file_size: [""],
      import_format: [""],
      process_status: [""],
      error_message: [""],
      createdBy: new FormControl([""]),
      created_date: new FormControl([""]),
    });
  }

  ngOnInit() {
    this.localState$.subscribe((a) => {
      this.localState = a;
      this.componentStore.setState({ localState: a });
    });

    this.viewColFacade.prevIndex$.subscribe(
      (resolve) => (this.prevIndex = resolve)
    );
    this.viewColFacade
      .prevLocalState$()
      .subscribe((resolve) => (this.prevLocalState = resolve));

    this.toggleColumn$ = this.viewColFacade.toggleColumn$;

    console.log("Selected Index", this.selectedIndex$);
    this.resetform();

    this.store
      .select(FileImportSelectors.selectfileImportGuid)
      .subscribe((guid) => {
        this.fileimportGuid = guid;
        this.getFileImport(this.fileimportGuid);
        console.log("this.fileimportGuid",this.fileimportGuid)
      });

    this.subs.sink = this.appletSettings$.subscribe(resolve => {
      this.appletSettings = resolve;
    })
  }

  showPanels(): boolean {
    if(this.appletSettings?.VERTICAL_ORIENTATION){
      if(this.appletSettings?.DEFAULT_ORIENTATION === 'HORIZONTAL'){
        this.orientation = false;
      } else {
        this.orientation = true;
      }
    } else {
      if(this.appletSettings?.DEFAULT_ORIENTATION === 'VERTICAL'){
        this.orientation = true;
      } else {
        this.orientation = false;
      }
    }
    return this.orientation;
  }

  async getFileImport(guid): Promise<void> {
    await this.fileimportService
      .getByGuid(this.fileimportGuid, this.apiVisa)
      .toPromise()
      .then(async (response: any) => {
        this.fileimportContainer = response.data;
        this.form.patchValue({
          file_name: this.fileimportContainer.bl_fi_internal_sales_return_import_file_hdr.file_name
            ? this.fileimportContainer.bl_fi_internal_sales_return_import_file_hdr.file_name.toString()
            : "",
          file_size: this.fileimportContainer.bl_fi_internal_sales_return_import_file_hdr.file_size
            ? this.fileimportContainer.bl_fi_internal_sales_return_import_file_hdr.file_size.toString()
            : "",
          import_format: this.fileimportContainer.bl_fi_internal_sales_return_import_file_hdr.import_format
            ? this.fileimportContainer.bl_fi_internal_sales_return_import_file_hdr.import_format.toString()
            : "",
          process_status: this.fileimportContainer.bl_fi_internal_sales_return_import_file_hdr.process_status
            ? this.fileimportContainer.bl_fi_internal_sales_return_import_file_hdr.process_status.toString()
            : "",
          error_message: this.fileimportContainer.bl_fi_internal_sales_return_import_file_hdr.error_message
            ? this.fileimportContainer.bl_fi_internal_sales_return_import_file_hdr.error_message.toString()
            : "",
        });

        this.form.patchValue({
          created_date: moment(
            response.data.bl_fi_internal_sales_return_import_file_hdr.created_date
          ).format("YYYY-MM-DD HH:mm:ss")
        });
        if (this.form.value.created_date === "Invalid date") {
          this.form.patchValue({
            created_date: "",
          });
        }
        if (response.data.bl_fi_internal_sales_return_import_file_hdr.created_by_subject_guid) {
          const paging2 = new Pagination();
          paging2.conditionalCriteria = [
            {
              columnName: "subject_guid",
              operator: "=",
              value:
                response.data.bl_fi_internal_sales_return_import_file_hdr.created_by_subject_guid.toString(),
            },
          ];
          this.appLoginPrincipalService
            .getByCriteria(paging2, this.apiVisa)
            .subscribe((appLoginPrincipal) => {
              appLoginPrincipal.data.forEach((appLoginPrincipalResponse) => {
                if (
                  appLoginPrincipalResponse.app_login_principal
                    .principal_type === "EMAIL_USERNAME"
                ) {
                  this.form.patchValue({
                    createdBy:
                      appLoginPrincipalResponse.app_login_principal
                        .principal_id,
                  });
                }
              });
            });
        }
      });
  }

  onNext() {
    let selectindex = 2;
    this.viewColFacade.updateInstance(this.index, {
      ...this.localState,
      deactivateAdd: false,
      deactivateList: false,
      selectedIndex: selectindex,
    });
    this.viewColFacade.onNextAndReset(this.index, 3);
  }

  onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateAdd: false,
      deactivateList: false,
      selectedIndex: 0,
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  onGridReady(event) {
    this.gridApi = event.api;
    this.gridColumnApi = event.columnApi;
    event.api.sizeColumnsToFit();
    this.gridApi.closeToolPanel();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    if (this.matTab) {
      this.viewColFacade.updateInstance(this.index, {
        ...this.localState,
        selectedIndex: this.matTab?.selectedIndex,
      });
    }
  }
}