/**
 * Renders a search field in an input group, with a leading search mark and a control that clears
 * the value.
 *
 * @remarks
 *   The box, the field and the marks are the input group's parts. `searchIndicator` renders a
 *   decorative mark before the field. The clear control renders only while the field has a value
 *   and the caller passes `clearIndicator`. Pressing it empties the field and moves focus back to
 *   the field. Escape empties a non-empty field and stops there, so a dialog around the field stays
 *   open; on an empty field Escape passes on. The clear control is out of the tab order, because
 *   Escape clears from the keyboard. Enter calls `onSubmit` with the value, and a form around the
 *   field still submits.
 */

import {
  type ComponentProps,
  type KeyboardEvent,
  type KeyboardEventHandler,
  type ReactElement,
  type ReactNode,
  useRef,
} from "react";

import { omitUndefined, useControllableState } from "@stealthscale/hooks";

import { Field } from "#input-group/field.ts";
import { Mark } from "#input-group/mark.ts";
import { Root, type RootProps } from "#input-group/root.tsx";
import { withContext } from "#search-input/context.ts";

/**
 * Renders the `button` that clears the field.
 */
const Clear = withContext("button", { defaultProps: { tabIndex: -1, type: "button" } });

/**
 * Describes the props of SearchInput: the group's variants, the field's props, the value, and the
 * content and names of the marks.
 */
export interface SearchInputProps
  extends
    Omit<ComponentProps<typeof Field>, "defaultValue" | "onChange" | "onSubmit" | "size" | "value">,
    Pick<RootProps, "size" | "status" | "variant"> {
  /**
   * Content of the clear control. The control renders only when this is passed.
   */
  readonly clearIndicator?: ReactNode | undefined;

  /**
   * Accessible name of the clear control. Defaults to `Clear search`.
   */
  readonly clearLabel?: string | undefined;

  /**
   * Initial value when the caller does not control the value.
   */
  readonly defaultValue?: string | undefined;

  /**
   * Called with the value when Enter is pressed in the field.
   */
  readonly onSubmit?: ((value: string) => void) | undefined;

  /**
   * Called with the new value on every change, clearing included.
   */
  readonly onValueChange?: ((value: string) => void) | undefined;

  /**
   * Content of the decorative mark before the field, such as a magnifying glass.
   */
  readonly searchIndicator?: ReactNode | undefined;

  /**
   * Controlled value.
   */
  readonly value?: string | undefined;
}

/**
 * Describes what the key handler reads: the value, the setter, and the caller's handlers.
 */
interface Keyed {
  /**
   * Value of the field.
   */
  readonly held: string;

  /**
   * Caller's key handler, which runs first.
   */
  readonly onKeyDown: KeyboardEventHandler<HTMLInputElement> | undefined;

  /**
   * Caller's submit handler, which receives the value on Enter.
   */
  readonly onSubmit: ((value: string) => void) | undefined;

  /**
   * Sets the value of the field.
   */
  readonly setHeld: (value: string) => void;
}

/**
 * Handles a key in the field after the caller's handler: Escape clears a non-empty value and
 * Enter submits the value.
 */
function keyed(
  event: KeyboardEvent<HTMLInputElement>,
  { held, onKeyDown, onSubmit, setHeld }: Keyed,
): void {
  onKeyDown?.(event);

  if (event.defaultPrevented) return;

  if (event.key === "Escape" && held !== "") {
    event.preventDefault();
    event.stopPropagation();
    setHeld("");
  }

  if (event.key === "Enter") onSubmit?.(held);
}

/**
 * Renders the search field, its search mark, and the clear control while it has a value.
 */
export function SearchInput({
  clearIndicator,
  clearLabel = "Clear search",
  defaultValue = "",
  onKeyDown,
  onSubmit,
  onValueChange,
  searchIndicator,
  size,
  status,
  value,
  variant,
  ...rest
}: SearchInputProps): ReactElement {
  const field = useRef<HTMLInputElement>(null);
  const [held, setHeld] = useControllableState<string>({
    defaultValue,
    onChange: onValueChange,
    value,
  });

  return (
    <Root {...omitUndefined({ size, status, variant })}>
      {searchIndicator === undefined ? undefined : <Mark aria-hidden>{searchIndicator}</Mark>}
      <Field
        enterKeyHint="search"
        {...rest}
        onChange={(event) => {
          setHeld(event.target.value);
        }}
        onKeyDown={(event) => {
          keyed(event, { held, onKeyDown, onSubmit, setHeld });
        }}
        ref={field}
        type="search"
        value={held}
      />
      {held !== "" && clearIndicator !== undefined ? (
        <Mark>
          <Clear
            {...omitUndefined({ size })}
            aria-label={clearLabel}
            onClick={() => {
              setHeld("");
              field.current?.focus();
            }}
          >
            {clearIndicator}
          </Clear>
        </Mark>
      ) : undefined}
    </Root>
  );
}
