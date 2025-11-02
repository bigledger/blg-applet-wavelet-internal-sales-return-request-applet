import { ISpreadsheetConfig } from "../types";
export declare function getMenuStruct(config: ISpreadsheetConfig): ({
    id: string;
    open: boolean;
    value: string;
    items: {
        id: string;
        value: string;
        icon: string;
        items: {
            id: string;
            value: string;
            icon: string;
        }[];
    }[];
} | {
    id: string;
    value: string;
    items: ({
        id: string;
        value: string;
        icon: string;
        type?: undefined;
        items?: undefined;
    } | {
        type: string;
        id?: undefined;
        value?: undefined;
        icon?: undefined;
        items?: undefined;
    } | {
        id: string;
        value: string;
        icon: string;
        items: {
            id: string;
            value: string;
        }[];
        type?: undefined;
    })[];
    open?: undefined;
} | {
    id: string;
    value: string;
    items: ({
        id: string;
        value: string;
        icon: string;
        items: {
            id: string;
            value: string;
            icon: string;
        }[];
        type?: undefined;
    } | {
        id: string;
        type: string;
        icon: string;
        value: string;
        items?: undefined;
    })[];
    open?: undefined;
} | {
    id: string;
    value: string;
    items: ({
        id: string;
        value: string;
        icon: string;
        type?: undefined;
        items?: undefined;
        tooltip?: undefined;
    } | {
        type: string;
        id?: undefined;
        value?: undefined;
        icon?: undefined;
        items?: undefined;
        tooltip?: undefined;
    } | {
        id: string;
        value: string;
        items: {
            id: string;
            value: string;
            twoState: boolean;
            group: string;
            icon: string;
        }[];
        icon?: undefined;
        type?: undefined;
        tooltip?: undefined;
    } | {
        id: string;
        type: string;
        value: string;
        items: ({
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
        icon?: undefined;
        tooltip?: undefined;
    } | {
        id: string;
        type: string;
        value: string;
        tooltip: string;
        icon?: undefined;
        items?: undefined;
    })[];
    open?: undefined;
} | {
    id: string;
    value: string;
    items: ({
        id: string;
        value: string;
        icon: string;
        items?: undefined;
    } | {
        id: string;
        value: string;
        icon: string;
        items: {
            id: string;
            value: string;
            icon: string;
        }[];
    })[];
    open?: undefined;
} | {
    id: string;
    value: string;
    open?: undefined;
    items?: undefined;
})[];
