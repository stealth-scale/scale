/**
 * Contributes a page's content to a slot outside the page: its title into the header, its actions
 * into the toolbar.
 */

import { createElement, type ReactNode, use, useId, useLayoutEffect, useRef } from "react";

import { type SlotReference } from "@stealthscale/sdk-core";

import { useHost } from "#host/use-host.ts";
import { PluginContext } from "#scope/context.ts";

/**
 * Describes the props of `Into`.
 */
export interface IntoProps {
  /**
   * The content the slot renders for as long as `Into` is mounted.
   */
  readonly children?: ReactNode;

  /**
   * Rank among the slot's page contributions, ascending. 0 where left out.
   */
  readonly order?: number | undefined;

  /**
   * The slot.
   */
  readonly slot: SlotReference;
}

/**
 * Contributes its children to a slot for as long as it is mounted, and renders nothing where it is
 * mounted.
 *
 * @remarks
 *   The slot renders the contribution after its `after` extensions, in `order`. The content renders
 *   inside the slot and in the plugin scope `Into` renders in, so a hook that acts as a plugin acts
 *   as the page's plugin. Every other context comes from above the slot. The contribution keeps its
 *   place while its content changes, so a title that changes does not move.
 */
export function Into({ children, order = 0, slot }: IntoProps): null {
  const { pages } = useHost("Into").stores;
  const scope = use(PluginContext);
  const key = useId();
  const content =
    scope === undefined ? children : createElement(PluginContext, { value: scope }, children);
  const latest = useRef(content);

  useLayoutEffect(() => {
    latest.current = content;
    pages.fill(key, content);
  }, [content, key, pages]);

  useLayoutEffect(() => {
    const leave = pages.place(slot.id, key, order);

    pages.fill(key, latest.current);

    return leave;
  }, [key, order, pages, slot.id]);

  return null;
}
