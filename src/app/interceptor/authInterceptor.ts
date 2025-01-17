import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Example: Modify request headers, add authentication token, etc.
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: 'Bearer my-auth-token',
      },
    });
    return next.handle(clonedRequest);
  }
}
