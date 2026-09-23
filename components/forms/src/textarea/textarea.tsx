/**
 * Renders a multi-line text field that can size itself to its content.
 *
 * @remarks
 *   With `grows` set, the component writes the value into an attribute on the root, and the recipe
 *   renders a hidden copy of it in the same grid cell as the `textarea`. The cell takes the height
 *   of the copy, so the field resizes in the same frame as the edit and no layout is measured.
 *   `maxRows` writes a row limit onto the root, which caps the copy, so the field stops growing at
 *   that many lines and scrolls. Without `grows` the root has no copy, so the field keeps the
 *   height of its `rows` and scrolls. The component holds the value when the caller does not, and
 *   writes the attribute from whichever value is in force, so a controlled field grows the same
 *   way.
 */

import { type ComponentProps, type ReactElement } from "react";

import { omitUndefined, useControllableState } from "@stealthscale/hooks";

import { withContext, withProvider } from "#textarea/context.ts";
import { CAPPED, MAX_ROWS, VALUE } from "#textarea/recipe.ts";

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
 *   axis from them would pick up the style prop of the same name. The variants are on the root
 *   because a slot recipe resolves them where the provider receives them.
 */
interface Variants {
  /**
   * Axes the resize handle drags along. Defaults to `vertical`.
   */
  readonly grip?: "both" | "none" | "vertical" | undefined;

  /**
   * Whether the field takes its height from its content, with `rows` as the least height.
   */
  readonly grows?: boolean | undefined;

  /**
   * Text size and inset. Defaults to `md`.
   */
  readonly size?: "lg" | "md" | "sm" | undefined;

  /**
   * Status the edge and the focus ring report.
   */
  readonly status?: "error" | "info" | "success" | "warning" | undefined;

  /**
   * Edges and surface of the field. Defaults to `outline`.
   */
  readonly variant?: "flushed" | "outline" | "subtle" | undefined;
}

/**
 * Describes the props of `Textarea`: the variants, the value, the row limit, and the props of a
 * styled `textarea`.
 */
export interface TextareaProps
  extends Omit<ComponentProps<typeof Typed>, "defaultValue" | "onChange" | "value">, Variants {
  /**
   * Initial value when the caller does not control the value.
   */
  readonly defaultValue?: string | undefined;

  /**
   * Most lines a growing field takes before it scrolls. Held at `rows` or more. A field without
   * `grows` ignores it.
   */
  readonly maxRows?: number | undefined;

  /**
   * Called with the new value on every change.
   */
  readonly onValueChange?: ((value: string) => void) | undefined;

  /**
   * Controlled value.
   */
  readonly value?: string | undefined;
}

/**
 * Returns the attributes the root carries: the copy of the value on a growing field, and the row
 * limit where one is set.
 */
function sizing(
  held: string,
  grows: boolean | undefined,
  rows: number,
  maxRows: number | undefined,
): Readonly<Record<string, unknown>> {
  if (grows !== true) return {};

  if (maxRows === undefined) return { [VALUE]: held };

  const limit: Record<string, string> = { [MAX_ROWS]: String(Math.max(maxRows, rows)) };

  return { [CAPPED]: "", style: limit, [VALUE]: held };
}

/**
 * Renders the `textarea` inside the root that sizes it.
 *
 * @remarks
 *   `omitUndefined` removes the variants the caller left unset, because the styled root's props
 *   reject `undefined` under `exactOptionalPropertyTypes`.
 */
export function Textarea({
  defaultValue = "",
  grip,
  grows,
  maxRows,
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
    <Sized {...sizing(held, grows, rows, maxRows)} {...variants}>
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
