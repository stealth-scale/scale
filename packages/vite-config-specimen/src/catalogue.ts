/**
 * Collects the layers an application that shows a catalogue extends its tier with.
 */

import { type Layer } from "@stealthscale/vite-config-core";

import { crawled } from "#crawled.ts";
import { indexed } from "#indexed.ts";
import { type Options } from "#types.ts";

/**
 * Returns the index layer and the crawl layers, in the order they run.
 *
 * @remarks
 *   An array and not a tier, because a catalogue is an ordinary application first: it picks the
 *   tier its framework calls for, and these layers extend it.
 * @param stated - Where the specimens are. `Options` documents every member.
 */
export function catalogue(stated: Options): readonly Layer[] {
  return [indexed(stated), ...crawled(stated.patterns)];
}
