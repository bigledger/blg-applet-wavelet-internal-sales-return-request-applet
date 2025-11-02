import { ICellMeta } from "../types";
export declare class LinkForm {
    protected _handlers: {
        [key: string]: (...args: any[]) => void;
    };
    private _form;
    private _modal;
    private _cell;
    private _debounds;
    private _popup;
    private _toolbar;
    private _grid;
    private _toolbarLink;
    private _cellMeta;
    private _set;
    private _events;
    constructor(grid: any, set: any, events: any);
    hide(): void;
    isVisible(): boolean;
    destructor(): void;
    show(cell: string, cellMeta: ICellMeta): void;
    showInfo(cell: string, cellMeta: ICellMeta): void;
    hideInfo(): void;
    private _keyHandler;
    protected _save(): void;
    protected toogleSaveButton(text: string): void;
    protected toogleLocked(locked: boolean): void;
    protected _initHandlers(): void;
}
