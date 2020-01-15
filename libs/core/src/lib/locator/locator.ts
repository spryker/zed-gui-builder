import { ProjectConfig } from '../config';
import { Logger } from '../logger';

export type LocatorConfig = unknown;

export interface LocatorOptions<C = LocatorConfig> {
  project: ProjectConfig;
  config: C;
  logger: Logger;
}

export interface Locator<C = LocatorConfig> {
  findEntries(rootPath: string, options: LocatorOptions<C>): Promise<string[]>;
}
