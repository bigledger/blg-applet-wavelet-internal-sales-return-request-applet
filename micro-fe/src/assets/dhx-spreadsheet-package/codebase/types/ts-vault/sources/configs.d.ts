export declare const gridTemplate: (item: any) => string;
export declare const listTemplate: (item: any) => string;
export declare const getContainersEvents: (data: any) => {
    onclick: {
        "dxi-delete-forever": (event: any) => void;
    };
    onmouseover: {
        "dxi-download": (event: any) => void;
        "dxi-delete-forever": (event: any) => void;
        "dhx_list-item--name": (event: any) => void;
        "dhx_dataview-item--file-name": (event: any) => void;
    };
};
