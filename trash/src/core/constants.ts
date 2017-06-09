/**
 * Khai báo các hằng số cho hệ thống
 */

// It should be seperate to another file for config
export const ENV = {
  API_URL: 'http://test_api.tnttnamhoa.org',
  NODE_ENV: 'prod'
};

export class AuthConst {
  public static get USER_KEY(): string {
    return 'user_id';
  }

  public static get TOKEN_KEY(): string {
    return 'id_token';
  }
}
