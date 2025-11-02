import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { GenericDocAttachmentService, Pagination, TenantUserProfileService, bl_fi_generic_doc_ext_RowClass } from 'blg-akaun-ts-lib';
import * as moment from 'moment';
import { AppConfig } from 'projects/shared-utilities/visa';
import { forkJoin, from, iif, Observable, of, zip } from 'rxjs';
import { catchError, concatMap, map, mergeMap, tap, toArray } from 'rxjs/operators';
import { SubSink } from 'subsink2';
import { ToastrService } from 'ngx-toastr';
import { pageFiltering, pageSorting } from 'projects/shared-utilities/listing.utils';
import { DownloadDeleteButtonRendererComponent } from 'projects/shared-utilities/utilities/download-delete-button-renderer/download-delete-button-renderer.component';
import { AttachmentActions } from '../../../../state-controllers/draft-controller/store/actions';
import { InternalSalesReturnActions } from '../../../../state-controllers/internal-sales-return-controller/store/actions';
import { InternalSalesReturnSelectors } from '../../../../state-controllers/internal-sales-return-controller/store/selectors';
import { InternalSalesReturnStates } from '../../../../state-controllers/internal-sales-return-controller/store/states';

export class UserModel {
  guid: any;
  name: string;
}
@Component({
  selector: 'app-internal-sales-return-attachments-listing',
  templateUrl: './attachments-listing.component.html',
  styleUrls: ['./attachments-listing.component.scss']
})
export class AttachmentsListingComponent implements OnInit, OnDestroy {

  @Input() localState: any;
  @Output() addAttachment = new EventEmitter();
  @Output() extItem = new EventEmitter<bl_fi_generic_doc_ext_RowClass>();

  protected subs = new SubSink();

  genDocHdr$ = this.store.select(InternalSalesReturnSelectors.selectSalesReturn).pipe(
    map(a => a.bl_fi_generic_doc_hdr)
  );
  genDocLock$ = this.store.select(InternalSalesReturnSelectors.selectGenDocLock);

  gridApi;
  rowData = [];
  hdr;
  userUploadMap: UserModel[] = [];
  depositUsed = new FormControl();
  frameworkComponents: { buttonRenderer: any; };
  usedCreditMemo = new FormControl();
  genDocLock: boolean;

  defaultColDef = {
    filter: 'agTextColumnFilter',
    floatingFilterComponentParams: { suppressFilterButton: true },
    minWidth: 200,
    flex: 2,
    sortable: true,
    resizable: true,
    suppressCsvExport: true,
    onCellClicked: (params) => this.onRowClicked(params.data)
  };

  columnsDefs = [
    { 
      headerName: 'File Name', 
      field: 'bl_fi_generic_doc_attachment.file_name', 
      cellStyle: () => ({ 'text-align': 'left' })
    },
    { 
      headerName: 'Size', 
      field: 'bl_fi_generic_doc_attachment.file_size', 
      type: 'rightAligned',
      valueGetter: (params) => this.formatBytes(params)
    },
    { 
      headerName: 'Uploaded Date', 
      field: 'bl_fi_generic_doc_attachment.created_date', 
      type: 'rightAligned', 
      valueFormatter: (params) => moment(params.value).format('YYYY-MM-DD') 
    },
    { 
      headerName: 'Uploaded By', 
      field: 'uploaded_by_name', 
      cellStyle: () => ({ "text-align": "left" })
    },
    {
      headerName: "Actions",
      field: "action",
      width: 60,
      cellStyle: () => ({ "text-align": "left" }),
      floatingFilter: false,
      valueGetter: (params) => params.data.bl_fi_generic_doc_attachment.guid,
      cellRenderer: "buttonRenderer",
      cellRendererParams: {
        onClick: this.onDownloadorDelete.bind(this),
      },
    }
  ];

  constructor(
    protected readonly store: Store<InternalSalesReturnStates>,
    private profileService: TenantUserProfileService,
    private genDocAttachmentService: GenericDocAttachmentService,
    private toastr: ToastrService
    ) {
      this.frameworkComponents = {
        buttonRenderer: DownloadDeleteButtonRendererComponent
      };
    }

  ngOnInit() {
    this.subs.sink = this.genDocHdr$.subscribe({ next: resolve => {
      this.hdr = resolve;
      this.gridApi?.refreshServerSideStore();
    }})

    this.subs.sink = this.genDocLock$.subscribe(lock=>{
      this.genDocLock = lock;
    })
  }

