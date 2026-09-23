/**
 * Renders a multi-line text field that can size itself to its content.
 *
 * @remarks
 *   With `grows` set, the component writes the value into an attribute on the root, and the recipe
 *   renders a hidden copy of it in the same grid cell as the `textarea`. The cell takes the height
 *   of the copy, so the field resizes in the same frame as the edit and no layout is measured. The
 *   component holds the value when the caller does not, and writes the attribute from whichever
 *   value is in force, so a controlled field grows the same way.
 */

import { type ComponentProps, type ReactElement } from "react";

import { omitUndefined, useControllableState } from "@stealthscale/hooks";

import { withContext, withProvider } from "#textarea/context.ts";
import { VALUE } from "#textarea/recipe.ts";

/**
 * Renders the root grid cell that sizes the field, with the recipe's variants.
 */
const Sized = withProvider("div", "root");

/**
 * Renders the `textarea` element.
 */
const Typed = withContext("textarea", "control");

/**
 * Lists the recipe variants the root accepts, which a caller sets on `Textarea`.
 *
 * @remarks
 *   The type is written by hand. The styled root's props include every CSS property, so deriving an
 *   axis from them would pick up the style prop of the same name. The variants sit on the root
 *   because a slot recipe resolves them where the provider receives them.
 */
interface Variants {
  /**
   * The axes the resize handle drags along. Default: `vertical`.
   */
  readonly grip?: "both" | "none" | "vertical" | undefined;

  /**
   * Whether the field takes its height from its content instead of from `rows`.
   */
  readonly grows?: boolean | undefined;

  /**
   * The inset around the text. Default: `md`.
   */
  readonly size?: "lg" | "md" | "sm" | undefined;

  /**
   * The status palette the border uses.
   */
  readonly status?: "error" | "info" | "success" | "warning" | undefined;

  /**
   * The border treatment. Default: `outline`.
   */
  readonly variant?: "flushed" | "outline" | "subtle" | undefined;
}

/**
 * Describes the props of `Textarea`: the variants, the value, and the styled `textarea` props.
 */
export interface TextareaProps
  extends Omit<ComponentProps<typeof Typed>, "defaultValue" | "onChange" | "value">, Variants {
  /**
   * The initial value when the caller does not control it.
   */
  readonly defaultValue?: string | undefined;

  /**
   * Receives the new value on every change.
   */
  readonly onValueChange?: ((value: string) => void) | undefined;

  /**
   * The controlled value.
   */
  readonly value?: string | undefined;
}

/**
 * Renders the field inside the root that sizes it.
 *
 * @remarks
 *   `omitUndefined` removes the variants the caller left unset, because the styled root's props
 *   reject `undefined` under `exactOptionalPropertyTypes`.
 */
export function Textarea({
  defaultValue = "",
  grip,
  grows,
  onValueChange,
  rows = 3,
  size,
  status,
  value,
  variant,
  ...rest
}: TextareaProps): ReactElement {
  const [held, setHeld] = useControllableState<string>({
    defaultValue,
    onChange: onValueChange,
    value,
  });
  const variants = omitUndefined({ grip, grows, size, status, variant });

  return (
    <Sized {...{ [VALUE]: held }} {...variants}>
      <Typed
        {...rest}
        onChange={(event) => {
          setHeld(event.target.value);
        }}
        rows={rows}
        value={held}
      />
    </Sized>
  );
}
