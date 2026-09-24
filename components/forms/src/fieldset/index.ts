/**
 * Exports the fieldset's parts, composed as `Fieldset.Root` around a legend, the group's fields and
 * its texts, and the hook that reads the group's state.
 */

export { ErrorText, type ErrorTextProps } from "#fieldset/error-text.tsx";
export { HelperText, type HelperTextProps } from "#fieldset/helper-text.tsx";
export { Legend, type LegendProps } from "#fieldset/legend.tsx";
export { Root, type RootProps } from "#fieldset/root.tsx";
export { type FieldsetState, useFieldset } from "#fieldset/state.ts";
