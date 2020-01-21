export interface PromiseWithError<T, E> extends Promise<T> {
  catch<TResult = never>(
    onrejected?:
      | ((reason: E) => TResult | PromiseLike<TResult>)
      | undefined
      | null
  ): Promise<T | TResult>;
}

export function reducePromises<T, R = T>(
  arr: T[],
  reducer: (acc: R, val: T, index: number, arr: T[]) => R | PromiseLike<R>,
  initialValue: R | PromiseLike<R>
): Promise<R> {
  return arr.reduce(
    (accPromise, val, i) => accPromise.then(acc => reducer(acc, val, i, arr)),
    Promise.resolve(initialValue)
  );
}
