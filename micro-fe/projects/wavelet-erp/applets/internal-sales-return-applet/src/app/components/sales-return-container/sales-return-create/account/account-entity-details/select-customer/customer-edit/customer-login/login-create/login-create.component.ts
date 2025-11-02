import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  ApiVisa, AppLoginContainerModel, AppLoginPrincipalService,
  AppLoginPrincipalTenantService, AppLoginRegistrationContainerModel, AppLoginRegistrationService, app_login_registration_RowClass, bl_fi_mst_entity_line_RowClass,
  EntityLoginSubjectLinkContainerModel, EntityLoginSubjectLinkService, Pagination, TenantService, TenantUserService,
} from 'blg-akaun-ts-lib';
import { isEmpty } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { ViewColumnComponent } from 'projects/shared-utilities/view-column.component';
import { AppConfig } from 'projects/shared-utilities/visa';
import { ViewColumnFacade } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/facades/view-column.facade';
import { CustomerConstants } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/models/customer-constants';
import { CustomerActions } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/actions';
import { CustomerSelectors } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/selectors';
import { CustomerStates } from 'projects/wavelet-erp/applets/internal-sales-return-applet/src/app/state-controllers/customer-controller/states';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-login-create',
  templateUrl: './login-create.component.html',
  styleUrls: ['./login-create.component.css']
})
export class CreateLoginComponent extends ViewColumnComponent implements OnInit {

  form: FormGroup;
  deactivateReturn$;
  @Input() customerExtLineItem$: Observable<bl_fi_mst_entity_line_RowClass>;

  protected readonly index = 15;
  prevIndex: number;
  private prevLocalState: any;
  readonly localState$ = this.viewColFacade.selectLocalState(this.index);
  customerExt$: Observable<any>;
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
  apiVisa = AppConfig.apiVisa;
  subjectLink: EntityLoginSubjectLinkContainerModel;
  addSuccess = 'Add';
  isClicked = 'primary';
  doesEmailExist = false;
  verifyBtnAppear = true;
  sendBtnAppear = false;
  errorMessage: string;
  haveError = false;
  message: any;
  entityGuid$: Observable<any>;
  constructor(
    private tenantUserService: TenantUserService,
    private appLoginPrincipalService: AppLoginPrincipalTenantService,
    private toastr: ToastrService,
    private readonly store: Store<CustomerStates>,
    private fb: FormBuilder,
    private viewColFacade: ViewColumnFacade,
    private _entityLoginSubjectLinkService: EntityLoginSubjectLinkService,
    private userInvitationService: AppLoginRegistrationService
  ) {
    super();
  }

