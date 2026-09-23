/**
 * Draws the box a field's parts sit in, and states what the field knows about itself.
 *
 * @remarks
 *   The element is `div` and carries no role. A field is not a grouping a reader navigates by; the
 *   control inside it keeps its own role and the label names it.
 *   Every part reads the state from here. One `invalid` on the root marks the control, draws the
 *   message and leaves the two in step, where a prop on each part would let them disagree.
 *   A field takes its disabled state from the fieldset around it until it states its own. The
 *   browser already takes the controls in a disabled fieldset out of reach; what it does not do is
 *   draw the labels beside them as unreachable, which is what the inherited state is for.
 *   The identifiers are derived from one. A caller states `id` where a label outside the field
 *   points at the control, and React generates one otherwise.
 */

import { type ComponentProps, type ReactElement, useId, useMemo } from "react";

import { withProvider } from "#field/context.ts";
import { idsOf } from "#field/ids.ts";
import { FieldProvider, type FieldState } from "#field/state.ts";
import { useFieldset } from "#fieldset/state.ts";

/**
 * Draws the box and sets the variants every part below it reads.
 */
const Framed = withProvider("div", "root");

/**
 * Describes what a field takes: the recipe's variants, what it knows about itself, and everything
 * a styled div takes.
 */
export interface RootProps extends ComponentProps<typeof Framed> {
  /**
   * Whether a person can reach the control at all. Default: whatever the fieldset around it
   * states, and false outside one.
   */
  readonly disabled?: boolean | undefined;

  /**
   * Whether what the control holds is wrong. Default: false.
   */
  readonly invalid?: boolean | undefined;

  /**
   * Whether the control shows a value a person cannot change. Default: false.
   */
  readonly readOnly?: boolean | undefined;

  /**
   * Whether the field has to be filled in. Default: false.
   */
  readonly required?: boolean | undefined;
}

/**
 * Draws the field, with what it knows about itself in scope.
 *
 * @param props - The variants, the field's state, and the element's own props.
 * @returns The box, holding the parts, under the state they read.
 */
export function Root({
  disabled,
  id,
  invalid = false,
  readOnly = false,
  required = false,
  status,
  ...rest
}: RootProps): ReactElement {
  const generated = useId();
  const group = useFieldset();
  const unreachable = disabled ?? group.disabled;
  const state = useMemo<FieldState>(
    () => ({
      disabled: unreachable,
      ids: idsOf(id ?? generated),
      invalid,
      readOnly,
      required,
      status,
    }),
    [generated, id, invalid, readOnly, required, status, unreachable],
  );

  return (
    <FieldProvider value={state}>
      <Framed
        {...rest}
        {...(status === undefined ? {} : { status })}
        data-disabled={unreachable || undefined}
        data-invalid={invalid || undefined}
      />
    </FieldProvider>
  );
}
