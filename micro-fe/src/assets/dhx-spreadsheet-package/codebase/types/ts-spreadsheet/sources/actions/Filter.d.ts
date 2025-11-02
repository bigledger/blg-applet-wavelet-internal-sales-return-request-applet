import { IAction, IActionConfig } from "../types";
export declare class Filter implements IAction {
    config: IActionConfig;
    private _prev;
    constructor(config: IActionConfig);
    do(): void;
    undo(): void;
}
