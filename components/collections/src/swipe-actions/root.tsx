/**
 * Renders a swipe row's root: the row that clips its content and its actions, and keeps how far
 * the actions are revealed.
 *
 * @remarks
 *   The root states the revealed width in `--swipe-reveal`, which the content and the actions
 *   read. It sets `data-open` while the actions rest open and `data-dragging` while a finger or a
 *   trackpad moves the row. A press outside an open row closes it, so opening another row closes
 *   the first. The root takes `tabIndex={-1}`, so Escape in the actions and a pressed action return
 *   focus to the row and not to the document's body.
 */

import { type ComponentProps, type ReactElement, useEffect, useRef, useState } from "react";

import { useCallbackRef } from "@stealthscale/hooks";

import { withProvider } from "#swipe-actions/context.ts";
import { REVEAL } from "#swipe-actions/recipe.ts";
import { settleSwipe } from "#swipe-actions/settle.ts";
import { StateProvider, type SwipeState } from "#swipe-actions/state.ts";

/**
 * Renders the root `div` with the recipe's variants.
 */
const Row = withProvider("div", "root");

/**
 * Describes the props of the root: the props of a `div` without `ref`, which the root keeps.
 */
export type RootProps = Omit<ComponentProps<typeof Row>, "ref">;

/**
 * Returns the width of the actions' element, or 0 for a row without actions.
 */
function widthOf(actions: HTMLElement | null): number {
  return actions?.getBoundingClientRect().width ?? 0;
}

/**
 * Renders the row and provides its state to the parts.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element inside the state provider.
 */
export function Root({ style, ...props }: RootProps): ReactElement {
  const [revealed, setRevealed] = useState(0);
  const [dragging, setDragging] = useState(false);
  const row = useRef<HTMLDivElement>(null);
  const actions = useRef<HTMLElement | null>(null);
  const open = revealed > 0 && !dragging;
  const revealing: Record<string, string> = { [REVEAL]: `${String(revealed)}px` };

  const settle = useCallbackRef((opened: boolean): void => {
    setDragging(false);
    setRevealed(opened ? widthOf(actions.current) : 0);
  });

  useEffect(() => {
    /**
     * Closes the row when a press lands outside it.
     */
    const pressed = (event: PointerEvent): void => {
      // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the row is mounted while its effect runs, and a press targets a node
      if (!(row.current as HTMLDivElement).contains(event.target as Node)) settle(false);
    };

    if (open) document.addEventListener("pointerdown", pressed, true);

    return (): void => {
      document.removeEventListener("pointerdown", pressed, true);
    };
  }, [open, settle]);

  const state: SwipeState = {
    dismiss: () => {
      settle(false);
      // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a part calls this while the row is mounted
      (row.current as HTMLDivElement).focus();
    },
    drag: (to) => {
      const clamped = Math.min(widthOf(actions.current), Math.max(0, to));

      setDragging(true);
      setRevealed(clamped);

      return clamped;
    },
    release: (to) => {
      settle(settleSwipe(to, widthOf(actions.current)) === "open");
    },
    revealed,
    rightToLeft: () =>
      // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a part calls this while the row is mounted
      getComputedStyle(row.current as HTMLDivElement).direction === "rtl",
    setActions: (node) => {
      actions.current = node;
    },
    settle,
  };

  return (
    <StateProvider value={state}>
      <Row
        data-dragging={dragging ? "" : undefined}
        data-open={open ? "" : undefined}
        ref={row}
        style={{ ...style, ...revealing }}
        tabIndex={-1}
        {...props}
      />
    </StateProvider>
  );
}
