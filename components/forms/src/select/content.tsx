/**
 * Renders the panel of rows.
 *
 * @remarks
 *   The panel contains the primitives package's scroll area, whose viewport is the `listbox`. The
 *   machine moves focus into it as it opens, points `aria-activedescendant` at the highlighted row
 *   and scrolls that row into view in it, so the arrow keys, Home, End and typed letters move the
 *   highlight and Enter or Space selects it. Escape and a press outside close it and return focus
 *   to the trigger. Tab and Shift+Tab move focus on from the trigger, and the panel closes as focus
 *   leaves it. The listbox is named by the label that names the trigger, else by the trigger's
 *   `aria-label`. A reference to the trigger would name it by the value, because the trigger is a
 *   `combobox`. The panel remains shown while its exit animation runs. The caller's `as` goes to
 *   the panel, and every other prop to the listbox.
 */

import { type ComponentProps, type KeyboardEvent, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { ScrollArea } from "@stealthscale/component-primitives";
import { omitUndefined } from "@stealthscale/hooks";

import { withContext } from "#select/context.ts";
import { usePanelPresence, useSelect } from "#select/machine.ts";
import { useShared } from "#select/state.ts";

/**
 * Renders the `div` with the select's content class.
 */
const Listed = withContext("div", "content");

/**
 * Renders the scroll area's viewport with the select's viewport class.
 */
const Viewport = withContext(ScrollArea.Viewport, "viewport");

/**
 * Renders the scroll area's content with the select's rows class, which pads the rows.
 */
const Rows = withContext(ScrollArea.Content, "rows");

/**
 * Describes the props of the content: the props of a `div`, without `ref`, which the presence
 * takes.
 */
export type ContentProps = Omit<ComponentProps<typeof Listed>, "ref">;

/**
 * Moves focus to the trigger on Tab, before the machine sees the key.
 *
 * @remarks
 *   The machine cancels Tab in the panel. The handler runs in the capture phase and stops the key
 *   there, so the browser's own Tab moves focus on from the trigger, and the panel closes as focus
 *   leaves it without returning focus.
 * @param event - The key event.
 * @param trigger - ID of the trigger.
 */
function tabbed(event: KeyboardEvent<HTMLDivElement>, trigger: string): void {
  if (event.key !== "Tab") return;

  event.stopPropagation();
  event.currentTarget.ownerDocument.querySelector<HTMLElement>(`[id="${trigger}"]`)?.focus();
}

/**
 * Renders the panel with the presence props and the machine's direction, placement and side, and
 * the rows inside a scroll area whose viewport takes the machine's content props and the listbox's
 * name.
 *
 * @param props - The panel's `as`, and the rows and the props of the listbox.
 * @returns The `div` element of the panel.
 */
export function Content({ as, children, ...rest }: ContentProps): ReactElement {
  const api = useSelect();
  const { label, name, trigger } = useShared();
  const { props: presented, setNode } = usePanelPresence();
  const { "aria-labelledby": _labelledBy, hidden: _hidden, ...machine } = api.getContentProps();
  const id: unknown = machine["id"];
  const placement: unknown = machine["data-placement"];
  const side: unknown = machine["data-side"];
  const direction = machine["dir"] === "rtl" ? "rtl" : "ltr";
  const own = {
    ...omitUndefined(label === undefined ? { "aria-label": name } : { "aria-labelledby": label }),
    onKeyDownCapture: (event: KeyboardEvent<HTMLDivElement>): void => {
      tabbed(event, trigger);
    },
  };

  return (
    <Listed
      {...presented}
      {...(as === undefined ? {} : { as })}
      {...{ "data-placement": placement, "data-side": side }}
      dir={direction}
      ref={setNode}
    >
      <ScrollArea.Root dir={direction} ids={{ viewport: String(id) }}>
        <Viewport focusable="none" {...mergeProps(machine, own, rest)}>
          <Rows>{children}</Rows>
        </Viewport>
        <ScrollArea.Scrollbar />
      </ScrollArea.Root>
    </Listed>
  );
}
