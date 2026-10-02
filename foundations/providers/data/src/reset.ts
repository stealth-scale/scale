/**
 * Removes the previous subject's data when the signed-in person or the tenant changes.
 */

import { type QueryClient } from "@tanstack/react-query";

/**
 * Cancels every fetch, and removes all cached data and every paused mutation.
 *
 * @remarks
 *   A paused mutation is removed rather than sent, because it would run with the next person's
 *   token. The library resumes only the mutations its cache lists, so a removed one never runs. The
 *   cache keys contain no tenant, so the reset is what keeps one subject's data from rendering for
 *   another.
 * @param client - The data client of the subject that changed.
 * @returns A promise that settles once every fetch stopped and both caches are empty.
 */
export async function resetData(client: QueryClient): Promise<void> {
  await client.cancelQueries();

  client.clear();
}
