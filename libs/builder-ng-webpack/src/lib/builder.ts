import {
  WebpackBuilder,
  WebpackBuilderConfig
} from '@zed-builder/builder-webpack';
import { BuilderOptions } from '@zed-builder/core';

export interface NgWebpackBuilderConfig extends WebpackBuilderConfig {
  workspaceFile?: string[];
}

export type NgWebpackBuilderOptions = BuilderOptions<NgWebpackBuilderConfig>;

export type NgWebpackBuilder<
  C extends NgWebpackBuilderConfig = NgWebpackBuilderConfig
> = WebpackBuilder<C>;