  ngOnInit() {
    this.customerExt$ = this.store.select(CustomerSelectors.selectContainer);
    this.form = this.fb.group({
      status: [''],
      user_email: ['', [Validators.required, Validators.email]],
      rank: [''],
      subject_guid: [''],
      entity_hdr_guid: [''],
      createdDate: [''],
      modifiedDate: ['']
    });

    this.viewColFacade.prevIndex$.subscribe(resolve => this.prevIndex = resolve);
    this.viewColFacade.prevLocalState$().subscribe(resolve => this.prevLocalState = resolve);
    this.store.select(CustomerSelectors.selectGuid).subscribe((entity) => {
      this.form.patchValue({
        entity_hdr_guid: entity
      });
    });
    this.form.get('user_email').valueChanges.subscribe((x) => {
      this.doesEmailExist = false;
      this.errorMessage = null;
      this.message = null;
      this.sendBtnAppear = false;
      this.verifyBtnAppear = true;
    })
  }
  validateEmail(email) {
    // check if email is valid
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  checkUserExist() {
    this.doesEmailExist = false;
    const isEmailValid = this.validateEmail(this.form.value.user_email);
    if (isEmailValid) {
      // encode the email for post api call
      const userEmail = this.form.value.user_email.replace('@', '%40');
      //  empty body
      const d = {};
      this.tenantUserService.addUser(userEmail, d, this.apiVisa).subscribe((resp) => {
        if (resp.code = 'OK_RESPONSE') {
          this.doesEmailExist = true;
          this.verifyBtnAppear = false;
          this.sendBtnAppear = false;
          this.getSubjectGuid(this.form.value.user_email.toString());
        }
      }, error => {
        this.haveError = true;
        this.errorMessage = error.error.code.toString();
        if (this.errorMessage == 'USER_NOT_FOUND') {
          // backend implementing the invitation
          // Scenario 2 => valid email, but not in root
          // send invitation
          this.message = 'User \'' + this.form.value.user_email.toString() + '\' not found.';
          this.verifyBtnAppear = false;
          this.sendBtnAppear = true;

        }
        if (this.errorMessage.includes('already exists')) {
          this.doesEmailExist = true;
          this.getSubjectGuid(this.form.value.user_email);
          this.verifyBtnAppear = false;
          this.sendBtnAppear = false;
        }
      }
      );
      // get the value from form
      // check if the input in the root if not send inviation
      // if in the root but not in the tenant => tenantUserService
      // get the subject guid and add add to platform
    }
  }

  sendInvite() {
    let requestBody = {
      "email": this.form.value.user_email.toString(),
      "postRegistrationRequest": {
        "add_user_to_tenant": true
      }
    }

    this.userInvitationService.inviteUser(requestBody, this.apiVisa).subscribe((resp) => {
      this.haveError = false;
      this.message = 'Invitation email to AKAUN has been sent to ' + this.form.value.user_email.toString();
    })
  }

  getSubjectGuid(user_email) {
    const pagintaion = new Pagination();
    pagintaion.conditionalCriteria.length = 0;
    pagintaion.conditionalCriteria.push(
      { columnName: 'principal_id', operator: '=', value: user_email },
      { columnName: 'principal_type', operator: '=', value: 'EMAIL_USERNAME' },
      { columnName: 'status', operator: '=', value: 'USER_CONFIRMED' },
    );
    this.appLoginPrincipalService.getByCriteria(pagintaion, this.apiVisa).subscribe((response) => {
      if (!isEmpty(response) && response.data.length !== 0) {
        const subject_guid = response.data[0].app_login_principal.subject_guid.toString();
        const principal_id = response.data[0].app_login_principal.principal_id.toString();
        this.form.patchValue(
          {
            subject_guid: subject_guid
          });
        // show message if have any error or successfully added
        this.haveError = false;
        this.message = 'User email \'' + principal_id + '\' is valid';
      } if (isEmpty(response.data) && response.data.length == 0) {
        this.haveError = true;
        this.message = 'User email does not exist or was not confirmed';
      }
    });
  }
  onReturn() {
    this.viewColFacade.updateInstance(this.prevIndex, {
      ...this.prevLocalState,
      deactivateAdd: false,
      deactivateList: false
    });
    this.viewColFacade.onPrev(this.prevIndex);
  }
  onSave() {
    const userGuid = localStorage.getItem('guid');
    const date = new Date();
    const newLogin = new EntityLoginSubjectLinkContainerModel();
    newLogin.bl_fi_mst_entity_login_subject_link.entity_hdr_guid = this.form.value.entity_hdr_guid;
    newLogin.bl_fi_mst_entity_login_subject_link.rank = this.form.value.rank;
    newLogin.bl_fi_mst_entity_login_subject_link.status = this.form.value.status;
    newLogin.bl_fi_mst_entity_login_subject_link.subject_guid = this.form.value.subject_guid;
    this.subjectLink = newLogin;
    this.store.dispatch(CustomerActions.createLogin({ customerLogin: this.subjectLink }));
    this.haveError = null;
    this.form.reset();
    this.form.patchValue(
      {
        status: 'ACTIVE',
      });
    this.addSuccess = 'Success';
    this.isClicked = 'buttonSuccess';
    setTimeout(() => {
      this.addSuccess = 'Add';
      this.form.reset();
      this.isClicked = 'primary';
      this.onReturn();
    }, 1500);

  }

}
