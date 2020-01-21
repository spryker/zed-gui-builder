/* eslint-disable @typescript-eslint/no-explicit-any */

function assertAsyncCallback(
  cbDelegate: (cb: jest.Mock<any, any>) => void,
  expected?: any,
  delay = 0
) {
  const callback = jest.fn();
  cbDelegate(callback);
  setTimeout(() => {
    if (expected !== undefined) {
      expect(callback).toHaveBeenCalledWith(expected);
    } else {
      expect(callback).toHaveBeenCalled();
    }
  }, delay);
}

export function expectResolved<T, E = T>(
  promise: Promise<T>,
  expected?: E,
  delay = 0
) {
  assertAsyncCallback(cb => promise.then(cb), expected, delay);
}

export function expectRejected<T, E = T>(
  promise: Promise<T>,
  expected?: E,
  delay = 0
) {
  assertAsyncCallback(cb => promise.catch(cb), expected, delay);
}
