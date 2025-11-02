import * as fromColumn1ViewModelStates from './column_1_view_model.states';
import * as fromColumn2ViewModelStates from './column_2_view_model.states';
import * as fromColumn4ViewModelStates from './column_4_view_model.states';
export interface ColumnViewModelStates {
    column1ViewModel: fromColumn1ViewModelStates.Column1ViewModelState;
    column2ViewModel: fromColumn2ViewModelStates.Column2ViewModelState;
    column4ViewModel: fromColumn4ViewModelStates.Column4ViewModelState;
  }
  