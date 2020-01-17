import { WebpackBuilder } from './builder';
import { ConfigurableWebpackBuilder } from './configurable-webpack-builder';
import { WebpackBuilderConfigurator } from './configurator';

export function createWebpackBuilder(): {
  builder: WebpackBuilder;
  configurator: WebpackBuilderConfigurator;
} {
  const builder = new ConfigurableWebpackBuilder();

  return {
    builder,
    configurator: builder
  };
}
