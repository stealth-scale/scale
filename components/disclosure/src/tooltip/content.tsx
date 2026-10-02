/**
 * Renders the tooltip's content.
 *
 * @remarks
 *   The machine sets `role="tooltip"` and the id the trigger's `aria-describedby` references. The
 *   content sets `--tooltip-surface`, which the arrow tip reads, so the two share one fill. The
 *   content stays shown while its exit animation runs. The positioner around it renders nothing
 *   while the content is out of the document.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tooltip/context.ts";
import { useTipPresence, useTooltip } from "#tooltip/machine.ts";

/**
 * Renders the `div` with the tooltip's content class.
 */
const Boxed = withContext("div", "content");

/**
 * Describes the props of the content: the props of a `div`, without `ref`, which the presence
 * takes.
 */
export type ContentProps = Omit<ComponentProps<typeof Boxed>, "ref">;

/**
 * Renders the content with the machine's content props and the presence props merged over the
 * caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function Content(props: ContentProps): ReactElement {
  const api = useTooltip();
  const { props: presented, setNode } = useTipPresence();

  return <Boxed {...mergeProps(api.getContentProps(), presented, props)} ref={setNode} />;
}
