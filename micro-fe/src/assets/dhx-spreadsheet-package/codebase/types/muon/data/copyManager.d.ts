import { Store } from "../store";
import { TChunkCell, cellId, TChunk, PageGetter, PASTE_MODE, MathSerialization, TBoxRange, CellUpdater, IValue } from "../types";
export declare class CopyManager {
    private _store;
    private _pageGetter;
    constructor(store: Store, pageGetter: PageGetter);
    copy(from: cellId, to?: cellId): TChunk;
    /**
     * Pastes a chunk of data into a specified range of cells.
     */
    paste(targetLeftTop: cellId, targetRightBottom: cellId, chunk?: TChunk, mode?: PASTE_MODE, handler?: CellUpdater): void;
    clean(from: cellId, to: cellId, mode?: number): void;
    _refreshRelatedFormulas(ids: number[]): void;
    _serialize(from: cellId, to: cellId): TChunk;
    reset(): void;
    move(to: cellId, chunk?: TChunk): void;
    _updateRelatedFormulas(ids: number[], dr: number, dc: number, dp: number, chunkInfo: TBoxRange): void;
    _getTriggersOutsideCutRange(triggerList: number[], chunkFromId: cellId, chunkR: number, chunkC: number): number[];
    _updateCell(r: number, c: number, p: number, chunkCell: TChunkCell, dx: number, dy: number, handler: CellUpdater): MathSerialization | null;
    _updateCurrentCell(_current: IValue, update: IValue): IValue;
    fromCSV(text: string, rowSeparator?: string, columnSeparator?: string): TChunk;
}
