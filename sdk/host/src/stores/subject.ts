/**
 * Names the subject a person's stored choices belong to.
 */

import { subjectOf } from "@stealthscale/sdk-core";
import { type SessionState } from "@stealthscale/sdk-plugin";

/**
 * Returns the subject a session's stored choices are kept under: its person and tenant, or
 * `anyone` for a session nobody signed in to.
 */
export function subjectFor({ session }: SessionState): string {
  return subjectOf(session) ?? "anyone";
}
