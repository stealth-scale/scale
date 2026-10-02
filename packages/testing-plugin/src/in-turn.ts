/**
 * Runs asynchronous steps one after another, for renders that share one document.
 */

/**
 * Runs the steps one after another, each once the step before it settled. A step that rejects
 * rejects the run, and no later step runs.
 */
export async function inTurn(steps: ReadonlyArray<() => Promise<void>>): Promise<void> {
  const [first, ...rest] = steps;

  if (first === undefined) return;

  await first();
  await inTurn(rest);
}
