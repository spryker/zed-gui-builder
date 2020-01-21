import { assert } from './assert';

export function assertDefined<T>(
  value: T | undefined,
  msg = 'Expected value to be defined!'
): asserts value is T {
  return assert(value !== undefined, msg);
}
