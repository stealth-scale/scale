/**
 * Publishes this package's interactive components. Each binds a recipe a theme can extend and
 * applies no styling of its own. An application's style compiler picks those recipes up from the
 * preset at `./theme`; the components themselves come through this entry point.
 *
 * @packageDocumentation
 */

export * from "#button/index.ts";
export * as Clipboard from "#clipboard/index.ts";
