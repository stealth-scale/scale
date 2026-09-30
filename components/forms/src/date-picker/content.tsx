/**
 * Renders the panel.
 *
 * @remarks
 *   A floating panel is a `dialog` beside the control, named by `label`, "Choose date" by default,
 *   followed by the label that names the picker. An inline panel is a `group` named by the label,
 *   in place of the control. Opening a floating panel moves focus to the selected date, else to
 *   today. Tab moves through the panel's controls and on from the last one to the control after
 *   the trigger, and Shift+Tab moves from the first one back to the trigger, so the panel follows
 *   the trigger in the tab order wherever a portal puts it. Escape, a press outside and focus that
 *   leaves the panel close it. The machine's `application` role and its English name are left out.
 *   While a panel is mounted the page tracks whether the last input was a key, which the cells read
 *   to show their focus ring. The views scroll in the primitives package's scroll area, whose
 *   viewport takes no tab stop, because every control scrolls into view as it takes focus.
 */

import { type ComponentProps, type FocusEvent, type ReactElement, useEffect } from "react";

import { proxyTabFocus, scrollIntoView } from "@zag-js/dom-query";
import { trackFocusVisible } from "@zag-js/focus-visible";
import { mergeProps } from "@zag-js/react";

import { ScrollArea } from "@stealthscale/component-primitives";
import { omitUndefined } from "@stealthscale/hooks";

import { withContext } from "#date-picker/context.ts";
import { type DatePickerApi, useDatePicker, usePanelPresence } from "#date-picker/machine.ts";
import { useShared } from "#date-picker/state.ts";

/**
 * Renders the `div` with the date picker's content class.
 */
const Drawn = withContext("div", "content");

/**
 * Renders the scroll area's viewport with the recipe's class, which stops a scroll at its ends.
 */
const Viewport = withContext(ScrollArea.Viewport, "viewport");

/**
 * Renders the scroll area's content with the recipe's class, the padded column of the views.
 */
const Body = withContext(ScrollArea.Content, "body");

/**
 * Scrolls the element that takes focus inside the viewport into view while the viewport
 * overflows.
 *
 * @remarks
 *   The machine focuses a cell with `preventScroll`, so the viewport reveals the cell itself. A key
 *   that moves focus past the edge of a capped panel then scrolls the cell into view, clear of the
 *   edge by the viewport's scroll padding.
 */
function revealed(event: FocusEvent<HTMLDivElement>): void {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- focus lands only on the HTML controls of the views
  const focused = event.target as HTMLElement;

  scrollIntoView(focused, { block: "nearest", inline: "nearest", rootEl: event.currentTarget });
}

/**
 * Describes the props of the content: its name and the props of a `div`, without `ref`, which the
 * presence takes.
 */
export interface ContentProps extends Omit<ComponentProps<typeof Drawn>, "ref"> {
  /**
   * Accessible name of a floating panel, followed by the label's. Defaults to `Choose date`.
   */
  readonly label?: string | undefined;
}

/**
 * Renders the panel with the machine's content props and the presence props merged over the
 * caller's, around a scroll area of the views, and moves Tab between the panel and the trigger
 * while a floating panel is open.
 *
 * @param props - The name, the views and the props of a `div`.
 * @returns The `div` element.
 */
export function Content({ children, label = "Choose date", ...props }: ContentProps): ReactElement {
  const api = useDatePicker();
  const { ids, label: named } = useShared();
  const { props: presented, setNode } = usePanelPresence();
  const floating = api.open && !api.inline;
  const {
    "aria-label": _label,
    "aria-roledescription": _description,
    role: _role,
    ...machine
  }: ReturnType<DatePickerApi["getContentProps"]> = api.getContentProps();

  useEffect(() => trackFocusVisible(), []);

  useEffect((): (() => void) | undefined => {
    if (!floating) return undefined;

    return proxyTabFocus(() => document.querySelector<HTMLElement>(`[id="${ids.content}"]`), {
      defer: true,
      onFocus: (element) => {
        element.focus({ preventScroll: true });
      },
      triggerElement: () => document.querySelector<HTMLElement>(`[id="${ids.trigger}"]`),
    });
  }, [floating, ids.content, ids.trigger]);

  const own = api.inline
    ? omitUndefined({ "aria-labelledby": named, role: named === undefined ? undefined : "group" })
    : omitUndefined({
        "aria-label": label,
        "aria-labelledby": named === undefined ? undefined : `${ids.content} ${named}`,
        role: "dialog",
      });

  return (
    <Drawn {...mergeProps(machine, presented, own, props)} ref={setNode}>
      <ScrollArea.Root>
        <Viewport focusable={false} onFocus={revealed}>
          <Body>{children}</Body>
        </Viewport>
        <ScrollArea.Scrollbar />
      </ScrollArea.Root>
    </Drawn>
  );
}
