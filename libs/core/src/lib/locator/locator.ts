import { ProjectConfig } from '../config';

export type LocatorConfig = unknown;

export interface LocatorOptions<C = LocatorConfig> {
  project: ProjectConfig;
  config: C;
}

export interface Locator<C = LocatorConfig> {
  findEntries(rootPath: string, options: LocatorOptions<C>): Promise<string[]>;
}
