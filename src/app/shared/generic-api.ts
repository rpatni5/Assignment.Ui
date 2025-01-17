import { ApiResponse } from './models/api-response';
import { PagedApiResponse } from './models/paged-api-response';

export interface IGenericApi {
  get<TResult>(
    id?: any,
    action?: string,
    queryObj?: any
  ): Promise<ApiResponse<TResult>>;

  search<TResult>(
    bodyParams?: any,
    queryParams?: any,
    action?: string
  ): Promise<PagedApiResponse<TResult>>;

  searchAll<TResult>(
    bodyParams?: any,
    queryParams?: any,
    action?: string
  ): Promise<PagedApiResponse<TResult>>;

  post<TResult>(
    data: any,
    removeNulls?: boolean,
    action?: string
  ): Promise<ApiResponse<TResult>>;

  put<TResult>(
    id?: any,
    data?: any,
    removeNulls?: boolean,
    action?: string
  ): Promise<ApiResponse<TResult>>;

  delete<TResult>(
    id: number | string,
    action?: string
  ): Promise<ApiResponse<TResult>>;

  upload<TResult>(
    file: File,
    action?: string,
    notificationTimeout?: number
  ): Promise<ApiResponse<TResult>>;
  export(action?:string,params?:any):Promise<any>;
}
