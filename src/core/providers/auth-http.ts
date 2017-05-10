/**
 * Reference : https://github.com/auth0/angular2-jwt/issues/37
 * 
 * Tạo các kết nối thông qua JWT
 *    Nếu kết nối chưa được Authorize thì sẽ chuyển đến trang login
 *      - Lúc này store được update -> LoggedIn được subscribe
 */

import { Injectable } from '@angular/core';
import { Http, Request, Response, RequestOptionsArgs } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';
import { AuthActions } from '../../store/actions/auth.action';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/reducers/index';

@Injectable()
export class JwtAuthHttp extends AuthHttp {
  constructor(options: AuthConfig,
    http: Http,
    public authActions: AuthActions,
    public store: Store<AppState>) {
    super(options, http);
  }

  /** Kiểm tra xem kết nối đã được xác thực chưa (Authorize) */
  private isUnauthorized(status: number): boolean {
    return status === 401;
  }

  /** Tạo các kết nối đến server */
  public request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    const response = super.request(url, options);

    response.subscribe(null, (err) => {
      // Kiểm tra kết nối được xác thực chưa
      if (this.isUnauthorized(err.status)) {
        console.log('JwtAuthHttp ==> dispatch unauthorized');
        this.store.dispatch(
          this.authActions.unauthorized()
        );
      }
    });

    return response;
  }
}
