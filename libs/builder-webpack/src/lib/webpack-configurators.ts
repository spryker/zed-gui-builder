import * as webpack from 'webpack';
import * as webpackMerge from 'webpack-merge';

import { WebpackConfigurator } from './configurator';

export function webpackAppendRules(
  rules: webpack.RuleSetRule[]
): WebpackConfigurator {
  return config =>
    webpackMerge.strategy({ 'module.rules': 'append' })(config, {
      module: { rules }
    });
}

export function webpackAppendPlugins(
  plugins: webpack.Plugin[]
): WebpackConfigurator {
  return config =>
    webpackMerge.strategy({ plugins: 'append' })(config, { plugins });
}

export function webpackAppendEntry(
  entry?: string | string[] | webpack.Entry | webpack.EntryFunc
): WebpackConfigurator {
  return config =>
    webpackMerge.strategy({ plugins: 'append' })(config, { entry });
}
