import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CompanyContainerModel } from 'blg-akaun-ts-lib';
import { ViewColActions } from 'projects/shared-utilities/application-controller/store/actions';
import { ViewColSelectors } from 'projects/shared-utilities/application-controller/store/selectors';
import { AppStates } from 'projects/shared-utilities/application-controller/store/states';
import { ViewColumnState } from 'projects/shared-utilities/application-controller/store/states/view-col.states';
import { CompanyActions } from '../state-controllers/company-controller/store/actions';
import { CompanyStates } from '../state-controllers/company-controller/store/states';
import { ViewCacheActions } from '../state-controllers/view-cache-controller/store/actions';
import { ViewCacheSelectors } from '../state-controllers/view-cache-controller/store/selectors';
import { ViewCacheStates } from '../state-controllers/view-cache-controller/store/states';

@Injectable()
export class ViewColumnFacade {

  viewColState: ViewColumnState;

  companyViewCache$ = this.viewCacheStore.select(ViewCacheSelectors.selectCompanyCache);
  genericCache$ = this.viewCacheStore.select(ViewCacheSelectors.selectGenericCache);
  firstCol$ = this.appStore.select(ViewColSelectors.selectFirstColComp);
  secondCol$ = this.appStore.select(ViewColSelectors.selectSecondColComp);
  breadCrumbs$ = this.appStore.select(ViewColSelectors.selectBreadCrumbs);
  leftDrawer$ = this.appStore.select(ViewColSelectors.selectLeftDrawer);
  rightDrawer$ = this.appStore.select(ViewColSelectors.selectRightDrawer);
  toggleColumn$ = this.appStore.select(ViewColSelectors.selectSingleColumn);
  prevIndex$ = this.appStore.select(ViewColSelectors.selectPrevIndex);
  prevLocalState$ = () => {
    ViewColSelectors.selectPrevLocalState.release();
    return this.appStore.select(ViewColSelectors.selectPrevLocalState);
  }

  constructor(
    private readonly appStore: Store<AppStates>,
    private readonly viewCacheStore: Store<ViewCacheStates>,
    private readonly companyStore: Store<CompanyStates>,
    private router: Router
  ) {
    this.appStore.select(ViewColSelectors.selectViewColState).subscribe( resolve => this.viewColState = resolve);
  }

  setViewColState(state: ViewColumnState) {
    this.appStore.dispatch(ViewColActions.setViewColState({state}));
  }

  saveCompanyState() {
    this.viewCacheStore.dispatch(ViewCacheActions.cacheCompany({cache: this.viewColState}));
  }

  saveGenericState() {
    this.viewCacheStore.dispatch(ViewCacheActions.cacheGeneric({cache: this.viewColState}));
  }

  onNext(index: number) {
    this.appStore.dispatch(ViewColActions.viewColNext({index}));
  }

  onNextAndReset(curIndex: number, nextIndex: number) {
    this.appStore.dispatch(ViewColActions.viewColNextAndReset({curIndex, nextIndex}));
  }

  onPrev(index: number) {
    this.appStore.dispatch(ViewColActions.viewColPrev({index}));
  }

  updateInstance<T>(index: number, localState: T) {
    this.appStore.dispatch(ViewColActions.viewColUpdateInstance({index, localState}));
  }

  goToIndex(index: number) {
    this.appStore.dispatch(ViewColActions.goToIndex({index}));
  }

  goBackIndex(index: number) {
    this.appStore.dispatch(ViewColActions.viewColRvIndex({index}));
  }

  goForwardIndex(index: number) {
    this.appStore.dispatch(ViewColActions.viewColFwIndex({index}));
  }

  resetIndex(index: number) {
    this.appStore.dispatch(ViewColActions.resetIndex({index}));
  }

  toggleColumn(toggle: boolean) {
    this.appStore.dispatch(ViewColActions.toggleColumn({toggle}));
  }

  selectLocalState(index: number) {
    return this.appStore.select(ViewColSelectors.selectLocalState, index);
  }

  gotoFourOhFour() {
    this.router.navigate(['404']);
  }

  createCompany(company: CompanyContainerModel) {
    this.companyStore.dispatch(CompanyActions.createCompanyInit({company}))
    this.updateInstance(0, {
      deactivateAdd: false,
      deactivateList: false
    });
    this.resetIndex(0);
  }
}
