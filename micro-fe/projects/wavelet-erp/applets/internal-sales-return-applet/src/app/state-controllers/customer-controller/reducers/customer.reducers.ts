import { CustomerActions } from '../actions';
import { Action, createReducer, on } from '@ngrx/store';
import { initState, customerAdapter } from '../states/customer.states';
import { CustomerState } from '../states/customer.states';
import { bl_fi_mst_entity_ext_RowClass, bl_fi_mst_item_ext_RowClass, EntityContainerModel, } from 'blg-akaun-ts-lib';
import { CustomerConstants } from '../../../models/customer-constants';


export const customerFeatureKey = 'customer';

export const customerReducer = createReducer(
  initState,
  on(CustomerActions.loadCustomerExtSuccess, (state, action) =>
    ({ ...state, totalRecords: action.totalRecords })),
  on(CustomerActions.loadCustomerExtFailed, (state, action) =>
    ({ ...state, errorLog: [...state.errorLog, { timeStamp: new Date(), log: action.error }] })),
  on(CustomerActions.createCustomerSuccess, (state, action) =>
    customerAdapter.addOne(action.customerExt, state)),
  on(CustomerActions.loadAddress, (state, action) => {
    if (action.allAddress == null || Object.keys(action.allAddress).length === 0) {
      state = { ...state, hdrAddress: { main_address: [], billing_address: [], shipping_address: [] } }
    }
    else {
      state = { ...state, hdrAddress: action.allAddress };
    }
    return state;
  }),
  on(CustomerActions.startDraft, (state, action) => {
    return state;
  }),
  on(CustomerActions.updateDraft, (state, action) => {
    if (action.entity) {
    }
    if (action.line) {
    }
    return state;
  }),
  on(CustomerActions.resetDraft, (state, action) => ({
    ...state, draft: new EntityContainerModel()
  })),
  on(CustomerActions.selectCustomerExtGuid, (state, action) => {
    // ({ ...state, selectedGuid: action.guid })
    state.selectedGuid = action.guid;
    return state;
  }),

  on(CustomerActions.updatePMCDraft, (state, action) => {
    if (action.initCheck) {
      state.pmcDraft.property_json = action.initCheck.value;
    }
    if (action.record) {
      state.pmcDraft.value_json = { record: [...state.pmcDraft.value_json.record, action.record] };
    }
    return state;
  }),
  // branch
  on(CustomerActions.createBranchLine, (state, action) => {
    const guidDummy: string[] = [];
    state.extBranch.forEach(x => guidDummy.push(x.guidDummy));
    let randomNumberGenerator = Math.round(Math.random() * 1e12).toString();
    while (guidDummy.includes(randomNumberGenerator)) {
      randomNumberGenerator = Math.round(Math.random() * 1e12).toString();
    }
    const branchExt = { ...action.ext, guid: randomNumberGenerator };
    state.extBranch = [...state.extBranch, branchExt];
    return state;
  }
  ),
  // customer category
  on(CustomerActions.itemCategory, (state, action) => {
    state.itemCategory.guids = action.category;
    state.updatedCat = action.updated;
    return state;
  }),
  on(CustomerActions.editBranchLine, (state, action) => {
    if (action.guid) {
      state.extBranch.forEach((x, i) => {
        if (action.guid === x.ref_1) {
          if (action.ext.status === "DELETED") {
            // state.extBranch.splice(i, 1);
            x.status === "DELETED";
          } else {
            state.extBranch[i] = action.ext;
          }
        }
      });
    }
    state.extBranch = [...state.extBranch];
    return state;
  }),
  on(CustomerActions.createContactLoginExt, (state, action) => {
    const guidDummy: string[] = []; // []
    state.contactLogin.forEach(x => guidDummy.push(x.guidDummy));
    let randomNumberGenerator = Math.round(Math.random() * 1e12).toString();
    while (guidDummy.includes(randomNumberGenerator)) {
      randomNumberGenerator = Math.round(Math.random() * 1e12).toString();
    }
    const actionExt = { ...action.ext, guid: randomNumberGenerator };
    state.contactLogin = [...state.contactLogin, actionExt
    ];
    // state.contactLogin.push(action.ext.value_json.paymentConfig[0])
    return state;
  }
  ),
  on(CustomerActions.editContactLoginExt, (state, action) => {
    if (action.ext.guid) {
      state.contactLogin.forEach((x, i) => {
        if (action.ext.guid == x.guid) {
          if (action.ext.status == 'DELETED') {
            state.contactLogin.splice(i, 1);
          } else {
            state.contactLogin[i] = action.ext;
          }
        }
      });
    }
    state.extLogin = [...state.extLogin];
    return state;
  }),

  on(CustomerActions.createLoginExt, (state, action) => {
    const guidDummy: string[] = []; // []
    state.extLogin.forEach(x => guidDummy.push(x.guidDummy));
    let randomNumberGenerator = Math.round(Math.random() * 1e12).toString();
    while (guidDummy.includes(randomNumberGenerator)) {
      randomNumberGenerator = Math.round(Math.random() * 1e12).toString();
    }
    const actionExt = { ...action.ext, guid: randomNumberGenerator };
    state.extLogin = [...state.extLogin, actionExt
    ];
    // state.extLogin.push(action.ext.value_json.paymentConfig[0])
    return state;
  }
  ),
  on(CustomerActions.editLoginExt, (state, action) => {
    if (action.ext.guid) {
      state.extLogin.forEach((x, i) => {
        if (action.ext.guid == x.guid) {
          if (action.ext.status == 'DELETED') {
            state.extLogin.splice(i, 1);
          } else {
            state.extLogin[i] = action.ext;
          }
        }
      });
    }
    state.extLogin = [...state.extLogin];
    return state;
  }),

  on(CustomerActions.createPaymentConfigExt, (state, action) => {
    const guidDummy: string[] = []; // []
    state.extPayment.forEach(x => guidDummy.push(x.guidDummy));
    let randomNumberGenerator = Math.round(Math.random() * 1e12).toString();
    while (guidDummy.includes(randomNumberGenerator)) {
      randomNumberGenerator = Math.round(Math.random() * 1e12).toString();
    }
    const actionExt = { ...action.ext, guid: randomNumberGenerator };
    state.extPayment = [...state.extPayment, actionExt
    ];
    // state.extPayment.push(action.ext.value_json.paymentConfig[0])
    return state;
  }
  ),
  on(CustomerActions.addNewPaymentConfig, (state, action) => {
    state.paymentConfig = [...state.paymentConfig, action.paymentConfig];
    return state;
  }),
  on(CustomerActions.selectEditPaymentConfig, (state, action) => {
    state.editPaymentConfig = action.paymentConfig;
    return state;
  }),
  on(CustomerActions.createNewPaymentConfigSuccess, (state, action) => {
    state.updateAgGrid = true;
    return state;
  }),
  on(CustomerActions.selectCustomerEditExt, (state, action) => {
    state.selectExt = [action.ext];
    return state;
  }),
  on(CustomerActions.resetCustomerEditExt, (state, action) => {
    state.selectExt = null;
    return state;
  }),
  on(CustomerActions.selectContactLine, (state, action) => {
    state.selectContactLine = [action];
    return state;
  }),

  on(CustomerActions.editPaymentConfigExt, (state, action) => {
    if (action.ext.guid) {
      state.extPayment.forEach((x, i) => {
        if (action.ext.guid == x.guid) {
          if (action.ext.status == 'DELETED') {
            state.extPayment.splice(i, 1);
          } else {
            state.extPayment[i] = action.ext;
          }
        }
      });
    }
    state.extPayment = [...state.extPayment];
    return state;
  }),

  on(CustomerActions.createCustomerTaxExt, (state, action) => {
    const guidDummy: string[] = [];
    state.extTax.forEach(x => guidDummy.push(x.guidDummy));
    let randomNumberGenerator = Math.round(Math.random() * 1e12).toString();
    while (guidDummy.includes(randomNumberGenerator)) {
      randomNumberGenerator = Math.round(Math.random() * 1e12).toString();
    }
    const actionExt = { ...action.ext, guid: randomNumberGenerator };
    state.extTax = [...state.extTax, actionExt];
    return state;
  }
  ),

  on(CustomerActions.editTaxExt, (state, action) => {
    if (action.guid) {
      state.extTax.forEach((x, i) => {
        if (action.guid == x.guid) {
          if (action.ext.status == 'DELETED') {
            state.extTax.splice(i, 1);
          } else {
            state.extTax[i] = action.ext;
          }
        }
      });
    }
    state.extTax = [...state.extTax];
    return state;
  }),
  // address
  on(CustomerActions.createAddress, (state, action) => {
    if (action.address.addressType === CustomerConstants.BILLING_ADDRESS) {
      if (action.address.default_address_status) {
        state.hdrAddress.billing_address.forEach(addr => addr.default_address_status = false);
      }
      state.hdrAddress.billing_address = [...state.hdrAddress.billing_address, action.address];
    }
    else if (action.address.addressType === CustomerConstants.SHIPPING_ADDRESS) {
      if (action.address.default_address_status) {
        state.hdrAddress.shipping_address.forEach(addr => addr.default_address_status = false);
      }
      state.hdrAddress.shipping_address = [...state.hdrAddress.shipping_address, action.address];
    }
    else if (action.address.addressType === CustomerConstants.MAIN_ADDRESS) {
      if (action.address.default_address_status) {
        state.hdrAddress.main_address.forEach(addr => addr.default_address_status = false);
      }
      state.hdrAddress.main_address = [...state.hdrAddress.main_address, action.address];
    }
    state.hdrAddress = { ...state.hdrAddress };
    return state
  }),
  on(CustomerActions.editAddress, (state, action) => {
    let originalPos = action.address.address_pos;
    const newAddressType = action.address.addressType;
    const originalAddressType = action.address.originalAddressType;
    delete action.address.address_pos;
    delete action.address.originalAddressType;

    if (originalPos) {
      if (state.hdrAddress.main_address.length) {
        if (originalPos >= state.hdrAddress.main_address.length) {
          originalPos -= state.hdrAddress.main_address.length;
          if (state.hdrAddress.billing_address.length && originalPos >= state.hdrAddress.billing_address.length) {
            originalPos -= state.hdrAddress.billing_address.length;
          }
        }
      }
      else if (state.hdrAddress.billing_address.length && originalPos >= state.hdrAddress.billing_address.length) {
        originalPos -= state.hdrAddress.billing_address.length;
      }
    }

    // update default address
    if (action.address.default_address_status) {
      switch (newAddressType) {
        case CustomerConstants.BILLING_ADDRESS:
          state.hdrAddress.billing_address.forEach(addr => addr.default_address_status = false);
          break;
        case CustomerConstants.SHIPPING_ADDRESS:
          state.hdrAddress.shipping_address.forEach(addr => addr.default_address_status = false);
      }
    }

    const deleteFlag = action.address.status === 'DELETED';
    const switchAddressType = action.address.addressType !== originalAddressType;

    // delete
    if (deleteFlag || switchAddressType) {
      if (originalAddressType === CustomerConstants.BILLING_ADDRESS) {
        state.hdrAddress.billing_address.splice(originalPos, 1);
      }
      else if (originalAddressType === CustomerConstants.SHIPPING_ADDRESS) {
        state.hdrAddress.shipping_address.splice(originalPos, 1);
      }
      else {
        state.hdrAddress.main_address.splice(originalPos, 1);
      }
    }

    // update
    if (!deleteFlag && !switchAddressType) {
      if (newAddressType === CustomerConstants.BILLING_ADDRESS) {
        state.hdrAddress.billing_address[originalPos] = action.address;
      }
      else if (newAddressType === CustomerConstants.SHIPPING_ADDRESS) {
        state.hdrAddress.shipping_address[originalPos] = action.address;
      }
      else {
        state.hdrAddress.main_address[originalPos] = action.address;
      }
    }
    else if (!deleteFlag && switchAddressType) {
      if (newAddressType === CustomerConstants.BILLING_ADDRESS) {
        state.hdrAddress.billing_address = [...state.hdrAddress.billing_address, action.address];
      }
      else if (newAddressType === CustomerConstants.SHIPPING_ADDRESS) {
        state.hdrAddress.shipping_address = [...state.hdrAddress.shipping_address, action.address];
      }
      else {
        state.hdrAddress.main_address = [...state.hdrAddress.main_address, action.address];
      }
    }
    state.hdrAddress = { ...state.hdrAddress };
    return state
  }),


  // on(CustomerActions.createAddressExt, (state, action) => {
  //   const guidDummy: string[] = [];
  //   state.extAddress.forEach(x => guidDummy.push(x.guidDummy));
  //   let randomNumberGenerator = Math.round(Math.random() * 1e12).toString();
  //   while (guidDummy.includes(randomNumberGenerator)) {
  //     randomNumberGenerator = Math.round(Math.random() * 1e12).toString();
  //   }

  //   const actionExt = { ...action.ext, guid: randomNumberGenerator };
  //   state.extAddress = [...state.extAddress, actionExt];
  //   return state;
  // }
  // ),
  // on(CustomerActions.editAddressExt, (state, action) => {
  //   if (action.guid) {
  //     state.extAddress.forEach((x, i) => {
  //       if (action.guid == x.guid) {
  //         if (action.ext.status == 'DELETED') {
  //           state.extAddress.splice(i, 1);
  //         } else {
  //           state.extAddress[i] = action.ext;
  //         }
  //       }
  //     });
  //   }
  //   state.extAddress = [...state.extAddress];
  //   return state;
  // }),
  // address
  // on(CustomerActions.createAddress, (state, action) => {
  //   const actionExt = { ...action.ext };
  //   state.address = [...state.address, actionExt];
  //   return state;
  // }
  // ),
  // on(CustomerActions.editAddress, (state, action) => {

  //   if (action.guid) {
  //     state.address.forEach((x, i) => {
  //       if (action.guid == x.address.guid) {
  //         if (action.ext.status == 'DELETED') {
  //           state.address.splice(i, 1);
  //         } else {
  //           state.address[i] = { "address": action.ext };
  //         }
  //       }
  //     });
  //   }
  //   state.address = [...state.address];
  //   return state;
  // }),
  // on(CustomerActions.resetAddress, (state, action) => {
  //   state.address = [];
  //   return state;
  // }),
  // contact
  on(CustomerActions.createContactExt, (state, action) => {
    const guidDummy: string[] = [];
    state.extContact.forEach(x => guidDummy.push(x.guidDummy));
    let randomNumberGenerator = Math.round(Math.random() * 1e12).toString();
    while (guidDummy.includes(randomNumberGenerator)) {
      randomNumberGenerator = Math.round(Math.random() * 1e12).toString();
    }
    const actionExt = { ...action.ext, guid: randomNumberGenerator };
    state.extContact = [...state.extContact, actionExt];
    return state;
  }
  ),
  on(CustomerActions.editContactLine, (state, action) => {
    if (action.guid) {
      state.extContact.forEach((x, i) => {
        if (action.guid == x.guid) {
          if (action.ext.status == 'DELETED') {
            state.extContact.splice(i, 1);
          } else {
            state.extContact[i] = action.ext;
          }
        }
      });
    }
    state.extContact = [...state.extContact];
    return state;
  }),
  // CREDIT LIMIT
  on(CustomerActions.createLimitExt, (state, action) => {
    const guidDummy: string[] = [];
    state.extLimit.forEach(x => guidDummy.push(x.guidDummy));
    let randomNumberGenerator = Math.round(Math.random() * 1e12).toString();
    while (guidDummy.includes(randomNumberGenerator)) {
      randomNumberGenerator = Math.round(Math.random() * 1e12).toString();
    }
    const actionExt = { ...action.ext, guid: randomNumberGenerator };
    state.extLimit = [...state.extLimit, actionExt];
    return state;
  }
  ),
  on(CustomerActions.editLimitLine, (state, action) => {
    if (action.ext) {
      state.extLimit.forEach((x, i) => {
        if (action.ext == x.guid) {
          if (action.ext.status == 'DELETED') {
            state.extLimit.splice(i, 1);
          } else {
            state.extLimit[i] = action.ext;
          }
        }
      });
    }
    state.extLimit = [...state.extLimit];
    return state;
  }),

  // CREDIT TERMS
  on(CustomerActions.createTermExt, (state, action) => {
    const guidDummy: string[] = [];
    state.extTerm.forEach(x => guidDummy.push(x.guidDummy));
    let randomNumberGenerator = Math.round(Math.random() * 1e12).toString();
    while (guidDummy.includes(randomNumberGenerator)) {
      randomNumberGenerator = Math.round(Math.random() * 1e12).toString();
    }
    const actionExt = { ...action.ext, guid: randomNumberGenerator };
    state.extTerm = [...state.extTerm, actionExt];
    return state;
  }
  ),
  on(CustomerActions.editTermLine, (state, action) => {
    if (action.ext) {
      state.extTerm.forEach((x, i) => {
        if (action.ext == x.guid) {
          if (action.ext.status == 'DELETED') {
            state.extTerm.splice(i, 1);
          } else {
            state.extTerm[i] = action.ext;
          }
        }
      });
    }
    state.extTerm = [...state.extTerm];
    return state;
  }),
  //
  on(CustomerActions.containerDraftUpdateSuccess, (state, action) => {
    state.draftContainer = action.entity;
    state.updateAgGrid = true;
    return state;
  }),
  on(CustomerActions.createContainerDraftInit, (state, action) => {
    state.draftContainer = action.entity;
    return state;
  }
  ),
  on(CustomerActions.updateAgGridDone, (state, action) => ({
    ...state, updateAgGrid: action.status
  })
  ),
  on(CustomerActions.createContainerDraftInit, (state, action) => {
    state.onSaveFail = false;
    const isLoginExist = false;
    let isPaymentExist = false;
    let isTaxExist = false;
    // let isAddressExist = false;
    let isContactExist = false;
    let isBranchExist = false;
    let isLimitExist = false;
    let isTermExist = false;
    let isCategoryExist = false;

    state.draftContainer = action.entity;
    if (state.draftContainer != null) {

      const payment = state.draftContainer.bl_fi_mst_entity_ext.filter(element =>
        element.param_code === CustomerConstants.PAYMENT_CONFIG && element.status != 'DELETED');
      isPaymentExist = true;
      if (payment) {
        let tempData = [];
        payment.forEach(x => tempData.push(x));
        state.extPayment = tempData;
      }
      const tax = state.draftContainer.bl_fi_mst_entity_ext.filter(element =>
        element.param_code === CustomerConstants.TAX_DETAILS && element.status != 'DELETED');
      isTaxExist = true;
      if (tax) {
        let tempData = [];
        tax.forEach(x => tempData.push(x));
        state.extTax = tempData;
      }
      // address
      // const address = state.draftContainer.bl_fi_mst_entity_ext.filter(element =>
      //   element.param_code === CustomerConstants.ADDRESS && element.status != 'DELETED'); isAddressExist = true;
      // if (address) {
      //   isAddressExist = true;
      //   let tempData = [];
      //   address.forEach(x => tempData.push(x));
      //   state.extAddress = tempData;
      // }
      // state.draftContainer.bl_fi_mst_entity_line.forEach(element => {
      //   if (element && element.status != 'DELETED' && element.txn_type == "CONTACT") {
      //     var tempData = [];
      //     tempData.push(element);
      //     isContactExist = true;
      //     state.extContact = tempData;
      //   }
      // });
      const contact = state.draftContainer.bl_fi_mst_entity_line.filter(element =>
        element.txn_type == CustomerConstants.CONTACT && element.status != 'DELETED'); isContactExist = true;
      if (contact) {
        isContactExist = true;
        let tempData = [];
        contact.forEach(x => tempData.push(x));
        state.extContact = tempData;
      }
      // branch
      const branch = state.draftContainer.bl_fi_mst_entity_line.filter(element =>
        element.txn_type == CustomerConstants.BRANCH && element.status != 'DELETED'); isBranchExist = true;
      if (branch) {
        isBranchExist = true;
        let tempData = [];
        branch.forEach(x => tempData.push(x));
        state.extBranch = tempData;
      }

      // category
      let category: any;
      category = state.draftContainer.bl_fi_mst_entity_ext.filter(element =>
        element.param_code === CustomerConstants.LIST_CATEGORY_GUID && element.status != 'DELETED');
      let tempData = [];
      if (category.length > 0) {
        isCategoryExist = true;
        tempData = category[0].value_json;
        // category[0].value_json.guids.forEach(x => {
        //   tempData.push(x)
        //   console.log(x, 'this category');

        // });
        state.itemCategory = tempData;
      } else {
        state.itemCategory = tempData;
      }

      // CREDIT LIMIT//
      const limit = state.draftContainer.bl_fi_mst_entity_ext.filter(element =>

        element.param_code === CustomerConstants.CREDIT_LIMITS && element.status != 'DELETED'); isLimitExist = true;
      if (limit) {
        isLimitExist = true;
        let tempData = [];
        limit.forEach(x => tempData.push(x));
        state.extLimit = tempData;
      }

      // CREDIT TERM//
      const term = state.draftContainer.bl_fi_mst_entity_ext.filter(element =>
        element.param_code === CustomerConstants.CREDIT_TERMS && element.status != 'DELETED');
      isTermExist = true;
      if (term) {
        isTermExist = true;
        let tempData = [];
        term.forEach(x => tempData.push(x));
        state.extTerm = tempData;
      }
    }

    if (!isLoginExist) {
      state.extLogin = [];
    }
    if (!isPaymentExist) {
      state.extPayment = [];
    }
    if (!isTaxExist) {
      state.extTax = [];
    }
    // if (!isAddressExist) {
    //   state.extAddress = [];
    // }
    if (!isContactExist) {
      state.extContact = [];
    } if (!isBranchExist) {
      state.extBranch = [];
    }
    if (!isLimitExist) {
      state.extLimit = [];
    }
    if (!isTermExist) {
      state.extTerm = [];
    }
    // if (!isRemarkExist) {
    //   state.extr = []
    // }
    return state;
  }
  ),
  on(CustomerActions.containerDraftUpdateFailed, (state, action) => {
    state.onSaveFail = action.status;
    return state;
  }),

  on(CustomerActions.createContainerCatDraftInit, (state, action) => {
    state.draftCatContainer = action.entity;
    return state;
  }),

  on(CustomerActions.containerCatDraftUpdateSuccess, (state, action) => {
    state.draftCatContainer = action.entityCat;
    state.updateAgGrid = true;
    return state;
  }),

  on(CustomerActions.createContainerCatDraftInit, (state, action) => {
    state.draftCatContainer = action.entity;
    return state;
  }),

  on(CustomerActions.containerCatDraftUpdateSuccess, (state, action) => {
    state.draftCatContainer = action.entityCat;
    state.updateAgGrid = true;
    return state;
  }),
  on(CustomerActions.selectCustomerCatGuid, (state, action) => {
    state.selectedCatGuid = action.guid;
    return state;
  }),
  on(CustomerActions.createCatCustomerSuccess, (state, action) => {
    state.updateAgGrid = true;
    return state;
  }),

  // REDUCER FOR CREDITLIMIT MODULE//
  on(CustomerActions.createContainerLimitDraftInit, (state, action) => {
    state.draftLimitContainer = action.entity;
    return state;
  }),

  on(CustomerActions.containerLimitDraftUpdateSuccess, (state, action) => {
    state.draftLimitContainer = action.entityLimit;
    state.updateAgGrid = true;
    return state;
  }),

  on(CustomerActions.createContainerLimitDraftInit, (state, action) => {
    state.draftLimitContainer = action.entity;
    return state;
  }),

  on(CustomerActions.containerLimitDraftUpdateSuccess, (state, action) => {
    state.draftLimitContainer = action.entityLimit;
    state.updateAgGrid = true;
    return state;
  }),

  on(CustomerActions.selectCustomerLimitGuid, (state, action) => {
    state.selectedLimitGuid = action.guid;
    return state;
  }),

  on(CustomerActions.getCurrencySuccess, (state, action) => {
    state.currency = action.currency;
    return state;
  }),

  on(CustomerActions.createLimitCustomerSuccess, (state, action) => {
    state.updateAgGrid = true;
    return state;
  }),

  // Term Container//

  on(CustomerActions.createContainerTermDraftInit, (state, action) => {
    state.draftTermContainer = action.entity;
    return state;
  }),

  on(CustomerActions.containerTermDraftUpdateSuccess, (state, action) => {
    state.draftTermContainer = action.entityTerm;
    state.updateAgGrid = true;
    return state;
  }),

  on(CustomerActions.selectCustomerTermGuid, (state, action) => {
    state.selectedTermGuid = action.guid;
    return state;
  }),

  on(CustomerActions.createTermCustomerSuccess, (state, action) => {
    state.updateAgGrid = true;
    return state;
  }),

  on(CustomerActions.getAppLoginCreatedBy, (state, action) => {
    state.appLoginCreatedBy = action.appLoginCreatedBy;
    return state;
  }),

  on(CustomerActions.getAppLoginModifiedBy, (state, action) => {
    state.appLoginModifiedBy = action.appLoginModifiedBy;
    return state;
  }),
  on(CustomerActions.selectedRow, (state, action) => ({
    ...state, selectedRow: action.row
  })),
  on(CustomerActions.selectToggleMode, (state, action) => ({
    ...state, selectedToggleMode: action.SelectedToggleMode

  })),
);


export function reducer(state: CustomerState | undefined, action: Action) {
  return customerReducer(state, action);
}
