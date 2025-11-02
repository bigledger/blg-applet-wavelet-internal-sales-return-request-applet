import { IAction, IActionConfig } from "../types";
export declare class InsertLink implements IAction {
    config: IActionConfig;
    private _page;
    constructor(config: IActionConfig);
    do(): void;
    undo(): void;
}
