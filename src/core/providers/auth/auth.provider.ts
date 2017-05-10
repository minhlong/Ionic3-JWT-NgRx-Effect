/**
 * Auth Service AuthProvider
 * Kết nối/thao tác với server, như login, logout,...
 */

import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { JwtHelper } from 'angular2-jwt';
import { Storage } from '@ionic/storage';
import { BaseProvider } from '../base.provider';
import { AuthConst } from '../../constants';
import { ENV } from './../../constants';

@Injectable()
export class AuthProvider extends BaseProvider {

  private jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    private http: Http,
    private storage: Storage
  ) {
    super();
  }

  /**
   * Kiểm tra thông tin đăng nhập từ Server
   *    Nếu Err thì chuyển đến action lỗi thông qua Observable.throw nhờ handleError 
   *    Nếu Succ thì lấy thông tin token từ server trả về
   */
  public login(username: string, password: string): Observable<any> {
    // Create header
    const url: string = `${ENV.API_URL}/dang-nhap`;
    const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = new RequestOptions({ headers: headers });

    // Tạo Parameters
    const payload = new URLSearchParams();
    payload.set('id', username);
    payload.set('password', password);

    // Make connection
    return this.http.post(url, payload.toString(), options)
      .map((res: Response) => <any>res.json())
      .map((res: any) => this.validateToken(res.token))
      .catch((err: any) => this.handleError(err));
  }

  /** Lấy thông tin đăng nhập từ token */
  public getLoggedUser(): Observable<any> {
    return Observable.forkJoin(
      this.storage.get(AuthConst.TOKEN_KEY),
      this.storage.get(AuthConst.USER_KEY)
    ).map((data) => {
      const jwtToken = data[0];
      if (!jwtToken || this.jwtHelper.isTokenExpired(jwtToken)) {
        console.log('AuthProvider ==> token expired');
        return null;
      }
      const _user = data[1];
      return _user
    }).catch((err: any) => this.handleError(err));
  }

  /**
   * Đăng Xuất - Xóa mọi thông tin trên localStorage
   */
  public logout(): void {
    console.log('AuthProvider ==> logout');
    this.storage.clear();
  }

  /**
   * Kiểm tra token
   * Nếu hợp lệ sẽ lưu token vào local Storge để sử dụng cho các request sau dựa vào Json Web Token(JWT)
   */
  private validateToken(token: string): any {
    if (!token || this.jwtHelper.isTokenExpired(token)) {
      return null;
    }
    try {
      this.storage.set(AuthConst.TOKEN_KEY, token);
      const user: any = this.jwtHelper.decodeToken(token);
      // FIXME: Parse User information
      this.storage.set(AuthConst.USER_KEY, user.sub);
      return user;
    } catch (ex) {
      this.handleError(ex);
    }
  }
}
