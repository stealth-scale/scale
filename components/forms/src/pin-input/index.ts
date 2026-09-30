/**
 * Exports the pin input's parts, composed as `PinInput.Root` around its label and a control that
 * contains one input per character, and the types its callbacks receive.
 */

export { Control, type ControlProps } from "#pin-input/control.tsx";
export { Input, type InputProps } from "#pin-input/input.tsx";
export { Label, type LabelProps } from "#pin-input/label.tsx";
export { type ValueChangeDetails, type ValueInvalidDetails } from "#pin-input/machine.ts";
export { Root, type RootProps } from "#pin-input/root.tsx";
