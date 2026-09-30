/**
 * Renders the list of rows.
 *
 * @remarks
 *   The part renders the primitives package's scroll area inside the frame, so the label and the
 *   field remain in place while the rows move. The area's viewport is the element with
 *   `role="listbox"` and the tab stop, so the element that has focus is the one that scrolls, and
 *   the machine scrolls a highlighted row into view in it. Focus remains on it, and the machine
 *   points its `aria-activedescendant` at the highlighted row, so a row never takes focus. The
 *   scroll area follows the machine's direction and orientation. The role replaces the element's
 *   own semantics, so a `ul` would add nothing.
 */

import { type ComponentProps, type ReactElement, useState } from "react";

import { mergeProps } from "@zag-js/react";

import { ScrollArea } from "@stealthscale/component-primitives";

import { withContext } from "#listbox/context.ts";
import { useListbox } from "#listbox/machine.ts";
import { ScrollerContext } from "#listbox/scroller.ts";

/**
 * Renders the `div` with the listbox's content class, which the scroll area's root takes.
 */
const Listed = withContext("div", "content");

/**
 * Renders the scroll area's viewport with the listbox's viewport class.
 */
const Viewport = withContext(ScrollArea.Viewport, "viewport");

/**
 * Renders the scroll area's content with the listbox's rows class, which lays the rows out.
 */
const Rows = withContext(ScrollArea.Content, "rows");

/**
 * Describes the props of the content: the props of the `div` with `role="listbox"`, without `as`,
 * because another element in the viewport's place would drop the scroll area.
 */
export type ContentProps = Omit<ComponentProps<typeof Listed>, "as">;

/**
 * Renders the scroll area with the machine's content props on its viewport.
 *
 * @param props - Attributes and children of the element with `role="listbox"`, merged over the
 *   machine's.
 * @returns The scroll area's root.
 */
export function Content({ children, ...rest }: ContentProps): ReactElement {
  const api = useListbox();
  const machine = api.getContentProps();
  const [scroller, setScroller] = useState<HTMLDivElement | null>(null);
  const direction: unknown = machine["dir"];
  const id: unknown = machine["id"];
  const across = machine["data-orientation"] === "horizontal";

  return (
    <ScrollArea.Root
      as={Listed}
      dir={direction === "rtl" ? "rtl" : "ltr"}
      ids={{ viewport: String(id) }}
      scrolls={across ? "horizontal" : "vertical"}
    >
      <Viewport focusable="none" {...mergeProps(machine, rest)} ref={setScroller}>
        <ScrollerContext value={scroller}>
          <Rows>{children}</Rows>
        </ScrollerContext>
      </Viewport>
      <ScrollArea.Scrollbar orientation={across ? "horizontal" : "vertical"} />
    </ScrollArea.Root>
  );
}
