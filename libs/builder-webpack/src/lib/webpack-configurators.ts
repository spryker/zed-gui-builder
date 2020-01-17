import * as webpack from 'webpack';
import * as webpackMerge from 'webpack-merge';

import { WebpackConfigurator } from './configurator';

const APPEND_RULES = webpackMerge.strategy({ 'module.rules': 'append' });
const APPEND_PLUGINS = webpackMerge.strategy({ plugins: 'append' });
const APPEND_ENTRY = webpackMerge.strategy({ entry: 'append' });

export function webpackAppendRules(
  rules: webpack.RuleSetRule[]
): WebpackConfigurator {
  return config => APPEND_RULES(config, { module: { rules } });
}

export function webpackAppendPlugins(
  plugins: webpack.Plugin[]
): WebpackConfigurator {
  return config => APPEND_PLUGINS(config, { plugins });
}

export function webpackAppendEntry(
  entry?: string | string[] | webpack.Entry | webpack.EntryFunc
): WebpackConfigurator {
  return config => APPEND_ENTRY(config, { entry });
}
