import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CompanyContainerModel } from 'blg-akaun-ts-lib';
import { ViewColumnState } from 'projects/shared-utilities/application-controller/store/states/view-col.states';

export interface CompanyState extends EntityState<CompanyContainerModel> {
  selectedGuid: string;
  errorLog: {timeStamp: Date, log: string}[];
  totalRecords: number;
  requiresUpdate: boolean;
  updateAgGrid: boolean;
}

export const companyAdapters: EntityAdapter<CompanyContainerModel> = createEntityAdapter<CompanyContainerModel>({
  selectId: a => a.bl_fi_mst_comp.guid
});

export const initialState: CompanyState = companyAdapters.getInitialState({
  selectedGuid: null,
  errorLog: [],
  totalRecords: 0,
  requiresUpdate: false,
  updateAgGrid: false
});

