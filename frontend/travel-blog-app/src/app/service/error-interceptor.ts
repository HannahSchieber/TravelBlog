import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService} from './auth.service';
import {ApiService} from '../shared/api.service';
import {ToastrService} from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  errorCounter = 0;

  constructor(private auth: AuthService, private api: ApiService, private toastr: ToastrService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401 || err.status === 403) {
        // auto logout if 401 response returned from api
        if (this.errorCounter <= 2) {
          this.errorCounter++;
          this.api.tokenrefresh().subscribe(elem => {
            console.log(elem);
            this.auth.login(elem);
          });
        } else {

          this.errorCounter = 0;
          this.auth.logout();
        }
      } else {
        this.toastr.error(err.error.message, 'Error!');
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }
}
