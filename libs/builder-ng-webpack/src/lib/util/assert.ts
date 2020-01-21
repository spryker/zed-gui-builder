export function assert(
  expr: unknown,
  msg = 'Expected expression to be truthy'
): asserts expr {
  if (!expr) {
    throw new Error(msg);
  }
}
