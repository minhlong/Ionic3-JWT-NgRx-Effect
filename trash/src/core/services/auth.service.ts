/**
 * Authority AuthService
 * Service này giống như cầu nối sẽ cập nhật trạng thái từ store,
 *  trong lúc store được cập nhật sẽ có các action khác được thao tác thông qua Middle Ware (Effect Middleware)
 */

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { AuthActions } from '../../store/actions/auth.action';
import { AppState } from '../../store/reducers/index';
import { AuthSelector } from '../../store/selectors/auth.selector';

@Injectable()
export class AuthService {

  constructor(
    private store: Store<AppState>,
    private authActions: AuthActions) {
  }

  // Check/create store base on token
  public dispatchCheckToken(): void {
    this.store.dispatch(
      this.authActions.checkToken()
    );
  }

  /** Kiểm tra đăng nhập */
  public dispachAuth(username: string, password: string) {
    this.store.dispatch(
      this.authActions.auth(username, password)
    );
  }

  /** Đăng xuất */
  public dispatchLogout(): void {
    this.store.dispatch(
      this.authActions.logout()
    );
  }

  /** Kiểm tra xem trạng thái đã đăng nhập chưa */
  public loggedIn(): Observable<boolean> {
    return this.getCurrentUser()
      .combineLatest(this.isLoading(), (user, isLoading) => ({
        user,
        isLoading
      }))
      .filter(({isLoading}) => !isLoading)
      .map(({user}) => {
        return !!(user)
      })
      .delay(100) // TODO necessary in order to make nav push work ..
      .distinctUntilChanged();
  }

  /** Lấy thông tin User Đăng Nhập */
  public getCurrentUser(): Observable<any> {
    return this.store.let(AuthSelector.getCurrentUser());
  }

  /** Lấy trạng thái đang request lên server */
  public isLoading(): Observable<boolean> {
    return this.store.let(AuthSelector.isLoading());
  }

  /** Lấy lỗi nếu có sau khi thao tác lên server */
  public getErrorMessage(): Observable<string> {
    return this.store.let(AuthSelector.getErrorMessage());
  }
}
