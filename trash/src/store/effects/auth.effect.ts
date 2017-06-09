/**
 * Auth Middle Ware
 * Các method được gọi trong khi store được cập nhật
 */
import { Injectable } from '@angular/core';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { AuthActions } from '../actions/auth.action';
import { AuthProvider } from '../../core/providers/auth/auth.provider';

@Injectable()
export class AuthEffect {

  constructor(
    private actions$: Actions,
    private authService: AuthProvider, // Auth Service xử lý các thao tác với server
    private authActions: AuthActions // Định nghĩa các Auth action
  ) {
  }

  /**
   * Action Login
   * Kiểm tra thông tin đăng nhập từ server thông qua authService.login
   *  Nếu succ sẽ gọi đến action Auth succ
   *  Nếu Err sẽ gọi đến action Auth Error,
   *    lúc này những phần error handle của auth sẽ được trigger. 
   * 
   * Ex: login.ts page
   * 
   * ngOnInit() {
   *   ...
   *   // Quản lý trạng thái lỗi
   *   this.authStoreService.getErrorMessage().distinctUntilChanged().subscribe((err) => {
   *     if (err) {
   *       // FIXME - Advance: Mã lỗi, phân loại lỗi
   *       this.err = 'Thông tin đăng nhập chưa đúng'
   *     }
   *   })
   * }
   */
  @Effect()
  login$: Observable<Action> = this.actions$
    .ofType(AuthActions.AUTH)
    .map<Action, any>(toPayload)
    .switchMap((payload: any) => this.authService.login(payload.username, payload.password)
      .map((user: any) => this.authActions.authCompleted(user))
      .catch((err) =>
        Observable.of(this.authActions.authError(err))
      )
    );

  /**
   * Lấy thông tin user từ token
   */
  @Effect()
  checkToken$: Observable<Action> = this.actions$
    .ofType(AuthActions.CHECK_TOKEN)
    .switchMap(() => this.authService.getLoggedUser()
      .map((user: any) => {
        return this.authActions.checkTokenCompleted(user);
      })
      .catch((err) =>
        Observable.of(this.authActions.checkTokenCompleted(null))
      )
    );

  /**
   * Action Logout
   * Xóa thông tin token ở local thông qua authService.logout
   * Sau đó gọi đến action Auth logoutSuccess
   */
  @Effect()
  logout$: Observable<Action> = this.actions$
    .ofType(AuthActions.LOGOUT, AuthActions.UNAUTHORIZED)
    .do(() => this.authService.logout())
    .map(() => this.authActions.logoutSuccess());
}
