import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { bl_fi_generic_doc_hdr_RowClass } from 'blg-akaun-ts-lib';
import { InternalSalesReturnStates } from '../../../../state-controllers/internal-sales-return-controller/store/states';
import { InternalSalesReturnSelectors } from '../../../../state-controllers/internal-sales-return-controller/store/selectors';
import { InternalSalesReturnActions } from '../../../../state-controllers/internal-sales-return-controller/store/actions';
import { ClientSidePermissionsSelectors } from 'projects/shared-utilities/modules/permission/client-side-permissions-controller/selectors';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { AppletSettings } from '../../../../models/applet-settings.model';
import { SubSink } from 'subsink2';
import { PermissionStates } from 'projects/shared-utilities/modules/permission/permission-controller';

@Component({
  selector: 'app-sales-return-arap',
  templateUrl: './arap-details.component.html',
  styleUrls: ['./arap-details.component.scss'],
})
export class SalesReturnARAPComponent implements OnInit, OnDestroy {

  @Input() draft$: Observable<bl_fi_generic_doc_hdr_RowClass>;

  public form: FormGroup;

  protected subs = new SubSink();

  docArapBalance;
  docOpenAmount;
  totalContra;
  totalSettlement;
  totalPNS;
  appletSettings: AppletSettings;
  SHOW_ARAP_PNS: boolean;
  SHOW_ARAP_SETTLEMENT: boolean;
  SHOW_ARAP_DOC_OPEN: boolean;
  SHOW_ARAP_CONTRA: boolean;
  SHOW_ARAP_BAL: boolean;


  constructor(
    protected readonly store: Store<InternalSalesReturnStates>,
    protected readonly sessionStore: Store<SessionStates>,
    protected readonly permissionStore: Store<PermissionStates>,
  ) {
  }

  masterSettings$ = this.sessionStore.select(SessionSelectors.selectMasterSettings);
  clientSidePermissions$ = this.permissionStore.select(ClientSidePermissionsSelectors.selectAll)

  ngOnInit() {

    this.subs.sink = this.masterSettings$.subscribe({ next: (resolve: AppletSettings) => { this.appletSettings = resolve } });
    this.subs.sink = this.clientSidePermissions$.subscribe({
      next: (resolve) => {
        resolve.forEach(permission => {
          if (permission.perm_code === "SHOW_ARAP_PNS") {
            this.SHOW_ARAP_PNS = true;
          }

          if (permission.perm_code === "SHOW_ARAP_SETTLEMENT") {
            this.SHOW_ARAP_SETTLEMENT = true;
          }

          if (permission.perm_code === "SHOW_ARAP_DOC_OPEN") {
            this.SHOW_ARAP_DOC_OPEN = true;
          }

          if (permission.perm_code === "SHOW_ARAP_CONTRA") {
            this.SHOW_ARAP_CONTRA = true;
          }

          if (permission.perm_code === "SHOW_ARAP_BAL") {
            this.SHOW_ARAP_BAL = true;
          }
        })
      }
    });

    this.form = new FormGroup({
      totalPNS: new FormControl(),
      totalSettlement: new FormControl(),
      docOpenAmount: new FormControl(),
      totalContra: new FormControl(),
      totalOutstanding: new FormControl()
    });

    this.subs.sink = this.draft$.subscribe(resolve => {
      if (resolve.posting_status === "VOID" || resolve.posting_status === "DISCARDED") {
        this.form.disable()
      }
      this.getARAP();
    })


    this.form.patchValue({
      totalPNS: this.totalPNS,
      totalSettlement: this.totalSettlement,
      docOpenAmount: this.docOpenAmount,
      totalContra: this.totalContra,
      totalOutstanding: this.docArapBalance
    });
  }

  getARAP() {
    this.store.select(InternalSalesReturnSelectors.selectedDocArapBalance).subscribe(data => {
      this.docArapBalance = data;

      this.form.patchValue({
        totalOutstanding: this.docArapBalance
      });
    })

    this.store.select(InternalSalesReturnSelectors.selectedTotalExpense).subscribe(data => {
      this.totalPNS = data;

      this.form.patchValue({
        totalPNS: this.totalPNS
      });


    })

    this.store.select(InternalSalesReturnSelectors.selectedDocOpenAmount).subscribe(data => {
      this.docOpenAmount = data;

      this.form.patchValue({
        docOpenAmount: this.docOpenAmount,
      });
    })

    this.store.select(InternalSalesReturnSelectors.selectedTotalContra).subscribe(data => {
      this.totalContra = data;

      this.form.patchValue({
        totalContra: this.totalContra
      });
    })
    this.store.select(InternalSalesReturnSelectors.selectedTotalSettlement).subscribe(data => {
      this.totalSettlement = data;

      this.form.patchValue({
        totalSettlement: this.totalSettlement
      });
    })

  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}