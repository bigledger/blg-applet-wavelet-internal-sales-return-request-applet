import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { UUID } from "angular2-uuid";
import { ApiVisa, Pagination, ServiceReturnReasonService, TenantAppletConfigService } from "blg-akaun-ts-lib";
import { ToastrService } from "ngx-toastr";
import { AppConfig } from "projects/shared-utilities/visa";
import { of } from "rxjs";
import { mergeMap } from "rxjs-compat/operator/mergeMap";
import { catchError, exhaustMap, map, take, withLatestFrom } from "rxjs/operators";
import { ViewColumnFacade } from "../../../../facades/view-column.facade";
import { ToastConstants } from "../../../../models/constants/toast.constants";
import { ReasonSettingActions } from "../actions";
import { ReasonSettingSelectors } from "../selectors";
import { ReasonSettingStates } from "../states";


@Injectable()
export class ReasonEffects {
    private readonly apiVisa: ApiVisa = AppConfig.apiVisa

    createReasonSettings$ = createEffect(() =>
     this.actions$.pipe(
        ofType(ReasonSettingActions.createReasonSettingInit),
      exhaustMap((action) =>
        this.returnReasonService.post(
          action.reasonSetting,
          AppConfig.apiVisa
        ).pipe(
            take(1),
          map((response: any) => {
            this.viewColFacade.showSuccessToast(
              "Reason Created Successfully"
            );
            this.viewColFacade.updateInstance(1, {
              deactivateAdd: false,
              deactivateReturn: false,
              selectedIndex: 2,
            });
            this.viewColFacade.resetIndex(1);
            return ReasonSettingActions.createReasonSettingSuccess({
              reasonSetting: response.data,
            });
          }),
          catchError((err) => {
            console.log(err);
            err.message = "Error Creating Reason";
            this.viewColFacade.showFailedToast(err);

            return of(
                ReasonSettingActions.createReasonSettingFailed({
                error: err.message,
              })
            );
          })
        )
      )
    )
  );

deleteReasonSetting$ = createEffect(() => this.actions$.pipe(
    ofType(ReasonSettingActions.deleteReasonSettingInit),
    withLatestFrom(this.store.select(ReasonSettingSelectors.selectReasonSetting)),
    exhaustMap(([a, b]) => this.returnReasonService.delete(b.bl_svc_return_reason.guid.toString(), this.apiVisa).pipe(
      map(() => {
        this.viewColFacade.showSuccessToast(
            "Reason Deleted Successfully"
          );
        this.viewColFacade.updateInstance(0, {
          deactivateAdd: false,
          deactivateList: false,
        });
        this.viewColFacade.resetIndex(0);
        // this.viewColFacade.resetDraft();
        return ReasonSettingActions.deleteReasonSettingSuccess();
      }),
      catchError(err => {
        this.viewColFacade.showFailedToast(err);
        return of(ReasonSettingActions.deleteReasonSettingFailed({ error: err.message }));
      })
    ))
  ));


    updateReason$ = createEffect(() => this.actions$.pipe(
        ofType(ReasonSettingActions.updateReasonSettingInit),
        exhaustMap((action) => 
            this.appletConfigService.getByCriteria(
                new Pagination(0,10, [
                    {
                        columnName: 'applet_hdr_guid',
                        operator: '=',
                        value: sessionStorage.appletGuid
                    },
                    {
                        columnName: 'param_code',
                        operator: '=',
                        value: "SERVICE_REASON"
                    }
                ]),
                this.apiVisa
            ).pipe(
                map((a_a) => {
                    const b = <any> a_a;
                    let body = b.data[0]
                    let value_json_data = body.bl_applet_config.value_json.data
                    let arr = [];
                    arr = value_json_data;
                    console.log(arr)
                    let updatedReason = arr.find(x => x.guid == action.guid);
                    console.log(updatedReason)
                    if (updatedReason) {
                        updatedReason.name = action.reasonSetting.value.reasonName;
                        updatedReason.code = action.reasonSetting.value.reasonCode;
                    }
                    console.log(updatedReason)
                    body.bl_applet_config.value_json.data = arr
                    return body
                }),
                exhaustMap ((body) => 
                    this.appletConfigService.put(body, this.apiVisa).pipe(
                        map(
                            (response) => ReasonSettingActions.updateReasonSettingSuccess(),
                            this.toastr.success(
                                'Remarks saved successfully',
                                'Success',
                                {
                                    tapToDismiss: true,
                                    progressBar: true,
                                    timeOut: 1300
                                }
                            )
                        ),
                        catchError((e) => {
                          this.toastr.error(e.message, "Error", {
                            tapToDismiss: true,
                            progressBar: true,
                            timeOut: 3000,
                          });
                          return of(
                            ReasonSettingActions.updateReasonSettingFailed({ error: e.message })
                          );
                        })
                    )
                ),
                catchError(err => {
                    this.toastr.error(
                    err.message,
                    'Error',
                    {
                        tapToDismiss: true,
                        progressBar: true,
                        timeOut: 1300
                    }
                    );
                    return of(ReasonSettingActions.updateReasonSettingFailed({ error: err.message }));
                })
            )
        )
    ));
                


    constructor(
        private appletConfigService: TenantAppletConfigService,
        private returnReasonService: ServiceReturnReasonService,
        private actions$: Actions,
        private store: Store<ReasonSettingStates>,
        private viewColFacade: ViewColumnFacade,
        private toastr: ToastrService
    ) { }

}