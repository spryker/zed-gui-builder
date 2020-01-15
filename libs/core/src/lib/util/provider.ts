export interface Provider<T> {
  provide(value: T): void;
  get(): T;
  reset(): void;
}

export class ValueNotProvidedError extends Error {
  constructor(name: string, extraMsg = '') {
    super(`Could not get ${name}!
    Please provide it first!
    ${extraMsg}`);
  }
}

export function createProvider<T>(
  name: string,
  notProvidedMsg?: string,
  defaultValue?: T
): Provider<T> {
  let _value: T | undefined = defaultValue;

  return {
    provide(value) {
      _value = value;
    },
    get() {
      if (!_value) {
        throw new ValueNotProvidedError(name, notProvidedMsg);
      }

      return _value;
    },
    reset() {
      _value = undefined;
    }
  };
}
