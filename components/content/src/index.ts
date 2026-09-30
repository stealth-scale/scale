/**
 * Provides `CodeBlock`, which renders a passage of source code, terminal output or the diff of two
 * versions, `JsonTreeView`, which renders a JSON value as a tree, `Markdown`, which renders a
 * Markdown document with the library's components, and `Marquee`, which moves a strip of items in a
 * loop. Each takes its whole appearance from a recipe a theme can extend. An application installs
 * the recipes through the preset at `./theme` and imports the components from here. A component
 * made of parts is exported as a namespace, so a caller writes `CodeBlock.Root`.
 *
 * @packageDocumentation
 */

export * as CodeBlock from "#code-block/index.ts";
export * as JsonTreeView from "#json-tree-view/index.ts";
export * from "#markdown/index.ts";
export * as Marquee from "#marquee/index.ts";
