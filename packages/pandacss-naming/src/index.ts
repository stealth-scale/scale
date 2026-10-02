/**
 * Rewrites the class names the Panda CSS compiler emits into one naming scheme for the stylesheet
 * and the runtime.
 *
 * @packageDocumentation
 */

export { atomicClass, conditionsOf, isAtomic } from "#atomic.ts";
export {
  type CompilerConfig,
  compoundClass,
  type Recipe,
  type Separator,
  slotClass,
  variantClass,
} from "#recipe.ts";
export { rename } from "#rename.ts";
export { kebab, sanitise } from "#sanitise.ts";
