import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { APP_ROUTES } from './app.routes';
import {DashboardModule} from './dashboard/dashboard.module';
import {RouterModule} from '@angular/router';
import {ApiService} from './shared/api.service';
import {AuthService} from './service/auth.service';
import { HttpClientModule } from '@angular/common/http';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Interceptor } from './service/interceptor';
import {ErrorInterceptor} from './service/error-interceptor';
import {ToastrModule} from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';

import { NavigationComponent} from './navigation/navigation.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ModalModule} from 'ngx-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageNotFoundComponent,
    NavigationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(APP_ROUTES), // RouterModule.forRoot(appRoutes, {useHash: true})
    NoopAnimationsModule,
    DashboardModule,
    ToastrModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [ApiService, AuthService, ToastrService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
