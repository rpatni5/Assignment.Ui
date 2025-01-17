import { KeyValuePair } from "./key-value-pair";

export interface ApiResponse<TResult>{
    data?: any;
    count?: number;
    code?:string;
    result?:TResult;
    stats?:KeyValuePair<any>[];
    message?:string;
    isSuccess?:boolean
}