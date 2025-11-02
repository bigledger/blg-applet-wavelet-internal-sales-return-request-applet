import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AppLoginPrincipalService, AppLoginPrincipalTenantService, bl_fi_mst_entity_line_RowClass, EntityLoginSubjectLinkContainerModel, Pagination, } from 'blg-akaun-ts-lib';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from 'projects/shared-utilities/visa';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { ViewColumnFacade } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/facades/view-column.facade';
import { CustomerActions } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/actions';
import { CustomerSelectors } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/selectors';
import { CustomerStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/states';

@Component({
  selector: 'app-login-edit',
  templateUrl: './login-edit.component.html',
  styleUrls: ['./login-edit.component.css']
})
export class EditLoginComponent extends ViewColumnComponent implements OnInit {

  form: FormGroup;

  @Input() customerExtLineItem$: Observable<bl_fi_mst_entity_line_RowClass>;
  deactivateReturn$;
  // @Input() customerExtLineItem$: Observable<bl_fi_mst_entity_line_RowClass>;

  protected readonly index = 16;
  prevIndex: number;
  private prevLocalState: any;
  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  apiVisa = AppConfig.apiVisa;
  paging = new Pagination();
  @Input() customerExt$: Observable<any>;
  paymentExt: any;
  status = [
    { value: 'ACTIVE', viewValue: 'ACTIVE' },
    { value: 'INACTIVE', viewValue: 'INACTIVE' }
  ];
  rank = [
    { value: 'OWNER', viewValue: 'OWNER' },
    { value: 'ADMIN', viewValue: 'ADMIN' },
    { value: 'MANAGER', viewValue: 'MANAGER' },
    { value: 'MEMBER', viewValue: 'MEMBER' },
    { value: 'GUEST', viewValue: 'GUEST' },
    { value: 'VISITOR', viewValue: 'VISITOR' },
    { value: 'ANNONYMOUS', viewValue: 'ANNONYMOUS' },
  ];
  addSuccess = 'Add';
  isClicked: string;
  entityLogin: EntityLoginSubjectLinkContainerModel;

  constructor(
    private appLoginPrincipalTenantService: AppLoginPrincipalTenantService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private readonly store: Store<CustomerStates>,
    private viewColFacade: ViewColumnFacade,
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.fb.group({
      guid: [''],
      status: [''],
      subject_guid: [''],
      user_email: [{ value: '', disabled: true }],
      rank: [''],
    });
    this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.customerExt$ = this.store.select(CustomerSelectors.selectExt);
    this.customerExt$.subscribe(
      data => {
        if (data[0].ext.bl_fi_mst_entity_login_subject_link.subject_guid) {
          this.getUsername(data[0].ext.bl_fi_mst_entity_login_subject_link.subject_guid.toString());
        }
        this.entityLogin = data[0].ext;
        let extData = data[0].ext.bl_fi_mst_entity_login_subject_link;
        this.form.patchValue(
          {
            guid: extData.guid,
            subject_guid: extData.subject_guid,
            // user_email: extData.user_email,
            rank: extData.rank,
            status: extData.status,
          },
        );
      }
    )
    this.getUsername(this.form.value.subject_guid.toString());
  }
  getUsername(guid) {
    let pagination = new Pagination();
    pagination.conditionalCriteria.length = 0;
    pagination.conditionalCriteria.push({
      columnName: "subject_guid",
      operator: "=",
      value: guid,
    }, {
      columnName: " principal_type",
      operator: "=",
      value: 'EMAIL_USERNAME',
    })
    this.appLoginPrincipalTenantService.getByCriteria(pagination, this.apiVisa).subscribe((response) => {
      if (!isEmpty(response) && response.data.length !== 0) {
        let principal_id = response.data[0].app_login_principal.principal_id.toString();
        this.form.patchValue(
          {
            user_email: principal_id,
          });
      } if (isEmpty(response.data) && response.data.length == 0) {

      }
    })
  }
  // Telegraphic Transfer, GIRO and JOmPay
  onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateAdd: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }
  onSave() {
    this.entityLogin.bl_fi_mst_entity_login_subject_link.rank = this.form.value.rank;
    this.entityLogin.bl_fi_mst_entity_login_subject_link.status = this.form.value.status;
    this.store.dispatch(CustomerActions.createContainerDraftLoginInit({ customerLogin: this.entityLogin }));
  }
  onRemove() {
    this.form.patchValue(
      {
        status: 'DELETED'
      },
    );
    this.paymentExt.ext.status = 'DELETED';
    this.onSave();
    this.form.reset();
  }

}
