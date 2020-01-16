import { Builder, BuilderOptions } from '@zed-builder/core';
import * as webpack from 'webpack';

export interface WebpackBuilderConfig {
  entry: webpack.Entry | webpack.EntryFunc;
}

export type WebpackBuilderOptions = BuilderOptions<WebpackBuilderConfig>;

export interface WebpackBuilder extends Builder<WebpackBuilderConfig> {
  provideWebpack(factory: WebpackFactory): void;
}

export type WebpackFactory = () => typeof webpack | Promise<typeof webpack>;
