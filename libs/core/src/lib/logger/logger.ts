/* eslint-disable @typescript-eslint/no-explicit-any */

export enum LogLevel {
  debug,
  default,
  warn,
  error
}

export interface Logger {
  debug(...msgs: any[]): void;
  log(...msgs: any[]): void;
  warn(...msgs: any[]): void;
  error(...msgs: any[]): void;
}
