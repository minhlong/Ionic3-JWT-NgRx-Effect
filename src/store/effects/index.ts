/** Khai báo các middle ware */
import { AuthEffect } from './auth.effect';

export function effects() {
  return [
    AuthEffect,
  ];
}