  formatBytes(params, decimals = 2) {
    let bytes=params.data.bl_fi_generic_doc_attachment.file_size;
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  } 

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
    this.setGridData()
  }

  setGridData() {
    const datasource = {
      getRows: grid => {
        const sortModel = grid.request.sortModel;
        const filterModel = grid.request.filterModel;
        const sortOn = pageSorting(sortModel);
        const filter = pageFiltering(filterModel);
        this.subs.sink = this.genDocAttachmentService.getAttachmentByCriteria(new Pagination(
          0, grid.request.endRow - grid.request.startRow,
          [
            {columnName: 'calcTotalRecords', operator: '=', value: 'true'},
            {columnName: 'generic_doc_hdr_guid', operator: '=', value: this.hdr.guid.toString()},
          ]
        ), AppConfig.apiVisa)
        .pipe(
          mergeMap((a) =>
          from(a.data).pipe(
            concatMap((a_a: any) =>
            forkJoin([
              iif(
                () => !!a_a.bl_fi_generic_doc_attachment.created_by_subject_guid,
                iif(
                  () =>
                    !!this.userUploadMap.find(
                      (s) =>
                        s.guid ===
                        a_a.bl_fi_generic_doc_attachment.created_by_subject_guid?.toString()
                    ),
                  of(
                    this.userUploadMap.find(
                      (s) =>
                        s.guid ===
                        a_a.bl_fi_generic_doc_attachment.created_by_subject_guid?.toString()
                    )
                  ).pipe(
                    map((a_a_a) => {
                      const container = new UserModel();
                      container.guid = a_a_a.guid;
                      container.name = a_a_a.name;
                      return container;
                    })
                  ),
                  this.profileService
                    .getProfileName(
                      AppConfig.apiVisa,
                      a_a.bl_fi_generic_doc_attachment.created_by_subject_guid?.toString()
                    )
                    .pipe(
                      tap((a_a_b) =>
                        this.userUploadMap.push({
                          guid: a_a.bl_fi_generic_doc_attachment.created_by_subject_guid.toString(),
                          name: a_a_b.data.toString(),
                        })
                      ),
                      map((a_a_c) => {
                        const container = new UserModel();
                        container.guid =
                          a_a.bl_fi_generic_doc_attachment.created_by_subject_guid;
                        container.name = a_a_c.data;
                        return container;
                      }),
                      catchError((err) => of(err))
                    )
                ),
                of(null)
              ),
            ]).pipe(
              map(([b_a]) => {
                a_a = Object.assign(
                  {
                    uploaded_by_name: b_a ? b_a.name : "",
                  },
                  a_a
                );
                return a_a;
              })
            )
          ),
          toArray(),
          map((b) => {
            a.data = b;
            return a;
            })
          )
        )
      )
      .subscribe( resolved => {
            const data = sortOn(resolved.data).filter(entity => filter.by(entity));
            const totalRecords = filter.isFiltering ? resolved.totalRecords : data.length;
            grid.success({
              rowData: data,
              rowCount: totalRecords
            });
          }, err => {
            grid.fail();
          });
        }
      };
    this.gridApi.setServerSideDatasource(datasource);
  }

  onNext() {
    this.addAttachment.emit();
  }

  onRowClicked(entity: bl_fi_generic_doc_ext_RowClass) {
    // this.extItem.emit(e);
  }

  onDownloadorDelete(e) {
    const attachment = e.rowData.bl_fi_generic_doc_attachment;
    if(e.type === "Download"){
      this.subs.sink = this.genDocAttachmentService
          .getAttachmentFile(attachment.guid.toString(), AppConfig.apiVisa)
          .pipe(
            map((a) => {
              console.log(a);
              const downloadURL = window.URL.createObjectURL(a);
              const link = document.createElement("a");
              link.href = downloadURL;
              link.download = attachment.file_name.toString();
              console.log(attachment.file_name.toString());
              link.click();
              link.remove();
              this.toastr.success("Attachment Downloaded", "Success", {
                tapToDismiss: true,
              });
              return;
            }),
            catchError((error) => {
              console.log(error);
              this.toastr.error(error.error.message, error.error.code, {
                tapToDismiss: true,
                progressBar: true,
                timeOut: 2000,
              })
              return of();
            })
          ).subscribe();
    }
    else {
      this.subs.sink = this.genDocAttachmentService
          .deleteAttachment(attachment.guid.toString(), AppConfig.apiVisa)
          .pipe(
            map((a) => {
              this.toastr.success("Attachment Deleted", "Success", {
                tapToDismiss: true,
              });
              return;
            }),
            catchError((error) => {
              this.toastr.error(error.error.message, error.error.code, {
                tapToDismiss: true,
                progressBar: true,
                timeOut: 2000,
              });
              return of();
            })
          ).subscribe(() => this.gridApi.refreshServerSideStore());
    }
  }

  posting() {
    if (this.genDocLock) {
      return false;
    }
    else {
      return true;
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
