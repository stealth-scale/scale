/**
 * Renders the menubar's root, which measures its row, with the bar of names and the fold trigger a
 * crowded bar shows in its place.
 *
 * @remarks
 *   The bar is the WAI-ARIA `menubar`, and the caller's `aria-label` is its accessible name. The
 *   bar is one tab stop, the arrows move along it, and at most one menu is open. While the names do
 *   not fit the row at their natural width, the root marks the row `data-crowded`, the bar is
 *   hidden, and the fold trigger opens one menu with a submenu per menu of the bar. The fold's
 *   panel is portalled to the document, because a clipping ancestor would cut it. The root passes
 *   `size`, `variant`, `palette`, `highlight` and `dir` to every menu, and its names read the same
 *   `size` and `palette`.
 */

import { type ComponentProps, type ReactElement, type ReactNode } from "react";

import { RovingFocus } from "@stealthscale/component-a11y";
import { Portal } from "@stealthscale/component-primitives";
import { omitUndefined, useCrowded } from "@stealthscale/hooks";

import { Content, Root as MenuRoot, Positioner, Trigger } from "#menu/index.ts";
import { type MenuVariants } from "#menu/variants.ts";
import { BarProvider, FoldedProvider, useMenubar, type ValueChangeDetails } from "#menubar/bar.ts";
import { withContext, withProvider } from "#menubar/context.ts";

/**
 * Renders the `div` that measures the row and provides the recipe's size and palette.
 */
const Framed = withProvider("div", "root");

/**
 * Renders the roving focus root with the menubar's bar class.
 */
const Bar = withContext(RovingFocus.Root, "bar");

/**
 * Renders the menu trigger with the menubar's fold class.
 */
const Fold = withContext(Trigger, "fold");

/**
 * Describes the props of the root: the bar's name, value, direction, loop and fold, the menus'
 * variants, and the props of a `div`.
 */
export interface RootProps
  extends
    Omit<MenuVariants, "inset" | "size">,
    Omit<ComponentProps<typeof Framed>, "defaultValue" | "dir" | "value"> {
  /**
   * Name of the bar, which a screen reader announces on reaching it.
   */
  readonly "aria-label": string;

  /**
   * Menus of the bar, each a `Menubar.Menu`.
   */
  readonly children?: ReactNode | undefined;

  /**
   * Value of the menu open at mount.
   */
  readonly defaultValue?: string | undefined;

  /**
   * Writing direction of the bar and its menus. In `rtl` the bar runs from the right, the arrows
   * along it swap, and a submenu opens to the left.
   */
  readonly dir?: "ltr" | "rtl" | undefined;

  /**
   * Words of the trigger a crowded bar folds into. Defaults to `Menu`.
   */
  readonly fold?: string | undefined;

  /**
   * Glyph before the fold trigger's words.
   */
  readonly foldIcon?: ReactNode | undefined;

  /**
   * Glyph after the words of a row of the folded menu that opens a menu of the bar.
   */
  readonly foldIndicator?: ReactNode | undefined;

  /**
   * Whether a step past one end of the bar continues at the other. Defaults to true.
   */
  readonly loop?: boolean | undefined;

  /**
   * Runs when another menu opens or every menu closes.
   */
  readonly onValueChange?: ((details: ValueChangeDetails) => void) | undefined;

  /**
   * Value of the open menu, where the caller keeps it. An empty string closes every menu.
   */
  readonly value?: string | undefined;
}

/**
 * Renders the root, the bar and the fold trigger, and provides the bar to its menus.
 *
 * @param props - The bar's name, value, direction, loop and fold, the menus' variants, and the
 *   props of a `div`.
 * @returns The `div` element inside the bar's provider.
 */
export function Root({
  "aria-label": label,
  children,
  defaultValue,
  dir,
  fold = "Menu",
  foldIcon,
  foldIndicator,
  highlight,
  loop = true,
  onValueChange,
  palette,
  size,
  value,
  variant,
  ...rest
}: RootProps): ReactElement {
  const menus = omitUndefined({ dir, highlight, palette, size, variant });
  const bar = useMenubar({ defaultValue, loop, menus, onValueChange, value });
  const [crowded, measure] = useCrowded();

  return (
    <BarProvider value={bar}>
      <Framed
        {...rest}
        data-crowded={crowded ? "" : undefined}
        dir={dir}
        ref={measure}
        {...omitUndefined({ palette, size })}
      >
        <Bar aria-label={label} role="menubar" wrap={loop}>
          {children}
        </Bar>
        <FoldedProvider value={omitUndefined({ indicator: foldIndicator })}>
          <MenuRoot {...menus}>
            <Fold>
              {foldIcon}
              {fold}
            </Fold>
            <Portal>
              <Positioner>
                <Content>{children}</Content>
              </Positioner>
            </Portal>
          </MenuRoot>
        </FoldedProvider>
      </Framed>
    </BarProvider>
  );
}
