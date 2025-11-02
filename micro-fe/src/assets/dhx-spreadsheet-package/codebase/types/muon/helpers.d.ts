import { cellId } from "./types";
export declare function str2id(str: string): cellId;
export declare function str2pos(str: string): number[];
export declare function str2range(str: string): number[];
export declare function checkIntersection(id1: cellId, h1: number, w1: number, id2: cellId, h2: number, w2: number): boolean;
