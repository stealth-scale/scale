/**
 * Renders a bar across the bottom of the shell.
 *
 * @remarks
 *   The element is `footer`, which is the `contentinfo` landmark at the top level of a document.
 *   Several bars stack in source order. A `sticky` bar pins to the bottom of the window and pads
 *   itself by the safe area. The bar is inert while a panel is over the page. `when="narrow"`
 *   renders the bar only while the shell is narrower than the width the navigation folds below by
 *   default, the `md` breakpoint, which is where a phone's bar of destinations replaces the
 *   navigation. The shell measures its root, so a shell in a frame or a box folds on its own width.
 */

import { type ComponentProps, type ReactElement } from "react";

import { useNarrow, widthOf } from "@stealthscale/provider-viewport";

import { withContext } from "#app-shell/context.ts";
import { type ShellWidth, useOverlaid, useShell } from "#app-shell/state.ts";
import { FOLDS_BELOW } from "#app-shell/use-panel.ts";

/**
 * Renders the bar `footer`.
 */
const Barred = withContext("footer", "footer");

/**
 * Describes the props of `Footer`.
 */
export interface FooterProps extends ComponentProps<typeof Barred> {
  /**
   * Whether the bar pins to the bottom of the window while the window scrolls.
   */
  readonly sticky?: boolean | undefined;

  /**
   * Width of the shell the bar renders at: `narrow` below the `md` breakpoint, `wide` from it.
   * Every width when absent.
   */
  readonly when?: ShellWidth | undefined;
}

/**
 * Renders a bar across the bottom.
 *
 * @param props - `sticky`, `when` and the `footer` element's props.
 * @returns The bar, inert while a panel is over the page, or nothing at a width `when` excludes.
 */
export function Footer({ sticky = false, when, ...rest }: FooterProps): null | ReactElement {
  const sheets = useOverlaid();
  const narrow = useNarrow(useShell().root, widthOf(FOLDS_BELOW.start), FOLDS_BELOW.start);

  if (when !== undefined && (when === "narrow") !== narrow) return null;

  return <Barred {...rest} data-sticky={sticky ? "" : undefined} inert={sheets.length > 0} />;
}
