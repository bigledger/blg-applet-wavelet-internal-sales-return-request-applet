import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { MatTabGroup } from "@angular/material/tabs";
import { MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { ComponentStore } from "@ngrx/component-store";
import { ViewColumnFacade } from "../../../facades/view-column.facade";
import { ViewColumnComponent } from "projects/shared-utilities/view-column.component";
import { FileImportStates } from "../../../state-controllers/file-import-controller/store/states";
import { SubSink } from "subsink2";
import { Attachment } from "../../../models/attachment.model";
import { AttachmentSelectors } from "../../../state-controllers/draft-controller/store/selectors";
import { AttachmentActions } from "../../../state-controllers/draft-controller/store/actions";
import { ToastrService } from "ngx-toastr";
import { SalesReturnFileImportService } from "blg-akaun-ts-lib";
import { AppConfig } from "projects/shared-utilities/visa";
// import { Papa } from "ngx-papaparse";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ExportDataDialogComponent } from 'projects/shared-utilities/utilities/export-data-dialog/export-data-dialog.component';
import { InternalSalesReturnActions } from '../../../state-controllers/internal-sales-return-controller/store/actions';
import { InternalSalesReturnStates } from '../../../state-controllers/internal-sales-return-controller/store/states';

interface LocalState {
  deactivateReturn: boolean;
}

@Component({
  selector: "app-file-import-create",
  templateUrl: "./file-import-create.component.html",
  styleUrls: ["./file-import-create.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore],
})
export class FileImportCreateComponent extends ViewColumnComponent {
  protected compName = "File Import Create";
  protected readonly index = 1;
  private localState: LocalState;
  protected subs = new SubSink();

  readonly localState$ = this.viewColFacade.selectLocalState(this.index);

  prevIndex: number;
  private prevLocalState: any;
  byteSize = ["Bytes", "KB", "MB"];
  attachment: Attachment;
  authToken = localStorage.getItem("authToken");
  csvData: any[] = null;
  public form: FormGroup;
  @ViewChild(MatTabGroup, { static: true }) matTab: MatTabGroup;
  @ViewChild("input") input: ElementRef<HTMLInputElement>;

  files$ = this.store.select(AttachmentSelectors.selectAll);
  fileUploaded: boolean = false;
  files: any[];
  Delimeters = [
    { value: "PIPE", viewValue: "PIPE" },
    { value: "COMMA", viewValue: "COMMA" },
  ];

  sourceFields= [

          'BILLING_NAME',
          'AMOUNT_INCL_TAX',
          'LOCATION_CODE',
          'SALES_AGENT_EMPLOYEE_CODE',
          'CREDIT_TERMS',
          'CREDIT_LIMIT',
          'HDR_DESCRIPTION',
          'HDR_REMARKS',
          'TRACKING_ID',
          'ENTITY_CODE',
          'BILLING_EMAIL',
          'BILLING_PHONE',
          'BILLING_ADDRESS_LINE_1',
          'BILLING_ADDRESS_LINE_2',
          'BILLING_ADDRESS_LINE_3',
          'BILLING_ADDRESS_LINE_4',
          'BILLING_ADDRESS_LINE_5',
          'BILLING_COUNTRY',
          'BILLING_STATE',
          'BILLING_CITY',
          'BILLING_POSTCODE',
          'SHIPPING_NAME',
          'SHIPPING_EMAIL',
          'SHIPPING_PHONE',
          'SHIPPING_ADDRESS_LINE_1',
          'SHIPPING_ADDRESS_LINE_2',
          'SHIPPING_ADDRESS_LINE_3',
          'SHIPPING_ADDRESS_LINE_4',
          'SHIPPING_ADDRESS_LINE_5',
          'SHIPPING_COUNTRY',
          'SHIPPING_STATE',
          'SHIPPING_CITY',
          'SHIPPING_POSTCODE',
          'ENTITY_BRANCH_CODE',
          'ENTITY_BRANCH_CODE_XTN_MAPPING_VALUE_01',
          'ENTITY_BRANCH_CODE_XTN_MAPPING_VALUE_02',
          'ENTITY_BRANCH_CODE_XTN_MAPPING_VALUE_03',
          'ENTITY_BRANCH_CODE_XTN_MAPPING_VALUE_04',
          'ENTITY_BRANCH_CODE_XTN_MAPPING_VALUE_05',
          'LINE_BRANCH_CODE',
          'ITEM_REF_NO',
          'STL_AMOUNT',
          'TRANSACTION_NO',
          'STL_REMARKS',
          'UOM',
          'UNIT_PRICE_INCL_TAX',
          'TAX_GST_CODE',
          'TAX_WHT_CODE',
          'ITEM_SERIAL_NO',
          'ITEM_BATCH_NO',
          'ITEM_BIN_NO',
          'ITEM_TRACKING_ID',
          'POSTING_STATUS',
          'GL_CODE',
          'SEGMENT_CODE',
          'GL_DIMENSION_CODE',
          'PROFIT_CENTRE_CODE',
          'PROJECT_CODE',
          'EINVOICE_BUYER_TIN_NO',
          'EINVOICE_BUYER_ENTITY_ID_TYPE',
          'EINVOICE_BUYER_ID_NO',
          'EINVOICE_BUYER_SST_NO',
          'EINVOICE_BUYER_NAME',
          'EINVOICE_BUYER_EMAIL',
          'EINVOICE_BUYER_PHONE',
          'EINVOICE_BUYER_ADDRESS_NAME',
          'EINVOICE_BUYER_ADDRESS_LINE_1',
          'EINVOICE_BUYER_ADDRESS_LINE_2',
          'EINVOICE_BUYER_ADDRESS_LINE_3',
          'EINVOICE_BUYER_ADDRESS_LINE_4',
          'EINVOICE_BUYER_ADDRESS_LINE_5',
          'EINVOICE_BUYER_ADDRESS_CITY',
          'EINVOICE_BUYER_ADDRESS_POSTCODE',
          'EINVOICE_BUYER_ADDRESS_STATE',
          'EINVOICE_BUYER_ADDRESS_COUNTRY',
          'EINVOICE_SUBMISSION_TYPE',
          'EINVOICE_BILLING_FREQUENCY', 
          'EINVOICE_BILLING_PERIOD_START', 
          'EINVOICE_BILLING_PERIOD_END',
          'CLIENT_DOC_TYPE',
          'CLIENT_DOC_1',
          'CLIENT_DOC_2',
          'CLIENT_DOC_3',
          'CLIENT_DOC_4',
          'CLIENT_DOC_5',
          'BASE_DOC_X_RATE',
          'TRADE_TARIFF_CODE',
          'LINE_ITEM_REMARKS'
         ];

targetFields=[

          'BRANCH_CODE',
          'TXN_DATE',
          'HDR_REF_NO',
          'DOC_CURRENCY',
          'SETTLEMENT_OR_ITEM_CODE',
          'QTY',
          
];

disabledFields=[

          'BRANCH_CODE',
          'TXN_DATE',
          'HDR_REF_NO',
          'DOC_CURRENCY',
          'SETTLEMENT_OR_ITEM_CODE',
          'QTY',

];

  constructor(
    private readonly store: Store<FileImportStates>,
    private readonly componentStore: ComponentStore<{ localState: LocalState }>,
    private viewColFacade: ViewColumnFacade,
    private toastr: ToastrService,
    private fileImportService: SalesReturnFileImportService,
    public dialog: MatDialog,
    // private papa: Papa,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    protected readonly siStore: Store<InternalSalesReturnStates>
  ) {
    super();
  }

  ngOnInit() {
    this.subs.sink = this.files$.subscribe((a) => {
      this.files = a;
    });
    this.subs.sink = this.viewColFacade.prevIndex$.subscribe(
      (resolve) => (this.prevIndex = resolve)
    );
    this.subs.sink = this.viewColFacade
      .prevLocalState$()
      .subscribe((resolve) => (this.prevLocalState = resolve));
    this.subs.sink = this.localState$.subscribe((a) => {
      this.localState = a;
      this.componentStore.setState(a);
    });
    this.form = this.fb.group({
      delimeter: ["", [Validators.required]],
    });

    this.form.patchValue({
      delimeter: this.Delimeters[1].value,
    });
    this.siStore.dispatch(
      InternalSalesReturnActions.setDelimeter({ delimeter: this.Delimeters[1].value })
    );
  }

  onChange(e: FileList) {
    // for (let i = 0; i < e.length; i++) {
    //   const file = e.item(i);
    //   if (file) {
    //     this.parseCSV(file);
    //   }
    // }
    let attachment: Attachment;
    Object.values(e).forEach((file) => {
      let size = file.size,
        sizeIncrement = 0;
      while (size >= 1024) {
        size /= 1024;
        sizeIncrement++;
      }
      const fileReader = new FileReader();

      fileReader.readAsDataURL(file);
      fileReader.addEventListener("loadend", (a) => {
        attachment = {
          file,
          fileSRC: file.type.includes("image") ? a.target.result : "icon",
          fileAttributes: {
            fileName: file.name,
            size: `${sizeIncrement > 0 ? size.toFixed(2) : size} ${
              this.byteSize[sizeIncrement]
            }`,
          },
        };
        this.store.dispatch(AttachmentActions.addAttachment({ attachment }));
      });
    });
    this.fileUploaded = true;
  }

  async sampleCSV() {
    if (this.form.value.delimeter === "PIPE") {
      this.fileImportService
        .samplePipeCSV(this.authToken, AppConfig.apiVisa)
        .then((blob) => {
          const downloadURL = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = downloadURL;
          link.download = "Sales_Return_Master_Data_Template.csv";
          link.click();
          link.remove();
          this.toastr.success("Master Data Template Downloaded", "Success", {
            tapToDismiss: true,
            progressBar: true,
            timeOut: 1300,
          });
        });
    } else {
      this.fileImportService
        .sampleCommaCSV(this.authToken, AppConfig.apiVisa)
        .then((blob) => {
          const downloadURL = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = downloadURL;
          link.download = "Sales_Return_Master_Data_Template.csv";
          link.click();
          link.remove();
          this.toastr.success("Master Data Template Downloaded", "Success", {
            tapToDismiss: true,
            progressBar: true,
            timeOut: 1300,
          });
        });
    }
  }

  
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '600px';
    dialogConfig.width = '1000px';
    dialogConfig.data = {
      sourceFields: this.sourceFields,
      targetFields: this.targetFields,
      disabledFields: this.disabledFields
    };
    const dialogRef = this.dialog.open(ExportDataDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //this.fieldsFromDialog = result; // Save the target fields to use in the parent
        console.log('Fields from dialog:', result);
        this.onExport(result);
      }
    });
  }

  onExport(result) {
    const allFields = [...result.fields]; // Get the header fields
    console.log('allFields', allFields);
    
    // Get the selected delimiter from the form
    const selectedDelimiter = this.form.get('delimeter').value;
    
    // Convert the headers to a CSV string with no data rows
    const headerData = [allFields];
    console.log('headerData', headerData);
    
    // Export CSV with only the headers
    this.exportCSV(headerData, "Sales_Return_Master_Data_Template.csv", selectedDelimiter);
  }

  exportCSV(data: any[], fileName: string, delimiter: string) {
    const csv = this.convertToCSV(data, delimiter);
    
    // Create a Blob with UTF-8 encoding
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csv], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  convertToCSV(data: any[], delimiter: string): string {
    // Convert the selected delimiter into its actual value
    const actualDelimiter = delimiter === 'PIPE' ? '|' : ',';
  
    if (Array.isArray(data[0])) {
      // When data is an array of header strings (first element is an array of headers)
      const header = data[0].join(actualDelimiter);
      return header; // Just return the header row
    } else {
      // Logic for handling arrays of objects
      const header = Object.keys(data[0]).join(actualDelimiter);
      const rows = data.map(item => {
        return Object.values(item).map(value => {
          if (typeof value === 'string') {
            let value2 = value as string;
            value2 = value2.replace(/"/g, '""'); // Escape double quotes
            // If the value contains the delimiter or special characters, wrap it in double quotes
            if (value2.includes(actualDelimiter) || value2.includes('"') || /[^\x00-\x7F]/.test(value2)) {
              value = `"${value2}"`;
            } else {
              value = value2;
            }
          }
          return value;
        }).join(actualDelimiter); // Join using the selected delimiter
      });
      return [header, ...rows].join('\n'); // Combine header and rows
    }
  }


  updateDelimeter(e) {
    console.log("delimeter", e);
    this.siStore.dispatch(
      InternalSalesReturnActions.setDelimeter({ delimeter: e.value })
    );
  }

  onAdd() {
    this.store.dispatch(AttachmentActions.uploadSRImportAttachmentsInit());
  }

  // onDeleteFile() {
  //   console.log(this.files[0].id);
  //   this.store.dispatch(AttachmentActions.removeAttachment({ id: this.files[0].id }))
  //   this.csvData = null;
  //   this.cdr.detectChanges();
  //   this.fileUploaded = false;
  // }

  onDeleteFile(file: Attachment) {
    this.store.dispatch(AttachmentActions.removeAttachment({ id: file.id }));
    this.csvData = null;
    this.cdr.detectChanges();
    this.fileUploaded = false;
    this.input.nativeElement.value = null;
  }

  onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateReturn: false,
      deactivateAdd: false,
      deactivateList: false,
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }

  getObjectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
