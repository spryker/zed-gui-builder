import { BuilderConfig, getBuilder } from './builder';
import { maybeValidate, ProjectConfig, InvalidConfigError } from './config';
import { getLocator, LocatorConfig } from './locator';

export interface BuildOptions {
  project: ProjectConfig;
  locator?: LocatorConfig;
  builder?: BuilderConfig;
}

export async function execBuild(options: BuildOptions): Promise<void> {
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

  console.log(`Locating entry points in ${options.project.rootPath}...`);

  const entries = await locator.findEntries(options.project.rootPath, {
    project: options.project,
    config: options.locator
  });

  console.log(`Building entries into ${options.project.outputPath}....`);

  await builder.buildWithEntries(entries, options.project.outputPath, {
    project: options.project,
    config: options.builder
  });

  console.log(`Build completed!`);
}
