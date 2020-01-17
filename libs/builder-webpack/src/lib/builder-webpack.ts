import { inspect } from 'util';
import * as webpack from 'webpack';
import * as webpackMerge from 'webpack-merge';

import {
  WebpackBuilder,
  WebpackBuilderOptions,
  WebpackFactory
} from './builder';
import {
  WebpackBuilderConfigurator,
  WebpackConfigurator
} from './configurator';
import { runCompiler } from './util/async-webpack';

export class ConfigurableWebpackBuilder
  implements WebpackBuilder, WebpackBuilderConfigurator {
  private configurators: WebpackConfigurator[] = [];
  private webpackFactory: WebpackFactory = () => webpack;

  addRule(rule: webpack.RuleSetRule): this {
    return this.addConfigurator(config => {
      return webpackMerge.strategy({ 'module.rules': 'append' })(config, {
        module: { rules: [rule] }
      });
    });
  }

  addPlugin(plugin: webpack.Plugin): this {
    return this.addConfigurator(config => {
      return webpackMerge.strategy({ plugins: 'append' })(config, {
        plugins: [plugin]
      });
    });
  }

  addConfigurator(configurator: WebpackConfigurator): this {
    this.configurators.push(configurator);
    return this;
  }

  provideWebpack(factory: WebpackFactory): void {
    this.webpackFactory = factory;
  }

  async buildWithEntries(
    entries: string[],
    outputPath: string,
    options: WebpackBuilderOptions
  ): Promise<void> {
    const logger = options.logger;

    logger.log(`Resolving Webpack config...`);

    const config = await this.resolveConfig(entries, outputPath, options);

    logger.log(`Resolved Webpack config!`);
    logger.debug(`Config: ${inspect(config)}`);

    logger.debug(`Creating Webpack Compiler from config...`);

    const webpack = await this.webpackFactory();
    const compiler = webpack(config);

    logger.debug(`Created Webpack Compiler from config!`);

    logger.log(`Running Webpack Compiler...`);

    await runCompiler(compiler);

    logger.log(`Compilation completed!`);
  }

  private async resolveConfig(
    entries: string[],
    outputPath: string,
    options: WebpackBuilderOptions
  ): Promise<webpack.Configuration> {
    const logger = options.logger;
    const initialConfig = webpackMerge.strategy({ entry: 'append' })(
      { entry: entries, output: { path: outputPath } },
      { entry: options.config.entry }
    );

    logger.debug(`Initial Webpack config: ${inspect(initialConfig)}`);

    logger.debug(`Resolving Webpack config from configurators...`);
    logger.debug(`Executing ${this.configurators.length} configurator(s)`);

    const config = await this.configurators.reduce(
      (prevConfig, configurator) =>
        prevConfig.then(c => configurator(c, options)),
      Promise.resolve(initialConfig)
    );

    logger.debug(`Resolved Webpack config from configurators!`);
    logger.debug(`Config after configurators: ${inspect(config)}`);

    return config;
  }
}

export function createBuilder(): {
  builder: WebpackBuilder;
  configurator: WebpackBuilderConfigurator;
} {
  const builder = new ConfigurableWebpackBuilder();

  return {
    builder,
    configurator: builder
  };
}
