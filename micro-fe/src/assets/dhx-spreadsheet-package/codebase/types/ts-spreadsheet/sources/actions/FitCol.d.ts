import { IAction, IActionConfig } from "../types";
export declare class FitColumn implements IAction {
    config: IActionConfig;
    private _page;
    private _prev;
    constructor(config: IActionConfig);
    do(): void;
    undo(): void;
}
