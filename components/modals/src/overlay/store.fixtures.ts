/**
 * Fixtures for the store specs: the state a promise is in after the microtasks queued before the
 * read.
 */

/**
 * Returns whether a promise has settled once every microtask queued before the call has run.
 *
 * @param promise - The promise under test.
 * @returns `settled` when the promise settled first, and `pending` otherwise.
 */
export async function stateOf(promise: Promise<unknown>): Promise<"pending" | "settled"> {
  const pending = Symbol("pending");
  const first = await Promise.race([promise, Promise.resolve(pending)]);

  return first === pending ? "pending" : "settled";
}
