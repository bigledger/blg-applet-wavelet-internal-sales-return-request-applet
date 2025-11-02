import { DataPage } from "./data/page";
declare type IRawCode = number[];
interface IFormula {
    code: IRawCode;
    source: string;
    exec: execFunction;
    triggers: number[];
    broken: number;
    $width?: number;
    $height?: number;
}
export interface IMathStore {
    each(cb: (id: number, obj: IFormula) => void): void;
    clean(id: cellId): void;
    refresh(id: cellId): void;
    setMath(id: cellId, value: string, ctx?: parseContext): void;
    getMath(id: cellId): IFormula;
}
export interface execContext {
    a: arrayFormulaWrapper;
    v: valueFormulaGetter;
    r: rangeFormulaGetter;
    m: {
        [key: string]: mathFunction;
    };
    e: errorSetter;
    p: (v: string) => cellValue | placeholders;
}
export interface parseContext {
    page: pageResolver;
    name: codeProcessor;
    pageName: (page: number) => string;
    pageObj: (page: number) => DataPage;
    z: number;
}
export interface cellRange {
    $width?: number;
    $height?: number;
}
declare type cellValue = number | string | boolean;
export declare class cellValueArray extends Array<string> {
    $width: number;
    $height: number;
}
declare type namedGetter = (name: string) => cellValue[];
declare type numberGetter = (name: string) => number;
declare type codeProcessor = (v: number[], text: string, ctx: parseContext) => void;
declare type pageResolver = (v: string) => number;
declare type valueGetter = (id: number) => cellValue;
declare type valueSetter = (id: number, value: cellValue, type?: number, source?: number) => boolean;
declare type errorSetter = (e: string) => void;
declare type rangeFormulaGetter = (x1: number, y1: number, x2: number, y2: number, z: number) => cellValue[];
declare type arrayFormulaWrapper = (values: cellValue[], cols: number, rows: number) => cellValue[];
declare type valueFormulaGetter = (x: number, y: number, z: number) => cellValue;
declare type valueFormulaSetter = (x: number, y: number, z: number, value: cellValue) => void;
declare type mathArgument = cellValue | cellValue[];
declare type mathFunction = (...x: mathArgument[]) => cellValue;
declare type execFunction = (context: execContext) => cellValue;
declare type cellId = number;
declare type publicId = cellId | string;
declare type maybeNumber = number | false;
declare type placeholders = {
    [name: string]: cellValue;
};
declare type MathParser = (code: string, ctx: parseContext) => IFormula;
declare type MathGenerator = (x: IFormula, strict: boolean) => void;
declare type PageGetter = {
    (name: string | number): DataPage;
};
declare type CellUpdater = {
    (current: IValue, update: IValue): IValue;
};
declare type MathSerialization = [number, number, IValue];
interface IConfig {
    get: valueGetter;
    set: valueSetter;
    strict: boolean;
}
interface IStoreConfig {
    strict: boolean;
}
export { IRawCode, IConfig, IFormula, namedGetter, numberGetter, valueGetter, valueSetter, valueFormulaGetter, rangeFormulaGetter, valueFormulaSetter, execFunction, cellId, publicId, MathParser, MathGenerator, mathArgument, mathFunction, cellValue, maybeNumber, placeholders, IStoreConfig, PageGetter, CellUpdater, MathSerialization, };
declare const T_TEXT = 1;
declare const T_PLACEHOLDER = 2;
declare const T_ERROR = 3;
declare const T_METHOD = 4;
declare const T_PAGE = 5;
declare const T_NAME = 6;
declare const T_ARG = 7;
declare const T_RANGE = 8;
declare const T_DATA = 9;
declare const T_OPERATOR = 10;
declare const T_NUMBER = 11;
declare const T_SPACE = 12;
declare const T_ARRAY = 13;
export { T_TEXT, T_OPERATOR, T_NUMBER, T_METHOD, T_PAGE, T_ERROR, T_PLACEHOLDER, T_NAME, T_ARG, T_RANGE, T_DATA, T_SPACE, T_ARRAY, };
declare const ERR_PARSE = 1;
declare const ERR_EXEC = 2;
declare const ERR_REF = 3;
declare const ERR_SPILL = 4;
declare const errorText: {
    [key: number]: string;
};
export { errorText, ERR_EXEC, ERR_PARSE, ERR_REF, ERR_SPILL };
export interface IValue {
    value?: cellValue;
    source?: number;
    [key: string]: any;
}
export declare const D_COMMON = 0;
export declare const D_STRING = 1;
export declare const D_RESULT = 2;
export declare const D_SPILL = 3;
export declare type TFindResult = {
    id: cellId;
    value: string | number;
};
export declare const RANGE_PAGE_ID = 63;
export declare const PASTE_MODE_OVERLAP = 0;
export declare const PASTE_MODE_RANGE = 1;
export declare const PASTE_MODE_REPEAT = 2;
export declare const PASTE_MODE_SKIP = 128;
export declare const CLEAN_MODE_DATA = 1;
export declare const CLEAN_MODE_ALL = 255;
export declare type PASTE_MODE = typeof PASTE_MODE_OVERLAP | typeof PASTE_MODE_RANGE | typeof PASTE_MODE_REPEAT;
export declare type TChunkCell = [IValue | null, string?];
export declare type TChunk = {
    from?: cellId;
    data?: TChunkCell[][];
};
export interface IMeta {
    $clipboard?: TChunk;
    [key: string]: any;
}
export declare type TBoxRange = {
    id: number;
    h: number;
    w: number;
};
