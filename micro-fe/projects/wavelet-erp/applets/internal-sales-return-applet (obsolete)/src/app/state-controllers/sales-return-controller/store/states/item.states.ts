export interface ItemState {
  selectedInvItem: any;
  selectedSerial: any;
  selectedBin: any;
  selectedBatch: any;
}

export const initState: ItemState = {
  selectedInvItem: null,
  selectedSerial: null,
  selectedBin: null,
  selectedBatch: null
};