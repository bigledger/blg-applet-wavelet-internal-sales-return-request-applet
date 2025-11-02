import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { UUID } from 'angular2-uuid';
import { InventoryItemHdrService, InventoryItemService, InvSerialNumberService, Pagination, SerialNumberService } from 'blg-akaun-ts-lib';
import { SerialNumberStatus } from 'projects/shared-utilities/models/serial-number.model';
import { AppConfig } from 'projects/shared-utilities/visa';
import { map, withLatestFrom,concatMap,exhaustMap } from 'rxjs/operators';
import { ViewColumnFacade } from '../../../../facades/view-column.facade';

import { PNSActions } from '../actions';
import { HDRSelectors } from '../selectors';
import { DraftStates } from '../states';
import { SessionStates } from 'projects/shared-utilities/modules/session/session-controller/states';
import { SessionSelectors } from 'projects/shared-utilities/modules/session/session-controller/selectors';
import { AppletConstants } from '../../../../models/constants/applet-constants';
import { ColumnViewModelStates } from '../../../sales-return-view-model-controller/store/states';

@Injectable()
export class PNSEffects {
private readonly apiVisa = AppConfig.apiVisa;


validatePNSNoSerialNo$ = createEffect(() => this.actions$.pipe(
    ofType(PNSActions.validatePNSNoSerialNo),
    map(action=>{
      let newLine = action.line;
      newLine.serial_no = <any> [];
      return PNSActions.mapToSerialNumberObjectSuccess({line:newLine});
    })
  ));

  mapToSerialNumberObject$ = createEffect(() => this.actions$.pipe(
    ofType(PNSActions.mapToSerialNumberObject),
    map(action=>{
      let newLine = action.line;
      newLine.serial_no = <any> this.mapToSerialNumberObject(newLine.serial_no, action.postingStatus);
      return PNSActions.mapToSerialNumberObjectSuccess({line:newLine});
    })
  ));

  validatePNSSerialNo$ = createEffect(() => this.actions$.pipe(
        ofType(PNSActions.validatePNSSerialNo),
        withLatestFrom(
          this.store.select(HDRSelectors.selectHdr),
          this.sessionStore.pipe(select(SessionSelectors.selectMasterSettings))
        ),
        concatMap(([action, hdr, master]) => {
          const paging = new Pagination();
            paging.conditionalCriteria.push({
            columnName: "guid_fi_mst_item",
            operator: "=",
            value: action.line.item_guid.toString(),
          });
          return this.invItemService.getByCriteria(paging, this.apiVisa)
              .pipe(
                map((b_inner) => {
                  const snArrObj = this.mapToSerialNumberObject(action.line.serial_no, 'DRAFT');

                  return  {
                    line: action.line,
                    serialValidationJson : {
                      "txn_type":"PURCHASE",
                      "location_guid":null,
                      "company_guid":hdr.guid_comp,
                      "inv_item_guid":b_inner.data.length>0?b_inner.data[0].bl_inv_mst_item_hdr.guid.toString():"",
                      "serialNumbers": snArrObj,
                      "checkDraftLock": master?.ENABLE_DRAFT_LOCK_SERIAL_NUMBER_CHECKING?true:false,
                      "editMode": true,
                      "generic_doc_hdr_guid": hdr.guid,
                      "server_doc_type": AppletConstants.docType,
                    }
                  }

                })

              );
        }),
        concatMap((response) => {
            return  this.invSerialService.validateMultiSerialNumbers(response.serialValidationJson, this.apiVisa).pipe(
                map((result:any) =>
                  {
                    console.log("res validatePNSSerialNo",result)
                    const hasInvalidSerial = result.data.serialNumbers.filter(s=>s.status==="INVALID");
                   // console.log("hasInvalidSerial",hasInvalidSerial)
                    let newLine = response.line;
                    let array : any [] = result.data.serialNumbers;
                    //Check duplicate
                     const findDuplicate = array.reduce((a, e) => {
                      a.set(e.sn_id, (a.get(e.sn_id) ?? 0) + 1);
                      return a;
                    }, new Map());

                    const duplicateObject = (array.filter(e => findDuplicate.get(e.sn_id) > 1));
                    duplicateObject.forEach(dup=>{

                      array =  array.map(item => ({...item}))
                        .map(item => {

                            if (item.sn_id === dup.sn_id) {
                              return {
                                ...item,
                                status:"INVALID",
                                remarks:"Duplicate Serial Number"
                              }
                            }
                            else {
                               return item;
                              }
                            })
                      })
                      array = array.map(obj => ({ ...obj, guid: UUID.UUID().toLowerCase() }))
                      newLine.serial_no = <any> array;
                    return PNSActions.validatePNSSerialNoSuccess({line:newLine});
                  })
                )
              })
            )
    );


    mapToSerialNumberObject(snJson: any,postingStatus: string){
        if(snJson?.serialNumbers){

          let snArray : SerialNumberStatus [] = [];
          snJson.serialNumbers.map(sn=>  {
              const snObj = new SerialNumberStatus();
              snObj.sn_id = sn;
              snObj.status = postingStatus!=='FINAL'?"VALIDATION_IN_PROGRESS":"VALID";
              snArray.push(snObj);
          });
         console.log('snArray',snArray)
          return snArray;
        }else{
          console.log('snJson',snJson)
          return snJson;
        }
    }

    constructor(
      private sessionStore: Store<SessionStates>,
        private viewModelStore: Store<ColumnViewModelStates>,
        private invItemService: InventoryItemService,
        private invSerialService : InvSerialNumberService,
        private actions$: Actions,

        private readonly store: Store<DraftStates>
    ) { }
}
