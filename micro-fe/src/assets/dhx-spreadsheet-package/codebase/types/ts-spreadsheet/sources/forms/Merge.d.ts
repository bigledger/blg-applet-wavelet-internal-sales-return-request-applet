import { DataPage } from "../../../muon";
export declare class Merge {
    protected _handlers: {
        [key: string]: (...args: any[]) => void;
    };
    private _callAction;
    private _isLocked;
    private _config;
    private _grid;
    constructor(cb: any, config: any, grid: any, isLocked: any);
    doAction(cell: string, remove: boolean): void;
    checkBeforeMerge(cell: string, remove: boolean): boolean;
    checkBeforeAction(cell: any, page: DataPage, action: string): boolean;
}
