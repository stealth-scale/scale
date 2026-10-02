/**
 * Exports the password input's parts, composed as `PasswordInput.Root` around its input and a
 * toggle that contains the indicator, and the type `onVisibilityChange` receives.
 */

export { Indicator, type IndicatorProps } from "#password-input/indicator.ts";
export { Input, type InputProps } from "#password-input/input.tsx";
export { type VisibilityChangeDetails } from "#password-input/machine.ts";
export { Root, type RootProps } from "#password-input/root.tsx";
export {
  VisibilityTrigger,
  type VisibilityTriggerProps,
} from "#password-input/visibility-trigger.tsx";
