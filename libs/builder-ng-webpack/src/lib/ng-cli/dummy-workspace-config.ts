import { Configuration } from 'webpack';
import * as webpackMerge from 'webpack-merge';

import { NgWebpackBuilderOptions } from '../builder';
import { NgCliConfigStrategy } from '../generic-ng-webpack-builder';

import {
  createWorkspace,
  getAngularCliParts,
  getCliWebpackConfigOptions
} from './ng-cli';

export class DummyWorkspaceConfigStrategy implements NgCliConfigStrategy {
  private static PROJECT = 'dummy-project';
  private static BUILD = 'dummy-build';

  extract(
    outputPath: string,
    options: NgWebpackBuilderOptions
  ): Configuration | Promise<Configuration> {
    const logger = options.logger;

    logger.log(`Getting NG CLI Webpack configuration...`);
    logger.debug(`Generating dummy workspace to extract NG CLI config...`);

    const workspace = createWorkspace(
      DummyWorkspaceConfigStrategy.PROJECT,
      DummyWorkspaceConfigStrategy.BUILD,
      { root: options.project.rootPath },
      { builder: '@angular-devkit/build-angular:browser' }
    );

    // We manually create a Dummy Workspace - so project always exists!
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const project = workspace.projects.get(
      DummyWorkspaceConfigStrategy.PROJECT
    )!;
    const buildOptions = project?.targets.get(
      DummyWorkspaceConfigStrategy.BUILD
    )?.options;

    logger.debug(`Preparing NG CLI Webpack options...`);

    const cliWebpackConfigOptions = getCliWebpackConfigOptions(
      project,
      outputPath,
      buildOptions
    );

    logger.debug(`Extracting NG CLI Webpack config...`);

    const { cliCommonConfig, cliStyleConfig } = getAngularCliParts(
      cliWebpackConfigOptions
    );

    logger.debug(`Got NG CLI Webpack config:`);
    logger.debug(`Common:`, cliCommonConfig);
    logger.debug(`Styles:`, cliStyleConfig);

    return webpackMerge(cliCommonConfig, cliStyleConfig);
  }
}
