/**
 * Renders a key combination through the kbd-group recipe.
 *
 * @remarks
 *   The element is `kbd` around one `kbd` per key, which is the HTML markup for a combination such
 *   as `⌘ K`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { PropsProvider, withGroupContext } from "#kbd/context.ts";
import { type RootProps } from "#kbd/root.ts";

/**
 * Renders the outer `kbd` element with the classes of the kbd-group recipe.
 */
const Row = withGroupContext("kbd");

/**
 * Describes the props of Kbd.Group: the size, look and palette of its keycaps, and the props of a
 * `kbd` element.
 */
export type GroupProps = ComponentProps<typeof Row> &
  Pick<RootProps, "palette" | "size" | "variant">;

/**
 * Renders a key combination and sets its size, look and palette on every keycap inside it.
 *
 * @remarks
 *   An axis the caller leaves unset is not passed down, so a keycap keeps the recipe's default. The
 *   recipe runtime reads an axis passed as undefined as a selection and writes no class for it.
 */
export function Group({ palette, size, variant, ...props }: GroupProps): ReactElement {
  const chosen = {
    ...(palette === undefined ? {} : { palette }),
    ...(size === undefined ? {} : { size }),
    ...(variant === undefined ? {} : { variant }),
  };

  return (
    <PropsProvider value={chosen}>
      <Row {...props} />
    </PropsProvider>
  );
}
