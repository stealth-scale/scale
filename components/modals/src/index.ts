/**
 * Provides the components that take over the page until a user deals with them: a command palette
 * now, with dialogs, drawers and tours to follow. Each one binds a recipe a theme can extend and
 * ships no appearance of its own. An application installs the recipes through the preset at
 * `./theme` and imports the components from here.
 *
 * @packageDocumentation
 */

export * as Command from "#command/index.ts";
