import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpErrorResponse} from '@angular/common/http';
import {catchError, map, retry} from 'rxjs/operators';
import {Entry} from './blog.service';
import {Observable, throwError} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../service/auth.service';

export class User {
  username: string;
  password: string;
  passwordAgain?: string;
  email?: string;
  phonenumber?: string;

}

export class ReturnValueRegister {
  message: string;
}

export class Token {
  accessToken: string;
  refreshToken?: string;
  id?: string;
}


/**
 *  @author Hannah Schieber
 * Service to access endpoints
 */
@Injectable()
/**
 * @author Hannah Schieber
 * Service to access endpoints
 */
export class ApiService {

  /**
   * url for all database resources
   */
  private baseUrl = 'http://localhost:5000/';

  /**
   *
   * constructor for service setting httpClient for requests receiving <b>JSON</b>-Data.
   * @param {HttpClient} http http client to safe reponses by default as <b>JSON</b>
   */
  constructor(private http: HttpClient, private toastr: ToastrService, private auth: AuthService) {
  }

  // ---- User

  public registerUser(user: User): Observable<ReturnValueRegister> {
    return this.http.post<ReturnValueRegister>(`${this.baseUrl}register`, user).pipe(
      catchError(this.handleError)
    );
  }

  public loginUser(user: User): Observable<Token> {
    console.log(user);
    return this.http.post<Token>(`${this.baseUrl}login`, user).pipe(
      catchError(this.handleError)
    );
  }

  public changeUserPassword(password: any): Observable<any> {
    console.log(password);
    return this.http.put<any>(`${this.baseUrl}changeuserpw`, password).pipe(
      catchError(this.handleError)
    );
  }


  // ------ entries

  public createEntry(entry: Entry): Observable<any> {
    console.log(entry);
    return this.http.post<any>(`${this.baseUrl}createentry`, entry).pipe(
      // retry(1),
      catchError(this.handleError)
    );
  }

  public updateEntry(entry: Entry): Observable<any> {
    console.log(entry);
    return this.http.put<any>(`${this.baseUrl}changeentry`, entry).pipe(
      // retry(1),
      catchError(this.handleError)
    );
  }

  public deleteEntry(entry: Entry): Observable<any> {
    console.log(entry);
    return this.http.delete<any>(`${this.baseUrl}deleteentry/${entry.id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * getting all travellist entries
   */
  public getAllEntries(): Observable<any> {
    return this.http.get<Entry>(`${this.baseUrl}getallentries`).pipe(
      catchError(this.handleError)
    );
  }


  public tokenrefresh(): Observable<Token> {
    return this.http.get<any>(`${this.baseUrl}tokenrefresh`).pipe(
      catchError(this.handleError)
    );
  }


  /**
   * handle errors to prevent crashes
   * @param err thrown error by backend
   * @returns Use observable for better handling
   */
  private handleError(err: HttpErrorResponse) {
    if (err.error instanceof ErrorEvent) {
      console.log('client error');
    } else {
      if (err.error && err.error.body) {
        console.error(`Backend returned code ${err.status}, ${err.error.message} is:`, err.error.body);
        return throwError(err.error.body);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(`Backend returned ${err}, body was: `, err);
        return throwError(err);
      }
    }
    // Not reachbale for now:
    // return an ErrorObservable with a user-facing error message
    return throwError('Could not access the API.');
  }



}
