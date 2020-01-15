/* eslint-disable @typescript-eslint/no-empty-function */
import { Logger } from '../src/lib/logger';

export class NoopLogger implements Logger {
  debug(): void {}
  log(): void {}
  warn(): void {}
  error(): void {}
}
