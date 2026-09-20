/**
 * Draws one named type as the control that opens what it holds.
 */

import { type ReactElement, useState } from "react";

import { Popover } from "@stealthscale/component-disclosure";
import { Code } from "@stealthscale/component-typography";

import { shortOf, type Shown } from "#catalogue/parted.ts";
import { PropsMembers } from "#catalogue/props-members.tsx";

/**
 * Describes what the control takes.
 */
export interface PropsShownProps {
  /**
   * The named type, and the members the reader listed for it.
   */
  readonly shown: Shown;
}

/**
 * Opens a named type on the members it holds.
 *
 * @remarks
 *   A popover rather than a tooltip. What it opens is a table, and a tooltip carries a line of
 *   words: it takes the `tooltip` role, which says the panel is a description of its control, and
 *   nothing inside one is reachable.
 *   The pointer opens it and a press opens it as well. A type in a table of types is read by
 *   running an eye down a column, and a reader who has to click each one to find the one they want
 *   clicks a dozen times. The handlers sit on the root rather than on the control, because the
 *   panel is drawn inside the root, so a pointer that travels from the name into the table never
 *   leaves the element that holds the panel open.
 *   The panel does not take the focus when it opens. It opens under a pointer that is only passing
 *   over, and a panel that took the focus each time would move the caret out of whatever the reader
 *   was in.
 *   The name takes the link ink, a dotted underline and the cursor a browser shows over a
 *   definition. The decoration sits on the snippet rather than on the control, and the snippet is
 *   laid out inline for it: a decoration on a box does not reach into an inline-flex child, which
 *   is what the snippet is by default, so the underline drawn on the control never appeared.
 *   The panel is named by the type and holds no heading of its own. It opens right under the name
 *   it belongs to and holds one table, so a heading repeated the word the reader pointed at.
 *   The panel leaves no room round the table either, so the table reaches all four edges and the
 *   panel clips the corners it rounds. There is nothing else in the panel for that room to part the
 *   table from.
 * @param props - The named type and its members.
 * @returns The name, and the panel it opens.
 */
export function PropsShown({ shown }: PropsShownProps): ReactElement {
  const short = shortOf(shown.name);
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root
      autoFocus={false}
      onOpenChange={(details) => {
        setOpen(details.open);
      }}
      onPointerEnter={() => {
        setOpen(true);
      }}
      onPointerLeave={() => {
        setOpen(false);
      }}
      open={open}
    >
      <Popover.Trigger cursor="help">
        <Code
          _hover={{ textDecorationStyle: "solid" }}
          color="fg.link"
          display="inline"
          size="sm"
          textDecorationLine="underline"
          textDecorationStyle="dotted"
          textUnderlineOffset="3px"
          variant="plain"
        >
          {short}
        </Code>
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content
          aria-label={short}
          aria-labelledby={undefined}
          overflow="hidden"
          padding="0"
        >
          <PropsMembers label={short} members={shown.members} />
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  );
}
