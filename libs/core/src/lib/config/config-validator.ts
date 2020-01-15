import { ProjectConfig } from './project';

export interface ConfigValidator<C = unknown> {
  validateConfig(
    config: unknown,
    projectConfig: ProjectConfig
  ): asserts config is C;
}

export function isConfigValidator<C>(obj: unknown): obj is ConfigValidator<C> {
  return !!obj && typeof (obj as ConfigValidator).validateConfig === 'function';
}

export class InvalidConfigError extends Error {}

export function maybeValidate<T extends ConfigValidator, C>(
  obj: T,
  config: C,
  projectConfig: ProjectConfig
): asserts config is C;
export function maybeValidate<T, C>(
  obj: T,
  config: C,
  projectConfig: ProjectConfig
): void;
export function maybeValidate<T, C>(
  obj: T,
  config: C,
  projectConfig: ProjectConfig
) {
  if (isConfigValidator<C>(obj)) {
    const validator: ConfigValidator<C> = obj; // <-- Workaround for https://github.com/microsoft/TypeScript/pull/33622
    return validator.validateConfig(config, projectConfig);
  }
}
