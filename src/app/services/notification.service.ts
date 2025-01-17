import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthResponseModel } from '../models/auth-response';
export type NotificationType = 'warning' | 'success' | 'error' | 'default';
const loaderHtml=`<div class="c-placeholder">
<div class="animated-background"></div>
</div>`;
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _loadingSubject = new Subject<boolean>();
  private _notificationSubject = new Subject<{message:string,duration:number}>();
  private _appHeaderSubject=new Subject<string>();
  private _branchChangeSubject=new Subject<string>();
  private _tokenUpdateSubject=new Subject<AuthResponseModel>();
  private instanceCount = 0;
  get notifications(): Observable<{message:string,duration:number}> {
    return this._notificationSubject.asObservable();
  }
  get globalLoader(): Observable<boolean> {
    return this._loadingSubject.asObservable();
  }
  get appHeaderChange(): Observable<string> {
    return this._appHeaderSubject.asObservable();
  }
  get onTokenChanges(): Observable<AuthResponseModel> {
    return this._tokenUpdateSubject.asObservable();
  }
  get onBranchChange(): Observable<string> {
    return this._branchChangeSubject.asObservable();
  }
  constructor() {}

  notify(message: any,duration:number = 4000) {
    this._notificationSubject.next({message,duration})
  }

  updateHeader(details:string) {
    this._appHeaderSubject.next(details);
  }

  notifyTokenChange(model:AuthResponseModel) {
    this._tokenUpdateSubject.next(model);
  }
  notifyBranchChange(branchId:string) {
    this._branchChangeSubject.next(branchId);
  }

  startLoader(containerElementId?:string) {
    if(containerElementId){
      let ele=document.getElementById(containerElementId);
      if(ele){
        ele.classList.remove('d-none');
        ele.innerHTML=loaderHtml;
      }
    }else{
      this.instanceCount += 1;
      this._loadingSubject.next(true);
    }
   
  }
  stopLoader(containerElementId?:string) {
    if(containerElementId){
      let ele=document.getElementById(containerElementId);
      if(ele){
        ele.classList.add('d-none');
      }
      return;
    }else{
      this.instanceCount -= 1;
    }
    if (this.instanceCount < 1) {
      this._loadingSubject.next(false);
    }
  }
}
