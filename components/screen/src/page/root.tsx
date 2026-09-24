/**
 * Renders the column of a page's bands and measures its own width.
 *
 * @remarks
 *   The element is `div` and no landmark. The shell renders the one `main` a screen has. The root
 *   measures its own width rather than the window's, and below the `md` breakpoint sets `folded`,
 *   so a page beside an open sidebar folds on its own room. It also sets `data-narrow`, because a
 *   row of actions in the page folds on that attribute and a variant class styles only this
 *   recipe's parts.
 */

import { type ComponentProps, type ReactElement, useMemo, useRef } from "react";

import { useNarrow, widthOf } from "@stealthscale/provider-viewport";

import { withProvider } from "#page/context.ts";
import { PageProvider, type PageSize } from "#page/state.ts";

/**
 * Breakpoint whose start width the root compares its own width against.
 *
 * @remarks
 *   The root compares widths and asks no media query, because a page beside an open sidebar is
 *   narrow while the window is wide.
 */
const FOLDS_BELOW = "md";

/**
 * Renders the `div` with the recipe's root class, which provides the variants to the bands.
 */
const Columned = withProvider("div", "root");

/**
 * Describes the props of the page: its size, the recipe's variants without `folded`, which the
 * page measures, and the props of a `div`.
 */
export interface RootProps extends Omit<ComponentProps<typeof Columned>, "folded" | "size"> {
  /**
   * Size of the page, which a section in it reads too.
   */
  readonly size?: PageSize | undefined;
}

/**
 * Renders the page with its measured width and provides its state to the parts.
 *
 * @param props - The size, the recipe's variants and the props of a `div`.
 * @returns The `div` element, with `folded` and `data-narrow` while it is narrow.
 */
export function Root({ size = "md", ...rest }: RootProps): ReactElement {
  const measured = useRef<HTMLDivElement>(null);
  const folded = useNarrow(measured, widthOf(FOLDS_BELOW), FOLDS_BELOW);
  const state = useMemo(() => ({ narrow: folded, size }), [folded, size]);

  return (
    <PageProvider value={state}>
      <Columned
        {...rest}
        {...(folded ? { "data-narrow": "", folded: true } : {})}
        ref={measured}
        size={size}
      />
    </PageProvider>
  );
}
