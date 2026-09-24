/**
 * Renders the switcher's menu and provides the variants to the control's parts.
 *
 * @remarks
 *   `Switcher.Root` is the disclosure package's `Menu.Root`, so the roles, the keyboard, Escape and
 *   the positioning come from the menu. It renders no element. It provides the switcher's variants
 *   to the control's parts and passes `size` to the menu, so the rows render at the control's size.
 */

import { type ComponentProps, type ReactElement } from "react";

import { type RecipeProps } from "@stealthscale/theme/authoring";

import { withRootProvider } from "#switcher/context.ts";
import { recipe } from "#switcher/recipe.ts";
import { Sized } from "#switcher/sized.tsx";

/**
 * Binds the sized menu as the root that provides the variants.
 */
const Bound = withRootProvider(Sized);

/**
 * Variant props of the switcher's recipe.
 */
type Variants = RecipeProps<typeof recipe>;

/**
 * Props of the binding, with the variants typed as the recipe types them.
 */
type ProvidedProps = Omit<ComponentProps<typeof Bound>, keyof Variants> & Variants;

/**
 * The binding, with its props typed as `ProvidedProps`.
 *
 * @remarks
 *   The binding types a variant without `undefined`, and under `exactOptionalPropertyTypes` an
 *   omitted variant arrives as `undefined`, which the recipe's props allow. The runtime is the
 *   same: the binding splits the switcher's variants off before the menu receives the rest.
 */
// eslint-disable-next-line typescript/no-unsafe-type-assertion -- the parameter type is restated over the same runtime, see the remarks
const Provided = Bound as (props: ProvidedProps) => ReactElement;

/**
 * Describes the props of `Root`: the switcher's variants and the menu's props.
 *
 * @remarks
 *   The menu's recipe also offers `size` and `variant`. Over the menu's root the two `variant` axes
 *   intersect to a type no value satisfies, so the switcher's axes replace the menu's here. The
 *   menu's size is the switcher's `size`, so `step` is omitted.
 */
export type RootProps = Omit<ProvidedProps, "step">;

/**
 * Renders the menu with the switcher's variants, at the switcher's size.
 *
 * @param props - The switcher's variants and the menu's props.
 * @returns The menu, providing the variants.
 */
export function Root({ size = "md", ...rest }: RootProps): ReactElement {
  return <Provided {...rest} size={size} step={size} />;
}
