import { BuilderConfig, getBuilder } from './builder';
import { InvalidConfigError, maybeValidate, ProjectConfig } from './config';
import { getLocator, LocatorConfig } from './locator';
import { getLogger, LogLevel } from './logger';

export interface BuildOptions {
  project: ProjectConfig;
  locator?: LocatorConfig;
  builder?: BuilderConfig;
  logLevel?: LogLevel;
}

export async function execBuild(options: BuildOptions): Promise<void> {
  const logger = getLogger(options.logLevel);
  const locator = getLocator();
  const builder = getBuilder();

  try {
    maybeValidate(locator, options.locator, options.project);
    maybeValidate(builder, options.builder, options.project);
  } catch (e) {
    if (e instanceof InvalidConfigError) {
      throw new Error(`Configuration is not valid: ${e}`);
    }

    throw new Error(`Unexpected error occurred during config validation: ${e}`);
  }

  logger.log(`Locating entry points in ${options.project.rootPath}...`);

  const entries = await locator.findEntries(options.project.rootPath, {
    project: options.project,
    config: options.locator,
    logger
  });

  logger.log(`Building entries into ${options.project.outputPath}....`);

  await builder.buildWithEntries(entries, options.project.outputPath, {
    project: options.project,
    config: options.builder,
    logger
  });

  logger.log(`Build completed!`);
}
