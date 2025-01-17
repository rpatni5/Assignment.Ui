import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { GenericApiService } from './generic-api.service';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
import {ControllersType} from '../shared/Utilities/controller-types'

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    readonly http: HttpClient,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  private apiUrl = environment.apiUrl;

  createAPI(controller: ControllersType) {
    return new GenericApiService(
      this.apiUrl,
      this.http,
      controller,
      this.router
    );  
  }
  getApiEndpoint(controller: ControllersType, action?: string): string {
    let retVal = `${this.apiUrl}${controller}`;
    if (action) {
      retVal = `${retVal}/${action}`;
    }
    return retVal;
  }
}
