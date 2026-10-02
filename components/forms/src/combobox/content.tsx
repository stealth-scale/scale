/**
 * Renders the panel of rows.
 *
 * @remarks
 *   The panel contains the primitives package's scroll area, whose viewport is the `listbox`. Focus
 *   remains on the input, which points `aria-activedescendant` at the highlighted row, and the
 *   machine scrolls that row into view in the listbox. A press in the panel keeps focus on the
 *   input. Escape, a press outside and focus leaving the input close it. The listbox is named by
 *   the label that names the input, else by the input's `aria-label`. A reference to the input
 *   would name it by the typed text, because the input is a `combobox`. The panel remains shown
 *   while its exit animation runs. The caller's `as` goes to the panel, and every other prop to the
 *   listbox.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { ScrollArea } from "@stealthscale/component-primitives";
import { omitUndefined } from "@stealthscale/hooks";

import { withContext } from "#combobox/context.ts";
import { useCombobox, usePanelPresence } from "#combobox/machine.ts";
import { useShared } from "#combobox/state.ts";

/**
 * Renders the `div` with the combobox's content class.
 */
const Listed = withContext("div", "content");

/**
 * Renders the scroll area's viewport with the combobox's viewport class.
 */
const Viewport = withContext(ScrollArea.Viewport, "viewport");

/**
 * Renders the scroll area's content with the combobox's rows class, which pads the rows.
 */
const Rows = withContext(ScrollArea.Content, "rows");

/**
 * Describes the props of the content: the props of a `div`, without `ref`, which the presence
 * takes.
 */
export type ContentProps = Omit<ComponentProps<typeof Listed>, "ref">;

/**
 * Renders the panel with the presence props and the machine's direction, placement, side and
 * empty mark, and the rows inside a scroll area whose viewport takes the machine's content props
 * and the listbox's name.
 *
 * @param props - The panel's `as`, and the rows and the props of the listbox.
 * @returns The `div` element of the panel.
 */
export function Content({ as, children, ...rest }: ContentProps): ReactElement {
  const api = useCombobox();
  const { label, name } = useShared();
  const { props: presented, setNode } = usePanelPresence();
  const { "aria-labelledby": _labelledBy, hidden: _hidden, ...machine } = api.getContentProps();
  const id: unknown = machine["id"];
  const empty: unknown = machine["data-empty"];
  const placement: unknown = machine["data-placement"];
  const side: unknown = machine["data-side"];
  const direction = machine["dir"] === "rtl" ? "rtl" : "ltr";
  const named = omitUndefined(
    label === undefined ? { "aria-label": name } : { "aria-labelledby": label },
  );

  return (
    <Listed
      {...presented}
      {...(as === undefined ? {} : { as })}
      {...{ "data-empty": empty, "data-placement": placement, "data-side": side }}
      dir={direction}
      ref={setNode}
    >
      <ScrollArea.Root dir={direction} ids={{ viewport: String(id) }}>
        <Viewport focusable="none" {...mergeProps(machine, named, rest)}>
          <Rows>{children}</Rows>
        </Viewport>
        <ScrollArea.Scrollbar />
      </ScrollArea.Root>
    </Listed>
  );
}
