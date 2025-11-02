
export interface ReasonSettingState {
  selectedReasonSetting: any;
  draftData: any;
  defaultReasonSettingGuid: string,
  totalRecords: number;
  updateAgGrid: boolean;
}

export const initState: ReasonSettingState = {
  selectedReasonSetting: null,
  draftData: null,
  defaultReasonSettingGuid: null,
  totalRecords: 0,
  updateAgGrid: false,
};
