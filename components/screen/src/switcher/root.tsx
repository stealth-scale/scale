/**
 * Holds the switcher together and sets the variants every part reads.
 *
 * @remarks
 *   It is the disclosure package's menu, drawing no element of its own, so the roles, the keyboard,
 *   the escape and the placing come from that component.
 *   It takes the variants rather than the control does, because the panel is placed outside the
 *   control in the document and a control that held them would leave every row in the panel with
 *   nothing to read. The size goes to the menu as well, so the rows are drawn at the step the
 *   control was asked for.
 */

import { type ComponentProps, type ReactElement } from "react";

import { type RecipeProps } from "@stealthscale/theme/authoring";

import { withRootProvider } from "#switcher/context.ts";
import { recipe } from "#switcher/recipe.ts";
import { Sized } from "#switcher/sized.tsx";

/**
 * Wraps the menu and hands the variants down to every part.
 */
const Bound = withRootProvider(Sized);

/**
 * Describes the variants the switcher's own recipe offers.
 */
type Variants = RecipeProps<typeof recipe>;

/**
 * The binding's props, with the variants typed as the recipe types them.
 */
type ProvidedProps = Omit<ComponentProps<typeof Bound>, keyof Variants> & Variants;

/**
 * The binding, with the variants restated as the recipe types them.
 *
 * @remarks
 *   The binding types a variant without `undefined`, and a caller that leaves one out under
 *   `exactOptionalPropertyTypes` hands it as `undefined`, which the recipe's own props allow. The
 *   values reach the same runtime, which splits the switcher's off before the menu sees them.
 */
// eslint-disable-next-line typescript/no-unsafe-type-assertion -- the parameter type is restated over the same runtime, see the remarks
const Provided = Bound as (props: ProvidedProps) => ReactElement;

/**
 * Describes what the switcher takes: its own variants, and everything the menu takes apart from
 * the axes the two recipes both name.
 *
 * @remarks
 *   The menu's recipe offers `size` and `variant` as well. Bound over the menu's root, the two
 *   `variant` axes intersect to a type no value satisfies, so the switcher's axes are stated over
 *   the menu's here. The step the menu is handed is the switcher's size and is not stated twice.
 */
export type RootProps = Omit<ProvidedProps, "step">;

/**
 * Wraps the menu and hands the variants down to every part, the size to the menu among them.
 *
 * @param props - The variants, and whatever the menu takes.
 * @returns The menu, carrying the switcher's variants.
 */
export function Root({ size = "md", ...rest }: RootProps): ReactElement {
  return <Provided {...rest} size={size} step={size} />;
}
