import { Store } from "../../../muon";
import { IGrid } from "../../../ts-grid";
export declare const alphaRegex: RegExp;
export declare function getCellsDiff(firstCell: string, lastCell: string, grid: IGrid): {
    x: number;
    y: number;
    isLargerByX: boolean;
    negativeDir: boolean;
};
export declare function getLastCopyingCell(firstCell: string, lastCell: string, grid: IGrid): string;
export declare function getProgressionStep(progression: any[]): number;
export declare function getDateStep(dates: any[]): number;
export declare function getTimeStep(dates: any[]): number;
export declare function isCellGreater(a: string, b: string, grid: any): boolean;
export declare function getAutoFilledCells(values: any[], focused: string, selected: string, math: Store, grid: IGrid): {
    cells: string;
    value: any[];
    spans: any;
};
