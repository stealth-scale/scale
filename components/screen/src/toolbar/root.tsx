/**
 * Renders the row with `role="toolbar"`, one tab stop across its controls, and its measured width.
 *
 * @remarks
 *   `role="toolbar"` tells a screen reader that the arrow keys move between the controls and Tab
 *   leaves the row. The roving focus group is the accessibility package's, and a step past the
 *   last control continues at the first unless `wrap` is false. Name the row with
 *   `aria-label`, because a screen reader announces an unnamed one as "toolbar". The row measures
 *   its own width and sets `data-narrow` below the `sm` breakpoint, so a row beside an open sidebar
 *   folds on its own width. While an action is folded, the row renders the menu of folded actions
 *   as its last control. Every library button in the row renders at the toolbar's size unless it
 *   states its own.
 */

import { type ComponentProps, type ReactElement, type ReactNode, useMemo, useRef } from "react";

import { RovingFocus } from "@stealthscale/component-a11y";
import { ButtonPropsProvider } from "@stealthscale/component-actions";
import { useNarrow, widthOf } from "@stealthscale/provider-viewport";

import { FoldContext, More, Trigger, useFolded } from "#folding/index.ts";
import { withProvider } from "#toolbar/context.ts";
import { Item } from "#toolbar/item.tsx";
import { ToolbarProvider } from "#toolbar/state.ts";

/**
 * Breakpoint whose start width the row compares its own width against.
 */
const FOLDS_BELOW = "sm";

/**
 * Renders the roving focus root with the recipe's root class.
 */
const Rowed = withProvider(RovingFocus.Root, "root");

/**
 * Describes the props of the toolbar: its accessible name, the menu's words and mark, the recipe's
 * variants, the roving focus options and the props of a `div`.
 */
export interface RootProps extends ComponentProps<typeof Rowed> {
  /**
   * The accessible name of the row.
   */
  readonly "aria-label": string;

  /**
   * Words that name the menu of folded actions. Defaults to `More actions`.
   */
  readonly more?: string | undefined;

  /**
   * Mark the menu's trigger shows in place of its words.
   */
  readonly moreIcon?: ReactNode | undefined;
}

/**
 * Renders the row with its measured width, and the menu while an action is folded.
 *
 * @param props - The name, the menu's words and mark, the variants, the roving focus options and
 *   the props of a `div`.
 * @returns The `div` element with `role="toolbar"`.
 */
export function Root({
  children,
  more = "More actions",
  moreIcon,
  size = "md",
  wrap = true,
  ...rest
}: RootProps): ReactElement {
  const measured = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(measured, widthOf(FOLDS_BELOW), FOLDS_BELOW);
  const [entries, fold] = useFolded();
  const state = useMemo(() => ({ narrow, size }), [narrow, size]);
  const sized = useMemo(() => ({ size }), [size]);

  return (
    <ToolbarProvider value={state}>
      <FoldContext value={fold}>
        <ButtonPropsProvider value={sized}>
          <Rowed
            role="toolbar"
            {...rest}
            data-narrow={narrow ? "" : undefined}
            ref={measured}
            size={size}
            wrap={wrap}
          >
            {children}
            {entries.length > 0 && (
              <More
                entries={entries}
                trigger={
                  <Item as={Trigger} icon={moreIcon} label={more} size={size} variant="ghost" />
                }
              />
            )}
          </Rowed>
        </ButtonPropsProvider>
      </FoldContext>
    </ToolbarProvider>
  );
}
