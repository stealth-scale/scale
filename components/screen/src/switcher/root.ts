/**
 * Holds the switcher together and sets the variants every part reads.
 *
 * @remarks
 *   It is the disclosure package's menu, drawing no element of its own, so the roles, the keyboard,
 *   the escape and the placing come from that component.
 *   It takes the variants rather than the control does, because the panel is placed outside the
 *   control in the document and a control that held them would leave every row in the panel with
 *   nothing to read.
 */

import { type ComponentProps, type JSX } from "react";

import { Menu } from "@stealthscale/component-disclosure";
import { type RecipeProps } from "@stealthscale/theme/authoring";

import { withRootProvider } from "#switcher/context.ts";
import { recipe } from "#switcher/recipe.ts";

/**
 * Wraps the menu and hands the variants down to every part.
 */
const Provided = withRootProvider(Menu.Root);

/**
 * Describes the variants the switcher's own recipe offers.
 */
type Variants = RecipeProps<typeof recipe>;

/**
 * Describes what the switcher takes: its own variants, and everything the menu takes apart from
 * the axes the two recipes both name.
 *
 * @remarks
 *   The menu's recipe offers `size` and `variant` as well. Bound over the menu's root, the two
 *   `variant` axes intersect to a type no value satisfies, so the switcher's axes are stated over
 *   the menu's here. The provider keeps the switcher's values for its own parts and the menu draws
 *   in its defaults.
 */
export type RootProps = Omit<ComponentProps<typeof Provided>, keyof Variants> & Variants;

/**
 * Wraps the menu and hands the variants down to every part.
 *
 * @remarks
 *   The provider's own parameter type carries the intersected axes. The values reach the same
 *   runtime, which splits the switcher's off before the menu sees them, so the type is restated
 *   and nothing else changes.
 */
// eslint-disable-next-line typescript/no-unsafe-type-assertion -- the parameter type is restated over the same runtime, see the remarks
export const Root = Provided as (props: RootProps) => JSX.Element;
