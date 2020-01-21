/* eslint-disable @typescript-eslint/no-explicit-any */

export enum LogLevel {
  debug,
  default,
  warn,
  error
}

export type LoggerFn = (...msgs: unknown[]) => void;

export interface Logger {
  debug: LoggerFn;
  log: LoggerFn;
  warn: LoggerFn;
  error: LoggerFn;
}
