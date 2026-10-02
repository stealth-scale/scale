/**
 * Renders the popover's panel.
 *
 * @remarks
 *   The machine sets `role="dialog"`. The panel's `aria-labelledby` and `aria-describedby` point
 *   at the title and the description while each is mounted, from the reports the root records, and
 *   the machine's own two are left out. The machine moves focus into the panel on opening, unless
 *   `autoFocus` is false, and back to the trigger on closing. The panel stays shown while its exit
 *   animation runs. The positioner around it renders nothing while the panel is out of the
 *   document.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#popover/context.ts";
import { useNaming, usePanelPresence, usePopover } from "#popover/machine.ts";

/**
 * Renders the `div` with the popover's content class.
 */
const Drawn = withContext("div", "content");

/**
 * Describes the props of the content: the props of a `div`, without `ref`, which the presence
 * takes.
 */
export type ContentProps = Omit<ComponentProps<typeof Drawn>, "ref">;

/**
 * Returns the id in a machine part's props, which the machine types with an index signature.
 */
function idOf(props: Readonly<Record<string, unknown>>): string {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the machine gives the title and the description an id string
  return props["id"] as string;
}

/**
 * Renders the panel with the machine's content props, the panel's names and the presence props
 * merged over the caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function Content(props: ContentProps): ReactElement {
  const api = usePopover();
  const { described, titled } = useNaming();
  const { props: presented, setNode } = usePanelPresence();
  const {
    "aria-describedby": _described,
    "aria-labelledby": _labelled,
    ...machine
  } = api.getContentProps();
  const named = {
    "aria-describedby": described ? idOf(api.getDescriptionProps()) : undefined,
    "aria-labelledby": titled ? idOf(api.getTitleProps()) : undefined,
  };

  return <Drawn {...mergeProps(machine, named, presented, props)} ref={setNode} />;
}
