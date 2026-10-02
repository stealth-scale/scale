/**
 * Renders the region a form's own errors are read from.
 *
 * @remarks
 *   The region is on the page from the first render and empty until the schema or a form validator
 *   refuses the whole value, so a screen reader announces the words as they arrive. While the form
 *   has errors, the region renders the library's `Alert` in the error status, with the form's error
 *   glyph and one line per error. The region is the alert, so the `Alert` sets no role of its own.
 *   The region takes focus when a refused submit has no field to move it to, which is why it has
 *   `tabIndex={-1}`.
 */

import { type ReactElement } from "react";

import { Alert } from "@stealthscale/component-feedback";
import { type ErrorsProps } from "@stealthscale/provider-form";

import { withContext } from "#form/context.ts";
import { useFormScope } from "#form/scope.ts";

/**
 * Renders the region's `div` with the form's errors class.
 */
const Region = withContext("div", "errors");

/**
 * Renders the region, and the errors in it.
 *
 * @param props - The errors, resolved to words, and the id the foundation finds the region by.
 * @returns The region.
 */
export function Errors({ errors, id }: ErrorsProps): ReactElement {
  const { glyphs } = useFormScope();

  return (
    <Region id={id} role="alert" tabIndex={-1}>
      {errors.length === 0 ? null : (
        <Alert.Root live="off" status="error">
          {glyphs.error === undefined ? null : <Alert.Indicator>{glyphs.error}</Alert.Indicator>}
          <Alert.Content>
            {errors.map((error) => (
              <Alert.Description key={error}>{error}</Alert.Description>
            ))}
          </Alert.Content>
        </Alert.Root>
      )}
    </Region>
  );
}
