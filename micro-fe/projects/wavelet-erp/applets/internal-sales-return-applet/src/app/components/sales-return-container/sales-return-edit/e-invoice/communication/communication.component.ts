import {
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { AppConfig } from "projects/shared-utilities/visa";
import { Subject, forkJoin, of } from "rxjs";
import { SubSink } from "subsink2";
import moment from "moment";
import { TenantUserProfileService } from "blg-akaun-ts-lib";
import { map, switchMap } from "rxjs/operators";

@Component({
  selector: "app-communication",
  templateUrl: "./communication.component.html",
  styleUrls: ["./communication.component.scss"],
})
export class CommunicationComponent implements OnInit, OnDestroy {

  protected subs = new SubSink();
  apiVisa = AppConfig.apiVisa;
  public form: FormGroup;
  protected _onDestroy = new Subject<void>();
  isCustomer;
  hide: boolean = true;
  constructor(
    // private readonly store: Store<TicketStates>,
    private profileService: TenantUserProfileService,
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      customerName: new FormControl(""),
      customerEmail: new FormControl(""),
      emailTemplate: new FormControl(""),
    });

    this.patchSelectedScannedEventDetails();

  }

  patchSelectedScannedEventDetails() {
    // this.subs.sink = this.store
    //   .select(TicketSelectors.selectTicketData)
    //   .pipe(
    //     switchMap((selectedTicketData) => {
    //       console.log(selectedTicketData)
    //       const createdBy$ = selectedTicketData.bl_fi_mst_coupon_line.created_by_subject_guid ?  this.getName(selectedTicketData.bl_fi_mst_coupon_line.created_by_subject_guid) : of("");
    //       const modifiedBy$ = selectedTicketData.bl_fi_mst_coupon_line.updated_by_subject_guid ? this.getName(selectedTicketData.bl_fi_mst_coupon_line.updated_by_subject_guid) : of("");

    //       return forkJoin([createdBy$, modifiedBy$]).pipe(
    //         map(([createdByName, modifiedByName]) => ({ selectedTicketData, createdByName, modifiedByName }))
    //       );
    //     })
    //   )
    //   .subscribe(({ selectedTicketData, createdByName, modifiedByName }) => {
    //     this.form.patchValue({
    //       serialNumber: selectedTicketData.bl_fi_mst_coupon_line.serial_number,
    //       assignment: selectedTicketData.bl_fi_mst_coupon_line.assignment_status,
    //       validity: selectedTicketData.bl_fi_mst_coupon_line.validity_status,
    //       cancellation: selectedTicketData.bl_fi_mst_coupon_line.cancellation_status,
    //       redeemable: selectedTicketData.bl_fi_mst_coupon_line.redemption_status,
    //       urlKey: selectedTicketData.bl_fi_mst_coupon_line.url_key,
    //       activationPin: selectedTicketData.bl_fi_mst_coupon_line.activation_pin,

    //       createdBy: createdByName,
    //       createdDate: moment(selectedTicketData.bl_fi_mst_coupon_line.created_date).format('YYYY-MM-DD'),
    //       modifiedBy: modifiedByName,
    //       modifiedDate: moment(selectedTicketData.bl_fi_mst_coupon_line.updated_date).format('YYYY-MM-DD'),
    //     });
    //   });
  }

  getName(subjectGuid) {
    return this.profileService.getProfileName(AppConfig.apiVisa, subjectGuid.toString()).pipe(
      map((profileData) => profileData.data)
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
