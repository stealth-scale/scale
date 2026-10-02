/**
 * Exports the text components: paragraph, heading, inline runs, code, keycaps, list, quotation and
 * the marked matches of a search. Each component binds a recipe that a theme extends, and the
 * preset under `./theme` registers the recipes with an application's compiler. A component with
 * parts is a namespace, such as `Kbd.Root` and `List.Item`.
 *
 * @packageDocumentation
 */

export * as Blockquote from "#blockquote/index.ts";
export * from "#code/index.ts";
export * from "#em/index.ts";
export * from "#heading/index.ts";
export * from "#highlight/index.ts";
export * from "#icon/index.ts";
export * as Kbd from "#kbd/index.ts";
export * as List from "#list/index.ts";
export * from "#mark/index.ts";
export * from "#quote/index.ts";
export * from "#span/index.ts";
export * from "#strong/index.ts";
export * from "#text/index.ts";
