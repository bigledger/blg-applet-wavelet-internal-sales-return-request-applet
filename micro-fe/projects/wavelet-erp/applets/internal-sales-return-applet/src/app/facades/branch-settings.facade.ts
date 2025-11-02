import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ViewColActions } from 'projects/shared-utilities/application-controller/store/actions';
import { ViewColSelectors } from 'projects/shared-utilities/application-controller/store/selectors';
import { AppStates } from 'projects/shared-utilities/application-controller/store/states';
import { ViewColumnState } from 'projects/shared-utilities/application-controller/store/states/view-col.states';
import { ViewCacheActions } from '../state-controllers/view-cache-controller/store/actions';
import { ViewCacheSelectors } from '../state-controllers/view-cache-controller/store/selectors';
import { ViewCacheStates } from '../state-controllers/view-cache-controller/store/states';

@Injectable()
export class BranchSettingsFacade {

  viewColState: ViewColumnState;

  branchSettingsCache$ = this.viewCacheStore.select(ViewCacheSelectors.selectBranchSettingsCache);
  settlementMethodSettingsCache$ = this.viewCacheStore.select(ViewCacheSelectors.selectSettlementMethodSettingsCache);

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
  };

  constructor(
    private readonly appStore: Store<AppStates>,
    private readonly viewCacheStore: Store<ViewCacheStates>,
    private router: Router
  ) {
    this.appStore.select(ViewColSelectors.selectViewColState).subscribe( resolve => this.viewColState = resolve);
  }

  setViewColState(state: ViewColumnState) {
    this.appStore.dispatch(ViewColActions.setViewColState({state}));
  }


  saveBranchSettingsState() {
    this.viewCacheStore.dispatch(ViewCacheActions.cacheBranchSettings({cache: this.viewColState}));
  }

  saveSettlementMethodSettingsState() {
    this.viewCacheStore.dispatch(ViewCacheActions.cacheSettlementMethodSettings({cache: this.viewColState}));
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

}