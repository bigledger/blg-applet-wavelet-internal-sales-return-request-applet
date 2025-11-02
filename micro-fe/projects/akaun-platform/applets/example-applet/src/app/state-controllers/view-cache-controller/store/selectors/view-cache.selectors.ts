import { ViewCacheStates } from '../states';

export const selectCompanyCache = (state: ViewCacheStates) => state.viewCache.company;
export const selectGenericCache = (state: ViewCacheStates) => state.viewCache.generic;
