/**
 * Renders a row's link, with a tooltip of its words while its list is iconic.
 *
 * @remarks
 *   The element is `a` and takes `href`. Set `aria-current="page"` on the link to the current page.
 *   A screen reader announces the attribute and the `highlight` axis styles it, so the two cannot
 *   disagree. In the iconic list the text is hidden visually and remains the link's accessible
 *   name, and a link with `tooltip` shows those words beside its icon on hover and on focus. The
 *   tooltip is portalled to the document, because a sidebar's scrolling column clips what overflows
 *   it.
 */

import { type ComponentProps, type ReactElement, type ReactNode } from "react";

import { Tooltip } from "@stealthscale/component-disclosure";
import { Portal } from "@stealthscale/component-primitives";

import { withContext } from "#nav-list/context.ts";
import { useList } from "#nav-list/state.ts";
import { Tip } from "#nav-list/tip.tsx";

/**
 * Renders the link `a` with the list's variants.
 */
const Anchored = withContext("a", "link");

/**
 * Placement of the tooltip: beside the icon, towards the page.
 */
const BESIDE = { placement: "right" } as const;

/**
 * Describes the props of `Link`: its tooltip and the props of an anchor.
 */
export interface LinkProps extends ComponentProps<typeof Anchored> {
  /**
   * Words the link shows in a tooltip while its list is iconic, usually the link's own words.
   */
  readonly tooltip?: ReactNode | undefined;
}

/**
 * Renders the link, as the trigger of its tooltip while the list is iconic.
 *
 * @param props - The tooltip and the props of an anchor.
 * @returns The `a` element, inside the tooltip's root on an iconic list.
 */
export function Link({ tooltip, ...rest }: LinkProps): ReactElement {
  const { iconic } = useList();

  if (!iconic || tooltip === undefined) return <Anchored {...rest} />;

  return (
    <Tooltip.Root positioning={BESIDE}>
      <Anchored as={Tip} {...rest} />
      <Portal>
        <Tooltip.Positioner>
          <Tooltip.Content>{tooltip}</Tooltip.Content>
        </Tooltip.Positioner>
      </Portal>
    </Tooltip.Root>
  );
}
