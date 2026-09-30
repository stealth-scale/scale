/**
 * Provides the components that take over the page until a user deals with them: a command palette,
 * a dialog, a drawer and a tour, and `createOverlay`, which opens a dialog or a drawer from code.
 * Each component binds a recipe a theme can extend and ships no appearance of its own. An
 * application installs the recipes through the preset at `./theme` and imports the components
 * from here.
 *
 * @packageDocumentation
 */

export * as Command from "#command/index.ts";
export * as Dialog from "#dialog/index.ts";
export * as Drawer from "#drawer/index.ts";
export * from "#overlay/index.ts";
export * as Tour from "#tour/index.ts";
