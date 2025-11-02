import { IAction, IActionConfig } from "./../types";
export declare class SetCellValue implements IAction {
    config: IActionConfig;
    private _page;
    private _page_rows;
    private _page_cols;
    private _prevCell;
    constructor(config: IActionConfig);
    do(): void;
    undo(): void;
}
