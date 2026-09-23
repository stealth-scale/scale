/**
 * Renders an icon through the icon recipe.
 *
 * @remarks
 *   The element is `svg`, with the caller's paths as children, or the component passed as `as`. The
 *   icon is hidden from assistive technology by default, because an icon beside text is decoration.
 *   An icon that stands alone sets `aria-hidden={false}` and `aria-label`, and the `img` role
 *   exposes that label.
 */

import { type ComponentProps } from "react";

import { withContext } from "#icon/context.ts";

/**
 * Renders an `svg` element with the classes of the icon recipe, hidden and in the `img` role.
 */
export const Icon = withContext("svg", { defaultProps: { "aria-hidden": true, role: "img" } });

/**
 * Describes the props of Icon: the recipe's variants and the props of an `svg` element.
 */
export type IconProps = ComponentProps<typeof Icon>;
