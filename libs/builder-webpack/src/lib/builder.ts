import * as webpack from 'webpack';

import { Builder, BuilderOptions } from '@zed-builder/core';

export interface WebpackBuilderConfig {
  entry?: webpack.Entry | webpack.EntryFunc;
}

export type WebpackBuilderOptions = BuilderOptions<WebpackBuilderConfig>;

export interface WebpackBuilder extends Builder<WebpackBuilderConfig> {
  provideWebpack(factory: WebpackFactory): void;
}

export type WebpackFactory = () => typeof webpack | Promise<typeof webpack>;
