import { cellValue, IStoreConfig, TFindResult } from "../types";
import { Store } from "../store";
import { DataPage } from "./page";
import { RangeStore } from "./ranges";
import { CopyManager } from "./copyManager";
export declare class DataStore {
    private _cfg;
    private _pages;
    private _pageName2ID;
    private _pageNames;
    private _store;
    private _ranges;
    private _pCounter;
    private _parseContext;
    private _cm;
    constructor(cfg: IStoreConfig);
    addPage(name: string): DataPage;
    renamePage(name: string, newName: string): void;
    removePage(name: string): void;
    getPage(name: string | number): DataPage;
    getRanges(): RangeStore;
    getStore(): Store;
    find(cb: (value: cellValue) => boolean, { firstOnly, resultsLimit, }: {
        firstOnly: boolean;
        resultsLimit?: number;
    }): TFindResult[];
    getCopyManager(): CopyManager;
}
