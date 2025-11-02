import { IValue, cellValue, parseContext, cellId, MathSerialization } from "../types";
import { Store } from "../store";
export interface NumberHash<T> {
    [key: number]: T;
}
declare type MetaValues = {
    [key: string]: any;
};
declare type TCellSpanInfo = {
    width: number;
    height: number;
};
declare type TCellSpan = {
    id: cellId;
    info: TCellSpanInfo;
};
export declare class DataPage {
    private _data;
    private _store;
    private _id;
    private _parseContext;
    private _meta;
    private _rows;
    private _cols;
    private _spans;
    private _parseMode;
    constructor(id: number, store: Store, ctx: parseContext);
    reset(): void;
    getMeta(): any;
    setMeta(obj: MetaValues): void;
    getID(): number;
    cellID(row: number, col: number): number;
    getSize(): [number, number];
    getContext(): parseContext;
    addRow(pos: number, count: number): void;
    removeRow(pos: number, count: number): void;
    addColumn(pos: number, count: number): void;
    removeColumn(pos: number, count: number): void;
    setCell(r: number, c: number, value: IValue): void;
    clearCell(r: number, c: number): void;
    setValue(r: number, c: number, value?: cellValue, type?: number): void;
    getCell(r: number, c: number, force?: boolean): IValue;
    getValue(r: number, c: number, formula?: boolean): cellValue;
    getRange(r1: number, c1: number, r2: number, c2: number): cellValue[];
    getCellRange(r1: number, c1: number, r2: number, c2: number): IValue[];
    eachCell(cb: (row: number, col: number, value: IValue) => void): void;
    serialize(formula?: true): MathSerialization[];
    parse(data: MathSerialization[], process?: boolean): void;
    parseBlock(data: MathSerialization[], process?: boolean, parse?: boolean): void;
    throwError(text: string): void;
    setRowMeta(rowIndex: number, dataObject: MetaValues): void;
    getRowMeta(rowIndex: number, force?: boolean): MetaValues;
    setColumnMeta(colIndex: number, dataObject: MetaValues): void;
    getColumnMeta(colIndex: number, force?: boolean): MetaValues;
    sort(from: cellId, to: cellId, index?: number, dir?: string): void;
    addSpan(id: cellId, width: number, height: number): void;
    getSpan(id: cellId): TCellSpan;
    getSpans(): TCellSpan[];
    _recalculateSpans(pos: number, rCount: number, cCount: number): void;
    _adjustSpan(start: number, size: number, pos: number, count: number): [number, number];
}
export {};
