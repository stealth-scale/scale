/**
 * Renders the column an application is laid out in.
 *
 * @remarks
 *   The element is a `div` with no landmark role, because the bars and the main region inside it
 *   are the landmarks. The root opens the store the panels publish to, so a trigger anywhere in the
 *   shell reads a panel by name. Every panel measures the root, which is as wide as the shell
 *   whatever the panels do, so opening a panel never changes the measurement that allowed it. The
 *   root writes `data-settled` in an effect after its first paint, and the recipe transitions
 *   nothing before that, so a panel takes its measured state without a slide on load. The attribute
 *   is written to the element and not held in state, because only the stylesheet reads it.
 */

import { type ComponentProps, type ReactElement, useEffect, useMemo, useRef } from "react";

import { useConst, useStickyOffsets } from "@stealthscale/hooks";

import { withProvider } from "#app-shell/context.ts";
import { panelStore } from "#app-shell/panels.ts";
import { SETTLED, STICKY_OFFSET, STICKY_TOP } from "#app-shell/recipe.ts";
import { ShellProvider } from "#app-shell/state.ts";

/**
 * Selects the pinned bars in stacking order, and names the properties their offsets are written to.
 *
 * @remarks
 *   A second pinned bar sticks under the first, so each bar needs the height of the bars above it,
 *   which a CSS sticky offset cannot compute. The root receives the total height, which the panels
 *   stick under.
 */
const PINNED = {
  bands: ":scope > .app-shell__header[data-sticky]",
  offset: STICKY_OFFSET,
  total: STICKY_TOP,
};

/**
 * Renders the column and provides the variants to every part below it.
 */
const Columned = withProvider("div", "root");

/**
 * Describes the props of `Root`.
 */
export type RootProps = ComponentProps<typeof Columned>;

/**
 * Renders the shell: bars across the top and the bottom, and a body between them with a panel on
 * either side of the page.
 *
 * @param props - The recipe's variants and the `div` element's props.
 * @returns The column, with the shell's state in context.
 */
export function Root({ scroll = "page", ...rest }: RootProps): ReactElement {
  const measured = useRef<HTMLDivElement>(null);
  const panels = useConst(panelStore);
  const state = useMemo(() => ({ panels, root: measured }), [panels]);

  useStickyOffsets(measured, scroll === "window", PINNED);

  useEffect(() => {
    measured.current?.setAttribute(SETTLED, "");
  }, []);

  return (
    <ShellProvider value={state}>
      <Columned {...rest} ref={measured} scroll={scroll} />
    </ShellProvider>
  );
}
