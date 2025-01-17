import { ApiResponse } from "./api-response";
export interface PagedApiResponse<TResult> extends Omit<ApiResponse<TResult>,'result'> {
    count?:number;
    result?:TResult[]
}