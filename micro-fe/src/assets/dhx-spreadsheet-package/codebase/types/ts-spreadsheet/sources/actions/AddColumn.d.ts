import { IAction, IActionConfig } from "./../types";
export declare class AddColumn implements IAction {
    config: IActionConfig;
    private _index;
    private _sheetName;
    private _prev;
    constructor(config: IActionConfig);
    do(): void;
    undo(): void;
}
