/**
 * Generates the styling runtime of a design system and compiles the stylesheet of an application.
 *
 * @packageDocumentation
 */

export {
  LAYER_DECLARATION,
  type Options,
  type RuntimeOptions,
  SEPARATOR,
  THEME_ATTRIBUTE,
} from "#options.ts";
export { type Extension, type Extensions, type Switchable, type SwitchablePreset } from "#scope.ts";
export { type Application, type Theme } from "#statement.ts";
export * as theme from "#theme/index.ts";
export { type Generator } from "#theme/runtime.ts";
