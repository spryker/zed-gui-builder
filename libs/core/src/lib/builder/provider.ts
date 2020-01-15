import { createProvider } from '../util/provider';
import { Builder } from './builder';

const builderProvider = createProvider<Builder>(
  'Builder',
  `Use 'provideBuilder()' function!`
);

export const provideBuilder = builderProvider.provide;

export const getBuilder = builderProvider.get;

export const resetBuilder = builderProvider.reset;
