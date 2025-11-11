import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import {
  map,
  mergeMap,
  concatMap,
  withLatestFrom,
  tap,
} from "rxjs/operators";
import {
  InvSerialNumberService,
} from "blg-akaun-ts-lib";
import { Column4ViewModelActions } from "../actions";
import { select, Store } from "@ngrx/store";
import { ColumnViewModelStates } from "../states";
import { AppConfig } from "projects/shared-utilities/visa";
import { Column4ViewSelectors } from "../selectors";
import { SessionStates } from "projects/shared-utilities/modules/session/session-controller/states";
import { SessionSelectors } from "projects/shared-utilities/modules/session/session-controller/selectors";
import { InternalSalesReturnStates } from "../../../internal-sales-return-controller/store/states";
import { InternalSalesReturnSelectors } from "../../../internal-sales-return-controller/store/selectors";
import { DraftStates } from "../../../draft-controller/store/states";
import { AppletConstants } from "../../../../models/constants/applet-constants";
import { HDRSelectors, PNSSelectors } from "../../../draft-controller/store/selectors";
import { UUID } from "angular2-uuid";
@Injectable()
export class Column4ViewModelEffects {
  private readonly apiVisa = AppConfig.apiVisa;

  processSerialNumberListing_checkStatus$ = createEffect(() =>
  this.actions$.pipe(
    ofType(Column4ViewModelActions.processSerialNumberListing_CheckStatus),
    withLatestFrom(
      this.store.pipe(select(Column4ViewSelectors.selectItemDetailsTab_qtyBaseField)),
      this.store.pipe(select(Column4ViewSelectors.selectSerialNumberTab_ScanTab_SerialNumbersListing)),
      this.store.pipe(select(HDRSelectors.selectHdr)),
      this.docStore.pipe(select(InternalSalesReturnSelectors.selectInvItem)),
      this.sessionStore.pipe(select(SessionSelectors.selectMasterSettings)),
      this.docStore.pipe(select(InternalSalesReturnSelectors.selectEditMode)),
    ),
    concatMap(([action, baseQty, serialNumberListing, hdr, invItemGuid, master, editMode]) => {
      const newArray = serialNumberListing.map(({ guid, ...sn }) => sn);
      let json = {
        "txn_type":"PURCHASE",
        "location_guid":hdr.guid_store,
        "company_guid":hdr.guid_comp,
        "inv_item_guid":invItemGuid,
        "serialNumbers":newArray,
        "server_doc_type": AppletConstants.docType,
        "checkDraftLock": master?.ENABLE_DRAFT_LOCK_SERIAL_NUMBER_CHECKING?true:false,
        "editMode": editMode?true:false,
        "generic_doc_hdr_guid": hdr.guid
    }
      return  this.invSerialService.validateMultiSerialNumbers(json, this.apiVisa).pipe(
      map((res:any) =>
        {
          let serialResponse = res.data.serialNumbers;
          const order = serialNumberListing;
          const unsorted = serialResponse;

          const sorted = unsorted.sort((a,b) => {
              const indexA = order.findIndex(type => a.sn_id === type.sn_id);
              const indexB = order.findIndex(type => b.sn_id === type.sn_id);
            return indexA - indexB;
          });

         sorted.map(sn=>{
            serialNumberListing.map((s) => {
              if (s.sn_id !== sn.sn_id) {
                  return sn;
              }

              return sn;
            });

          })

          serialResponse = serialResponse.map((obj) => ({
            ...obj,
            guid: UUID.UUID().toLowerCase(),
          }));
          return Column4ViewModelActions.setSerialNumberTab_ScanTab_SerialNumbersListing({serialNumberListing:serialResponse});

        })
      )
    })
  )
  );

