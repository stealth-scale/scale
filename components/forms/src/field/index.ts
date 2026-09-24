/**
 * Exports the field's parts, composed as `Field.Root` around a label, a control and the texts under
 * the control, and the hook that reads the field's state.
 */

export { Control, type ControlProps } from "#field/control.tsx";
export { Counter, type CounterProps } from "#field/counter.tsx";
export { ErrorText, type ErrorTextProps } from "#field/error-text.tsx";
export { HelperText, type HelperTextProps } from "#field/helper-text.tsx";
export { Label, type LabelProps } from "#field/label.tsx";
export { RequiredIndicator, type RequiredIndicatorProps } from "#field/required-indicator.tsx";
export { Root, type RootProps } from "#field/root.tsx";
export { type FieldState, useField } from "#field/state.ts";
export { Textarea, type TextareaProps } from "#field/textarea.tsx";
