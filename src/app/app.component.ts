/**
 * App Component - NamHoaApp
 * - Tạo Menu
 * - Tạo lại store từ token được lưu ở local Storage (store bị reset khi refresh browser)
 * - Subcribe sự kiện login
 *    + loggedIn rồi thì sẽ cho Nav chuyển đến trang chủ
 *    + Chưa loggedIn thì chuyển đến trang đăng nhập
 */

import { Subscription } from 'rxjs/Subscription';
import { Component, ViewChild } from '@angular/core';
import { MenuController, Nav } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AuthService } from './../core/services/auth.service';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';

export interface PageInterface {
  title: string;
  name?: string;
  icon?: string;
}

@Component({
  templateUrl: 'app.template.html'
})

export class NamHoaApp {
  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  // Tạo Menu
  appPages: PageInterface[] = [
    { title: 'Trang Chủ', name: 'HomeLink', icon: 'home' },
    { title: 'Đăng Xuất', name: 'LoginLink', icon: 'log-out' },
  ];

  private loginSub: Subscription;

  constructor(
    public menu: MenuController,
    public storage: Storage,
    private authService: AuthService,
  ) {
  }

  /** Khởi tạo các giá trị ban đầu/mặc định */
  ngOnInit() {
    // Enable/Disable menu
    this.menu.enable(false);

    // Check/create store base on token
    this.authService.dispatchCheckToken();

    // Monitor logged in
    this.loginSub = this.authService.loggedIn().subscribe((isLoggedIn) => {
      this.menu.enable(isLoggedIn);
      isLoggedIn ? this.nav.setRoot(HomePage) : this.nav.setRoot(LoginPage);
    });
  }

  /** Mở trang từ Menu */
  openPage(page: PageInterface) {
    // Set Root Nav cho trang
    //  Nếu là root nav sẽ không bị hiển thị back button
    this.nav.setRoot(page.name).catch((err: any) => {
      // Nếu chưa khai báo đường link cho nav, application sẽ báo lỗi
      console.log(`Didn't set nav root: ${err}`);
    });

    if (page.title === 'Đăng Xuất') {
      this.authService.dispatchLogout();
    }
  }

  /** Get color for active menu */
  isActive(page: PageInterface) {
    if (this.nav.getActive() && this.nav.getActive().name === page.name) {
      return 'primary';
    }
    return;
  }

  // Unsubscribe khi thoát khỏi trang
  ngOnDestroy() {
    this.loginSub.unsubscribe();
  }
}
