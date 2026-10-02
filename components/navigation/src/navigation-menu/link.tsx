/**
 * Renders a link of the menu: an item of the bar, or a destination inside a panel.
 *
 * @remarks
 *   The element is an `a`. `current` marks the link to the page on screen with
 *   `aria-current="page"`. A press closes the menu unless `closeOnClick` is false or the meta key
 *   is down, which opens the link elsewhere. `onSelect` runs on the press first, and calling
 *   `preventDefault` on its event keeps the menu open. A caller renders a router's link through
 *   `as`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { omitUndefined } from "@stealthscale/hooks";

import { withContext } from "#navigation-menu/context.ts";
import { useNavigationMenu } from "#navigation-menu/machine.ts";
import { useItem } from "#navigation-menu/scopes.ts";

/**
 * Renders the `a` with the navigation menu's link class.
 */
const Linked = withContext("a", "link");

/**
 * Runs on a press of a link whose caller passes no `onSelect`, so the machine registers a function
 * as the press's listener in every environment.
 */
function selected(): void {}

/**
 * Describes the props of a link: whether it leads to the current page, whether a press closes the
 * menu, what runs on a press, and the props of an `a`.
 */
export interface LinkProps extends Omit<ComponentProps<typeof Linked>, "onSelect"> {
  /**
   * Whether a press closes the menu. Defaults to true.
   */
  readonly closeOnClick?: boolean | undefined;

  /**
   * Whether the link leads to the page on screen.
   */
  readonly current?: boolean | undefined;

  /**
   * Runs on a press before the menu closes. Calling `preventDefault` on the event keeps it open.
   */
  readonly onSelect?: ((event: CustomEvent) => void) | undefined;
}

/**
 * Renders the link with the machine's link props for its item.
 *
 * @param props - Whether it is current, whether a press closes the menu, the press handler, the
 *   words and the props of an `a`.
 * @returns The `a` element.
 */
export function Link({
  closeOnClick,
  current,
  onSelect = selected,
  ...props
}: LinkProps): ReactElement {
  const api = useNavigationMenu();
  const { value } = useItem();

  return (
    <Linked
      {...mergeProps(
        api.getLinkProps({ ...omitUndefined({ closeOnClick, current }), onSelect, value }),
        props,
      )}
    />
  );
}
