/**
 * Draws the field a person narrows the list from, and the control that empties it.
 *
 * @remarks
 *   The field keeps focus while the highlight moves over the rows, and the machine points
 *   `aria-activedescendant` from here at the row a reader is on. That is what lets a person type
 *   and walk the rows without leaving the field, which a list that took focus itself cannot do.
 *   Narrowing is the caller's. The field reports what was typed and the caller hands back a
 *   collection holding what is left, so the machine never filters and never holds two lists.
 *   The control that empties the field belongs to this recipe rather than coming from a search
 *   field elsewhere. A field from another package brings its own box, and the box and this band
 *   both want to own the width the rule under it reaches, so the rule stopped short at both ends.
 *   It is drawn only where there is something to clear and only where a caller gives it a mark to
 *   draw. A control that is always there and does nothing half the time is one a reader learns to
 *   pass over, and clearing puts focus back in the field, because a person who has just emptied a
 *   filter is about to type another one.
 */

import { type ComponentProps, type ReactElement, type ReactNode, useCallback, useRef } from "react";

import { mergeProps } from "@zag-js/react";

import { useControllableState } from "@stealthscale/hooks";

import { withContext } from "#listbox/context.ts";
import { useListbox } from "#listbox/machine.ts";

/**
 * Draws the band the field and its control sit in.
 */
const Band = withContext("div", "control");

/**
 * Draws the field at the size the root states.
 */
const Typed = withContext("input", "input");

/**
 * Draws the control that empties the field.
 */
const Clear = withContext("button", "clearTrigger", { defaultProps: { type: "button" } });

/**
 * Describes what the field takes.
 */
export interface InputProps extends Omit<ComponentProps<typeof Typed>, "defaultValue" | "value"> {
  /**
   * Drawn inside the control that empties the field, which is drawn only where one is given.
   */
  readonly clearIndicator?: ReactNode | undefined;

  /**
   * Reads out as the name of the control that empties the field.
   */
  readonly clearLabel?: string | undefined;

  /**
   * Fills the field before a caller drives it.
   */
  readonly defaultValue?: string | undefined;

  /**
   * Hears the field's contents each time they change.
   */
  readonly onValueChange?: ((value: string) => void) | undefined;

  /**
   * Fills the field, where a caller drives it.
   */
  readonly value?: string | undefined;
}

/**
 * Takes what a person types, and walks the rows without giving up focus.
 *
 * @param props - The field's contents, the name of its control, and an input's own props.
 * @returns The band, holding the field and the control that empties it.
 */
export function Input({
  clearIndicator,
  clearLabel,
  defaultValue = "",
  onChange,
  onValueChange,
  value,
  ...rest
}: InputProps): ReactElement {
  const api = useListbox();
  const field = useRef<HTMLInputElement>(null);
  const [held, setHeld] = useControllableState<string>({
    defaultValue,
    onChange: onValueChange,
    value,
  });

  const clear = useCallback((): void => {
    setHeld("");
    field.current?.focus();
  }, [setHeld]);

  return (
    <Band>
      <Typed
        {...mergeProps(api.getInputProps(), rest)}
        onChange={(event) => {
          setHeld(event.target.value);
          onChange?.(event);
        }}
        ref={field}
        value={held}
      />
      {held !== "" && clearIndicator !== undefined ? (
        <Clear aria-label={clearLabel} onClick={clear}>
          {clearIndicator}
        </Clear>
      ) : null}
    </Band>
  );
}
