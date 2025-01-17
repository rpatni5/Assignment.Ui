import { ApiResponse } from '../shared/models/api-response';
import { PagedApiResponse } from '../shared/models/paged-api-response';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { AuthResponseModel } from '../models/auth-response';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { IGenericApi } from '../shared/generic-api';
export class GenericApiService implements IGenericApi {
  private _refreshTokenRequest: Promise<ApiResponse<AuthResponseModel>> | undefined;
  api: IGenericApi | undefined;
  constructor(
    private apiUrl: string,
    private http: HttpClient,
    private apiController: string,
    private router: Router,
  ) { }
    export(action?: string, params?: any): Promise<any> {
        throw new Error('Method not implemented.');
    }

  private _request = async <TResult>(
    url: string,
    type: 'get' | 'post' | 'put' | 'delete',
    data?: any,
    notificationTimeout: number = 6000
  ): Promise<ApiResponse<TResult>> => {
    try {
      let resp: Observable<ApiResponse<TResult>>;
      switch (type) {
        case 'post':
          resp = this.http.post<ApiResponse<TResult>>(url, data);
          break;
        case 'put':
          resp = this.http.put<ApiResponse<TResult>>(url, data);
          break;
        case 'delete':
          resp = this.http.delete<ApiResponse<TResult>>(url);
          break;
        default:
          resp = this.http.get<ApiResponse<TResult>>(url);
          break;
      }
      return this._handleResponse(resp, notificationTimeout, async () => {
        let resp = await this.refreshToken();
        if (resp.isSuccess) {
          return this._request(url, type, data, notificationTimeout);
        } else {
          return { data: resp.message };
        }
      });
    } catch (error) {
      return this.handleError(error);
    }
  };

  private _pageRequest = async <TResult>(
    url: string,
    type: 'get' | 'post',
    data?: any
  ): Promise<PagedApiResponse<TResult>> => {
    try {
      let resp: Observable<PagedApiResponse<TResult>>;
      switch (type) {
        case 'post':
          resp = this.http.post<PagedApiResponse<TResult>>(url, data);
          break;
        default:
          resp = this.http.get<PagedApiResponse<TResult>>(url);
          break;
      }
      return this._handleResponse(resp, 6000, async () => {
        let resp = await this.refreshToken();
        if (resp.isSuccess) {
          return this._request(url, type, data);
        } else {
          return { data: resp.message };
        }
      });
    } catch (error) {
      return this.handleError(error);
    }
  };

  private async refreshToken(): Promise<ApiResponse<any>> {
    try {
      if (this._refreshTokenRequest) {
        let resp = await this._refreshTokenRequest;
        if (resp.isSuccess) {
          return { data: resp.message };
        }else if(!resp.isSuccess && resp.code == "InvalidToken"){
          return { isSuccess: false };
        }
        
      }

      let userData : any = localStorage.getItem('authData')

      if (!userData?.refreshToken) {
        return { isSuccess: false };
      }
      let url = `${this.apiUrl}auth/refreshToken/${userData.refreshToken}`;
      this._refreshTokenRequest = firstValueFrom(
        this.http.post<ApiResponse<AuthResponseModel>>(url, null)
      );
      var refreshedTokenResponse = await this.refreshToken();
      if(!refreshedTokenResponse?.isSuccess && refreshedTokenResponse?.code == "InvalidToken"){
        return { isSuccess: false };
      }else
      if (refreshedTokenResponse?.result?.expiry.toString() < (new Date()).toISOString()) {
        return { isSuccess: false };
      } else {
        return refreshedTokenResponse;
      }
    } catch (error) {
      console.log(error);
      return { data:error };
    }
  }

  private async _handleResponse<TResult>(
    resp: Observable<ApiResponse<TResult>>,
    notificationTimeout: number,
    onAuthFailure: () => Promise<ApiResponse<TResult>>
  ): Promise<ApiResponse<TResult>> {
    try {
      let result = await firstValueFrom(resp);
     
      return result || { isSuccess: false };
    } catch (error:any) {
      if ((error.status || error.response?.status) == 401) {
        return onAuthFailure();
      }
      return this.handleError(error);
    }
  }

  private _buildUrl(action?: string, id?: any, queryObj?: any): string {
    let url = `${this.apiUrl}${this.apiController}`;
    if (action) {
      url = `${url}/${action}`;
    }
    if (id) {
      url = `${url}/${id}`;
    }
    if (queryObj) {
      url = `${url}?${new URLSearchParams(queryObj).toString()}`;
    }
    return url;
  }

  private handleError<TResult>(error:any): Promise<TResult> {
    let errorString;
    if (error?.status == 403) {
      errorString =
        'Seems like you do not have permissions to access this resource.Please reach out to system admin for more information';
    } else if (error?.status == 404) {
      errorString = `The resource you are trying to access doesn't exists.Please reach out to system admin for more information`;
    } else if (error?.status == 400 && error.error?.errors) {
      let errobj: string[] = [];
      Object.keys(error.error?.errors).forEach((k) => {
        let arr = `${k}:${error.error?.errors[k]}` || [];
        errobj = errobj.concat(arr);
      });
      errorString = errobj.join(';');
    }
    

    return Promise.resolve({
      isSuccess: false,
      message: 'Something went wrong.Please contact system admin',
    } as any);
  }

  get = async <TResult>(
    id?: any,
    action?: string,
    queryObj?: any
  ): Promise<ApiResponse<TResult>> => {
    let url = this._buildUrl(action, id, queryObj);
    return this._request(url, 'get');
  };

  search = async <TResult>(
    bodyParams?: any,
    queryParams?: any,
    action: string = 'search'
  ): Promise<PagedApiResponse<TResult>> => {
    let url = this._buildUrl(action, null, queryParams);
    return this._pageRequest<TResult>(url, 'post', bodyParams || {});
  };

  searchAll = async <TResult>(
    bodyParams?: any,
    queryParams?: any,
    action: string = 'searchAll'
  ): Promise<PagedApiResponse<TResult>> => {
    let url = this._buildUrl(action, null, queryParams);
    return this._pageRequest<TResult>(url, 'post', bodyParams || {});
  };

  post = async <TResult>(
    data: any,
    removeNulls: boolean = true,
    action?: string
  ): Promise<ApiResponse<TResult>> => {
    let url = this._buildUrl(action);
    if (removeNulls && data) {
      Object.keys(data).forEach((k) => data[k] == null && delete data[k]);
    }
    return this._request(url, 'post', data);
  };

  put = async <TResult>(
    id?: any,
    data?: any,
    removeNulls: boolean = true,
    action?: string
  ): Promise<ApiResponse<TResult>> => {
    let url = this._buildUrl(action, id);
    if (removeNulls && data) {
      Object.keys(data).forEach((k) => data[k] == null && delete data[k]);
    }
    return this._request(url, 'put', data);
  };

  delete = async <TResult>(
    id: number | string,
    action?: string
  ): Promise<ApiResponse<TResult>> => {
    let url = this._buildUrl(action, id);
    return this._request(url, 'delete');
  };

  upload = async <TResult>(
    file: File,
    action?: string,
    notificationTimeout: number = 12000
  ): Promise<ApiResponse<TResult>> => {
    let url = this._buildUrl(action);
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this._request(url, 'post', formData, notificationTimeout);
  };

 
 
}
