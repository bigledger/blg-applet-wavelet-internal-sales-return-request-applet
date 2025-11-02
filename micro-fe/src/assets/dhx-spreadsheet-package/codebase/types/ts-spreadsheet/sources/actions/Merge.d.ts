import { IAction, IActionConfig } from "../types";
export declare class Merge implements IAction {
    config: IActionConfig;
    private _newSpan;
    private _prevSpan;
    private _prevData;
    constructor(config: IActionConfig);
    do(): void;
    undo(): void;
}
