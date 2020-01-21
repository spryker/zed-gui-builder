import { Logger } from './logger';

function getConsoleBridge(): new () => Console {
  return function ConsoleBridge() {
    return console;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

export class ConsoleLogger extends getConsoleBridge() implements Logger {}
