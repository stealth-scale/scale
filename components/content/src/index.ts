/**
 * Provides the components that present a body of material to read, starting with source code and
 * extending later to markdown, diffs and documents. Each one binds a recipe a theme can extend and
 * ships no appearance of its own. An application installs the recipes through the preset at
 * `./theme` and imports the components from here. A component made of parts is exported as a
 * namespace, so a caller writes `CodeBlock.Root`.
 *
 * @packageDocumentation
 */

export * as CodeBlock from "#code-block/index.ts";
