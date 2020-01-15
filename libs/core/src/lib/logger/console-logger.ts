/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger } from './logger';

function getConsoleBridge(): new () => Console {
  return function ConsoleBridge() {
    return console;
  } as any;
}

export class ConsoleLogger extends getConsoleBridge() implements Logger {}
