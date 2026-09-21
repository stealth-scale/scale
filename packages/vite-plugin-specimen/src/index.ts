/**
 * Indexes specimen files from their source, so a catalogue lists every page without loading one.
 *
 * @remarks
 *   The plugin parses each specimen for the metadata it declares and serves a module holding that
 *   metadata beside a dynamic import per page, with a second module carrying each scene's source
 *   and, where a repository asks, a third carrying what the page's components accept.
 *   `@stealthscale/vite-config-specimen` states the plugin as a layer and supplies the lint rules a
 *   specimen file is held to. `@stealthscale/vite-plugin-specimen/client` declares what the modules
 *   export.
 * @packageDocumentation
 */

export { type Reading } from "#anatomy/reading.ts";
export {
  type Anatomy,
  type Dropped,
  type Entry,
  type Indexed,
  type Kind,
  type Member,
  type Prop,
  type Read,
  type Refused,
  type Source,
} from "#contract.ts";
export { ID, type Options, PROPS, UPDATED } from "#options.ts";
export { specimens } from "#plugin.ts";
export { isRefused, read } from "#read.ts";
