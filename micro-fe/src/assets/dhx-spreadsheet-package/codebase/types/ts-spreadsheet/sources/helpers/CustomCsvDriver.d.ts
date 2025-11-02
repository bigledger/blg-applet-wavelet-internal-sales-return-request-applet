import { CsvDriver } from "../../../ts-data";
import { IGrid } from "../../../ts-grid";
export declare class CustomCsvDriver extends CsvDriver {
    private _grid;
    constructor(grid: IGrid);
    toJsonArray(data: string): any[];
}
