/** Khai các http service provider */
import { AuthProvider } from './auth/auth.provider';
import { JwtAuthHttp } from './auth-http';

export function providers() {
  return [
    JwtAuthHttp,
    AuthProvider,
  ];
}
