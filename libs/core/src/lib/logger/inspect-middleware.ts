import { inspect, InspectOptions } from 'util';

import { LoggerFn } from './logger';

/**
 * Wraps msgs that are objects in `inspect()` calls for better debugging
 */
export function inspectMsgs(
  opts: InspectOptions,
  msgs: readonly unknown[]
): unknown[] {
  return msgs.map(msg => (typeof msg === 'object' ? inspect(msg, opts) : msg));
}

/**
 * Create an inspectable log function
 * @see inspectLog()
 */
export function inspectableLog(
  logFn: LoggerFn,
  opts: InspectOptions = {}
): LoggerFn {
  return (...msgs) => logFn(...inspectMsgs(opts, msgs));
}
