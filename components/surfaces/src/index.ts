/**
 * Publishes this package's panelled surfaces. Each binds a recipe a theme can extend and applies no
 * styling of its own. An application's style compiler picks those recipes up from the preset at
 * `./theme`; the components themselves come through this entry point, a component built from parts
 * as a namespace such as `Card.Root`.
 *
 * @packageDocumentation
 */

export * as Card from "#card/index.ts";
