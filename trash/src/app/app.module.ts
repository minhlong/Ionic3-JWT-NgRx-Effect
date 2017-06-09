import { BrowserModule } from '@angular/platform-browser';
import { Http, HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { AuthConfig } from 'angular2-jwt';

// Core
import { JwtAuthHttp } from '../core/providers/auth-http';
import { AuthActions } from '../store/actions/auth.action';
import { AuthEffect } from '../store/effects/auth.effect';
import { reducer } from '../store/reducers/index';
import { providers } from '../core/providers';
import { services } from '../core/services';
import { actions } from '../store/actions';
import { AuthConst } from './../core/constants';

// App Component
import { NamHoaApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';

@NgModule({
  declarations: [
    NamHoaApp,
    LoginPage,
    HomePage,
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(NamHoaApp, {}, {
      links: [
        { component: HomePage, name: 'HomeLink', segment: 'trang-chu' },
        { component: LoginPage, name: 'LoginLink', segment: 'dang-nhap' },
      ]
    }),

    // Declare Storage (local storage)
    IonicStorageModule.forRoot(),

    // Declare Store
    StoreModule.provideStore(reducer),

    // Declare MiddleWare-Effect
    EffectsModule.run(AuthEffect),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    NamHoaApp,
    LoginPage,
    HomePage,
  ],
  providers: [
    providers(),
    services(),
    actions(),
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: JwtAuthHttp, useFactory: getAuthHttp, deps: [Http, AuthActions, Store, Storage] },
  ]
})

export class AppModule { }

export function getAuthHttp(http: Http, authActions: AuthActions, store: Store<any>, storage: Storage) {
  return new JwtAuthHttp(new AuthConfig({
    tokenGetter: () => storage.get(AuthConst.TOKEN_KEY),
    tokenName: AuthConst.TOKEN_KEY,
    globalHeaders: [{ 'Accept': 'application/json' }],
    noJwtError: true
  }), http, authActions, store);
}
