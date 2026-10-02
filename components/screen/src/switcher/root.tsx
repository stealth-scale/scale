/**
 * Renders the switcher's menu, derives where the switcher renders, and provides both to the
 * control's parts.
 *
 * @remarks
 *   `Switcher.Root` is the disclosure package's `Menu.Root`, so the roles, the keyboard, Escape and
 *   the positioning come from the menu. With `items` the root renders the trigger and the menu of
 *   the choices itself, and its children are `Switcher.Action` rows after them. Without `items`
 *   the children are the caller's trigger and menu. The root reads the sidebar or the toolbar
 *   around it for the placement and the size, unless the caller states them, and passes the size
 *   to the menu, so the rows render at the control's size. In a sidebar the menu is as wide as the
 *   control, and on a rail it opens beside the rail.
 */

import { type ComponentProps, type ReactElement, type ReactNode, useId } from "react";

import { type RecipeProps } from "@stealthscale/theme/authoring";

import { type Choice } from "#switcher/choice.ts";
import { withRootProvider } from "#switcher/context.ts";
import { Listed } from "#switcher/listed.tsx";
import { type recipe } from "#switcher/recipe.ts";
import { Sized } from "#switcher/sized.tsx";
import { type Placement, SwitcherProvider, type SwitcherSize, usePlaced } from "#switcher/state.ts";

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
 * Describes the props of `Root`: the choices and their glyphs, the switcher's variants and the
 * menu's props.
 *
 * @remarks
 *   The menu's recipe also offers `size` and `variant`. Over the menu's root the two `variant` axes
 *   intersect to a type no value satisfies, so the switcher's axes replace the menu's here. The
 *   menu's size is the switcher's `size`, so `step` is omitted.
 */
export interface RootProps extends Omit<ProvidedProps, "placement" | "size" | "step"> {
  /**
   * Glyph that marks the current choice's row in the menu.
   */
  readonly checkIcon?: ReactNode | undefined;

  /**
   * Value of the choice that is current at first, when the caller does not control it. Defaults to
   * the first choice.
   */
  readonly defaultValue?: string | undefined;

  /**
   * Glyph at the end of the trigger.
   */
  readonly indicator?: ReactNode | undefined;

  /**
   * The choices. With them the root renders the trigger and the menu.
   */
  readonly items?: readonly Choice[] | undefined;

  /**
   * Kind of thing the switcher switches, which a screen reader announces before the current name.
   * Used with `items`.
   */
  readonly label?: string | undefined;

  /**
   * Called with the value of the choice the reader switches to.
   */
  readonly onValueChange?: ((value: string) => void) | undefined;

  /**
   * Where the switcher renders. Read from the sidebar or the toolbar around it when absent.
   */
  readonly placement?: Placement | undefined;

  /**
   * Size of the switcher. The sidebar's or the toolbar's size when absent, and `md` alone.
   */
  readonly size?: SwitcherSize | undefined;

  /**
   * Value of the current choice, when the caller controls it.
   */
  readonly value?: string | undefined;
}

/**
 * Renders the menu with the switcher's variants, at the switcher's size.
 *
 * @remarks
 *   A caller's `positioning` applies over the placement's, and a caller's `ids` over the trigger id
 *   the root shares with the rail's tooltip.
 * @param props - The choices, the glyphs, the switcher's variants and the menu's props.
 * @returns The menu, providing the variants and the placement.
 */
export function Root({
  checkIcon,
  children,
  defaultValue,
  indicator,
  items,
  label = "",
  onValueChange,
  placement,
  positioning,
  size,
  value,
  ...rest
}: RootProps): ReactElement {
  const state = usePlaced(placement, size);
  const triggerId = useId();
  const row = state.placement === "sidebar";

  return (
    <SwitcherProvider value={state}>
      <Provided
        ids={{ trigger: triggerId }}
        {...rest}
        placement={state.placement}
        positioning={{
          placement: state.iconic ? "right-start" : "bottom-start",
          sameWidth: row && !state.iconic,
          ...positioning,
        }}
        size={state.size}
        step={state.size}
      >
        {items === undefined ? (
          children
        ) : (
          <Listed
            checkIcon={checkIcon}
            choices={items}
            defaultValue={defaultValue}
            indicator={indicator}
            label={label}
            onValueChange={onValueChange}
            triggerId={triggerId}
            value={value}
          >
            {children}
          </Listed>
        )}
      </Provided>
    </SwitcherProvider>
  );
}
