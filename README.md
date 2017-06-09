# Bài Toán
Cách đây 2 năm mình có viết một trang website (CMS) để quản lý thông tin các bé sinh hoạt trong Nhà Thờ nơi mình ở, dựa trên **Laravel** và **AngularJs** (V1). [*(Các bạn có thể xem Demo và Source Code ở đây)*](https://github.com/minhlong/NamHoa-TNTTNamHoa)

Mình gặp 2 vấn đề chính:
*  Mình không quản lý được trạng thái (State) của hệ thống như danh sách học viên, thông tin cá nhân (Mặc dù mình đã sử dụng localStorage, ...), và mỗi lần như thế mình lại phải request lên server, rồi bị duplicate request,...
* Web của mình chạy trên trình duyệt (browser) của smartphone bị chậm và không mượt lắm

# Giải Pháp
Mình đã tìm thấy **Redux**, nàng ấy đã giúp mình quản lý state tốt hơn
![Redux](https://raw.githubusercontent.com/minhlong/Ionic3-JWT-NgRx-Effect/master/doc/redux-article-3-03.png)

Không chỉ vậy, hệ thống của bạn có thể chia ra nhiều state con (học viên, lớp học, ...) và định danh các action cho từng state
![Redux-Action](https://cdn.css-tricks.com/wp-content/uploads/2016/03/redux-article-3-04.svg)

Và do hệ thống của mình đang dùng Angular nên mình đã tìm thấy Redux cho Angular, ẻm là **NgRx/Store**. Bên cạnh đó, để việc quản lý store tốt hơn, và linh động hơn thì khái niệm **middleware** đã được áp dụng vào đây (Với Angular thì mình có **NgRx/Effect**)

* Không có MiddleWare
![without middleware](https://raw.githubusercontent.com/minhlong/Ionic3-JWT-NgRx-Effect/master/doc/withoutM.png)

* Có MiddleWare
![middleware](https://camo.githubusercontent.com/9de527b9432cc9244dc600875b46b43311918b59/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6d656469612d702e736c69642e65732f75706c6f6164732f3336343831322f696d616765732f323438343739302f415243482d5265647578322d657874656e6465642d7265616c2d6465636c657261746976652e676966)


# Coding - Ionic 3
Do chạy với Angular khá ổn nên mình muốn nâng cấp lên phiên bản mới nhất của Angular là version 4. Nhưng khổ nỗi là hệ thống cũ của mình đang dùng **AngularJs v1**, mà cấu trúc của 2 phiên bản này là hoàn toàn khác nhau. Nên việc nâng cấp sẽ rất mất thời gian lắm đây... Thế thì sẵn tiện update một cú hoành tráng luôn, mình muốn 1 cái gì đó đa nền tảng (cross platform), mình đã tìm thấy 2 em là **Ionic** và **ReactNative**. Và cuối cùng mình đã chọn **Ionic 3** thay vì React Native (mặc dù mình thấy ReactNative ổn hơn)

Và tất nhiên, nếu đã tạo ứng dụng RESTful thì phải nên bảo mật hơn một chút, đó là lý do mình chọn **Json Web Token (JWT)**. Hỗ trợ rất nhiều ngôn ngữ và rất nhiều tutorial hướng dẫn.

### 1.Cấu Trúc Thư Mục
Như mình đã đề cập, mình sẽ không nói nhiều về việc code thế nào, một phần vì rất nhiều bài viết hướng dẫn, phần khác vì code mình comment tương đối chi tiết. Nên mình chỉ giới thiệu về cách kếp hợp và cấu trúc (structure)

    ├───resources -> Chứa các tài nguyên cho việc generate các platform khác (ios, android,...)
    ├───src
    │   ├───app
    │   │       app.module.ts     -> Cấu hình ban đầu của app (Component, Service, providers,...)
    │   │       app.component.ts  -> Giống như root page (index.html), nơi điều hướng tới các page khác
    │   │       app.scss          -> Các file có đuôi .scss là để code css cho chức năng của chính nó (trong trường hợp này là app)
    │   │       app.template.html -> Các file có đuôi .html là để code html cho chức năng của chính nó (trong trường hợp này là app)
    │   │
    │   ├───assets -> Chứa các file images,... 
    │   │
    │   ├───core -> Các thành phần chủ yếu của hệ thống
    │   │   │   constants.ts -> Hằng số tên biến,...
    │   │   │
    │   │   ├───providers
    │   │   │   │   auth-http.ts     -> Định nghĩa lại http service dựa trên JWT (tự gắn token vào header)
    │   │   │   │   base.provider.ts -> Lớp provider chung, dùng để kế thừa (ErrorHandle)
    │   │   │   │   index.ts         -> Tổng hợp các provider để đỡ khai báo trong app.module.ts
    │   │   │   │
    │   │   │   └───auth
    │   │   │           auth.provider.ts -> Tạo các kết nối Authenticate để lấy/lưu token vào hệ thống
    │   │   │
    │   │   └───services
    │   │           auth.service.ts -> Store Auth Service khai báo các phương thức tiếp xúc với store
    │   │           index.ts        -> Tổng hợp các store service để đỡ khai báo trong app.module.ts
    │   │
    │   ├───pages    -> Chứa các page của hệ thống
    │   │   ├───home -> Trang chủ
    │   │   │       home.html
    │   │   │       home.scss
    │   │   │       home.ts -> Các file .ts này sẽ là nơi xử lý mọi thứ của trang
    │   │   │
    │   │   └───login -> Đăng nhập
    │   │           login.html
    │   │           login.scss
    │   │           login.ts
    │   │
    │   ├───store
    │   │   ├───actions -> Action
    │   │   │       auth.action.ts -> Khai báo action cho auth state
    │   │   │       index.ts       -> Tổng hợp các action để đỡ khai báo trong app.module.ts
    │   │   │
    │   │   ├───effects -> MiddleWare
    │   │   │       auth.effect.ts -> Khai báo MiddleWare cho auth action
    │   │   │       index.ts       -> Tổng hợp các MiddleWare để đỡ khai báo trong app.module.ts
    │   │   │
    │   │   ├───reducers -> Khai báo store và các action tương ứng
    │   │   │   │   index.ts -> Cấu hình store, ở đây mình có dùng thêm ngrx-store-logger để tiện theo dõi khi dev
    │   │   │   │
    │   │   │   └───auth
    │   │   │           auth.reducer.ts -> Định nghĩa các action tương tác với auth state
    │   │   │           auth.state.ts   -> Định nghĩa auth state ban đầu
    │   │   │
    │   │   └───selectors -> Rất hữu ích, các selector cho mình biết khi nào store được thay đổi (Observable)
    │   │           auth.selector.ts -> Định nghĩa selector cho Auth
    │   │           index.ts         -> Tổng hợp các selector để đỡ khai báo trong app.module.ts

### 2.Luồng xử lý
* Đầy tiên `app.component.ts` sẽ được load, lúc này mình sẽ quan sát xem auth state hệ thống lúc này thế nào, nếu đã login rồi thì chuyển đến trang chủ, nếu chưa thì chuyển sang trong login

```javascript
  ...
  private loginSub: Subscription;
  ...
  /** Khởi tạo các giá trị ban đầu/mặc định */
  ngOnInit() {
    ...
    // Monitor logged in
    this.loginSub = this.authService.loggedIn().subscribe((isLoggedIn) => {
      this.menu.enable(isLoggedIn);
      isLoggedIn ? this.nav.setRoot(HomePage) : this.nav.setRoot(LoginPage);
    });
  }
  ...
```
* Lúc này auth state chưa có gì nên sẽ gọi đến trang login. Khi người dùng nhấp đăng nhập, hệ thống sẽ thực hiện việc sau
  * Gọi một action (auth.service.ts) để cập nhật state (auth.reducer.ts), lúc này middleware (auth.effect.ts ) của action này sẽ được **trigger**
  * **Middleware** (NgRx/Effect) sẽ thao tác đến server để xác thực (auth.provider.ts). Khi xác thực xong, nếu cần middleware sẽ **gọi đến 1 action khác** (Trong trường hợp này sẽ gọi đến Auth Succ để cập nhật **state** đã đăng nhập)
  * Action tiếp theo lại tiếp tục gọi middleware nếu cần... rồi middleware lại gọi các action nếu cần ... cứ tiếp tục đệ quy (middleware-action) như thế ...
```javascript
  ...
  /**
   * Khi người dùng nhấn Đăng Nhập
   *  - Kiểm tra các giá trị hợp lệ
   *    + Nếu không hợp lệ thì hiện lỗi trên giao diện
   *    + Nếu hợp lệ thì tiến hành gởi thông tin đăng nhập
   *        Nếu thành công thì chuyển sang trang chủ (Middle ware sẽ làm việc này)
   *        Nếu không thành công thì báo lỗi (thông qua authStoreService.getErrorMessage)
   */
  onLogin(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      this.authStoreService.dispachAuth(this.login.username, this.login.password);
    }
  }
```

* Trong khi cái vòng luẩn quẩn giữa middleware và action đang chạy như thế, mỗi khi **state** được cập nhật thì các selector(auth.selector.ts) sẽ cho ta biết. Trong trường hợp này là `loginSub` ở trang `app.component.ts`, khi state đã chuyển sang trạng thái đã đăng nhập thì lúc này app sẽ chuyển sang trang chủ

# Kết - Điểm tốt - Chưa tốt
Thật sự còn rất nhiều thứ trong quá trình mình làm việc với Ionic nhưng đó không phải là trọng tâm trong bài viết này nên mình không bàn đến. Vì mục đích ở đây là chỉ để kết hợp mọi thứ với nhau. Dưới đây là quan điểm cá nhân của mình, nếu trong bài viết còn gì thiếu sót hoặc hiểu sai mong các bạn góp ý dựa trên tinh thần xây dựng cùng nhau phát triển nhé

### Điểm tốt
* Code dễ
* Port từ html sang Ionic không quá khó
* Cấu hình không quá phức tạp

### Điểm chưa tốt
* Chạy không mượt khi build ra webapp. Đây là lý do lớn nhất mình muốn chuyển sang React Native (mặc dù theo mình biết thì hiện tại RN chỉ hỗ trợ IOS và Android, ... nhưng nó là Native không phải Hydrid)
* Tài liệu từ trang chủ không dễ hiểu, đa số mình tra từ google và github

# Tài liệu tham khảo
* https://github.com/driftyco/ionic-conference-app
* https://css-tricks.com/learning-react-redux/
* https://github.com/reactjs/redux/issues/653
