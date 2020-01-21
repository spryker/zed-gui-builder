import { Architect } from '@angular-devkit/architect';
import { WorkspaceNodeModulesArchitectHost } from '@angular-devkit/architect/node';
import { WebpackConfigOptions } from '@angular-devkit/build-angular/src/angular-cli-files/models/build-options';
import {
  getCommonConfig,
  getStylesConfig
} from '@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs';
import {
  JsonObject,
  JsonValue,
  normalize,
  resolve,
  schema,
  workspaces
} from '@angular-devkit/core';
import { NodeJsAsyncHost } from '@angular-devkit/core/node';
import {
  ProjectDefinitionCollection,
  TargetDefinitionCollection
} from '@angular-devkit/core/src/workspace';

export function getCliWebpackConfigOptions(
  project: workspaces.ProjectDefinition,
  outputPath: string,
  options?: Record<string, JsonValue | undefined>
): WebpackConfigOptions {
  const assets = [options?.assets, project.root, project.sourceRoot];
  const projectRoot = normalize(project.root);

  const tsConfigPath = resolve(
    normalize(project.root),
    normalize(options?.tsConfig?.toString() ?? 'tsconfig.json')
  );
  // const tsConfig = getTsConfigOptions(tsConfigPath);
  const tsConfig = {
    options: {},
    raw: {},
    fileNames: [],
    errors: []
  };

  const budgets = options?.budgets || [];
  const scripts = options?.scripts || [];
  const styles = options?.styles || [];

  return ({
    root: project.root,
    projectRoot,
    tsConfigPath,
    tsConfig,
    supportES2015: false,
    buildOptions: {
      sourceMap: false,
      optimization: {},
      ...options,
      assets,
      budgets,
      scripts,
      styles,
      outputPath
    }
  } as unknown) as WebpackConfigOptions;
}

export function getAngularCliParts(
  cliWebpackConfigOptions: WebpackConfigOptions
) {
  try {
    return {
      cliCommonConfig: getCommonConfig(cliWebpackConfigOptions),
      cliStyleConfig: getStylesConfig(cliWebpackConfigOptions)
    };
  } catch (e) {
    throw new Error(`Failed to load the Angular CLI config!\n${e}`);
  }
}

export async function getWorkspace(
  path: string
): Promise<workspaces.WorkspaceDefinition> {
  const workspaceHost = workspaces.createWorkspaceHost(new NodeJsAsyncHost());
  const { workspace } = await workspaces.readWorkspace(path, workspaceHost);
  return workspace;
}

export function createWorkspace(
  project: string,
  target: string,
  projectDef: Omit<workspaces.ProjectDefinition, 'targets' | 'extensions'>,
  builderDef: workspaces.TargetDefinition
): workspaces.WorkspaceDefinition {
  return {
    extensions: {},
    projects: new ProjectDefinitionCollection({
      [project]: {
        extensions: {},
        ...projectDef,
        targets: new TargetDefinitionCollection({
          [target]: builderDef
        })
      }
    })
  };
}

export async function execArchitectBuilder(
  path: string,
  name: string,
  options: JsonObject
) {
  const workspace = await getWorkspace(path);

  const registry = new schema.CoreSchemaRegistry();
  registry.addPostTransform(schema.transforms.addUndefinedDefaults);

  const architectHost = new WorkspaceNodeModulesArchitectHost(
    workspace,
    __dirname
  );
  const architect = new Architect(architectHost, registry);

  return architect.scheduleBuilder(name, options);
}
