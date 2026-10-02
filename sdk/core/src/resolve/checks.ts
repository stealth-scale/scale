/**
 * Runs the checks that resolve no declaration: the identities, the requirements and the
 * references first, and the configurations, the words and the manifests last.
 */

import { checkConfig } from "#resolve/config.ts";
import { type ResolveContext } from "#resolve/context.ts";
import { checkIdentity } from "#resolve/identity.ts";
import { checkManifests } from "#resolve/manifests.ts";
import { type Report } from "#resolve/problem.ts";
import { checkReferences } from "#resolve/references.ts";
import { checkRequirements } from "#resolve/requirements.ts";
import { checkWords } from "#resolve/words.ts";

/**
 * Checks every plugin's identity, its requirements and every reference.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param report - The report the faults go into.
 */
export function checkFirst(context: ResolveContext, report: Report): void {
  checkIdentity(context, report);
  checkRequirements(context, report);
  checkReferences(context, report);
}

/**
 * Checks every plugin's configuration, every catalogue key and every manifest.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param report - The report the faults go into.
 */
export function checkLast(context: ResolveContext, report: Report): void {
  checkConfig(context, report);
  checkWords(context, report);
  checkManifests(context, report);
}
