/**
 * Đăng nhập vào hệ thống
 * 
 * Dùng redux để quản lý trạng thái đăng nhập
 *    - Gọi AuthService.dispachAuth để cập nhật AppState
 *    - Subscribe AuthService.getErrorMessage để quản lý lỗi
 *        + Advance: Mã lỗi, phân loại lỗi
 *    - Subscribe AuthService.isLoading để quản lý trạng thái đang load dữ liệu
 * 
 * Phần điều hướng (navigate) sẽ nằm ở Root App (NamHoaApp - app component) để check auth lúc khởi tạo
 * Vì vậy sau khi login (loggin thành công), application sẽ tự động điều hướng đến trang chủ
 * thông qua Observable/Subscribe (trigger)
 */

import { AuthService } from './../../core/services/auth.service';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-user',
  templateUrl: 'login.html'
})

export class LoginPage {

  login: { username?: string, password?: string } = {};
  isLoading = false;
  submitted = false;

  private isLoadSub: Subscription;
  private errSub: Subscription;

  /**
   * Khởi tạo các independence services
   */
  constructor(
    public toastCtrl: ToastController,
    private authStoreService: AuthService, // Service gọi đến store
  ) { }

  /**
   * Khai báo các subscribe: loading, error handle
   */
  ngOnInit() {
    // Quản lý trạng thái đang load dữ liệu
    this.isLoadSub = this.authStoreService.isLoading().subscribe((res: boolean) => {
      this.isLoading = res
    })
    // Quản lý trạng thái lỗi
    this.errSub = this.authStoreService.getErrorMessage().subscribe((err) => {
      if (err) {
        // FIXME - Advance: Mã lỗi, phân loại lỗi
        const toast = this.toastCtrl.create({
          message: 'Thông tin đăng nhập chưa đúng',
          duration: 3000
        });
        toast.present();
      }
    })
  }

  /**
   * Khi người dùng nhấn Đăng Nhập
   *  - Kiểm tra các giá trị hợp lệ
   *    + Nếu không hợp lệ thì hiện lỗi trên giao diện
   *    + Nếu hợp lệ thì tiến hành gởi thông tin đăng nhập
   *        Nếu thành công thì cập nhật state, nhờ có selector(observable) nên khi state thay đổi thì app sẽ chuyển sang trang chủ (app.component.ts - loginSub)
   *        Nếu không thành công thì báo lỗi (thông qua authStoreService.getErrorMessage)
   */
  onLogin(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      this.authStoreService.dispachAuth(this.login.username, this.login.password);
    }
  }

  // Unsubscribe khi thoát khỏi trang
  ngOnDestroy() {
    this.isLoadSub.unsubscribe();
    this.errSub.unsubscribe();
  }
}
