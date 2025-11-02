import { IAction, IActionConfig } from "./../types";
export declare class SetCellStyle implements IAction {
    config: IActionConfig;
    private _page;
    private _page_rows;
    private _page_cols;
    constructor(config: IActionConfig);
    do(): void;
    undo(): void;
}
