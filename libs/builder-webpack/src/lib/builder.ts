import * as webpack from 'webpack';

import { Builder, BuilderOptions } from '@zed-builder/core';

export interface WebpackBuilderConfig {
  entry?: string | string[] | webpack.Entry | webpack.EntryFunc;
}

export type WebpackBuilderOptions = BuilderOptions<WebpackBuilderConfig>;

export interface WebpackBuilder<
  C extends WebpackBuilderConfig = WebpackBuilderConfig
> extends Builder<C> {
  provideWebpack(factory: WebpackFactory): void;
}

export type WebpackFactory = () => typeof webpack | Promise<typeof webpack>;
