/**
 * Lấy danh sách tài khoản từ server
 */
import { Component } from '@angular/core';
import { App, ToastController } from 'ionic-angular';
import { JwtAuthHttp } from './../../core/providers/auth-http';
import { ENV } from './../../core/constants';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  shownSessions: any = [];
  listAcc: any = [];

  constructor(
    public app: App,
    public toastCtrl: ToastController,
    private authHttp: JwtAuthHttp
  ) { }

  /**
   * - Set title
   * - Get list from the server
   */
  ngOnInit() {
    this.app.setTitle('Trang Chủ');
    this.getAccountList();
  }

  /**
   * Get account list from the server and Show data
   */
  getAccountList() {
    let url: string = `${ENV.API_URL}/tai-khoan/danh-sach`;
    let parames = { start: 0, length: 10 };
    this.authHttp.get(url, { params: parames }).subscribe(res => {
      this.listAcc = res.json().data
    }, err => {
      // Error Handle
      console.log(err)
    });
  }
}