  processSerialNumberListing_CheckDuplicate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Column4ViewModelActions.processSerialNumberListing_CheckDuplicate),
      withLatestFrom(
        this.store.pipe(
          select(
            Column4ViewSelectors.selectSerialNumberTab_ScanTab_SerialNumbersListing
          )
        ),
        this.draftStore.pipe(select(PNSSelectors.selectAll)),
        this.docStore.select(InternalSalesReturnSelectors.selectLineItem)
      ),
      map(([action, serialNumberListing, pns, selectLineItem]) => {
        const findDuplicate = serialNumberListing.reduce((a, e) => {
          a.set(e.sn_id, (a.get(e.sn_id) ?? 0) + 1);
          return a;
        }, new Map());

        const duplicateObject = serialNumberListing.filter(
          (e) => findDuplicate.get(e.sn_id) > 1
        );
        const notDuplicateAfterRemove = serialNumberListing.filter(
          (e) =>
            findDuplicate.get(e.sn_id) === 1 &&
            e.remarks === "Duplicate Serial Number"
        );

        if (notDuplicateAfterRemove?.length) {
          notDuplicateAfterRemove.forEach((dup) => {
            serialNumberListing = serialNumberListing
              .map((item) => ({ ...item }))
              .map((item) => {
                if (item.sn_id === dup.sn_id) {
                  return {
                    ...item,
                    status: "VALID",
                    remarks: "",
                  };
                } else {
                  return item;
                }
              });
          });
        }
        if (duplicateObject?.length) {
          duplicateObject.forEach((dup) => {
            serialNumberListing = serialNumberListing
              .map((item) => ({ ...item }))
              .map((item) => {
                if (item.sn_id === dup.sn_id) {
                  return {
                    ...item,
                    status: "INVALID",
                    remarks: "Duplicate Serial Number",
                  };
                } else {
                  return item;
                }
              });
          });
        } else {
          serialNumberListing = serialNumberListing
            .map((item) => ({ ...item }))
            .map((item) => {
              // console.log('item',item)
              if (
                item.status === "INVALID" &&
                item.remarks === "Duplicate Serial Number"
              ) {
                return {
                  ...item,
                  status: "VALID",
                  remarks: "",
                };
              } else {
                console.log("else");
                return item;
              }
            });
        }


        pns.forEach((pns: any) => {
          if (
            selectLineItem &&
            pns &&
            selectLineItem.guid?.toString() !== pns.guid.toString() &&
            selectLineItem.item_guid.toString() === pns.item_guid.toString() &&
            pns.status==='ACTIVE'
          ) {
            serialNumberListing.forEach((newSN) => {
              if (pns.serial_no.some((e) => e.sn_id === newSN.sn_id)) {
                serialNumberListing = serialNumberListing
                  .map((item) => ({ ...item }))
                  .map((item) => {
                    if (item.sn_id === newSN.sn_id) {
                      return {
                        ...item,
                        status: "INVALID",
                        remarks: "Duplicate Serial Number",
                      };
                    } else {
                      return item;
                    }
                  });
              }
            });
          }
        });

        if (serialNumberListing.length) {
          const hasInvalidSerial = serialNumberListing.filter(
            (s) => s.status === "INVALID"
          );
          if (hasInvalidSerial && hasInvalidSerial.length > 0) {
            this.store.dispatch(
              Column4ViewModelActions.setSerialNumberTabFieldColor({
                color: "warn",
              })
            );
          } else {
            this.store.dispatch(
              Column4ViewModelActions.setSerialNumberTabFieldColor({
                color: "primary",
              })
            );
          }
        }

        this.store.dispatch(
          Column4ViewModelActions.setSerialNumberTab_ScanTab_SerialNumbersListing(
            { serialNumberListing: serialNumberListing }
          )
        );
        return Column4ViewModelActions.processSerialNumberListing_CheckStatusSuccess();
      })
    )
  );

  processSerialNumberListing_AddSerialNumberEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Column4ViewModelActions.processSerialNumberListing_AddSerialNumber),
      withLatestFrom(
        this.store.pipe(select(Column4ViewSelectors.selectItemDetailsTab_qtyBaseField)),
        this.store.pipe(select(Column4ViewSelectors.selectItemDetailsTab_itemType_Value)),
      ),
      tap(data=> console.log(data[1])),
      mergeMap(([action, baseQty, itemType]) => {
        //console.log("processSerialNumberListing_AddSerialNumberEffect action.serialNumberListing.length",action.serialNumberListing.length);
        //console.log("baseQty",baseQty);

        this.store.dispatch(Column4ViewModelActions.updateSerialNumberTab_ScanTab_SerialNumbersListing({serialNumberListing:action.serialNumberListing}))

        if(itemType==="SERIAL_NUMBER"){
          if (action.serialNumberListing.length !== +baseQty) {
            return of(
              Column4ViewModelActions.setSerialNumberTabFieldColor({color: "warn"}),
              Column4ViewModelActions.setBaseQuantityFieldColor({color: "warn"})
            );
          }
          else {
            return of(
              Column4ViewModelActions.setSerialNumberTabFieldColor({color: "primary"}),
              Column4ViewModelActions.setBaseQuantityFieldColor({color: "primary"})
              );
          }
        }
      })
    )
  );

  processSerialNumberListing_RemoveSerialNumberEffect$ = createEffect(() =>
  this.actions$.pipe(
    ofType(
      Column4ViewModelActions.processSerialNumberListing_RemoveSerialNumber
    ),
    withLatestFrom(
      this.store.pipe(
        select(Column4ViewSelectors.selectItemDetailsTab_qtyBaseField)
      ),
      this.store.pipe(
        select(Column4ViewSelectors.selectItemDetailsTab_itemType_Value)
      ),
      this.store.pipe(
        select(
          Column4ViewSelectors.selectSerialNumberTab_ScanTab_SerialNumbersListing
        )
      )
    ),
    map(([action, baseQty, itemType, existingSerial]) => {
      console.log("existingSerial", existingSerial);
      const newSerialList = existingSerial.filter(
        (existing) =>
          !action.serialNumberListing.find(
            (sel) => existing.guid === sel.guid
          )
      );
      console.log("newSerialList", newSerialList);
      this.store.dispatch(
        Column4ViewModelActions.setSerialNumberTab_ScanTab_SerialNumbersListing(
          { serialNumberListing: newSerialList }
        )
      );

      if (itemType === "SERIAL_NUMBER") {
        if (newSerialList.length !== +baseQty) {
          this.store.dispatch(
            Column4ViewModelActions.setSerialNumberTabFieldColor({
              color: "warn",
            })
          );
          this.store.dispatch(
            Column4ViewModelActions.setBaseQuantityFieldColor({
              color: "warn",
            })
          );
        } else {
          this.store.dispatch(
            Column4ViewModelActions.setSerialNumberTabFieldColor({
              color: "primary",
            })
          );
          this.store.dispatch(
            Column4ViewModelActions.setBaseQuantityFieldColor({
              color: "primary",
            })
          );
        }
        if (newSerialList.length) {
          const hasInvalidSerial = newSerialList.filter(
            (s) => s.status === "INVALID"
          );
          if (hasInvalidSerial && hasInvalidSerial.length > 0) {
            this.store.dispatch(
              Column4ViewModelActions.setSerialNumberTabFieldColor({
                color: "warn",
              })
            );
          } else {
            this.store.dispatch(
              Column4ViewModelActions.setSerialNumberTabFieldColor({
                color: "primary",
              })
            );
          }
        }
      }
      return Column4ViewModelActions.processSerialNumberListing_CheckDuplicate();
    })
  )
);

  processUpdateBaseQuantityEffect$ = createEffect(() =>
  this.actions$.pipe(
    ofType(Column4ViewModelActions.processUpdateBaseQuantity),
    withLatestFrom(
      this.store.pipe(
        select(
          Column4ViewSelectors.selectSerialNumberTab_ScanTab_SerialNumbersListing
        )
      ),
      this.store.pipe(
        select(Column4ViewSelectors.selectItemDetailsTab_itemType_Value)
      )
    ),
    map(([action, serialNumberListing, itemType]) => {
      console.log('check1',itemType, serialNumberListing);
      this.store.dispatch(
        Column4ViewModelActions.setItemDetailsTab_qtyBaseField_Value({
          baseQuantity: action.baseQuantity,
        })
      );

      if (itemType === "SERIAL_NUMBER") {
        if (+action.baseQuantity !== serialNumberListing?.length) {
          this.store.dispatch(
            Column4ViewModelActions.setSerialNumberTabFieldColor({
              color: "warn",
            })
          );
          this.store.dispatch(
            Column4ViewModelActions.setBaseQuantityFieldColor({
              color: "warn",
            })
          );
        } else {
          this.store.dispatch(
            Column4ViewModelActions.setSerialNumberTabFieldColor({
              color: "primary",
            })
          );
          this.store.dispatch(
            Column4ViewModelActions.setBaseQuantityFieldColor({
              color: "primary",
            })
          );
        }

        if (serialNumberListing.length) {
          console.log(serialNumberListing);
          const hasInvalidSerial = serialNumberListing.filter(
            (s) => s.status === "INVALID"
          );
          if (hasInvalidSerial && hasInvalidSerial.length) {
            this.store.dispatch(
              Column4ViewModelActions.setSerialNumberTabFieldColor({
                color: "warn",
              })
            );
          } else {
            this.store.dispatch(
              Column4ViewModelActions.setSerialNumberTabFieldColor({
                color: "primary",
              })
            );
          }
        }
      }
      return Column4ViewModelActions.processUpdateBaseQuantitySuccess();
    })
  )
);

  constructor(
    private sessionStore: Store<SessionStates>,
    private docStore: Store<InternalSalesReturnStates>,
    private invSerialService : InvSerialNumberService,
    private actions$: Actions,
    private store: Store<ColumnViewModelStates>,
    private draftStore: Store<DraftStates>
  ) {}
}
