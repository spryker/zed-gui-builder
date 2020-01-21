import { Configuration } from 'webpack';
import * as webpackMerge from 'webpack-merge';

import { NgCliMergeStrategy } from '../generic-ng-webpack-builder';

export class AppendConfigStrategy implements NgCliMergeStrategy {
  merge(baseConfig: Configuration, ngCliConfig: Configuration): Configuration {
    return webpackMerge.strategy({
      entry: 'append',
      'module.rules': 'prepend',
      plugins: 'prepend',
      'resolve.modules': 'append',
      resolveLoader: 'replace'
    })(
      baseConfig,
      {
        entry: ngCliConfig.entry,
        module: { rules: ngCliConfig.module?.rules ?? [] },
        plugins: ngCliConfig.plugins,
        resolve: { modules: ngCliConfig.resolve?.modules },
        resolveLoader: ngCliConfig.resolveLoader
      },
      { entry: ngCliConfig.entry, plugins: ngCliConfig.plugins }
    );
  }
}
