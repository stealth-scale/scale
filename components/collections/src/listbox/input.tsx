/**
 * Renders the field that filters the list, and the control that clears it.
 *
 * @remarks
 *   The field keeps focus while the highlight moves, and the machine points its
 *   `aria-activedescendant` at the highlighted row, so a person types and moves through the rows
 *   without leaving the field. Filtering is the caller's: the field reports the text and the caller
 *   passes a filtered collection. With `autoHighlight`, the machine highlights the first row of
 *   each filtered collection, so Enter chooses the best match. The clear control renders while the
 *   field has text and the caller gives it an icon. A press clears the field and moves focus back
 *   to it.
 */

import { type ComponentProps, type ReactElement, type ReactNode, useCallback, useRef } from "react";

import { mergeProps } from "@zag-js/react";

import { useControllableState } from "@stealthscale/hooks";

import { withContext } from "#listbox/context.ts";
import { useListbox } from "#listbox/machine.ts";

/**
 * Renders the `div` with the listbox's control class, which contains the field and the clear
 * control.
 */
const Band = withContext("div", "control");

/**
 * Renders the `input` with the listbox's input class.
 */
const Typed = withContext("input", "input");

/**
 * Renders the clear `button` with the listbox's clear trigger class.
 */
const Clear = withContext("button", "clearTrigger", { defaultProps: { type: "button" } });

/**
 * Describes the props of the field: its value, the clear control and the props of an `input`.
 */
export interface InputProps extends Omit<ComponentProps<typeof Typed>, "defaultValue" | "value"> {
  /**
   * Whether the first row of the filtered list is highlighted while the field has text.
   */
  readonly autoHighlight?: boolean | undefined;

  /**
   * Icon of the clear control. The control renders only when an icon is given.
   */
  readonly clearIndicator?: ReactNode | undefined;

  /**
   * Accessible name of the clear control.
   */
  readonly clearLabel?: string | undefined;

  /**
   * Initial text of an uncontrolled field.
   */
  readonly defaultValue?: string | undefined;

  /**
   * Called with the field's text on every change.
   */
  readonly onValueChange?: ((value: string) => void) | undefined;

  /**
   * Text of a controlled field.
   */
  readonly value?: string | undefined;
}

/**
 * Renders the field with the machine's input props, and the clear control while it has text.
 *
 * @param props - The value, the clear control's icon and name, and the props of an `input`.
 * @returns The control `div` that contains the field and the clear control.
 */
export function Input({
  autoHighlight = false,
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
        {...mergeProps(api.getInputProps({ autoHighlight }), rest)}
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
