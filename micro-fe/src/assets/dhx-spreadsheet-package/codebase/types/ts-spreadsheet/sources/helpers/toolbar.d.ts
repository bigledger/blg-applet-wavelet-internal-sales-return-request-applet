import { Menu } from "../../../ts-menu";
import { IToolbar } from "../../../ts-toolbar";
import { DataPage } from "../../../muon";
import { IFormats, ISpreadsheetConfig } from "../types";
import { IGrid } from "../../../ts-grid";
export declare function getColorpickerTemplate(color: string, icon: string): string;
export declare function updateToolbar(toolbar: IToolbar, menu: Menu, page: DataPage, grid: any): void;
export declare function getToggledValue(page: DataPage, cell: string, name: string, value: any, grid: IGrid): string;
export declare function getFormatItem(format: IFormats, example?: string | number): string;
export declare function getFormatsDropdown(config: ISpreadsheetConfig): ({
    id: string;
    css: string;
    twoState: boolean;
    html: string;
} | {
    id: string;
    css: string;
    twoState: boolean;
    hidden: boolean;
    value: string;
})[];
export declare function normalizeToolbarFormat(format: IFormats): {
    id: string;
    css: string;
    twoState: boolean;
    html: string;
};
