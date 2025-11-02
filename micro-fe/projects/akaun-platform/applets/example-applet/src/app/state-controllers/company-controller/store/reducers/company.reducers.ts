import { Action, createReducer, on } from '@ngrx/store';
import { CompanyActions } from '../actions';
import { CompanyStates } from '../states';
import { companyAdapters, initialState } from '../states/company-states';

export const companyReducer = createReducer(
  initialState,
  // on(CompanyActions.loadCompanySuccess, (state, action) => companyAdapters.setAll(action.company, state)),
  // on(CompanyActions.createCompanySuccess, (state, action) => companyAdapters.addOne(action.company, state)),
  on(CompanyActions.loadCompanySuccess, (state, action) => ({...state, totalRecords: action.totalRecords})),
  on(CompanyActions.loadCompanyFailure, (state, action) =>
  ({...state, errorLog: [...state.errorLog, {timeStamp: new Date(), log: action.error}]})),
  on(CompanyActions.createCompanySuccess, (state, action) => ({...state, updateAgGrid: true})),
  on(CompanyActions.deleteCompanySuccess, (state, action) => companyAdapters.removeOne(action.guid, state)),
  on(CompanyActions.updateCompanySuccess, (state, action) => companyAdapters.upsertOne(action.company, state)),
  // For the select GUID you don't need to use the entity adapter as you're not changing the entity
  on(CompanyActions.selectGuid, (state, action) => ({...state, selectedGuid: action.guid})),
  on(CompanyActions.updateAgGridDone, (state, action) => ({...state, updateAgGrid: action.done}))
);

export function reducer(state: CompanyStates | undefined, action: Action) {
  return companyReducer(state.company, action);
}
