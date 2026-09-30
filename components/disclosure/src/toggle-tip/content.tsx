/**
 * Renders the toggle tip's note.
 *
 * @remarks
 *   The note drops the popover machine's `dialog` role and its labelling, because a note is not a
 *   dialog and a dialog without a name fails an audit. The trigger keeps focus, so the note
 *   announces its text through the document's polite live region each time it opens. Tab from the
 *   trigger moves into the note while it has a link, and Tab out of it closes it. The note is shown
 *   while its exit animation runs. The positioner around it renders nothing while the note is out
 *   of the document.
 */

import { type ComponentProps, type ReactElement, useEffect } from "react";

import { mergeProps } from "@zag-js/react";

import { useAnnounce } from "@stealthscale/hooks";

import { withContext } from "#toggle-tip/context.ts";
import { useTipPresence, useToggleTip } from "#toggle-tip/machine.ts";

/**
 * Renders the `div` with the toggle tip's content class.
 */
const Drawn = withContext("div", "content");

/**
 * Describes the props of the content: the props of a `div`, without `ref`, which the presence
 * takes.
 */
export type ContentProps = Omit<ComponentProps<typeof Drawn>, "ref">;

/**
 * Renders the note with the machine's content props, less its dialog semantics, and the presence
 * props merged over the caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function Content(props: ContentProps): ReactElement {
  const api = useToggleTip();
  const announce = useAnnounce();
  const { props: presented, setNode } = useTipPresence();
  const {
    "aria-describedby": _described,
    "aria-labelledby": _labelled,
    role: _role,
    ...machine
  }: ContentProps = { ...api.getContentProps() };
  const { id } = machine;

  useEffect(() => {
    if (!api.open || id === undefined) return;

    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the note is in the document while its own effect runs
    const note = globalThis.document.querySelector(`[id="${id}"]`) as Element;

    announce(note.textContent);
  }, [announce, api.open, id]);

  return <Drawn {...mergeProps({ ...machine, ...presented }, props)} ref={setNode} />;
}
