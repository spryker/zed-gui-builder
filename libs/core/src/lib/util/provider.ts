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

const UNINITIALIZED = Symbol('UNINITIALIZED');

export function createProvider<T>(
  name: string,
  notProvidedMsg?: string,
  defaultValueFactory?: () => T
): Provider<T> {
  let _value: T | typeof UNINITIALIZED = UNINITIALIZED;

  return {
    provide(value) {
      _value = value;
    },
    get() {
      if (_value !== UNINITIALIZED) {
        return _value;
      }

      if (defaultValueFactory) {
        return defaultValueFactory();
      }

      throw new ValueNotProvidedError(name, notProvidedMsg);
    },
    reset() {
      _value = UNINITIALIZED;
    }
  };
}
