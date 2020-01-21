import { Configuration } from 'webpack';

import {
  WebpackBuilder,
  WebpackBuilderConfigurator,
  WebpackFactory
} from '@zed-builder/builder-webpack';

import { NgWebpackBuilder, NgWebpackBuilderOptions } from './builder';
import { assertDefined } from './util/assert-defined';

export interface NgCliConfigStrategy {
  extract(
    outputPath: string,
    options: NgWebpackBuilderOptions
  ): Configuration | Promise<Configuration>;
}

export interface NgCliMergeStrategy {
  merge(
    baseConfig: Configuration,
    ngCliConfig: Configuration,
    options: NgWebpackBuilderOptions
  ): Configuration;
}

export class GenericNgWebpackBuilder implements NgWebpackBuilder {
  private ngCliConfigStrategy: NgCliConfigStrategy | undefined;
  private ngCliMergeStrategy: NgCliMergeStrategy | undefined;

  constructor(
    private webpackBuilder: WebpackBuilder,
    private webpackConfigurator: WebpackBuilderConfigurator
  ) {}

  useConfigStrategy(strategy: NgCliConfigStrategy) {
    this.ngCliConfigStrategy = strategy;
  }

  useMergeStrategy(strategy: NgCliMergeStrategy) {
    this.ngCliMergeStrategy = strategy;
  }

  provideWebpack(factory: WebpackFactory): void {
    this.webpackBuilder.provideWebpack(factory);
  }

  async buildWithEntries(
    entries: string[],
    outputPath: string,
    options: NgWebpackBuilderOptions
  ): Promise<void> {
    assertDefined(
      this.ngCliConfigStrategy,
      `GenericNgWebpackBuilder: NgCliConfigStrategy was not provided!`
    );
    assertDefined(
      this.ngCliMergeStrategy,
      `GenericNgWebpackBuilder: NgCliMergeStrategy was not provided!`
    );

    const logger = options.logger;

    logger.log(`Getting NG CLI Webpack configuration...`);

    const ngCliConfig = await this.ngCliConfigStrategy.extract(
      outputPath,
      options
    );

    logger.debug(`NG CLI Webpack configuration:`, ngCliConfig);

    this.webpackConfigurator.addConfigurator(baseConfig => {
      logger.log(`Merging base Webpack config with NG CLI Webpack config...`);

      return this.ngCliMergeStrategy!.merge(baseConfig, ngCliConfig, options);
    });

    return this.webpackBuilder.buildWithEntries(entries, outputPath, options);
  }
}
