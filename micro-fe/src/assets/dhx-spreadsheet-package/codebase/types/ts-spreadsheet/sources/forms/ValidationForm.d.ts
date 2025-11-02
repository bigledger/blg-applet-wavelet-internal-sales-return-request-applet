import { IGrid } from "../../../ts-grid";
export declare class ValidationForm {
    protected _handlers: {
        [key: string]: (...args: any[]) => void;
    };
    private _form;
    private _modal;
    private _focus;
    private _events;
    private _set;
    private _grid;
    constructor(events: any, set: any, grid: IGrid);
    hide(): void;
    formValidation(val: any): any;
    show(cell: string, config?: any): void;
    protected _save(save: boolean): void;
    protected _initHandlers(): void;
}
