/**
 * Renders the fieldset's root and provides the group's state to its parts and fields.
 *
 * @remarks
 *   The element is a `fieldset`, and `disabled` is the element's own attribute, so the browser
 *   disables every control inside the group, takes it out of the tab order and out of the form's
 *   submission, and leaves the first legend enabled. The state also reaches the fields through the
 *   context, so their labels take the disabled look. The group's `size` reaches every field that
 *   states none. The root derives its identifiers from one, as a field does, and lists the helper
 *   and error texts in `aria-describedby`. Write the legend as the first child, because a browser
 *   names the group from the first `legend`.
 */

import { type ComponentProps, type ReactElement, useId, useMemo } from "react";

import { describedBy, idsOf } from "#field/ids.ts";
import { withProvider } from "#fieldset/context.ts";
import { FieldsetProvider, type FieldsetState } from "#fieldset/state.ts";

/**
 * Renders the root `fieldset` with the recipe's variants.
 */
const Framed = withProvider("fieldset", "root");

/**
 * Describes the props of the root: the recipe's variants, the group's state, and the props of a
 * `fieldset`.
 */
export interface RootProps extends ComponentProps<typeof Framed> {
  /**
   * Whether every control in the group is disabled. Defaults to false.
   */
  readonly disabled?: boolean | undefined;

  /**
   * Whether the group's value is invalid. Defaults to false.
   */
  readonly invalid?: boolean | undefined;
}

/**
 * Renders the group and provides its state to the parts and fields inside it.
 *
 * @param props - The variants, the group's state, and the props of a `fieldset`.
 * @returns The `fieldset` element, with the state in scope.
 */
export function Root({
  disabled = false,
  id,
  invalid = false,
  size,
  status,
  ...rest
}: RootProps): ReactElement {
  const generated = useId();
  const state = useMemo<FieldsetState>(
    () => ({ disabled, ids: idsOf(id ?? generated), invalid, size, status }),
    [disabled, generated, id, invalid, size, status],
  );

  return (
    <FieldsetProvider value={state}>
      <Framed
        aria-describedby={describedBy(state.ids)}
        aria-invalid={invalid || undefined}
        {...rest}
        {...(size === undefined ? {} : { size })}
        {...(status === undefined ? {} : { status })}
        data-invalid={invalid || undefined}
        disabled={disabled}
      />
    </FieldsetProvider>
  );
}
