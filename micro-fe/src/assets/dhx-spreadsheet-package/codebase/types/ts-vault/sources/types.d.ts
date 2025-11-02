import { IEventSystem } from "../../ts-common/events";
import { DataCollection, DataEvents, IDataEventsHandlersMap, IDataItem } from "../../ts-data";
export interface IVault {
    config: IVaultConfig;
    data: DataCollection<IFileWrapper>;
    events: IVaultEventSystem;
    uploader: IUploader;
    paint(): void;
    destructor(): void;
}
export type IVaultEventSystem = IEventSystem<DataEvents | UploaderEvents | ProgressBarEvents, IDataEventsHandlersMap & IUploaderEventHandlersMap & IProgressBarEventHandlersMap>;
export interface IVaultConfig {
    mode?: VaultMode;
    modeControls?: boolean;
    customScroll?: boolean;
    toolbar?: boolean;
    scaleFactor?: number;
    uploader?: IUploaderConfig;
    downloadURL?: string;
    progressBar?: IProgressBarConfig<IVaultProgressData>;
    data?: DataCollection<IFileWrapper>;
    disablePreview?: boolean;
    editable?: boolean;
}
export interface IUploader {
    config: IUploaderConfig;
    data: DataCollection<IFileWrapper>;
    events: IUploaderEventSystem;
    isActive: boolean;
    selectFile(): void;
    abort(id?: string): void;
    linkDropArea(el: HTMLElement | string): void;
    unlinkDropArea(el?: HTMLElement | string): void;
    send(params?: IParams): void;
    parseFiles(dataTransfer: DataTransfer): any;
}
export type IUploaderEventSystem = IEventSystem<DataEvents | UploaderEvents, IDataEventsHandlersMap & IUploaderEventHandlersMap>;
export interface IUploaderConfig {
    autosend?: boolean;
    target?: string;
    params?: IParams;
    singleRequest?: boolean;
    fieldName?: string;
    updateFromResponse?: boolean;
    headerParams?: IParams;
}
export interface IProgressBarConfig<T> {
    template?: (percent: number, extra: T) => string;
}
export interface IScrollView {
    config: IScrollViewConfig;
}
export interface IScrollViewConfig {
    speed: number;
    render(element: any): void;
}
export declare enum UploaderEvents {
    uploadBegin = "uploadbegin",
    beforeUploadFile = "beforeuploadfile",
    uploadFile = "uploadfile",
    uploadFail = "uploadfail",
    uploadComplete = "uploadcomplete",
    uploadProgress = "uploadprogress"
}
export interface IUploaderEventHandlersMap {
    [key: string]: (...args: any[]) => any;
    [UploaderEvents.uploadBegin]: (files?: IFileWrapper[]) => void;
    [UploaderEvents.beforeUploadFile]: (file: IFileWrapper) => boolean | void;
    [UploaderEvents.uploadFile]: (file: IFileWrapper, extra?: {
        [key: string]: string;
    }) => void;
    [UploaderEvents.uploadFail]: (file: IFileWrapper) => void;
    [UploaderEvents.uploadComplete]: (files?: IFileWrapper[]) => void;
    [UploaderEvents.uploadProgress]: (progress: number, current?: number, total?: number) => void;
}
export declare enum ProgressBarEvents {
    cancel = "cancel"
}
export interface IProgressBarEventHandlersMap {
    [key: string]: (...args: any[]) => any;
    [ProgressBarEvents.cancel]: () => void;
}
export declare enum FileStatus {
    queue = "queue",
    uploaded = "uploaded",
    failed = "failed",
    inprogress = "inprogress"
}
export interface IParams {
    [key: string]: any;
}
export declare enum VaultMode {
    grid = "grid",
    list = "list"
}
export interface IVaultProgressData {
    total: number;
    current: number;
}
export interface IUploader {
    config: IUploaderConfig;
    data: DataCollection<IFileWrapper>;
    events: IUploaderEventSystem;
    isActive: boolean;
    selectFile(): void;
    abort(id?: string): void;
    linkDropArea(el: HTMLElement | string): void;
    unlinkDropArea(el?: HTMLElement | string): void;
    send(params?: IParams): void;
    parseFiles(dataTransfer: DataTransfer): any;
}
export interface IUploaderConfig {
    accept?: string;
    autosend?: boolean;
    target?: string;
    params?: IParams;
    headerParams?: IParams;
    singleRequest?: boolean;
    fieldName?: string;
    updateFromResponse?: boolean;
}
export interface IFileWrapper extends IDataItem {
    file: File;
    status: FileStatus;
    progress: number;
    link?: string;
    image?: HTMLImageElement;
    request?: XMLHttpRequest;
    path?: string;
    name?: string;
    size?: number;
    preview?: string;
    $toRemove?: boolean;
}
