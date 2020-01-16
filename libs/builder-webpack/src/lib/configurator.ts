import * as webpack from 'webpack';

import { WebpackBuilderOptions } from './builder';

export interface WebpackBuilderConfigurator {
  addRule(rule: webpack.Rule): this;
  addPlugin(plugin: webpack.Plugin): this;
  addConfigurator(configurator: WebpackConfigurator): this;
}

export type WebpackConfigurator = (
  config: webpack.Configuration,
  options: WebpackBuilderOptions
) => webpack.Configuration | Promise<webpack.Configuration>;
