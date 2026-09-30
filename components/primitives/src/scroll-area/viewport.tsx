/**
 * Renders the element that scrolls, without the browser's scrollbars.
 *
 * @remarks
 *   WCAG 2.1.1 requires keyboard access to every region a pointer can scroll. While the content
 *   overflows either axis, the viewport takes `tabIndex={0}` and `role="region"`, the pattern the
 *   WAI-ARIA practices give for a scrollable region, and the arrow keys, Page Up, Page Down, Home
 *   and End scroll it. While the content fits it takes neither, so a page of short lists has no
 *   empty tab stops. Name it with `aria-label` or `aria-labelledby`. Content whose every item
 *   takes focus, such as a list of links, passes `focusable={false}`: focus on a child scrolls the
 *   child into view, and the viewport takes no role and `tabIndex={-1}`. Firefox stops the Tab key
 *   on any element that scrolls unless it states a negative `tabIndex`. A viewport that is a
 *   widget's own element, such as a listbox's or a menu's, passes `focusable="none"` and takes
 *   neither from the scroll area: the widget's machine sets the role and the tab stop, and the
 *   element that scrolls is then the one that has focus. The recipe sets the viewport's `overflow`,
 *   which the machine writes inline, so a composing recipe turns the scrolling off where an
 *   ancestor scrolls instead.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#scroll-area/context.ts";
import { useScrollArea } from "#scroll-area/machine.ts";

/**
 * Renders the `div` with the scroll area's viewport class.
 */
const Drawn = withContext("div", "viewport");

/**
 * Describes the props of the viewport: whether it takes a tab stop, and the props of a `div`.
 */
export interface ViewportProps extends ComponentProps<typeof Drawn> {
  /**
   * How the viewport takes focus: `true`, the default, gives it the region role and a tab stop
   * while its content overflows, `false` keeps it out of the tab order in every browser, and
   * `"none"` gives it neither a role nor a `tabIndex`.
   */
  readonly focusable?: "none" | boolean | undefined;
}

/**
 * Describes the role and the tab stop the viewport takes.
 */
type Stop = Pick<ViewportProps, "role" | "tabIndex">;

/**
 * Sets the region role and a tab stop on a viewport whose content overflows.
 */
const SCROLLABLE: Stop = { role: "region", tabIndex: 0 };

/**
 * Keeps a viewport the caller made unfocusable out of the tab order in every browser.
 */
const UNSTOPPED: Stop = { tabIndex: -1 };

/**
 * Sets neither a role nor a tab stop.
 */
const PLAIN: Stop = {};

/**
 * Returns the role and the tab stop of a viewport.
 *
 * @param focusable - How the caller lets the viewport take focus.
 * @param overflows - Whether the content overflows either axis.
 * @returns The region role and a tab stop, a negative tab stop, or nothing.
 */
function stopOf(focusable: "none" | boolean, overflows: boolean): Stop {
  if (focusable === "none") return PLAIN;
  if (!focusable) return UNSTOPPED;

  return overflows ? SCROLLABLE : PLAIN;
}

/**
 * Renders the viewport with the machine's props, without its `presentation` role, its tab stop and
 * its inline overflow, merged under the caller's.
 *
 * @param props - Whether the viewport takes a tab stop, and the props of a `div`, its name among
 *   them.
 * @returns The `div` element.
 */
export function Viewport({ focusable = true, ...props }: ViewportProps): ReactElement {
  const api = useScrollArea();
  const {
    role: _presentation,
    style: _overflow,
    tabIndex: _stop,
    ...viewport
  } = api.getViewportProps();
  const stop = stopOf(focusable, api.hasOverflowX || api.hasOverflowY);

  return <Drawn {...mergeProps(viewport, stop, props)} />;
}
