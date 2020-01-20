import * as webpackMerge from 'webpack-merge';

import {
  createWebpackBuilder,
  WebpackBuilder,
  WebpackBuilderConfigurator,
  WebpackFactory
} from '@zed-builder/builder-webpack';

import { NgWebpackBuilder, NgWebpackBuilderOptions } from './builder';
import {
  createWorkspace,
  getAngularCliParts,
  getCliWebpackConfigOptions
} from './ng-cli';

export class NgWebpackBuilderImpl implements NgWebpackBuilder {
  constructor(
    private webpackBuilder: WebpackBuilder,
    private webpackConfigurator: WebpackBuilderConfigurator
  ) {}

  provideWebpack(factory: WebpackFactory): void {
    this.webpackBuilder.provideWebpack(factory);
  }

  async buildWithEntries(
    entries: string[],
    outputPath: string,
    options: NgWebpackBuilderOptions
  ): Promise<void> {
    const DUMMY_PROJECT = 'dummy-project';
    const DUMMY_PROJECT_BUILD = 'dummy-build';

    const workspace = createWorkspace(
      DUMMY_PROJECT,
      DUMMY_PROJECT_BUILD,
      { root: options.project.rootPath },
      { builder: '@angular-devkit/build-angular:browser' }
    );

    // We manually create a Dummy Workspace - so project always exists!
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const project = workspace.projects.get(DUMMY_PROJECT)!;
    const buildOptions = project?.targets.get(DUMMY_PROJECT_BUILD)?.options;

    const cliWebpackConfigOptions = getCliWebpackConfigOptions(
      project,
      outputPath,
      buildOptions
    );

    const { cliCommonConfig, cliStyleConfig } = getAngularCliParts(
      cliWebpackConfigOptions
    );

    this.webpackConfigurator.addConfigurator(baseConfig => {
      return webpackMerge.strategy({
        'module.rules': 'prepend',
        plugins: 'prepend',
        'resolve.modules': 'append',
        resolveLoader: 'replace'
      })(baseConfig, {
        module: { rules: [...cliStyleConfig.module.rules] },
        plugins: [
          ...cliStyleConfig.plugins,
          ...(cliCommonConfig.plugins || [])
        ],
        resolve: { modules: cliCommonConfig?.resolve?.modules },
        resolveLoader: cliCommonConfig.resolveLoader
      });
    });

    return this.webpackBuilder.buildWithEntries(entries, outputPath, options);
  }
}

export function createNgWebpackBuilder(): {
  builder: NgWebpackBuilder;
  configurator: WebpackBuilderConfigurator;
} {
  const webpackBuilder = createWebpackBuilder();
  const ngWebpackBuilder = new NgWebpackBuilderImpl(
    webpackBuilder.builder,
    webpackBuilder.configurator
  );

  return {
    builder: ngWebpackBuilder,
    configurator: webpackBuilder.configurator
  };
}
