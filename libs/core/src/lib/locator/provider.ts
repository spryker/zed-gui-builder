import { createProvider } from '../util/provider';

import { Locator } from './locator';

const locatorProvider = createProvider<Locator>(
  'Locator',
  `Use 'provideLocator()' function!`
);

export const provideLocator = locatorProvider.provide;

export const getLocator = locatorProvider.get;

export const resetLocator = locatorProvider.reset;
