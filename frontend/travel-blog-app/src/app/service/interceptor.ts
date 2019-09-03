import { Injectable } from '@angular/core';
import {HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthService} from './auth.service';
import {BlogService} from '../shared/blog.service';
import {finalize} from 'rxjs/operators';

@Injectable()
export class Interceptor implements HttpInterceptor {

  constructor(private auth: AuthService, private blogService: BlogService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.auth.isAuthenticated()) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
    }
    // this.blogService.show();
    return next.handle(request).pipe(
      // finalize(() => this.blogService.hide())
    );
  }
}
