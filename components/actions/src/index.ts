/**
 * Publishes what a person presses: the button, the square button that holds one glyph, and the
 * clipboard whose trigger copies a value. Each component binds a recipe a theme can extend and
 * draws nothing of its own. The recipes reach an application's compiler through the preset under
 * `./theme`, and the components reach its bundle through here.
 *
 * @packageDocumentation
 */

export * from "#button/index.ts";
export * as Clipboard from "#clipboard/index.ts";
