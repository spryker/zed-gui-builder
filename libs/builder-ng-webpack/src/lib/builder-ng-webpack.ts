import {
  createWebpackBuilder,
  WebpackBuilderConfigurator
} from '@zed-builder/builder-webpack';

import { NgWebpackBuilder } from './builder';
import { GenericNgWebpackBuilder } from './generic-ng-webpack-builder';
import { AppendConfigStrategy } from './ng-cli/append-config';
import { DummyWorkspaceConfigStrategy } from './ng-cli/dummy-workspace-config';

export function createNgWebpackBuilder(): {
  builder: NgWebpackBuilder;
  configurator: WebpackBuilderConfigurator;
} {
  const webpackBuilder = createWebpackBuilder();

  const genericNgBuilder = new GenericNgWebpackBuilder(
    webpackBuilder.builder,
    webpackBuilder.configurator
  );

  genericNgBuilder.useConfigStrategy(new DummyWorkspaceConfigStrategy());
  genericNgBuilder.useMergeStrategy(new AppendConfigStrategy());

  return {
    builder: genericNgBuilder,
    configurator: webpackBuilder.configurator
  };
}
