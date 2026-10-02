/**
 * Finds every catalogue an application can reach, types their keys, and serves `virtual:i18n`.
 *
 * @packageDocumentation
 */

export { type Problem, problems } from "#check.ts";
export {
  type CatalogueIndex,
  cataloguesModule,
  ID,
  indexed,
  type Pair,
  pairId,
  pairOfId,
  type Words,
} from "#emit.ts";
export { type Catalogue, found, LOCALES } from "#find.ts";
export {
  type CataloguesApi,
  cataloguesOf,
  type Changed,
  EVENT,
  i18n,
  type Options,
} from "#plugin.ts";
export { declared, FOUNDATION } from "#typegen.ts";
