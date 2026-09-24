/**
 * Renders the field's root and provides the field's state to its parts.
 *
 * @remarks
 *   The element is a `div` with no role. The control keeps its own role, and the label names it.
 *   Every part reads the state from the root: one `invalid` marks the control and renders the
 *   error text. A field inside a disabled fieldset is disabled until it states `disabled` itself.
 *   The root derives every identifier from one: `id` when the caller states it, otherwise one
 *   React generates. `maxLength` limits the control and sets the counter's maximum. The root's
 *   `size` reaches the control unless the control states its own.
 */

import { type ComponentProps, type ReactElement, useId, useMemo } from "react";

import { useConst } from "@stealthscale/hooks";

import { withProvider } from "#field/context.ts";
import { idsOf } from "#field/ids.ts";
import { FieldProvider, type FieldState } from "#field/state.ts";
import { tally } from "#field/tally.ts";
import { useFieldset } from "#fieldset/state.ts";

/**
 * Renders the root `div` with the recipe's variants.
 */
const Framed = withProvider("div", "root");

/**
 * Describes the props of the root: the recipe's variants, the field's state, and the props of a
 * `div`.
 */
export interface RootProps extends ComponentProps<typeof Framed> {
  /**
   * Whether the control is disabled. Defaults to the state of the fieldset around the field, and
   * to false outside one.
   */
  readonly disabled?: boolean | undefined;

  /**
   * Whether the control's value is invalid. Defaults to false.
   */
  readonly invalid?: boolean | undefined;

  /**
   * Most UTF-16 code units the control accepts. The counter shows the length against it.
   */
  readonly maxLength?: number | undefined;

  /**
   * Whether the control is read-only. Defaults to false.
   */
  readonly readOnly?: boolean | undefined;

  /**
   * Whether the control requires a value. Defaults to false.
   */
  readonly required?: boolean | undefined;
}

/**
 * Renders the field and provides its state to the parts inside it.
 *
 * @param props - The variants, the field's state, and the props of a `div`.
 * @returns The root, with the state in scope.
 */
export function Root({
  disabled,
  id,
  invalid = false,
  maxLength,
  readOnly = false,
  required = false,
  size,
  status,
  ...rest
}: RootProps): ReactElement {
  const generated = useId();
  const group = useFieldset();
  const counted = useConst(tally);
  const unreachable = disabled ?? group.disabled;
  const state = useMemo<FieldState>(
    () => ({
      disabled: unreachable,
      ids: idsOf(id ?? generated),
      invalid,
      maxLength,
      readOnly,
      required,
      size,
      status,
      tally: counted,
    }),
    [counted, generated, id, invalid, maxLength, readOnly, required, size, status, unreachable],
  );

  return (
    <FieldProvider value={state}>
      <Framed
        {...rest}
        {...(size === undefined ? {} : { size })}
        {...(status === undefined ? {} : { status })}
        data-disabled={unreachable || undefined}
        data-invalid={invalid || undefined}
      />
    </FieldProvider>
  );
}
