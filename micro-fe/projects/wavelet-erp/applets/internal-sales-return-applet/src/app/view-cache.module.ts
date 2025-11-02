import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { StoreModule } from "@ngrx/store";
import { LineItemsModule } from "./components/line-items-container/line-items.module";
import { SalesReturnModule } from "./components/sales-return-container/sales-return.module";
// import { LineItemsModule } from "./components/line-items-container/line-items.module";
import { PrintableFormatSettingsModule } from "./components/settings-container/printable-format-settings-container/printable-format-settings-container.module";
import { WorkflowSettingsModule } from "./components/settings-container/workflow-settings-container/workflow-settings-container.module";
import { ReasonSettingsModule } from "./components/settings-container/reason-settings-container/reason-settings-container.modules";
import { ViewColumnFacade } from "./facades/view-column.facade";
import { reducers } from "./state-controllers/view-cache-controller/store/reducers";
import { viewCacheFeatureKey } from "./state-controllers/view-cache-controller/store/reducers/view-cache.reducers";
import { ManualIntercompanyTransactionModule } from "./components/manual-intercompany-transaction/manual-intercompany-transaction.component.module";
import { salesReturnFileExportContainerModule } from "./components/sales-return-file-export/sales-return-file-export.module";
import { BranchSettingsFacade } from "./facades/branch-settings.facade";
import { FileImportModule } from "./components/file-import-container/file-import.module";

@NgModule({
  imports: [
    CommonModule,
    SalesReturnModule,
    LineItemsModule,
    WorkflowSettingsModule,
    PrintableFormatSettingsModule,
    FileImportModule,
    ReasonSettingsModule,
    ManualIntercompanyTransactionModule,
    salesReturnFileExportContainerModule,
    StoreModule.forFeature(viewCacheFeatureKey, reducers.viewCache),
  ],
  providers: [ViewColumnFacade, BranchSettingsFacade]
})
export class ViewCacheModule { }
