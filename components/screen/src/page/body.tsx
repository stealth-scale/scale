/**
 * Renders the page's content.
 *
 * @remarks
 *   The body takes the height the other bands leave and lays its children out in a column, so a
 *   table or a list can fill the page. While `Page.TabList` renders a strip of tabs, the body is
 *   the panel of the selected tab: it takes `role="tabpanel"`, the tab names it, and it is a tab
 *   stop, so a keyboard reader moves from the tabs into it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#page/context.ts";
import { usePanel } from "#page/tabs-state.ts";

/**
 * Renders the `div` with the recipe's body class.
 */
const Content = withContext("div", "body");

/**
 * Describes the props of the body: the props of a `div`.
 */
export type BodyProps = ComponentProps<typeof Content>;

/**
 * Renders the body, as the selected tab's panel while a strip of tabs renders.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function Body(props: BodyProps): ReactElement {
  const panel = usePanel()?.panel;

  if (panel === undefined) return <Content {...props} />;

  return (
    <Content
      aria-labelledby={panel.labelledBy}
      id={panel.id}
      role="tabpanel"
      tabIndex={0}
      {...props}
    />
  );
}
