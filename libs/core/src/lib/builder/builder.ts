import { ProjectConfig } from '../config';

export type BuilderConfig = unknown;

export interface BuilderOptions<C = BuilderConfig> {
  project: ProjectConfig;
  config: C;
}

export interface Builder<C = BuilderConfig> {
  buildWithEntries(
    entries: string[],
    outputPath: string,
    options: BuilderOptions<C>
  ): Promise<void>;
}
