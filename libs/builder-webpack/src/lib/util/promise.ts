export interface PromiseWithError<T, E> extends Promise<T> {
  catch<TResult = never>(
    onrejected?:
      | ((reason: E) => TResult | PromiseLike<TResult>)
      | undefined
      | null
  ): Promise<T | TResult>;
}
