import { createProvider } from '../util/provider';
import { ConsoleLogger } from './console-logger';
import { Logger } from './logger';

const loggerProvider = createProvider<Logger>(
  'Logger',
  `Use 'provideLogger()'!`,
  new ConsoleLogger()
);

export const provideLogger = loggerProvider.provide;

export const getLogger = loggerProvider.get;
