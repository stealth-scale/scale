/**
 * Provides the primitives that serve a keyboard or assistive technology and nothing else: content
 * announced but never painted, a single tab stop across a set of controls, and a link past the
 * navigation. Each component binds a recipe a theme can extend and ships no appearance of its own.
 * An application installs the recipes through the preset at `./theme` and imports the components
 * from here.
 *
 * @packageDocumentation
 */

export * as RovingFocus from "#roving-focus/index.ts";
export * as SkipNav from "#skip-nav/index.ts";
export * from "#visually-hidden/index.ts";
