import { ProjectConfig } from '../config';
import { Logger } from '../logger';

export type BuilderConfig = unknown;

export interface BuilderOptions<C = BuilderConfig> {
  project: ProjectConfig;
  config: C;
  logger: Logger;
}

export interface Builder<C = BuilderConfig> {
  buildWithEntries(
    entries: string[],
    outputPath: string,
    options: BuilderOptions<C>
  ): Promise<void>;
}
