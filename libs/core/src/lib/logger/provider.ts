import { createProvider } from '../util/provider';
import { ConsoleLogger } from './console-logger';
import { Logger, LogLevel } from './logger';

const loggerProvider = createProvider<Logger>(
  'Logger',
  `Use 'provideLogger()'!`,
  new ConsoleLogger()
);

export const provideLogger = loggerProvider.provide;

const noop = () => void null;

export const getLogger = (logLevel: LogLevel = LogLevel.debug) => {
  const logger = loggerProvider.get();

  if (logLevel > LogLevel.debug) {
    logger.debug = noop;
  }

  if (logLevel > LogLevel.default) {
    logger.log = noop;
  }

  if (logLevel > LogLevel.warn) {
    logger.warn = noop;
  }

  return logger;
};
